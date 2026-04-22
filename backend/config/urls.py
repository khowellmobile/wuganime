"""
URL configuration for config project. (core)
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "api/",
        include(
            [
                # Cookie-based auth endpoints and aliases for jwt/create and jwt/refresh.
                path("", include("accounts.urls")),
                # Djoser user management endpoints and JWT verify endpoint.
                path("auth/", include("djoser.urls")),
                path("auth/", include("djoser.urls.jwt")),
            ]
        ),
    ),
]
