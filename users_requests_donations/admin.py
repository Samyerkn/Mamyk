from django.contrib import admin
from .models import User, HelpRequest, Donation, MedicalCase, MedicalDonation, News

admin.site.register(User)
admin.site.register(HelpRequest)
admin.site.register(Donation)
admin.site.register(MedicalCase)
admin.site.register(MedicalDonation)
admin.site.register(News)