from hashlib import md5

from anime.models import Anime, Tag


def _generate_tag_color(tag_name):
    digest = md5(tag_name.encode("utf-8")).hexdigest()
    return f"#{digest[:6]}"


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
