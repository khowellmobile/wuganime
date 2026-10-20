import json
from hashlib import md5
from urllib.parse import urlencode, urlparse, parse_qsl, urlunparse
from urllib.request import Request, urlopen
from anime.models import Anime, Tag


class AnimeApiError(Exception):
    pass


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


def fetch_pages(
    base_url,
    limit,
    params=None,
    headers=None,
    page_param="page",
    timeout=20,
    results_key=None,
):
    params = params or {}
    headers = headers or {}
    items = []
    page = 1
    while len(items) < limit:
        page_params = {**params, page_param: page}
        request_url = _build_url(base_url, page_params)
        request = Request(request_url, headers=headers)

        try:
            with urlopen(request, timeout=timeout) as response:
                payload = json.loads(response.read().decode("utf-8"))
        except Exception as exc:
            raise AnimeApiError(
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
    return items


def normalize(item):
    """Convert one raw API item into model-ready data, or None if unusable."""
    if not isinstance(item, dict):
        return None

    external_id = _pick(item, "external_id", "mal_id", "id")
    title = _pick(item, "title", "name")
    if external_id is None or not title:
        return None

    fields = {
        "title": title,
        "synopsis": _pick(item, "synopsis", "description"),
        "type": _normalize_type(_pick(item, "type", "media_type")),
        "episodes": _pick(item, "episodes", "episode_count"),
        "status": _normalize_status(_pick(item, "status")),
        "image_url": _extract_image_url(item),
    }
    # Don't overwrite existing values with nulls
    fields = {k: v for k, v in fields.items() if v is not None}

    return {
        "external_id": external_id,
        "fields": fields,
        "tag_names": (
            _extract_jikan_tag_names(item) if _has_jikan_taxonomy(item) else None
        ),
    }


def upsert_anime(normalized, tag_cache=None):
    """Create or update an Anime from normalize() output. Returns (anime, was_created)."""
    anime, was_created = Anime.objects.update_or_create(
        external_id=normalized["external_id"],
        defaults=normalized["fields"],
    )

    tag_names = normalized["tag_names"]
    if tag_names is not None:  # None means no tag info.
        if tag_cache is None:
            tag_cache = {}
        tags = []
        for name in tag_names:
            key = name.casefold()
            tag = tag_cache.get(key)
            if tag is None:
                tag, _ = Tag.objects.get_or_create(
                    name=name,
                    defaults={"color": _generate_tag_color(name)},
                )
                tag_cache[key] = tag
            tags.append(tag)
        anime.tags.set(tags)

    return anime, was_created
