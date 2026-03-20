#!/usr/bin/env python
"""
Script de verificación de la migración de BinaryField a FileField.
Valida que los archivos se han transferido correctamente a disco.
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import (
    Imagen, ImagenCitologia, ImagenNecropsia, ImagenTubo,
    ImagenHematologia, ImagenMicrobiologia,
    Cassette, Citologia, Necropsia, Tubo, Hematologia, Microbiologia,
    InformeResultado
)
from django.conf import settings
from pathlib import Path

def verify_migration():
    """Verifica que la migración se completó correctamente."""
    print("=" * 70)
    print("VERIFICACIÓN DE MIGRACIÓN: BinaryField → FileField")
    print("=" * 70)
    
    models_and_fields = [
        ("Imagen", Imagen, 'imagen'),
        ("ImagenCitologia", ImagenCitologia, 'imagen'),
        ("ImagenNecropsia", ImagenNecropsia, 'imagen'),
        ("ImagenTubo", ImagenTubo, 'imagen'),
        ("ImagenHematologia", ImagenHematologia, 'imagen'),
        ("ImagenMicrobiologia", ImagenMicrobiologia, 'imagen'),
        ("Cassette (volante)", Cassette, 'volante_peticion'),
        ("Cassette (informe)", Cassette, 'informe_imagen'),
        ("Citologia (volante)", Citologia, 'volante_peticion'),
        ("Citologia (informe)", Citologia, 'informe_imagen'),
        ("Necropsia (volante)", Necropsia, 'volante_peticion'),
        ("Necropsia (informe)", Necropsia, 'informe_imagen'),
        ("Tubo (volante)", Tubo, 'volante_peticion'),
        ("Tubo (informe)", Tubo, 'informe_imagen'),
        ("Hematologia (volante)", Hematologia, 'volante_peticion'),
        ("Hematologia (informe)", Hematologia, 'informe_imagen'),
        ("Microbiologia (volante)", Microbiologia, 'volante_peticion'),
        ("Microbiologia (informe)", Microbiologia, 'informe_imagen'),
        ("InformeResultado", InformeResultado, 'imagen'),
    ]
    
    media_root = Path(settings.MEDIA_ROOT)
    total_files = 0
    total_with_files = 0
    total_missing = 0
    
    for label, model, field_name in models_and_fields:
        qs = model.objects.all()
        total_count = qs.count()
        
        with_files = 0
        missing = 0
        
        for obj in qs:
            file_field = getattr(obj, field_name, None)
            if file_field and hasattr(file_field, 'name') and file_field.name:
                file_path = media_root / file_field.name
                if file_path.exists():
                    with_files += 1
                    total_files += 1
                else:
                    missing += 1
                    total_missing += 1
                    print(f"  ❌ {label} {obj.pk}: archivo faltante en disco: {file_field.name}")
        
        total_with_files += with_files
        status = "✅" if missing == 0 else "⚠️"
        print(f"{status} {label:30} | Total: {total_count:3d} | Con archivo: {with_files:3d} | Faltantes: {missing}")
    
    print("=" * 70)
    print(f"RESUMEN:")
    print(f"  Total de registros con archivos: {total_with_files}")
    print(f"  Total de archivos en disco: {total_files}")
    print(f"  Archivos faltantes: {total_missing}")
    print(f"  MEDIA_ROOT: {media_root}")
    print("=" * 70)
    
    if total_missing == 0:
        print("✅ MIGRACIÓN EXITOSA: Todos los archivos se han transferido correctamente.")
        return 0
    else:
        print(f"❌ MIGRACIÓN INCOMPLETA: {total_missing} archivos faltantes en disco.")
        return 1

if __name__ == '__main__':
    sys.exit(verify_migration())
