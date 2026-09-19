from django.contrib import admin
from django.urls import path

import users.views
from . import views

urlpatterns =[
    path('login/', views.login_view, name='login'),
]