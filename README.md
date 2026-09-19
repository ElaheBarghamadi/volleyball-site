# باشگاه والیبال فراز 🏐

## تغییرات جدید — مدل کاربری و لندینگ

### ۱. پاکسازی فایل‌های اضافی
- حذف پوشه ` .idea/ ` (تنظیمات PyCharm)
- حذف `users/volleyball.jpg` تکراری (تصویر اصلی در `static/assets/img/hero-bg.jpg` است)
- حذف اپ‌های خالی `dashboard / support / notifications` (بدون مدل/ویو)
- حذف `templates/pages/registration.html` — ثبت‌نام عمومی نداریم

### ۲. مدل User سفارشی (`users/models.py`)
```python
class User(AbstractBaseUser, PermissionsMixin):
    username   # نام کاربری یکتا - لاگین
    full_name  # نام و نام خانوادگی
    phone      # موبایل 09xxxxxxxxx - یکتا + اعتبارسنجی
    role       # admin / coach / support / player
    password   # هش شده
    is_active, is_staff, date_joined ...
```
- ورود فقط با **نام کاربری + رمز عبور**
- ثبت‌نام از داخل پنل ادمین/پشتیبان انجام می‌شود، کاربر فقط وارد می‌شود
- `AUTH_USER_MODEL = 'users.User'` در settings
- ادمین جنگو سفارشی شده (فیلتر نقش، جستجو)

**نقش‌ها:**
- `admin` — ادمین کل
- `coach` — مربی
- `support` — پشتیبان
- `player` — بازیکن (پیش‌فرض)

### ۳. صفحه هوم عمومی (`/` — بدون لاگین)
`templates/pages/home.html + static/css/home.css`
- هدر چسبان با لوگو FARAZ و دکمه ورود
- هیرو با تصویر `hero-bg.jpg`، آمار و CTA
- بخش‌های: درباره، برنامه تمرین (شنبه–چهارشنبه + تعطیلی پنجشنبه/جمعه)، گالری، مربیان، تعرفه‌ها، تماس
- کاملاً RTL و با پالت نارنجی-مشکی

### ۴. لاگین (`/login/`)
`templates/pages/login.html` بازطراحی کامل:
- دو ستون: فرم دارک + ویژوال سینمایی
- CSRF، نمایش خطا، remember-me، لینک بازگشت به خانه
- پیام راهنما: ثبت‌نام فقط حضوری

### ۵. مسیرها
```
/              → هوم عمومی (public)
/login/        → ورود
/logout/       → خروج
/dashboard/    → داشبورد (login_required)
/schedule/ /attendance/ /tuition/ /insurance/ /progress/ /announcements/ /profile/ /settings/ /support/ → داخل داشبورد
/admin/        → پنل ادمین جنگو
```

### ۶. کاربران تستی
```
admin    / admin123    — ادمین  — 09123456789
coach1   / coach123    — مربی   — 09123456780
support1 / support123  — پشتیبان — 09123456781
player1  / player123   — بازیکن — 09123456782
```

### اجرای محلی
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # با username/full_name/phone/role
python manage.py runserver  # http://127.0.0.1:8000
```

### نکات
- `ALLOWED_HOSTS = ['*']` برای تست
- تم تاریک پیش‌فرض، فونت وزیرمتن self-hosted
- داشبورد همچنان MPA با base.html + سایدبار و topbar داینامیک (نام/نقش از `request.user`)
