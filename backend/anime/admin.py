from django.contrib import admin
from .models import Anime, UserAnime, Tag


# Register your models here.
@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name","color")
    search_fields = ("name",)


@admin.register(Anime)
class AnimeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "get_tags",
        "type",
        "episodes",
        "status",
        "image_url",
        "created_at",
    )
    search_fields = ("title",)
    list_filter = ("type", "status")

    def get_tags(self, obj):
        return ", ".join([tag.name for tag in obj.tags.all()])

    get_tags.short_description = "Tags"


@admin.register(UserAnime)
class UserAnimeAdmin(admin.ModelAdmin):
    list_display = ("user", "anime", "status", "score", "created_at")
    search_fields = ("user__username", "anime__title")
    list_filter = ("status", "score")
