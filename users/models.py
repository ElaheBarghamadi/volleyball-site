from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from django.core.validators import RegexValidator


class UserManager(BaseUserManager):
    """منیجر سفارشی برای مدل User"""

    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('نام کاربری الزامی است')
        extra_fields.setdefault('role', User.Role.PLAYER)
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.ADMIN)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('سوپریوزر باید is_staff=True باشد')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('سوپریوزر باید is_superuser=True باشد')

        return self.create_user(username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        ADMIN = 'admin', 'ادمین'
        COACH = 'coach', 'مربی'
        SUPPORT = 'support', 'پشتیبان'
        PLAYER = 'player', 'بازیکن'

    username = models.CharField(
        'نام کاربری',
        max_length=50,
        unique=True,
        help_text='نام کاربری منحصر به فرد برای ورود (انگلیسی، بدون فاصله)'
    )
    full_name = models.CharField('نام و نام خانوادگی', max_length=120)
    phone = models.CharField(
        'شماره تلفن',
        max_length=15,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^09\d{9}$',
                message='شماره تلفن باید با 09 شروع شود و ۱۱ رقم باشد (مثال: 09123456789)'
            )
        ],
        help_text='شماره موبایل ۱۱ رقمی با 09'
    )
    role = models.CharField('نقش کاربر', max_length=10, choices=Role.choices, default=Role.PLAYER)

    # وضعیت‌ها
    is_active = models.BooleanField('فعال', default=True)
    is_staff = models.BooleanField('کارمند', default=False,
                                   help_text='آیا کاربر به پنل ادمین دسترسی دارد؟')
    date_joined = models.DateTimeField('تاریخ عضویت', default=timezone.now)

    # فیلدهای اختیاری مفید
    national_id = models.CharField('کد ملی', max_length=10, blank=True, null=True)
    birth_date = models.DateField('تاریخ تولد', blank=True, null=True)
    avatar = models.ImageField('آواتار', upload_to='avatars/', blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['full_name', 'phone']

    class Meta:
        verbose_name = 'کاربر'
        verbose_name_plural = 'کاربران'
        ordering = ['-date_joined']

    def __str__(self):
        return f"{self.full_name} ({self.get_role_display()}) - {self.username}"

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN or self.is_superuser

    @property
    def is_coach(self):
        return self.role == self.Role.COACH

    @property
    def is_support(self):
        return self.role == self.Role.SUPPORT

    @property
    def is_player(self):
        return self.role == self.Role.PLAYER
