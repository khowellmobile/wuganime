# rental_api/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/', views.CookieTokenObtainPairView.as_view(), name='cookie-login'),
    path('auth/refresh/', views.CookieTokenRefreshView.as_view(), name='cookie-refresh'),
    path('auth/logout/', views.CookieLogoutView.as_view(), name='cookie-logout'),
    path('auth/jwt/create/', views.CookieTokenObtainPairView.as_view(), name='cookie-jwt-create'),
    path('auth/jwt/refresh/', views.CookieTokenRefreshView.as_view(), name='cookie-jwt-refresh'),
    path('profile/', views.UserProfileAPIView.as_view(), name='user-profile'),
]