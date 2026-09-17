from django.http import Http404
from django.shortcuts import render

#: صفحات سایت: کلید = نام قالب در templates/pages و عنوان پیش‌فرض
PAGES = {
    'dashboard': 'داشبورد',
    'schedule': 'برنامه تمرین',
    'attendance': 'حضور و غیاب',
    'tuition': 'شهریه',
    'registration': 'ثبت‌نام',
    'insurance': 'بیمه',
    'progress': 'پیشرفت من',
    'announcements': 'اعلانات',
    'profile': 'پروفایل',
    'settings': 'تنظیمات',
    'support': 'پشتیبانی',
}


def page(request, name='dashboard'):
    """رندر هر صفحه با قالب اختصاصی خودش (همه از base.html ارث می‌برند)."""
    if name not in PAGES:
        raise Http404('صفحه پیدا نشد')
    return render(request, 'pages/%s.html' % name, {'page_id': name, 'page_title': PAGES[name]})
