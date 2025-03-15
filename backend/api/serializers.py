from rest_framework import serializers
from django.contrib.auth.models import User
from .models import PlayerProfile

class PlayerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerProfile
        fields = ['player_tag', 'is_primary']

class UserSerializer(serializers.ModelSerializer):
    profiles = PlayerProfileSerializer(many=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'profiles']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profiles_data = validated_data.pop('profiles')
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        for i, profile_data in enumerate(profiles_data):
            PlayerProfile.objects.create(
                user=user,
                player_tag=profile_data['player_tag'],
                is_primary=profile_data.get('is_primary', i == 0) # First profile defaults to primary
            )
        return user
