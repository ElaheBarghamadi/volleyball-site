"""
URL configuration — ساختار استاندارد
- core.urls  → هوم + داشبورد
- users.urls → لاگین/لاگ‌اوت
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # اپ core: هوم (/) + داشبورد (/dashboard/ ...)
    path('', include('core.urls')),

    # اپ users: /login/ , /logout/
    path('', include('users.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    # static در DEBUG توسط runserver سرو می‌شود؛ STATICFILES_DIRS کافی است
