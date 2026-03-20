"""
Comando para limpiar archivos orfanados (archivos en media/ que no están referenciados en modelos).
Uso: python manage.py cleanup_orphaned_files [--dry-run]
"""

from django.core.management.base import BaseCommand
from django.conf import settings
from pathlib import Path
import os


class Command(BaseCommand):
    help = 'Limpia archivos orfanados en MEDIA_ROOT que no están referenciados en ningún modelo'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Mostrar archivos a eliminar sin eliminarlos realmente',
        )

    def handle(self, *args, **options):
        from api.models import (
            Imagen, ImagenCitologia, ImagenNecropsia, ImagenTubo,
            ImagenHematologia, ImagenMicrobiologia,
            Cassette, Citologia, Necropsia, Tubo, Hematologia, Microbiologia,
            InformeResultado
        )

        media_root = Path(settings.MEDIA_ROOT)
        if not media_root.exists():
            self.stdout.write(self.style.ERROR(f"MEDIA_ROOT no existe: {media_root}"))
            return

        # Recopilar todos los archivos referenciados en base de datos
        referenced_files = set()

        # Campos a verificar por modelo
        models_and_fields = [
            (Imagen, 'imagen'),
            (ImagenCitologia, 'imagen'),
            (ImagenNecropsia, 'imagen'),
            (ImagenTubo, 'imagen'),
            (ImagenHematologia, 'imagen'),
            (ImagenMicrobiologia, 'imagen'),
            (Cassette, 'volante_peticion'),
            (Cassette, 'informe_imagen'),
            (Citologia, 'volante_peticion'),
            (Citologia, 'informe_imagen'),
            (Citologia, 'qr_imagen'),
            (Necropsia, 'volante_peticion'),
            (Necropsia, 'informe_imagen'),
            (Tubo, 'volante_peticion'),
            (Tubo, 'informe_imagen'),
            (Hematologia, 'volante_peticion'),
            (Hematologia, 'informe_imagen'),
            (Microbiologia, 'volante_peticion'),
            (Microbiologia, 'informe_imagen'),
            (InformeResultado, 'imagen'),
        ]

        for model, field in models_and_fields:
            for obj in model.objects.all():
                file_field = getattr(obj, field, None)
                if hasattr(file_field, 'name') and file_field and file_field.name:
                    referenced_files.add(str(file_field.name))

        # Buscar todos los archivos en media_root
        disk_files = set()
        for root, dirs, files in os.walk(media_root):
            for file in files:
                file_path = Path(root) / file
                relative_path = file_path.relative_to(media_root)
                disk_files.add(str(relative_path))

        # Encontrar archivos orfanados
        orphaned_files = disk_files - referenced_files

        if not orphaned_files:
            self.stdout.write(self.style.SUCCESS("✅ No hay archivos orfanados"))
            return

        self.stdout.write(
            self.style.WARNING(f"⚠️ Encontrados {len(orphaned_files)} archivos orfanados")
        )

        if options['dry_run']:
            self.stdout.write(self.style.WARNING("DRY-RUN: No se eliminarán archivos"))
            for orphaned in sorted(orphaned_files):
                self.stdout.write(f"  {orphaned}")
            return

        # Eliminar archivos orfanados
        deleted_count = 0
        for orphaned in orphaned_files:
            file_path = media_root / orphaned
            try:
                file_path.unlink()
                deleted_count += 1
                self.stdout.write(f"🗑️  Eliminado: {orphaned}")
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"❌ Error al eliminar {orphaned}: {e}")
                )

        self.stdout.write(
            self.style.SUCCESS(f"✅ Limpieza completada: {deleted_count} archivos eliminados")
        )
