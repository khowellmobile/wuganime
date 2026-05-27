from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
	profile_picture_url = models.URLField(blank=True, null=True)
