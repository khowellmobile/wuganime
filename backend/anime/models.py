from django.db import models
from django.conf import settings


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=7, default="#000000")

    def __str__(self):
        return self.name


class Anime(models.Model):
    class TypeChoices(models.TextChoices):
        TV = "TV", "TV"
        MOVIE = "MOVIE", "Movie"
        OVA = "OVA", "OVA"
        SPECIAL = "SPECIAL", "Special"

    class StatusChoices(models.TextChoices):
        AIRING = "AIRING", "Currently Airing"
        FINISHED = "FINISHED", "Finished Airing"
        NOT_YET = "NOT_YET", "Not Yet Aired"

    title = models.CharField(max_length=255)
    synopsis = models.TextField(null=True, blank=True)
    tags = models.ManyToManyField(Tag, blank=True, related_name="animes")
    type = models.CharField(
        max_length=50, choices=TypeChoices.choices, null=True, blank=True
    )
    episodes = models.IntegerField(null=True, blank=True)
    status = models.CharField(
        max_length=50, choices=StatusChoices.choices, null=True, blank=True
    )
    image_url = models.URLField(null=True, blank=True)
    external_id = models.IntegerField(unique=True, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class UserAnime(models.Model):
    class UserStatus(models.TextChoices):
        WATCHED = "WATCHED", "Watched"
        TO_BE_WATCHED = "TO_WATCH", "To Watch"
        UP_NEXT = "UP_NEXT", "Up Next"
        DNF = "DNF", "Did Not Finish"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    anime = models.ForeignKey(Anime, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20, choices=UserStatus.choices, blank=True, null=True
    )
    episodes_watched = models.PositiveIntegerField(default=0)
    score = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "anime")

    def __str__(self):
        return f"{self.user.username} - {self.anime.title}"
