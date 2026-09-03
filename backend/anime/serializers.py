from rest_framework import serializers
from .models import Anime, UserAnime, Tag, CustomAnime


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "color"]


class AnimeSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Anime
        fields = [
            "id",
            "title",
            "synopsis",
            "tags",
            "type",
            "episodes",
            "status",
            "image_url",
            "external_id",
            "is_deleted",
            "created_at",
            "updated_at",
        ]


class AnimeWithUserStatusSerializer(AnimeSerializer):
    user_status = serializers.SerializerMethodField()
    episodes_watched = serializers.SerializerMethodField()
    is_custom = serializers.BooleanField(default=False, read_only=True)

    class Meta(AnimeSerializer.Meta):
        fields = AnimeSerializer.Meta.fields + [
            "user_status",
            "episodes_watched",
            "is_custom",
        ]

    def _get_user_relation(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return None

        prefetched = getattr(obj, "request_user_relations", None)
        if prefetched is not None:
            return prefetched[0] if prefetched else None

        return (
            UserAnime.objects.filter(user=request.user, anime=obj)
            .only("status", "episodes_watched")
            .first()
        )

    def get_user_status(self, obj):
        relation = self._get_user_relation(obj)
        if relation is None:
            return "UNCATEGORIZED"
        return relation.status or "UNCATEGORIZED"

    def get_episodes_watched(self, obj):
        relation = self._get_user_relation(obj)
        if relation is None:
            return 0
        return relation.episodes_watched


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
            "last_changed_at",
            "updated_at",
        ]


class UserAnimeStatusMutationSerializer(serializers.Serializer):
    anime = serializers.PrimaryKeyRelatedField(queryset=Anime.objects.all())
    status = serializers.ChoiceField(
        choices=[*UserAnime.UserStatus.values, "UNCATEGORIZED"], required=False
    )
    episodes_watched = serializers.IntegerField(required=False, min_value=0)
    score = serializers.IntegerField(required=False, min_value=0, allow_null=True)


class CustomAnimeSerializer(serializers.ModelSerializer):
    is_custom = serializers.BooleanField(default=True, read_only=True)
    user_status = serializers.ChoiceField(
        source="status",
        choices=CustomAnime.UserStatus.choices,
        required=False,
        allow_null=True,
    )
    is_deleted = serializers.BooleanField(default=False, read_only=True)

    class Meta:
        model = CustomAnime
        fields = [
            "id",
            "title",
            "synopsis",
            "type",
            "episodes",
            "user_status",
            "episodes_watched",
            "is_custom",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
