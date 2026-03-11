#!/usr/bin/env python
"""Test script para verificar subida de volante de petición"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from api.models import Citologia
from web.views import _guardar_volante_peticion

# Crear un archivo de prueba
contenido_pdf = b'%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n>>\nendobj\nxref\n0 1\n0000000000 65535 f \ntrailer\n<<\n/Size 1\n>>\nstartxref\n0\n%%EOF'
archivo = InMemoryUploadedFile(
    BytesIO(contenido_pdf),
    'file',
    'test_volante.pdf',
    'application/pdf',
    len(contenido_pdf),
    None
)

def main():
    print("1. Creando nueva citología de prueba...")
    c = Citologia.objects.create(
        citologia='TEST-001',
        tipo_citologia='Convencional',
        fecha='2026-03-09',
        descripcion='Test de volante',
        caracteristicas='Test',
        observaciones='Test automatizado',
        qr_citologia='QR-TEST-001',
        organo='Test'
    )
    print(f"   ✓ Citología creada con ID: {c.pk}")

    print("\n2. Guardando volante de petición...")
    _guardar_volante_peticion(archivo, c)
    print(f"   - volante_peticion: {c.volante_peticion is not None}")
    print(f"   - volante_peticion_nombre: {c.volante_peticion_nombre}")
    print(f"   - volante_peticion_tipo: {c.volante_peticion_tipo}")

    print("\n3. Guardando en base de datos...")
    c.save()
    print("   ✓ Guardado")

    print("\n4. Recargando desde BD...")
    c.refresh_from_db()
    print(f"   - volante_peticion: {c.volante_peticion is not None}")
    print(f"   - volante_peticion_nombre: {c.volante_peticion_nombre}")
    print(f"   - volante_peticion_tipo: {c.volante_peticion_tipo}")
    if c.volante_peticion:
        print(f"   - Tamaño: {len(c.volante_peticion)} bytes")

    print("\n✓ Test completado!")
    if c.volante_peticion:
        print("✅ TODO OK - Volante guardado correctamente")
    else:
        print("❌ ERROR - Volante NO guardado")


if __name__ == '__main__':
    main()
