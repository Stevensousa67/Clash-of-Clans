from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class PlayerProfile(models.Model):
    username = models.OneToOneField(User, on_delete=models.CASCADE)
    playertag = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return f"{self.user.username} - {self.playertag}"

