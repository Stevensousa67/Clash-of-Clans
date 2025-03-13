from rest_framework import serializers
from django.contrib.auth.models import User
from .models import PlayerProfile

class PlayerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerProfile
        fields = ['playertag']

class UserSerializer(serializers.ModelSerializer):
    player_profile = PlayerProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'player_profile']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('player_profile')
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        PlayerProfile.objects.create(
            user=user,
            **profile_data
        )
        return user
