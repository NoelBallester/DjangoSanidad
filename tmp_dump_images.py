import os
import django
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import (
    Cassette, Citologia, Necropsia, Tubo, Hematologia, Microbiologia,
    Imagen, ImagenCitologia, ImagenNecropsia, ImagenTubo, ImagenHematologia, ImagenMicrobiologia,
    InformeResultado
)

import base64

def get_ext(data):
    if isinstance(data, str):
        if data.startswith('data:image/jpeg') or data.startswith('/9j/'): return '.jpg'
        if data.startswith('data:image/png') or data.startswith('iVBORw0KGgo'): return '.png'
        if data.startswith('JVBERi0'): return '.pdf'
        data = data.encode('utf-8')
    elif isinstance(data, memoryview):
        data = bytes(data)
    
    if isinstance(data, bytes):
        if data.startswith(b'\xff\xd8'): return '.jpg'
        if data.startswith(b'\x89PNG'): return '.png'
        if data.startswith(b'%PDF'): return '.pdf'
    return '.bin'

def dump_binary(model_class, field_name, folder):
    import uuid
    os.makedirs(folder, exist_ok=True)
    count = 0
    mapping = []
    for obj in model_class.objects.all():
        data = getattr(obj, field_name)
        if data:
            ext = get_ext(data)
            
            # If data is string and looks like base64 without prefix
            if isinstance(data, str):
                if data.startswith('data:'):
                    data = data.split(',', 1)[1]
                try:
                    raw_data = base64.b64decode(data)
                except Exception:
                    raw_data = data.encode('utf-8')
            elif isinstance(data, memoryview):
                raw_data = bytes(data)
            else:
                raw_data = data
                
            filename = f"{model_class.__name__}_{obj.pk}_{field_name}_{uuid.uuid4().hex[:8]}{ext}"
            filepath = os.path.join(folder, filename)
            with open(filepath, 'wb') as f:
                f.write(raw_data)
                
            # Guardamos la ruta relativa para FileField
            rel_path = filepath.replace('media/', '', 1) if filepath.startswith('media/') else filepath
            mapping.append(f"{model_class.__name__},{obj.pk},{field_name},{rel_path}")
            count += 1
    with open('dump_mapping.csv', 'a') as f:
        for m in mapping:
            f.write(m + '\n')
    print(f"Dumped {count} items for {model_class.__name__}.{field_name}")

if __name__ == '__main__':
    open('dump_mapping.csv', 'w').close() # clear
    # Volantes
    for model in [Cassette, Citologia, Necropsia, Tubo, Hematologia, Microbiologia]:
        dump_binary(model, 'volante_peticion', 'media/volantes')
    # Informes
    for model in [Cassette, Tubo, Hematologia, Microbiologia]:
        dump_binary(model, 'informe_imagen', 'media/informes_legacy')
    # Imagenes
    for model in [Imagen, ImagenCitologia, ImagenNecropsia, ImagenTubo, ImagenHematologia, ImagenMicrobiologia]:
        dump_binary(model, 'imagen', 'media/imagenes')
    
    # InformeResultado
    dump_binary(InformeResultado, 'imagen', 'media/informes')
    print("Dumping complete! Check dump_mapping.csv")
