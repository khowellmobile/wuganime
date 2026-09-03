from django.db import transaction
from django.db.models import Prefetch, Q
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import Anime, UserAnime, CustomAnime
from .serializers import (
    AnimeSerializer,
    AnimeWithUserStatusSerializer,
    UserAnimeSerializer,
    UserAnimeStatusMutationSerializer,
    CustomAnimeSerializer,
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

    @action(detail=False, methods=["post"], url_path="update-useranime")
    def update_useranime(self, request):
        serializer = UserAnimeStatusMutationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        anime = serializer.validated_data["anime"]
        desired_status = serializer.validated_data.get("status")

        user_anime = UserAnime.objects.filter(
            user=request.user,
            anime=anime,
        ).first()

        """ Remove the UserAnime record if the desired status is UNCATEGORIZED. """
        if desired_status == "UNCATEGORIZED":
            if user_anime:
                user_anime.delete()

            return Response(
                {
                    "anime": anime.id,
                    "status": "UNCATEGORIZED",
                    "deleted": bool(user_anime),
                },
                status=status.HTTP_200_OK,
            )

        """ Update or create the UserAnime record with the provided fields. """
        updates = {}
        if "status" in serializer.validated_data:
            updates["status"] = serializer.validated_data["status"]
        if "episodes_watched" in serializer.validated_data:
            updates["episodes_watched"] = serializer.validated_data["episodes_watched"]
        if "score" in serializer.validated_data:
            updates["score"] = serializer.validated_data["score"]

        if not updates:
            return Response(
                {"detail": "No fields to update."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user_anime is None:
            if "status" not in updates:
                return Response(
                    {
                        "detail": "A non-UNCATEGORIZED status is required to create a record."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user_anime = UserAnime.objects.create(
                user=request.user,
                anime=anime,
                **updates,
            )
            created = True
        else:
            for field, value in updates.items():
                setattr(user_anime, field, value)
            user_anime.save()
            created = False

        response_serializer = self.get_serializer(user_anime)
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class CustomAnimeViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing a user's custom (self-added) anime entries.
    """

    serializer_class = CustomAnimeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CustomAnime.objects.filter(
            user=self.request.user, is_deleted=False
        ).order_by("-last_changed_at", "-id")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save(update_fields=["is_deleted"])


class LibraryViewSet(viewsets.ViewSet):
    """
    Read-only endpoint that merges the global Anime catalog with the
    requesting user's CustomAnime entries into a single searchable list.
    """

    permission_classes = [permissions.IsAuthenticated]
    pagination_class = AnimePagination

    def _get_anime_queryset(self, request, search_term):
        queryset = Anime.objects.all().prefetch_related("tags").order_by("id")

        if search_term:
            search_query = (
                Q(title__icontains=search_term)
                | Q(tags__name__icontains=search_term)
                | Q(synopsis__icontains=search_term)
            )
            if search_term.isdigit():
                search_query = search_query | Q(external_id=int(search_term))
            queryset = queryset.filter(search_query).distinct()

        tag_values = request.query_params.getlist("tags")
        if tag_values:
            queryset = queryset.filter(tags__name__in=tag_values).distinct()

        queryset = queryset.prefetch_related(
            Prefetch(
                "useranime_set",
                queryset=UserAnime.objects.filter(user=request.user).only(
                    "anime_id", "status", "episodes_watched"
                ),
                to_attr="request_user_relations",
            )
        )
        return queryset

    def _get_custom_anime_queryset(self, request, search_term):
        queryset = CustomAnime.objects.filter(
            user=request.user, is_deleted=False
        ).order_by("id")

        if search_term:
            queryset = queryset.filter(
                Q(title__icontains=search_term)
                | Q(synopsis__icontains=search_term)
                | Q(synopsis__icontains=search_term)
            )

        return queryset

    def list(self, request):
        search_term = (request.query_params.get("search") or "").strip()

        anime_qs = self._get_anime_queryset(request, search_term)
        custom_qs = self._get_custom_anime_queryset(request, search_term)

        user_status_filter = request.query_params.get("user_status")
        if user_status_filter:
            if user_status_filter not in UserAnime.UserStatus.values:
                return Response(
                    {"detail": "Invalid user_status."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            anime_qs = anime_qs.filter(
                useranime__user=request.user, useranime__status=user_status_filter
            )
            custom_qs = custom_qs.filter(status=user_status_filter)

        anime_data = AnimeWithUserStatusSerializer(
            anime_qs, many=True, context={"request": request}
        ).data
        custom_data = CustomAnimeSerializer(custom_qs, many=True).data

        combined = sorted(
            [*anime_data, *custom_data], key=lambda item: item["title"].lower()
        )

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(combined, request, view=self)
        return paginator.get_paginated_response(page)
