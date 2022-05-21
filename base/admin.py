from django.contrib import admin
from .models import Account, Sales, SaleStatistics, Countries

admin.site.register(Account)
admin.site.register(Sales)
admin.site.register(SaleStatistics)
admin.site.register(Countries)