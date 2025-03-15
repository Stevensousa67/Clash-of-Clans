from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class PlayerProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='profiles')
    player_tag = models.CharField(max_length=10)
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.player_tag}"
    
    class Meta:
        verbose_name = 'Player Profile'
        verbose_name_plural = 'Player Profiles'

