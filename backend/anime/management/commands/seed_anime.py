import json
from hashlib import md5
from urllib.parse import urlencode, urlparse, parse_qsl, urlunparse
from urllib.request import Request, urlopen

from django.core.management.base import BaseCommand, CommandError

from anime.models import Anime, Tag

TYPE_MAP = {
    "TV": "TV",
    "MOVIE": "MOVIE",
    "OVA": "OVA",
    "SPECIAL": "SPECIAL",
}

STATUS_MAP = {
    "CURRENTLY AIRING": "AIRING",
    "AIRING": "AIRING",
    "FINISHED AIRING": "FINISHED",
    "FINISHED": "FINISHED",
    "NOT YET AIRED": "NOT_YET",
    "NOT_YET": "NOT_YET",
    "NOT YET": "NOT_YET",
}


def _build_url(base_url, params):
    parsed = urlparse(base_url)
    existing_params = dict(parse_qsl(parsed.query, keep_blank_values=True))
    merged = {**existing_params, **params}
    query = urlencode(merged, doseq=True)
    return urlunparse(
        (
            parsed.scheme,
            parsed.netloc,
            parsed.path,
            parsed.params,
            query,
            parsed.fragment,
        )
    )


def _pluck_list(payload, results_key=None):
    if isinstance(payload, list):
        return payload

    if not isinstance(payload, dict):
        return []

    if results_key:
        value = payload.get(results_key)
        return value if isinstance(value, list) else []

    for key in ("results", "data", "items"):
        value = payload.get(key)
        if isinstance(value, list):
            return value

    return []


def _has_next_page(payload):
    if not isinstance(payload, dict):
        return False

    pagination = payload.get("pagination")
    if not isinstance(pagination, dict):
        return False

    return bool(pagination.get("has_next_page"))


def _pick(item, *keys):
    for key in keys:
        value = item.get(key)
        if value not in (None, ""):
            return value
    return None


def _normalize_type(value):
    if value is None:
        return None
    return TYPE_MAP.get(str(value).strip().upper())


def _normalize_status(value):
    if value is None:
        return None
    normalized = str(value).strip().upper()
    return STATUS_MAP.get(normalized)


def _extract_image_url(item):
    direct = _pick(item, "image_url", "image", "cover_image")
    if direct:
        return direct

    images = item.get("images")
    if not isinstance(images, dict):
        return None

    jpg = images.get("jpg")
    if isinstance(jpg, dict):
        val = _pick(jpg, "large_image_url", "image_url")
        if val:
            return val

    webp = images.get("webp")
    if isinstance(webp, dict):
        val = _pick(webp, "large_image_url", "image_url")
        if val:
            return val

    return None


def _normalize_tag_name(value):
    if value is None:
        return None

    normalized = " ".join(str(value).split()).strip()
    return normalized or None


def _extract_jikan_tag_names(item):
    tag_names = []

    for key in ("genres", "themes", "demographics"):
        raw_values = item.get(key)
        if not isinstance(raw_values, list):
            continue

        for raw_value in raw_values:
            if not isinstance(raw_value, dict):
                continue

            name = _normalize_tag_name(raw_value.get("name"))
            if name:
                tag_names.append(name)

    deduped = []
    seen = set()
    for name in tag_names:
        lowered = name.casefold()
        if lowered in seen:
            continue
        seen.add(lowered)
        deduped.append(name)

    return deduped


def _has_jikan_taxonomy(item):
    return any(key in item for key in ("genres", "themes", "demographics"))


def _generate_tag_color(tag_name):
    digest = md5(tag_name.encode("utf-8")).hexdigest()
    return f"#{digest[:6]}"


