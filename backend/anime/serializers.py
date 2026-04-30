from rest_framework import serializers
from .models import Anime, UserAnime


class AnimeSerializer(serializers.ModelSerializer):
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
