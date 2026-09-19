from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.cache import cache
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


# تنظیمات لاک — از settings می‌خوانیم تا یک‌جا قابل تغییر باشد
MAX_ATTEMPTS = getattr(settings, 'LOGIN_MAX_ATTEMPTS', 5)
LOCKOUT_MINUTES = getattr(settings, 'LOGIN_LOCKOUT_MINUTES', 15)
WINDOW_MINUTES = getattr(settings, 'LOGIN_ATTEMPT_WINDOW_MINUTES', 15)

LOCKOUT_SECONDS = LOCKOUT_MINUTES * 60
WINDOW_SECONDS = WINDOW_MINUTES * 60


def _get_client_ip(request):
    """IP کاربر برای لاگ/محدودیت (پشتیبانی از proxy)"""
    xff = request.META.get('HTTP_X_FORWARDED_FOR')
    if xff:
        return xff.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', 'unknown')


def _cache_keys(username: str):
    """کلیدهای یکتا برای هر نام کاربری (lower)"""
    u = (username or '').strip().lower()
    return f'login_attempts:{u}', f'login_lock:{u}', f'login_lock_until:{u}'


def login_view(request):
    """
    لاگین امن با قفل موقت:
    - ۵ تلاش اشتباه در ۱۵ دقیقه → ۱۵ دقیقه قفل
    - پیام فارسی + شمارش باقی‌مانده
    - ثبت‌نام عمومی ندارد، فقط ورود
    """
    if request.user.is_authenticated:
        return redirect('dashboard')

    error = None
    is_locked = False
    lockout_minutes = None
    remaining_attempts = None

    # برای نمایش باقی‌مانده حتی در GET
    # (اگر قبلاً_attempts داشتیم)
    # ولی فقط بعد POST دقیق می‌شویم

    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')
        remember = request.POST.get('remember') == 'on'

        if not username or not password:
            error = 'نام کاربری و رمز عبور را وارد کنید.'
        else:
            attempts_key, lock_key, lock_until_key = _cache_keys(username)

            # ۱. آیا قفله؟
            if cache.get(lock_key):
                is_locked = True
                lock_until = cache.get(lock_until_key)
                if lock_until:
                    delta = (lock_until - timezone.now()).total_seconds()
                    lockout_minutes = max(1, int((delta + 59) // 60))  # گرد به بالا
                else:
                    lockout_minutes = LOCKOUT_MINUTES
                error = f'حساب «{username}» به دلیل تلاش‌های ناموفق مکرر به مدت {lockout_minutes} دقیقه قفل شده است.'

                # برای نمایش در template
                remaining_attempts = 0
            else:
                # ۲. تلاش احراز هویت
                user = authenticate(request, username=username, password=password)

                if user is not None:
                    if not user.is_active:
                        error = 'حساب شما غیرفعال است. با پشتیبانی تماس بگیرید.'
                        # تلاش ناموفق حساب نمی‌شود چون یوزر درست بوده ولی غیرفعال
                    else:
                        # موفقیت → پاک کردن شمارش
                        cache.delete(attempts_key)
                        cache.delete(lock_key)
                        cache.delete(lock_until_key)

                        login(request, user)
                        if not remember:
                            request.session.set_expiry(0)
                        else:
                            request.session.set_expiry(1209600)

                        next_url = request.GET.get('next') or request.POST.get('next')
                        # جلوگیری از open redirect ساده
                        if next_url and next_url.startswith('/'):
                            return redirect(next_url)
                        return redirect('dashboard')
                else:
                    # ۳. ناموفق → افزایش شمارش
                    attempts = cache.get(attempts_key, 0) + 1
                    cache.set(attempts_key, attempts, WINDOW_SECONDS)

                    if attempts >= MAX_ATTEMPTS:
                        # قفل کن
                        lock_until = timezone.now() + timedelta(minutes=LOCKOUT_MINUTES)
                        cache.set(lock_key, True, LOCKOUT_SECONDS)
                        cache.set(lock_until_key, lock_until, LOCKOUT_SECONDS)
                        is_locked = True
                        lockout_minutes = LOCKOUT_MINUTES
                        error = f'تعداد تلاش ناموفق به حد مجاز ({MAX_ATTEMPTS} بار) رسید. حساب شما به مدت {LOCKOUT_MINUTES} دقیقه قفل شد.'
                        remaining_attempts = 0
                    else:
                        remaining_attempts = MAX_ATTEMPTS - attempts
                        if remaining_attempts <= 2:
                            error = f'نام کاربری یا رمز عبور اشتباه است. فقط {remaining_attempts} تلاش دیگر تا قفل موقت باقی مانده.'
                        else:
                            error = 'نام کاربری یا رمز عبور اشتباه است.'

                    # لاگ ساده در console برای ادمین (در پروداکشن به logger بفرست)
                    print(f"[LOGIN FAIL] user={username} ip={_get_client_ip(request)} attempts={attempts}/{MAX_ATTEMPTS}")

    else:
        # GET: اگر قبلاً قفل بوده، نمایش بده (برای وقتی کاربر صفحه را رفرش می‌کند)
        # نیاز به username نداریم، ولی اگر ?username در query باشد می‌توانیم چک کنیم
        # فعلاً چیزی نمایش نمی‌دهیم تا اطلاعات لو نرود
        pass

    # برای GET یا بعد از خطا، اگر هنوز is_locked مشخص نشده ولی attempts نزدیک قفل است، باقی‌مانده را حساب کن
    if request.method == 'POST' and not is_locked and remaining_attempts is None:
        # اگر خطای empty بود، باقی‌مانده را حساب نکن
        username_tmp = request.POST.get('username', '').strip()
        if username_tmp:
            attempts_key, _, _ = _cache_keys(username_tmp)
            attempts = cache.get(attempts_key, 0)
            if attempts > 0:
                remaining_attempts = max(0, MAX_ATTEMPTS - attempts)

    return render(request, 'users/login.html', {
        'error': error,
        'is_locked': is_locked,
        'lockout_minutes': lockout_minutes,
        'remaining_attempts': remaining_attempts,
    })


def logout_view(request):
    """خروج — هم GET هم POST (POST ترجیحی با CSRF)"""
    if request.method not in ('GET', 'POST'):
        return redirect('home')
    logout(request)
    messages.success(request, 'با موفقیت خارج شدید.')
    return redirect('home')


@login_required
def profile_view(request):
    # این ویو قدیمی برای سازگاری؛ صفحات داشبورد الان در core هستند
    return render(request, 'dashboard/profile.html', {'page_id': 'profile', 'page_title': 'پروفایل'})
