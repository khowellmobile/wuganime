from django.contrib import admin
from .models import Anime, UserAnime


# Register your models here.
@admin.register(Anime)
class AnimeAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "type", "episodes", "status", "created_at")
    search_fields = ("title",)
    list_filter = ("type", "status")


@admin.register(UserAnime)
class UserAnimeAdmin(admin.ModelAdmin):
    list_display = ("user", "anime", "status", "score", "created_at")
    search_fields = ("user__username", "anime__title")
    list_filter = ("status", "score")
