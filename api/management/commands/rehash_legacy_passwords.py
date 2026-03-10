from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import identify_hasher
from django.db import transaction

from api.models import Tecnico


class Command(BaseCommand):
    help = (
        "Rehashes legacy plaintext passwords for Tecnico users. "
        "Use --dry-run to preview and --apply to persist changes."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Analyze users and show what would change without writing to the database.",
        )
        parser.add_argument(
            "--apply",
            action="store_true",
            help="Persist updates in database. If omitted, command runs in dry-run mode.",
        )

    def handle(self, *args, **options):
        dry_run = options.get("dry_run", False) or not options.get("apply", False)

        total = 0
        already_hashed = 0
        unusable = 0
        empty = 0
        legacy_candidates = 0
        updated = 0

        queryset = Tecnico.objects.all().only("id_tecnico", "email", "password")

        if dry_run:
            self.stdout.write(self.style.WARNING("Running in DRY-RUN mode. No data will be updated."))
        else:
            self.stdout.write(self.style.WARNING("Running in APPLY mode. Password hashes will be updated."))

        with transaction.atomic():
            for tecnico in queryset.iterator():
                total += 1
                current_password = tecnico.password or ""

                if not current_password:
                    empty += 1
                    continue

                if current_password.startswith("!"):
                    unusable += 1
                    continue

                try:
                    identify_hasher(current_password)
                    already_hashed += 1
                    continue
                except Exception:
                    legacy_candidates += 1

                if dry_run:
                    self.stdout.write(
                        f"[DRY-RUN] id={tecnico.id_tecnico} email={tecnico.email} -> would be rehashed"
                    )
                    continue

                tecnico.set_password(current_password)
                tecnico.save(update_fields=["password"])
                updated += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Updated id={tecnico.id_tecnico} email={tecnico.email}"
                    )
                )

            if dry_run:
                transaction.set_rollback(True)

        self.stdout.write("")
        self.stdout.write(self.style.MIGRATE_HEADING("Summary"))
        self.stdout.write(f"Total usuarios revisados: {total}")
        self.stdout.write(f"Ya hasheadas: {already_hashed}")
        self.stdout.write(f"Sin contraseña: {empty}")
        self.stdout.write(f"Contraseña no usable: {unusable}")
        self.stdout.write(f"Candidatas legacy: {legacy_candidates}")

        if dry_run:
            self.stdout.write(self.style.WARNING("Aplicadas: 0 (dry-run)"))
        else:
            self.stdout.write(self.style.SUCCESS(f"Aplicadas: {updated}"))
