# rental_api/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model, focused on user-editable profile fields.
    Does NOT include sensitive fields like password.
    """

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "avatar_key",
            "is_active",
            "date_joined",
            "last_login",
        )
        read_only_fields = (
            "id",
            "date_joined",
            "last_login",
        )