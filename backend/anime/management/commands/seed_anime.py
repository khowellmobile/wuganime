import json

from django.core.management.base import BaseCommand, CommandError

from anime.models import Tag
from anime.services import anime_api


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

        try:
            items = anime_api.fetch_pages(
                base_url,
                limit,
                params=params,
                headers=headers,
                page_param=page_param,
                timeout=timeout,
                results_key=results_key,
            )
        except anime_api.AnimeApiError as exc:
            raise CommandError(str(exc)) from exc

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
            tag.name.casefold(): tag
            for tag in Tag.objects.all().only("id", "name", "color")
        }

        for item in items:
            normalized = anime_api.normalize(item)
            if not normalized:
                skipped += 1
                continue

            anime, was_created = anime_api.upsert_anime(normalized, tag_cache=tag_cache)
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
