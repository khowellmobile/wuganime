from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
	avatar_key = models.CharField(max_length=32, blank=True, null=True)
