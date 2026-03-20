"""
Normaliza referencias a archivos inexistentes en FileField/ImageField.
Uso:
  python manage.py repair_missing_file_references --dry-run
  python manage.py repair_missing_file_references
"""

from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Limpia referencias en BD a ficheros que no existen en MEDIA_ROOT"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Muestra cambios sin persistirlos",
        )

    def handle(self, *args, **options):
        from api.models import (
            Cassette,
            Citologia,
            Hematologia,
            Imagen,
            ImagenCitologia,
            ImagenHematologia,
            ImagenMicrobiologia,
            ImagenNecropsia,
            ImagenTubo,
            InformeResultado,
            Microbiologia,
            Necropsia,
            Tubo,
        )

        media_root = Path(settings.MEDIA_ROOT)
        dry_run = options["dry_run"]

        models_and_fields = [
            (Imagen, "id_imagen", "imagen"),
            (ImagenCitologia, "id_imagen", "imagen"),
            (ImagenNecropsia, "id_imagen", "imagen"),
            (ImagenTubo, "id_imagen", "imagen"),
            (ImagenHematologia, "id_imagen", "imagen"),
            (ImagenMicrobiologia, "id_imagen", "imagen"),
            (Cassette, "id_casette", "volante_peticion"),
            (Cassette, "id_casette", "informe_imagen"),
            (Citologia, "id_citologia", "volante_peticion"),
            (Citologia, "id_citologia", "informe_imagen"),
            (Citologia, "id_citologia", "qr_imagen"),
            (Necropsia, "id_necropsia", "volante_peticion"),
            (Necropsia, "id_necropsia", "informe_imagen"),
            (Tubo, "id_tubo", "volante_peticion"),
            (Tubo, "id_tubo", "informe_imagen"),
            (Hematologia, "id_hematologia", "volante_peticion"),
            (Hematologia, "id_hematologia", "informe_imagen"),
            (Microbiologia, "id_microbiologia", "volante_peticion"),
            (Microbiologia, "id_microbiologia", "informe_imagen"),
            (InformeResultado, "id_informe", "imagen"),
        ]

        fixed = 0
        checked = 0

        for model, pk_field, field_name in models_and_fields:
            for obj in model.objects.all().iterator():
                checked += 1
                value = getattr(obj, field_name, None)
                if not value:
                    continue

                name = getattr(value, "name", "")
                if not name:
                    continue

                if (media_root / name).exists():
                    continue

                obj_pk = getattr(obj, pk_field)
                self.stdout.write(
                    f"[MISSING] {model.__name__}({obj_pk}) campo={field_name} ruta={name}"
                )

                if not dry_run:
                    setattr(obj, field_name, None)
                    obj.save(update_fields=[field_name])
                fixed += 1

        mode = "DRY-RUN" if dry_run else "APLICADO"
        self.stdout.write(self.style.SUCCESS(f"{mode}: revisados={checked} corregidos={fixed}"))
