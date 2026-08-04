from django.db import transaction
from django.db.models import Prefetch, Q
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import Anime, UserAnime
from .serializers import (
    AnimeSerializer,
    AnimeWithUserStatusSerializer,
    UserAnimeSerializer,
    UserAnimeStatusMutationSerializer,
)


class AnimePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class AnimeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A simple ViewSet for viewing the global anime database.
    Users can list all anime or retrieve a single one.
    """

    queryset = Anime.objects.all().prefetch_related("tags")
    serializer_class = AnimeSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = AnimePagination

    def get_queryset(self):
        queryset = Anime.objects.all().prefetch_related("tags").order_by("id")
        user = self.request.user

        search_term = self.request.query_params.get("search")
        if search_term:
            search_term = search_term.strip()
            if search_term:
                search_query = (
                    Q(title__icontains=search_term)
                    | Q(tags__name__icontains=search_term)
                    | Q(synopsis__icontains=search_term)
                )
                if search_term.isdigit():
                    search_query = search_query | Q(external_id=int(search_term))
                queryset = queryset.filter(search_query)

        user_status_filter = self.request.query_params.get("user_status")
        if not user.is_authenticated:
            return queryset.none()
        if user_status_filter:
            if user_status_filter in UserAnime.UserStatus.values:
                queryset = queryset.filter(
                    useranime__user=user, useranime__status=user_status_filter
                )
            else:
                return queryset.none()

        tag_values = self.request.query_params.getlist("tags")
        if tag_values:
            queryset = queryset.filter(tags__name__in=tag_values).distinct()

        if search_term:
            queryset = queryset.distinct()

        if user.is_authenticated:
            queryset = queryset.prefetch_related(
                Prefetch(
                    "useranime_set",
                    queryset=UserAnime.objects.filter(user=user).only(
                        "anime_id", "status", "episodes_watched"
                    ),
                    to_attr="request_user_relations",
                )
            )

        return queryset

    def get_serializer_class(self):
        return AnimeWithUserStatusSerializer


class UserAnimeViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing a user's personal anime list.
    """

    serializer_class = UserAnimeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = UserAnime.objects.filter(user=self.request.user).select_related("anime")
        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)
        return qs.order_by("-last_changed_at", "-id")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["post"], url_path="set-status")
    def set_status(self, request):
        serializer = UserAnimeStatusMutationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        anime = serializer.validated_data["anime"]
        desired_status = serializer.validated_data["status"]

        if desired_status == "UNCATEGORIZED":
            deleted_count, _ = UserAnime.objects.filter(
                user=request.user, anime=anime
            ).delete()
            return Response(
                {
                    "anime": anime.id,
                    "status": "UNCATEGORIZED",
                    "deleted": bool(deleted_count),
                },
                status=status.HTTP_200_OK,
            )

        defaults = {"status": desired_status}
        if "episodes_watched" in serializer.validated_data:
            defaults["episodes_watched"] = serializer.validated_data["episodes_watched"]
        if "score" in serializer.validated_data:
            defaults["score"] = serializer.validated_data["score"]

        with transaction.atomic():
            user_anime, created = UserAnime.objects.update_or_create(
                user=request.user,
                anime=anime,
                defaults=defaults,
            )

        response_serializer = self.get_serializer(user_anime)
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
