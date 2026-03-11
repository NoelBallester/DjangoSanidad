"""
Migración de datos: convierte las rutas de archivo (FileField legacy)
almacenadas como binario en los campos BinaryField a los bytes reales
del archivo correspondiente en MEDIA_ROOT.
"""
import os
from django.db import migrations
from django.conf import settings


# Modelos y campos a corregir
MODELS_FIELDS = [
    ('imagen',              'imagen'),
    ('imagencitologia',     'imagen'),
    ('imagennecropsia',     'imagen'),
    ('imagentubo',          'imagen'),
    ('imagenhematologia',   'imagen'),
    ('imagenmicrobiologia', 'imagen'),
    ('informeresultado',    'imagen'),
    ('cassette',            'informe_imagen'),
    ('cassette',            'volante_peticion'),
    ('citologia',           'volante_peticion'),
    ('necropsia',           'volante_peticion'),
    ('hematologia',         'informe_imagen'),
    ('hematologia',         'volante_peticion'),
    ('tubo',                'informe_imagen'),
    ('tubo',                'volante_peticion'),
    ('microbiologia',       'informe_imagen'),
    ('microbiologia',       'volante_peticion'),
]

IMAGE_MAGIC = [
    b'\xff\xd8\xff',        # JPEG
    b'\x89PNG\r\n\x1a\n',  # PNG
    b'GIF87a',              # GIF87
    b'GIF89a',              # GIF89
    b'BM',                  # BMP
    b'RIFF',                # WebP
    b'%PDF',                # PDF
    b'PK\x03\x04',         # ZIP / docx / odt
    b'\xd0\xcf\x11\xe0',   # OLE / doc
]


def _to_bytes(raw):
    if raw is None:
        return None
    if isinstance(raw, memoryview):
        return raw.tobytes()
    if isinstance(raw, (bytes, bytearray)):
        return bytes(raw)
    if isinstance(raw, str):
        return raw.encode('utf-8')
    return None


def _looks_like_file_path(raw_bytes):
    """True si los bytes parecen una ruta de texto, no datos binarios reales."""
    if not raw_bytes:
        return False
    if any(raw_bytes.startswith(m) for m in IMAGE_MAGIC):
        return False
    try:
        text = raw_bytes.decode('utf-8', errors='strict')
        return '/' in text or '\\' in text
    except UnicodeDecodeError:
        return False


def fix_legacy_paths(apps, schema_editor):
    media_root = settings.MEDIA_ROOT
    for model_name, field_name in MODELS_FIELDS:
        try:
            Model = apps.get_model('api', model_name)
        except LookupError:
            continue

        for obj in Model.objects.all():
            raw = _to_bytes(getattr(obj, field_name, None))
            if not raw:
                continue
            if not _looks_like_file_path(raw):
                continue

            path_str = raw.decode('utf-8', errors='replace').strip()
            full_path = os.path.join(media_root, path_str)
            if not os.path.isfile(full_path):
                continue

            try:
                with open(full_path, 'rb') as f:
                    content = f.read()
                setattr(obj, field_name, content)
                obj.save(update_fields=[field_name])
            except Exception:
                pass


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0024_revert_filefield_to_binaryfield'),
    ]

    operations = [
        migrations.RunPython(fix_legacy_paths, migrations.RunPython.noop),
    ]
