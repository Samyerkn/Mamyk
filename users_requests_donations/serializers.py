from rest_framework import serializers

from .models import Donation, HelpRequest, MedicalCase, MedicalDonation, News, User


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'full_name', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data.get('full_name', ''),
            role=User.BUYER,
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'created_at']


class HelpRequestSerializer(serializers.ModelSerializer):
    amount_collected = serializers.ReadOnlyField()
    user = UserSerializer(read_only=True)

    class Meta:
        model = HelpRequest
        fields = [
            'id', 'user', 'child_name', 'diagnosis', 'story',
            'fastening_type', 'size', 'amount_needed',
            'amount_collected', 'status', 'created_at'
        ]
        read_only_fields = ['status', 'created_at']


class DonationSerializer(serializers.ModelSerializer):
    sponsor = UserSerializer(read_only=True)

    class Meta:
        model = Donation
        fields = ['id', 'sponsor', 'help_request', 'amount', 'is_full_payment', 'created_at']
        read_only_fields = ['created_at']


class MedicalCaseSerializer(serializers.ModelSerializer):
    amount_collected = serializers.ReadOnlyField()
    user = UserSerializer(read_only=True)

    class Meta:
        model = MedicalCase
        fields = [
            'id',
            'user',
            'patient_name',
            'diagnosis',
            'story',
            'image',
            'amount_needed',
            'amount_collected',
            'status',
            'created_at',
        ]
        read_only_fields = ['status', 'created_at']

class MedicalDonationSerializer(serializers.ModelSerializer):
    sponsor = UserSerializer(read_only=True)

    class Meta:
        model = MedicalDonation
        fields = ['id', 'sponsor', 'medical_case', 'amount', 'created_at']
        read_only_fields = ['created_at']


class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ['id', 'title', 'content', 'image', 'created_at']
        read_only_fields = ['created_at']