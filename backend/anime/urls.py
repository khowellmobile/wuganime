from rest_framework.routers import DefaultRouter
from .views import (
    AnimeViewSet,
    UserAnimeViewSet,
    CustomAnimeViewSet,
    LibraryViewSet,
)

router = DefaultRouter()
router.register(r"anime", AnimeViewSet, basename="anime")
router.register(r"user-anime", UserAnimeViewSet, basename="user-anime")
router.register(r"custom-anime", CustomAnimeViewSet, basename="custom-anime")
router.register(r"library", LibraryViewSet, basename="library")

urlpatterns = router.urls
