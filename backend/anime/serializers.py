from rest_framework import serializers
from .models import Anime, UserAnime, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]


class AnimeSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(many=True, read_only=True, slug_field="name")

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
