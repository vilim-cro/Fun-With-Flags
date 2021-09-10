from django.shortcuts import render
from .models import Zastava
from django.forms.models import model_to_dict

lista_rječnika_zastava = []
for zastava in Zastava.objects.all():
    lista_rječnika_zastava.append(model_to_dict(zastava))

def index(request):
    return render(request, 'bojanka/index.html', {
        "mydata": {"zastave": lista_rječnika_zastava}
    })
