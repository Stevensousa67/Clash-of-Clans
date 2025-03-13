from django.urls import path
from .views import RegisterView, ValidatePlayerTagView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('validate-player-tag/<str:player_tag>/', ValidatePlayerTagView.as_view(), name='validate-player-tag'),
]