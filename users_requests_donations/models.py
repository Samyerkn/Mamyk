from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Sum


class User(AbstractUser):
    BUYER = 'buyer'
    SPONSOR = 'sponsor'
    ROLE_CHOICES = [
        (BUYER, 'Покупатель'),
        (SPONSOR, 'Спонсор'),
    ]

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=BUYER)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


class HelpRequest(models.Model):
    PENDING = 'pending'
    IN_PROGRESS = 'in_progress'
    COMPLETED = 'completed'
    STATUS_CHOICES = [
        (PENDING, 'Ожидает'),
        (IN_PROGRESS, 'В процессе'),
        (COMPLETED, 'Выполнена'),
    ]

    BUTTONS = 'buttons'
    MAGNETS = 'magnets'
    VELCRO = 'velcro'
    FASTENING_CHOICES = [
        (BUTTONS, 'Кнопки'),
        (MAGNETS, 'Магниты'),
        (VELCRO, 'Липучки'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='help_requests')
    child_name = models.CharField(max_length=150)
    diagnosis = models.CharField(max_length=200)
    story = models.TextField()
    fastening_type = models.CharField(max_length=10, choices=FASTENING_CHOICES)
    size = models.CharField(max_length=5)
    amount_needed = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default=PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def amount_collected(self):
        result = self.donations.aggregate(total=Sum('amount'))['total']
        return result or 0

    def check_completion(self):
        if self.amount_collected >= self.amount_needed:
            self.status = self.COMPLETED
            self.save()

    def __str__(self):
        return f"{self.child_name} — {self.get_status_display()}"


class Donation(models.Model):
    sponsor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='donations')
    help_request = models.ForeignKey(HelpRequest, on_delete=models.CASCADE, related_name='donations')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_full_payment = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.help_request.check_completion()

    def __str__(self):
        return f"{self.sponsor.email} → {self.help_request.child_name}: {self.amount} ₸"


class MedicalCase(models.Model):
    PENDING = 'pending'
    IN_PROGRESS = 'in_progress'
    COMPLETED = 'completed'

    STATUS_CHOICES = [
        (PENDING, 'Ожидает'),
        (IN_PROGRESS, 'В процессе'),
        (COMPLETED, 'Выполнена'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='medical_cases'
    )
    patient_name = models.CharField(max_length=150)
    diagnosis = models.CharField(max_length=200)
    story = models.TextField()

    image = models.ImageField(
        upload_to='medical/',
        blank=True,
        null=True
    )

    amount_needed = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default=PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def amount_collected(self):
        result = self.medical_donations.aggregate(
            total=Sum('amount')
        )['total']
        return result or 0

    def check_completion(self):
        if self.amount_collected >= self.amount_needed:
            self.status = self.COMPLETED
            self.save()

    def __str__(self):
        return f"{self.patient_name} — {self.get_status_display()}"

<<<<<<< Updated upstream

class MedicalDonation(models.Model):
    sponsor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medical_donations')
    medical_case = models.ForeignKey(MedicalCase, on_delete=models.CASCADE, related_name='medical_donations')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.medical_case.check_completion()

    def __str__(self):
        return f"{self.sponsor.email} → {self.medical_case.patient_name}: {self.amount} ₸"


class News(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='news/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'news'
        verbose_name_plural = 'news'

    def __str__(self):
        return self.title