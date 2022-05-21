from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Account, Sales, SaleStatistics
from django.contrib.auth.hashers import make_password, check_password

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
def login(request):
    email = request.data['email']
    password = request.data['password']
    user = Account.objects.get(email=email)
    if user:
        if user.check_password(password):
            return Response(status=200)
    else:
        return Response(status=401)

@api_view(['GET'])
def getUser(request, pk):
    try:
        user = Account.objects.get(id=pk)
        context = {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'address': user.address,
            'phone': user.phone_number
        }
        return Response(context)
    except:
        return Response(status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getSalesStats(request):
    user = request.user
    sales_stats = SaleStatistics.objects.get(user=user)
    return Response(sales_stats.sales) 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getSalesList(request):
    user = request.user
    sales = Sales.objects.get(user=user)
    return Response(sales.total_sales) 

@api_view(['POST'])
def readFileData(request):
    filename = request.FILES['file']
    file_data = filename.read().decode('utf-8')
    lines = file_data.split("\n")
    return Response(lines)

@api_view(['GET'])
def getCountries(request):
    return Response(status=200)
    