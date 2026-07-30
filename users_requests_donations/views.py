from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Donation, HelpRequest, MedicalCase, MedicalDonation, News, User
from .serializers import (
    DonationSerializer,
    HelpRequestSerializer,
    MedicalCaseSerializer,
    MedicalDonationSerializer,
    NewsSerializer,
    UserRegisterSerializer,
    UserSerializer,
)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    'user': UserSerializer(user).data,
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    'user': UserSerializer(user).data,
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                },
                status=status.HTTP_200_OK,
            )

        return Response({'error': 'Неверный email или пароль'}, status=status.HTTP_401_UNAUTHORIZED)


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token не предоставлен'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            refresh = RefreshToken(refresh_token)
            return Response({'access': str(refresh.access_token)}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'error': 'Недействительный или истёкший refresh token'}, status=status.HTTP_401_UNAUTHORIZED)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token не предоставлен'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            refresh = RefreshToken(refresh_token)
            refresh.blacklist()
            return Response({'message': 'Выход выполнен успешно'}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({'error': 'Недействительный refresh token'}, status=status.HTTP_400_BAD_REQUEST)


class HelpRequestListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        requests = HelpRequest.objects.filter(status__in=['pending', 'in_progress']).order_by('-created_at')
        return Response(HelpRequestSerializer(requests, many=True).data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = HelpRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HelpRequestDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            help_request = HelpRequest.objects.get(pk=pk)
        except HelpRequest.DoesNotExist:
            return Response({'error': 'Заявка не найдена'}, status=status.HTTP_404_NOT_FOUND)
        return Response(HelpRequestSerializer(help_request).data, status=status.HTTP_200_OK)


class MyHelpRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        requests = HelpRequest.objects.filter(user=request.user).order_by('-created_at')
        return Response(HelpRequestSerializer(requests, many=True).data, status=status.HTTP_200_OK)


class DonationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DonationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(sponsor=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyDonationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        donations = Donation.objects.filter(sponsor=request.user).order_by('-created_at')
        return Response(DonationSerializer(donations, many=True).data, status=status.HTTP_200_OK)


class DonationsByRequestView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        donations = Donation.objects.filter(help_request_id=pk).order_by('-created_at')
        return Response(DonationSerializer(donations, many=True).data)


class MedicalCaseListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        cases = MedicalCase.objects.filter(status__in=['pending', 'in_progress']).order_by('-created_at')
        return Response(MedicalCaseSerializer(cases, many=True).data)

    def post(self, request):
        serializer = MedicalCaseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MedicalCaseDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            case = MedicalCase.objects.get(pk=pk)
        except MedicalCase.DoesNotExist:
            return Response({'error': 'Случай не найден'}, status=status.HTTP_404_NOT_FOUND)
        return Response(MedicalCaseSerializer(case).data)


class MedicalDonationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = MedicalDonationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(sponsor=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyMedicalDonationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        donations = MedicalDonation.objects.filter(sponsor=request.user).order_by('-created_at')
        return Response(MedicalDonationSerializer(donations, many=True).data)


class NewsListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        news = News.objects.order_by('-created_at')
        return Response(NewsSerializer(news, many=True).data)


class NewsDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            item = News.objects.get(pk=pk)
        except News.DoesNotExist:
            return Response({'error': 'Новость не найдена'}, status=status.HTTP_404_NOT_FOUND)
        return Response(NewsSerializer(item).data)
