from rest_framework import serializers

from .models import Order, Product, ProductSize


class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = ['id', 'size', 'stock']


class ProductSerializer(serializers.ModelSerializer):
    sizes = ProductSizeSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'fastening_type', 'price', 'description', 'image', 'sizes']


class OrderSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = Order
        fields = [
            'id', 'product', 'product_id', 'size',
            'delivery_address', 'status', 'total_price', 'created_at',
        ]
        read_only_fields = ['status', 'total_price', 'created_at']

    def create(self, validated_data):
        product = validated_data['product']
        validated_data['total_price'] = product.price
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)