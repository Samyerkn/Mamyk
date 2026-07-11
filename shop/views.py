import random

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order, Product, ProductSize
from .serializers import OrderSerializer, ProductSerializer, ProductSizeSerializer


class ProductListView(generics.ListAPIView):
    """GET /api/products/  — список товаров, поддерживает ?fastening_type="""
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Product.objects.all()
        fastening_type = self.request.query_params.get('fastening_type')
        if fastening_type:
            queryset = queryset.filter(fastening_type=fastening_type)
        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    """GET /api/products/{id}/"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]


class ProductSizesView(generics.ListAPIView):
    """GET /api/products/{id}/sizes/"""
    serializer_class = ProductSizeSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return ProductSize.objects.filter(product_id=self.kwargs['pk'])


class OrderCreateView(generics.CreateAPIView):
    """POST /api/orders/  (product_id, size, delivery_address)"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]


class OrderPayView(APIView):
    """POST /api/orders/{id}/pay/  — имитация оплаты (Mock Payment Gateway)"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
        except Order.DoesNotExist:
            return Response({'detail': 'Заказ не найден'}, status=404)

        # Имитация: 80% успешных оплат, 20% неудачных
        success = random.random() < 0.8
        order.status = Order.PAID if success else Order.FAILED
        order.save()
        return Response(OrderSerializer(order).data)


class MyOrdersView(generics.ListAPIView):
    """GET /api/orders/me/ — заказы текущего пользователя"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


class OrderDetailView(generics.RetrieveAPIView):
    """GET /api/orders/{id}/"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)