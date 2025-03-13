import requests
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login
from .models import PlayerProfile
from .serializers import UserSerializer
from backend.settings import CLASH_API_KEY

class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        login(self.request, user)  # Log the user in after creation

class ValidatePlayerTagView(APIView):
    def get(self, request, player_tag):
        url = f"https://api.clashofclans.com/v1/players/%23{player_tag}"
        headers = {'Authorization': f'Bearer {CLASH_API_KEY}'}
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:  # Fixed from response.status.code
            return Response({'valid': True}, status=status.HTTP_200_OK)
        return Response({'valid': False}, status=status.HTTP_400_BAD_REQUEST)