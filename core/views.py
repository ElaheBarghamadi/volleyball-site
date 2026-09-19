from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# نگاشت استاندارد صفحات داشبورد به تمپلیت‌های جدید
# templates/dashboard/<name>.html  (به جای pages/)
DASHBOARD_PAGES = {
    'dashboard':     {'title': 'داشبورد',      'template': 'dashboard/dashboard.html'},
    'schedule':      {'title': 'برنامه تمرین', 'template': 'dashboard/schedule.html'},
    'attendance':    {'title': 'حضور و غیاب',  'template': 'dashboard/attendance.html'},
    'tuition':       {'title': 'شهریه',        'template': 'dashboard/tuition.html'},
    'insurance':     {'title': 'بیمه',         'template': 'dashboard/insurance.html'},
    'progress':      {'title': 'پیشرفت من',    'template': 'dashboard/progress.html'},
    'announcements': {'title': 'اعلانات',      'template': 'dashboard/announcements.html'},
    'profile':       {'title': 'پروفایل',      'template': 'dashboard/profile.html'},
    'settings':      {'title': 'تنظیمات',      'template': 'dashboard/settings.html'},
    'support':       {'title': 'پشتیبانی',     'template': 'dashboard/support.html'},
}

# برای سازگاری با urls قدیمی (Config/urls.py loop)
PAGES = {k: v['title'] for k, v in DASHBOARD_PAGES.items()}


def home_view(request):
    """لندینگ عمومی — بدون لاگین — templates/core/home.html"""
    return render(request, 'core/home.html')


# --- ویوهای صریح داشبورد (هر کدام یک URL جدا، استاندارد) ---
@login_required
def dashboard_view(request):
    return render(request, DASHBOARD_PAGES['dashboard']['template'],
                  {'page_id': 'dashboard', 'page_title': DASHBOARD_PAGES['dashboard']['title']})


@login_required
def schedule_view(request):
    return render(request, DASHBOARD_PAGES['schedule']['template'],
                  {'page_id': 'schedule', 'page_title': DASHBOARD_PAGES['schedule']['title']})


@login_required
def attendance_view(request):
    return render(request, DASHBOARD_PAGES['attendance']['template'],
                  {'page_id': 'attendance', 'page_title': DASHBOARD_PAGES['attendance']['title']})


@login_required
def tuition_view(request):
    return render(request, DASHBOARD_PAGES['tuition']['template'],
                  {'page_id': 'tuition', 'page_title': DASHBOARD_PAGES['tuition']['title']})


@login_required
def insurance_view(request):
    return render(request, DASHBOARD_PAGES['insurance']['template'],
                  {'page_id': 'insurance', 'page_title': DASHBOARD_PAGES['insurance']['title']})


@login_required
def progress_view(request):
    return render(request, DASHBOARD_PAGES['progress']['template'],
                  {'page_id': 'progress', 'page_title': DASHBOARD_PAGES['progress']['title']})


@login_required
def announcements_view(request):
    return render(request, DASHBOARD_PAGES['announcements']['template'],
                  {'page_id': 'announcements', 'page_title': DASHBOARD_PAGES['announcements']['title']})


@login_required
def profile_view(request):
    return render(request, DASHBOARD_PAGES['profile']['template'],
                  {'page_id': 'profile', 'page_title': DASHBOARD_PAGES['profile']['title']})


@login_required
def settings_view(request):
    return render(request, DASHBOARD_PAGES['settings']['template'],
                  {'page_id': 'settings', 'page_title': DASHBOARD_PAGES['settings']['title']})


@login_required
def support_view(request):
    return render(request, DASHBOARD_PAGES['support']['template'],
                  {'page_id': 'support', 'page_title': DASHBOARD_PAGES['support']['title']})


# --- ویو عمومی قدیمی برای سازگاری (در صورت نیاز) ---
@login_required
def page(request, name='dashboard'):
    """ویو عمومی قدیمی — به ویوهای صریح ریدایرکت نمی‌کند، فقط رندر می‌کند (برای سازگاری)."""
    from django.http import Http404
    if name not in DASHBOARD_PAGES:
        raise Http404('صفحه پیدا نشد')
    meta = DASHBOARD_PAGES[name]
    return render(request, meta['template'], {'page_id': name, 'page_title': meta['title']})
