import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.test import Client

c = Client()
# Log in or mock authentication if needed, but '/api/cassettes/todos/' might need auth.
# Wait, let's create a temp user/tecnico
from api.models import Tecnico
from django.contrib.auth.hashers import make_password
t, _ = Tecnico.objects.get_or_create(id_tecnico=999, defaults={'nombre':'T', 'apellidos':'T', 'password': make_password('123')})
c.login(id_tecnico='999', password='123')

response = c.get('/api/cassettes/todos/')
print("Status Code:", response.status_code)
if response.status_code == 200:
    data = response.json()
    print("Keys in response:", data.keys() if isinstance(data, dict) else type(data))
    if isinstance(data, dict) and 'count' in data:
        print("PAGINATION WORKS! Count:", data['count'])
    else:
        print("Pagination did not apply or response is not a paginated dict")
else:
    print(response.content)

# Test base64 of image field
from api.models import Imagen
if Imagen.objects.exists():
    img = Imagen.objects.first()
    print("First image path:", img.imagen.name)
    print("Does file exist?", os.path.exists(img.imagen.path))
