from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/login/', views.login, name='login'),
    path('users/<int:pk>/', views.getUser, name="getUser"),
    path('users/sale_statistics/', views.getSalesStats, name="getSalesStats"),
    path('users/sales/', views.getSalesList, name="sales"),
    path('csvfile/', views.readFileData, name="readFileData"),
    path('users/countries/', views.getCountries, name="getCountries"),
]