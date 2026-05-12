from rest_framework import serializers
from .models import Anime, UserAnime, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "color"]


class AnimeSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Anime
        fields = "__all__"


class UserAnimeSerializer(serializers.ModelSerializer):
    anime_details = AnimeSerializer(source="anime", read_only=True)

    class Meta:
        model = UserAnime
        fields = [
            "id",
            "anime",
            "anime_details",
            "status",
            "episodes_watched",
            "score",
            "updated_at",
        ]
