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

    class Meta(AnimeSerializer.Meta):
        fields = AnimeSerializer.Meta.fields + ["user_status"]

    def get_user_status(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return "UNCATEGORIZED"

        prefetched = getattr(obj, "request_user_relations", None)
        if prefetched is not None:
            if not prefetched:
                return "UNCATEGORIZED"
            return prefetched[0].status or "UNCATEGORIZED"

        relation = UserAnime.objects.filter(user=request.user, anime=obj).only("status").first()
        if relation is None:
            return "UNCATEGORIZED"
        return relation.status or "UNCATEGORIZED"


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


class UserAnimeStatusMutationSerializer(serializers.Serializer):
    anime = serializers.PrimaryKeyRelatedField(queryset=Anime.objects.all())
    status = serializers.ChoiceField(
        choices=[*UserAnime.UserStatus.values, "UNCATEGORIZED"]
    )
    episodes_watched = serializers.IntegerField(required=False, min_value=0)
    score = serializers.IntegerField(required=False, min_value=0, allow_null=True)
