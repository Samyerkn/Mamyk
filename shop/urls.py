from django.urls import path

from .views import (
    MyOrdersView,
    OrderCreateView,
    OrderDetailView,
    OrderPayView,
    ProductDetailView,
    ProductListView,
    ProductSizesView,
)

urlpatterns = [
    path('products/', ProductListView.as_view()),
    path('products/<int:pk>/', ProductDetailView.as_view()),
    path('products/<int:pk>/sizes/', ProductSizesView.as_view()),

    # /orders/me/ обязательно ДО /orders/<int:pk>/, иначе "me" примет за id
    path('orders/me/', MyOrdersView.as_view()),
    path('orders/', OrderCreateView.as_view()),
    path('orders/<int:pk>/', OrderDetailView.as_view()),
    path('orders/<int:pk>/pay/', OrderPayView.as_view()),
]