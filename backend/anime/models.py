from django.db import models
from django.contrib.auth.models import User


class Anime(models.Model):
    title = models.CharField(max_length=255)
    synopsis = models.TextField(null=True, blank=True)
    type = models.CharField(max_length=50, null=True, blank=True)
    episodes = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=50, null=True, blank=True)
    image_url = models.URLField(null=True, blank=True)
    external_id = models.IntegerField(unique=True, null=True, blank=True)

    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class UserAnime(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    anime = models.ForeignKey(Anime, on_delete=models.CASCADE)

    status = models.CharField(max_length=20, default="Watching")
    episodes_watched = models.PositiveIntegerField(default=0)
    score = models.PositiveIntegerField(null=True, blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "anime")

    def __str__(self):
        return f"{self.user.username} - {self.anime.title}"