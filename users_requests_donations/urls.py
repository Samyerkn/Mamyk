from django.urls import path

from . import views


urlpatterns = [
    path('auth/register/', views.RegisterView.as_view()),
    path('auth/login/', views.LoginView.as_view()),
    path('auth/refresh/', views.RefreshTokenView.as_view()),
    path('auth/me/', views.MeView.as_view()),
    path('auth/logout/', views.LogoutView.as_view()),

    path('requests/', views.HelpRequestListCreateView.as_view()),
    path('requests/<int:pk>/', views.HelpRequestDetailView.as_view()),
    path('requests/me/', views.MyHelpRequestsView.as_view()),

    path('donations/', views.DonationCreateView.as_view()),
    path('donations/me/', views.MyDonationsView.as_view()),
    path('donations/by_request/<int:pk>/', views.DonationsByRequestView.as_view()),

    path('medical/', views.MedicalCaseListCreateView.as_view()),
    path('medical/<int:pk>/', views.MedicalCaseDetailView.as_view()),
    path('medical/donations/', views.MedicalDonationCreateView.as_view()),
    path('medical/donations/me/', views.MyMedicalDonationsView.as_view()),

    path('news/', views.NewsListView.as_view()),
    path('news/<int:pk>/', views.NewsDetailView.as_view()),
]