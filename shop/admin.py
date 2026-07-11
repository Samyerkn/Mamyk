from django.contrib import admin

from .models import Order, Product, ProductSize


class ProductSizeInline(admin.TabularInline):
    model = ProductSize
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'fastening_type', 'price']
    list_filter = ['fastening_type']
    inlines = [ProductSizeInline]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'product', 'status', 'total_price', 'created_at']
    list_filter = ['status']