class Command(BaseCommand):
    help = "Seed Anime rows from a JSON API endpoint."

    def add_arguments(self, parser):
        parser.add_argument("--url", required=True, help="JSON API endpoint URL.")
        parser.add_argument(
            "--limit",
            type=int,
            default=100,
            help="Maximum number of anime records to process (default: 100).",
        )
        parser.add_argument(
            "--results-key",
            default=None,
            help="Optional key that contains the list in the API response.",
        )
        parser.add_argument(
            "--params",
            default="{}",
            help='Optional JSON object of query params, ex: {"limit": 100}.',
        )
        parser.add_argument(
            "--headers",
            default="{}",
            help='Optional JSON object of request headers, ex: {"Authorization": "Bearer ..."}.',
        )
        parser.add_argument(
            "--timeout",
            type=int,
            default=20,
            help="HTTP timeout in seconds (default: 20).",
        )
        parser.add_argument(
            "--page-param",
            default="page",
            help="Query parameter name used for pagination (default: page).",
        )

    def handle(self, *args, **options):
        base_url = options["url"]
        limit = options["limit"]
        results_key = options["results_key"]
        timeout = options["timeout"]
        page_param = options["page_param"]

        try:
            params = json.loads(options["params"])
            headers = json.loads(options["headers"])
        except json.JSONDecodeError as exc:
            raise CommandError(
                f"Invalid JSON for --params or --headers: {exc}"
            ) from exc

        if not isinstance(params, dict) or not isinstance(headers, dict):
            raise CommandError("--params and --headers must be JSON objects.")

        headers = {k: str(v) for k, v in headers.items()}
        items = []
        page = 1

        while len(items) < limit:
            page_params = {**params, page_param: page}
            request_url = _build_url(base_url, page_params)
            self.stdout.write(f"Fetching: {request_url}")

            request = Request(request_url, headers=headers)

            try:
                with urlopen(request, timeout=timeout) as response:
                    payload = json.loads(response.read().decode("utf-8"))
            except Exception as exc:
                raise CommandError(
                    f"Failed to fetch or parse API response: {exc}"
                ) from exc

            page_items = _pluck_list(payload, results_key=results_key)
            if not page_items:
                break

            needed = limit - len(items)
            items.extend(page_items[:needed])

            if len(items) >= limit:
                break

            if not _has_next_page(payload):
                break

            page += 1

        if not items:
            raise CommandError(
                "No anime list found in API response. Try passing --results-key if needed."
            )

        created = 0
        updated = 0
        skipped = 0
        created_tag_names = set()
        reused_tag_names = set()
        tag_cache = {
            tag.name.casefold(): tag for tag in Tag.objects.all().only("id", "name", "color")
        }

        for item in items:
            if not isinstance(item, dict):
                skipped += 1
                continue

            external_id = _pick(item, "external_id", "mal_id", "id")
            title = _pick(item, "title", "name")

            if not title:
                skipped += 1
                continue

            defaults = {
                "title": title,
                "synopsis": _pick(item, "synopsis", "description"),
                "type": _normalize_type(_pick(item, "type", "media_type")),
                "episodes": _pick(item, "episodes", "episode_count"),
                "status": _normalize_status(_pick(item, "status")),
                "image_url": _extract_image_url(item),
            }

            # Remove keys with None so we do not overwrite existing values with nulls.
            defaults = {k: v for k, v in defaults.items() if v is not None}
            should_sync_tags = _has_jikan_taxonomy(item)
            tag_names = _extract_jikan_tag_names(item) if should_sync_tags else []

            if external_id is None:
                anime, was_created = Anime.objects.get_or_create(
                    title=title,
                    defaults=defaults,
                )
                if not was_created and defaults:
                    for key, value in defaults.items():
                        setattr(anime, key, value)
                    anime.save(update_fields=list(defaults.keys()) + ["updated_at"])

                if should_sync_tags:
                    tag_objects = []
                    for tag_name in tag_names:
                        tag_key = tag_name.casefold()
                        tag = tag_cache.get(tag_key)
                        if tag is None:
                            tag, _ = Tag.objects.get_or_create(
                                name=tag_name,
                                defaults={"color": _generate_tag_color(tag_name)},
                            )
                            tag_cache[tag_key] = tag
                            created_tag_names.add(tag.name)
                        else:
                            reused_tag_names.add(tag.name)
                        tag_objects.append(tag)

                    anime.tags.set(tag_objects)

                created += int(was_created)
                updated += int(not was_created)
                continue

            anime, was_created = Anime.objects.update_or_create(
                external_id=external_id,
                defaults={**defaults, "external_id": external_id, "title": title},
            )

            if should_sync_tags:
                tag_objects = []
                for tag_name in tag_names:
                    tag_key = tag_name.casefold()
                    tag = tag_cache.get(tag_key)
                    if tag is None:
                        tag, _ = Tag.objects.get_or_create(
                            name=tag_name,
                            defaults={"color": _generate_tag_color(tag_name)},
                        )
                        tag_cache[tag_key] = tag
                        created_tag_names.add(tag.name)
                    else:
                        reused_tag_names.add(tag.name)
                    tag_objects.append(tag)

                anime.tags.set(tag_objects)

            created += int(was_created)
            updated += int(not was_created)

        self.stdout.write(
            self.style.SUCCESS(
                f"Done. Processed={len(items)} Created={created} Updated={updated} Skipped={skipped}"
            )
        )
        self.stdout.write(
            self.style.SUCCESS(
                f"Tags synced. Created={len(created_tag_names)} Reused={len(reused_tag_names)}"
            )
        )
