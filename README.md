# وب‌سایت باشگاه والیبال فراز 🏐

داشبورد اختصاصی بازیکن باشگاه والیبال فراز — پروژهٔ جنگو با قالب استاندارد (base + صفحه‌های جداگانه) و طراحی یکپارچهٔ نارنجی-مشکی.

## ساختار پروژه

```
volleyball-site/
├── manage.py
├── requirements.txt
├── Config/                    # تنظیمات پروژه (settings، urls، wsgi، asgi)
├── core/                      # اپ صفحه‌ها: ویو تک‌صفحه‌ای با whitelist نام‌ها
├── dashboard/ users/ support/ notifications/   # اپ‌های اصلی پروژه
├── templates/
│   ├── base.html              # فایل بیس: head، سایدبار، تاپ‌بار، فوتر، اسکریپت‌ها
│   ├── includes/
│   │   ├── topbar.html        # نوار بالای اپ
│   │   ├── footer.html        # فوتر مدرن سایت
│   │   ├── overlays.html      # ریشهٔ مودال/دراور/توست
│   │   └── scripts.html       # ترتیب بارگذاری ماژول‌های JS
│   └── pages/                 # هر صفحه یک فایل جداگانه (ارث از base.html)
│       ├── dashboard.html  schedule.html  attendance.html  tuition.html
│       ├── registration.html  insurance.html  progress.html
│       └── announcements.html  profile.html  settings.html  support.html
└── static/
    ├── css/                   # reset، variables(توکن‌ها)، style، footer، responsive
    ├── js/                    # ۱۲ ماژول vanilla JS (بدون فریم‌ورک)
    └── assets/
        ├── fonts/             # وزیرمتن + Space Grotesk (self-hosted)
        └── img/hero-bg.jpg    # تصویر سینمایی کارت بازیکن
```

## اجرای محلی

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
# سپس: http://127.0.0.1:8000
```

## مسیرها

`/` داشبورد · `/schedule/` برنامه تمرین · `/attendance/` حضور و غیاب · `/tuition/` شهریه ·
`/registration/` ثبت‌نام · `/insurance/` بیمه · `/progress/` پیشرفت · `/announcements/` اعلانات ·
`/profile/` پروفایل · `/settings/` تنظیمات · `/support/` پشتیبانی

## نکته‌ها

- هر صفحه URL اختصاصی دارد و قالب خودش را از `base.html` ارث می‌برد؛ ناوبری بین صفحات با لینک واقعی (MPA) است.
- تم پیش‌فرض تاریک (پالت نارنجی/مشکی)؛ حالت روشن هم پشتیبانی می‌شود.
- داده‌ها نمایشی‌اند و در `static/js/data.js` به‌صورت پویا تولید می‌شوند.
