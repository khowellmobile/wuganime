from django.conf import settings
from django.middleware.csrf import get_token

from rest_framework import exceptions, status
from rest_framework.authentication import CSRFCheck
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .serializers import UserSerializer


def _set_auth_cookies(response, access_token, refresh_token=None):
    access_max_age = int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds())
    refresh_max_age = int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds())

    response.set_cookie(
        settings.JWT_AUTH_COOKIE_ACCESS,
        access_token,
        max_age=access_max_age,
        secure=settings.JWT_AUTH_COOKIE_SECURE,
        httponly=settings.JWT_AUTH_COOKIE_HTTP_ONLY,
        samesite=settings.JWT_AUTH_COOKIE_SAMESITE,
    )

    if refresh_token:
        response.set_cookie(
            settings.JWT_AUTH_COOKIE_REFRESH,
            refresh_token,
            max_age=refresh_max_age,
            secure=settings.JWT_AUTH_COOKIE_SECURE,
            httponly=settings.JWT_AUTH_COOKIE_HTTP_ONLY,
            samesite=settings.JWT_AUTH_COOKIE_SAMESITE,
        )


def _clear_auth_cookies(response):
    response.delete_cookie(
        settings.JWT_AUTH_COOKIE_ACCESS,
        samesite=settings.JWT_AUTH_COOKIE_SAMESITE,
    )
    response.delete_cookie(
        settings.JWT_AUTH_COOKIE_REFRESH,
        samesite=settings.JWT_AUTH_COOKIE_SAMESITE,
    )
    response.delete_cookie(
        settings.CSRF_COOKIE_NAME,
        samesite=settings.CSRF_COOKIE_SAMESITE,
    )


def _set_csrf_cookie(response, request):
    csrf_cookie_name = settings.CSRF_COOKIE_NAME
    csrf_token = get_token(request)
    response.set_cookie(
        csrf_cookie_name,
        csrf_token,
        secure=settings.CSRF_COOKIE_SECURE,
        httponly=False,
        samesite=settings.CSRF_COOKIE_SAMESITE,
    )


def _enforce_csrf(request):
    check = CSRFCheck(lambda request: None)
    check.process_request(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        raise exceptions.PermissionDenied(f"CSRF Failed: {reason}")


class CookieTokenObtainPairView(TokenObtainPairView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = TokenObtainPairSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        access = serializer.validated_data["access"]
        refresh = serializer.validated_data["refresh"]

        response = Response(
            {"detail": "Login successful."},
            status=status.HTTP_200_OK,
        )
        _set_auth_cookies(response=response, access_token=access, refresh_token=refresh)
        _set_csrf_cookie(response=response, request=request)
        return response


class CookieTokenRefreshView(TokenRefreshView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        _enforce_csrf(request)
        refresh = request.COOKIES.get(settings.JWT_AUTH_COOKIE_REFRESH)
        if not refresh:
            return Response(
                {"detail": "No refresh token cookie found."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = TokenRefreshSerializer(data={"refresh": refresh})
        serializer.is_valid(raise_exception=True)

        access = serializer.validated_data["access"]
        rotated_refresh = serializer.validated_data.get("refresh")

        response = Response(
            {"detail": "Token refreshed."},
            status=status.HTTP_200_OK,
        )
        _set_auth_cookies(
            response=response,
            access_token=access,
            refresh_token=rotated_refresh,
        )
        _set_csrf_cookie(response=response, request=request)
        return response


class CookieLogoutView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        _enforce_csrf(request)
        refresh = request.COOKIES.get(settings.JWT_AUTH_COOKIE_REFRESH)
        if refresh:
            try:
                token = RefreshToken(refresh)
                token.blacklist()
            except (AttributeError, TokenError):
                pass

        response = Response(
            {"detail": "Logout successful."},
            status=status.HTTP_200_OK,
        )
        _clear_auth_cookies(response)
        return response


class UserProfileAPIView(APIView):
    """
    API endpoint to retrieve and update the authenticated user's profile.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieves the profile of the authenticated user.
        """
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        """
        Updates the profile of the authenticated user.
        """

        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
