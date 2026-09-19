from django.urls import path
from . import views

urlpatterns = [
    # هوم عمومی
    path('', views.home_view, name='home'),

    # داشبورد — هر کدام ویو صریح + login_required
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('schedule/', views.schedule_view, name='schedule'),
    path('attendance/', views.attendance_view, name='attendance'),
    path('tuition/', views.tuition_view, name='tuition'),
    path('insurance/', views.insurance_view, name='insurance'),
    path('progress/', views.progress_view, name='progress'),
    path('announcements/', views.announcements_view, name='announcements'),
    path('profile/', views.profile_view, name='profile'),
    path('settings/', views.settings_view, name='settings'),
    path('support/', views.support_view, name='support'),
]
