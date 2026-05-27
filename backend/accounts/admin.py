from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
	fieldsets = UserAdmin.fieldsets + (
		("Profile", {"fields": ("profile_picture_url",)}),
	)
	add_fieldsets = UserAdmin.add_fieldsets + (
		("Profile", {"fields": ("profile_picture_url",)}),
	)
