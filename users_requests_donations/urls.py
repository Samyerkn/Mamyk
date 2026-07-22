from django.urls import path

from . import views


urlpatterns = [

    # =====================================================
    # АВТОРИЗАЦИЯ
    # =====================================================

    # Регистрация
    path(
        "auth/register/",
        views.RegisterView.as_view(),
    ),

    # Вход
    path(
        "auth/login/",
        views.LoginView.as_view(),
    ),

    # Обновление access token
    path(
        "auth/refresh/",
        views.RefreshTokenView.as_view(),
    ),

    # Текущий пользователь
    path(
        "auth/me/",
        views.MeView.as_view(),
    ),

    # Выход
    path(
        "auth/logout/",
        views.LogoutView.as_view(),
    ),


    # =====================================================
    # ЗАЯВКИ НА ПОМОЩЬ
    # =====================================================

    # Публичная лента заявок
    # POST — создать заявку (только авторизованные)
    # GET — посмотреть заявки (доступно всем)
    path(
        "requests/",
        views.HelpRequestListCreateView.as_view(),
    ),

    # Детальная страница заявки
    path(
        "requests/<int:pk>/",
        views.HelpRequestDetailView.as_view(),
    ),

    # Мои заявки
    path(
        "requests/me/",
        views.MyHelpRequestsView.as_view(),
    ),


    # =====================================================
    # ДОНАТЫ
    # =====================================================

    # Создать донат
    path(
        "donations/",
        views.DonationCreateView.as_view(),
    ),

    # Моя история помощи
    path(
        "donations/me/",
        views.MyDonationsView.as_view(),
    ),

    # Все донаты конкретной заявки
    path(
        "donations/by_request/<int:pk>/",
        views.DonationsByRequestView.as_view(),
    ),
]