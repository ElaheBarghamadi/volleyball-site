from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """ادمین کاربر — با نقش‌ها (ادمین/مربی/پشتیبان/بازیکن) + تلفن + نام کامل"""

    # لیست
    list_display = ('username', 'full_name', 'phone', 'role_badge', 'is_active', 'is_staff', 'date_joined')
    list_display_links = ('username', 'full_name')
    list_filter = ('role', 'is_active', 'is_staff', 'is_superuser', 'date_joined')
    search_fields = ('username', 'full_name', 'phone', 'national_id')
    ordering = ('-date_joined',)
    list_per_page = 25
    date_hierarchy = 'date_joined'

    # فرم ویرایش
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('اطلاعات شخصی'), {
            'fields': ('full_name', 'phone', 'role', 'national_id', 'birth_date', 'avatar'),
            'description': 'نام کاربری برای ورود است — ثبت‌نام عمومی نداریم.'
        }),
        (_('دسترسی‌ها'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('تاریخ‌ها'), {
            'fields': ('last_login', 'date_joined'),
        }),
    )

    # فرم افزودن
    add_fieldsets = (
        (_('ساخت کاربر جدید — توسط ادمین/پشتیبان'), {
            'classes': ('wide',),
            'fields': ('username', 'full_name', 'phone', 'role', 'password1', 'password2', 'is_staff', 'is_active'),
            'description': 'بازیکن با همین نام‌کاربری و رمز وارد می‌شود. تلفن باید 09xxxxxxxxx باشد.',
        }),
    )

    readonly_fields = ('last_login', 'date_joined')
    filter_horizontal = ('groups', 'user_permissions')

    # اکشن‌ها
    actions = ('activate_users', 'deactivate_users', 'make_player', 'make_coach', 'make_support')

    @admin.display(description='نقش', ordering='role')
    def role_badge(self, obj):
        colors = {
            'admin':   '#FF6500',
            'coach':   '#2B8CE6',
            'support': '#12A66A',
            'player':  '#8D97A8',
        }
        color = colors.get(obj.role, '#8D97A8')
        label = obj.get_role_display()
        return format_html(
            '<span style="background:{};color:#fff;padding:3px 9px;border-radius:999px;font-size:11px;font-weight:700;">{}</span>',
            color, label
        )

    @admin.action(description='فعال کردن کاربران انتخاب‌شده')
    def activate_users(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f'{queryset.count()} کاربر فعال شد.')

    @admin.action(description='غیرفعال کردن')
    def deactivate_users(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f'{queryset.count()} کاربر غیرفعال شد.')

    @admin.action(description='تبدیل به بازیکن')
    def make_player(self, request, queryset):
        queryset.update(role=User.Role.PLAYER)
        self.message_user(request, 'نقش به بازیکن تغییر کرد.')

    @admin.action(description='تبدیل به مربی')
    def make_coach(self, request, queryset):
        queryset.update(role=User.Role.COACH)
        self.message_user(request, 'نقش به مربی تغییر کرد.')

    @admin.action(description='تبدیل به پشتیبان')
    def make_support(self, request, queryset):
        queryset.update(role=User.Role.SUPPORT)
        self.message_user(request, 'نقش به پشتیبان تغییر کرد.')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # ادمین همه را می‌بیند، پشتیبان فقط بازیکن‌ها (نمونه)
        # if request.user.role == User.Role.SUPPORT:
        #     return qs.filter(role=User.Role.PLAYER)
        return qs
