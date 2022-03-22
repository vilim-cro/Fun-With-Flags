from django.db import models

class Zastava(models.Model):
    name = models.CharField(max_length=255, default='')
    style = models.CharField(max_length=255)
    first = models.CharField(max_length=255)
    second = models.CharField(max_length=255)
    third = models.CharField(max_length=255)

    def __str__(self):
        return self.name