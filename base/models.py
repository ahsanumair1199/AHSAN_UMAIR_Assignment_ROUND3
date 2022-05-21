from multiprocessing.sharedctypes import Value
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password

# Account Manager Model
class MyAccountManager(BaseUserManager):
    # create normal user
    def create_user(self, first_name, last_name, username, email, password=None):
        if not email:
            raise ValueError("User must have an email address")
        if not username:
            raise ValueError("User must have a username")

        user = self.model(
            email = self.normalize_email(email),
            username = username,
            first_name = first_name,
            last_name = last_name,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    # create super user
    def create_superuser(self, first_name, last_name, email, username, password):
        user = self.create_user(
            email = self.normalize_email(email),
            username = username,
            password = password,
            first_name = first_name,
            last_name = last_name,
        )
        user.is_admin = True
        user.is_active = True
        user.is_staff = True
        user.is_superadmin = True
        user.save(using=self._db)
        return user
# custom Account model

class Account(AbstractBaseUser):
    first_name = models.CharField(max_length=50, null=True)
    last_name = models.CharField(max_length=50, null=True)
    username = models.CharField(max_length=50, null=True)
    email = models.EmailField(max_length=50, unique=True)
    phone_number = models.CharField(max_length=50, null=True)
    address = models.TextField(null=True)

    # required fields
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superadmin = models.BooleanField(default=False)

    # backend login will require email instead of username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    objects = MyAccountManager()

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, add_label):
        return True

# sale statistics model
class SaleStatistics(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    sales = models.CharField(max_length=200, blank=True, null=True)
    def __str__(self):
        return self.sales

# sales model
class Sales(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    total_sales = models.CharField(max_length=200, blank=True, null=True)
    def __str__(self):
        return str(self.user.first_name)

# countries model
class Countries(models.Model):
    rank = models.IntegerField(default=None)
    city = models.CharField(max_length=200, default=None)
    country = models.CharField(max_length=200, default=None)
    population = models.CharField(max_length=200, default=None)
    def __str__(self):
        return self.city