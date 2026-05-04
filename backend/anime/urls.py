from rest_framework.routers import DefaultRouter
from .views import AnimeViewSet, UserAnimeViewSet

router = DefaultRouter()
router.register(r"anime", AnimeViewSet, basename="anime")
router.register(r"user-anime", UserAnimeViewSet, basename="user-anime")

urlpatterns = router.urls
