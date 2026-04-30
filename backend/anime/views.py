from rest_framework import viewsets, permissions
from .models import Anime, UserAnime
from .serializers import AnimeSerializer, UserAnimeSerializer


class AnimeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A simple ViewSet for viewing the global anime database.
    Users can list all anime or retrieve a single one.
    """

    queryset = Anime.objects.all()
    serializer_class = AnimeSerializer
    permission_classes = [permissions.AllowAny]


class UserAnimeViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing a user's personal anime list.
    """

    serializer_class = UserAnimeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserAnime.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
