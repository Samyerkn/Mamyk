from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Авторизация
    path('auth/register/', views.RegisterView.as_view()),
    path('auth/login/', views.LoginView.as_view()),
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('auth/me/', views.MeView.as_view()),

    # Заявки
    path('requests/', views.HelpRequestListCreateView.as_view()),
    path('requests/<int:pk>/', views.HelpRequestDetailView.as_view()),
    path('requests/me/', views.MyHelpRequestsView.as_view()),

    # Донаты
    path('donations/', views.DonationCreateView.as_view()),
    path('donations/me/', views.MyDonationsView.as_view()),
    path('donations/by_request/<int:pk>/', views.DonationsByRequestView.as_view()),
]