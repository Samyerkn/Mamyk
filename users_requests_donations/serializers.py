from rest_framework import serializers
from .models import User, HelpRequest, Donation


# ===== ПОЛЬЗОВАТЕЛЬ =====

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'full_name', 'password', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data.get('full_name', ''),
            role=validated_data.get('role', User.BUYER),
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'created_at']


# ===== ЗАЯВКИ =====

class HelpRequestSerializer(serializers.ModelSerializer):
    amount_collected = serializers.ReadOnlyField()  # берёт из @property модели
    user = UserSerializer(read_only=True)  # показывает данные автора заявки

    class Meta:
        model = HelpRequest
        fields = [
            'id', 'user', 'child_name', 'diagnosis', 'story',
            'fastening_type', 'size', 'amount_needed',
            'amount_collected', 'status', 'created_at'
        ]
        read_only_fields = ['status', 'created_at']


# ===== ДОНАТЫ =====

class DonationSerializer(serializers.ModelSerializer):
    sponsor = UserSerializer(read_only=True)  # показывает данные спонсора

    class Meta:
        model = Donation
        fields = ['id', 'sponsor', 'help_request', 'amount', 'is_full_payment', 'created_at']
        read_only_fields = ['created_at']