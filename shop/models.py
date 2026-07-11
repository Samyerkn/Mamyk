from django.conf import settings
from django.db import models


# модель самого продукта/товара
class Product(models.Model):
    BUTTONS = 'buttons'
    MAGNETS = 'magnets'
    VELCRO = 'velcro'
    FASTENING_CHOICES = [
        (BUTTONS, 'Кнопки'),
        (MAGNETS, 'Магниты'),
        (VELCRO, 'Липучки'),
    ]

    name = models.CharField(max_length=200)
    fastening_type = models.CharField(max_length=10, choices=FASTENING_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    image = models.ImageField(upload_to='products/', blank=True, null=True)

    def __str__(self):
        return self.name


# модель размера товара
class ProductSize(models.Model):
    S = 'S'
    M = 'M'
    L = 'L'
    XL = 'XL'
    SIZE_CHOICES = [(S, 'S'), (M, 'M'), (L, 'L'), (XL, 'XL')]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='sizes')
    size = models.CharField(max_length=2, choices=SIZE_CHOICES)
    stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.product.name} — {self.size} ({self.stock} шт.)"


# модель заказа
class Order(models.Model):
    PENDING = 'pending'
    PAID = 'paid'
    FAILED = 'failed'
    STATUS_CHOICES = [
        (PENDING, 'Ожидает оплаты'),
        (PAID, 'Оплачен'),
        (FAILED, 'Оплата не прошла'),
    ]

    # Ссылаемся на пользователя ТОЛЬКО через settings.AUTH_USER_MODEL —
    # модель User принадлежит Бэкенду А, напрямую её не импортируем
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='orders')
    size = models.CharField(max_length=5)
    delivery_address = models.CharField(max_length=300)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Заказ #{self.id} — {self.user.email} — {self.get_status_display()}"