from django.contrib import admin
from .models import (Tecnico, Cassette, Muestra, Imagen,
                     Citologia, MuestraCitologia, ImagenCitologia,
                     Hematologia, MuestraHematologia, ImagenHematologia,
                     Tubo, MuestraTubo, ImagenTubo)

admin.site.register(Tecnico)
admin.site.register(Cassette)
admin.site.register(Muestra)
admin.site.register(Imagen)
admin.site.register(Citologia)
admin.site.register(MuestraCitologia)
admin.site.register(ImagenCitologia)
admin.site.register(Hematologia)
admin.site.register(MuestraHematologia)
admin.site.register(ImagenHematologia)
admin.site.register(Tubo)
admin.site.register(MuestraTubo)
admin.site.register(ImagenTubo)
