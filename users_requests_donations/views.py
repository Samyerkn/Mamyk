from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import authenticate

from .models import User, HelpRequest, Donation
from .serializers import (
    UserRegisterSerializer,
    UserSerializer,
    HelpRequestSerializer,
    DonationSerializer,
)


# =========================================================
# АВТОРИЗАЦИЯ
# =========================================================

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "user": UserSerializer(user).data,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(
            request,
            username=email,
            password=password,
        )

        if user is not None:
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "user": UserSerializer(user).data,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "error": "Неверный email или пароль"
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {
                    "error": "Refresh token не предоставлен"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            refresh = RefreshToken(refresh_token)

            return Response(
                {
                    "access": str(refresh.access_token)
                },
                status=status.HTTP_200_OK,
            )

        except Exception:
            return Response(
                {
                    "error": "Недействительный или истёкший refresh token"
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            UserSerializer(request.user).data,
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {
                    "error": "Refresh token не предоставлен"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            refresh = RefreshToken(refresh_token)
            refresh.blacklist()

            return Response(
                {
                    "message": "Выход выполнен успешно"
                },
                status=status.HTTP_205_RESET_CONTENT,
            )

        except Exception:
            return Response(
                {
                    "error": "Недействительный refresh token"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


# =========================================================
# ЗАЯВКИ НА ПОМОЩЬ
# =========================================================

class HelpRequestListCreateView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]

        return [IsAuthenticated()]

    def get(self, request):
        # Публичная лента.
        # Показываем только активные заявки.
        # Завершённые заявки сюда не попадают.

        requests = (
            HelpRequest.objects
            .filter(
                status__in=[
                    "pending",
                    "in_progress",
                ]
            )
            .order_by("-created_at")
        )

        serializer = HelpRequestSerializer(
            requests,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = HelpRequestSerializer(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save(
                user=request.user
            )

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class HelpRequestDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):

        try:
            help_request = HelpRequest.objects.get(
                pk=pk
            )

        except HelpRequest.DoesNotExist:
            return Response(
                {
                    "error": "Заявка не найдена"
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = HelpRequestSerializer(
            help_request
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class MyHelpRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        requests = (
            HelpRequest.objects
            .filter(
                user=request.user
            )
            .order_by("-created_at")
        )

        serializer = HelpRequestSerializer(
            requests,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


# =========================================================
# ДОНАТЫ / СПОНСОРСТВО
# =========================================================

class DonationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = DonationSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save(
                sponsor=request.user
            )

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class MyDonationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        donations = (
            Donation.objects
            .filter(
                sponsor=request.user
            )
            .order_by("-created_at")
        )

        serializer = DonationSerializer(
            donations,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class DonationsByRequestView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):

        donations = (
            Donation.objects
            .filter(
                help_request_id=pk
            )
            .order_by("-created_at")
        )

        serializer = DonationSerializer(
            donations,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )