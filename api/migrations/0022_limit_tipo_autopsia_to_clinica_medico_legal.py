from django.db import migrations


def limit_tipo_autopsia_options(apps, schema_editor):
    CatalogoOpcion = apps.get_model('api', 'CatalogoOpcion')

    CatalogoOpcion.objects.filter(tipo='tipo_autopsia').update(activo=False)

    CatalogoOpcion.objects.update_or_create(
        tipo='tipo_autopsia',
        valor='Clínica',
        defaults={
            'categoria': None,
            'orden': 10,
            'activo': True,
        },
    )
    CatalogoOpcion.objects.update_or_create(
        tipo='tipo_autopsia',
        valor='Médico-legal',
        defaults={
            'categoria': None,
            'orden': 20,
            'activo': True,
        },
    )


def restore_tipo_autopsia_options(apps, schema_editor):
    CatalogoOpcion = apps.get_model('api', 'CatalogoOpcion')

    options = [
        ('Clínica', 10),
        ('Médico-legal', 20),
        ('Forense', 30),
        ('Anatomopatológica', 40),
        ('Perinatal', 50),
        ('Psicológica', 60),
        ('Verbal', 70),
        ('Virtual', 80),
        ('Otros', 90),
    ]

    for valor, orden in options:
        CatalogoOpcion.objects.update_or_create(
            tipo='tipo_autopsia',
            valor=valor,
            defaults={
                'categoria': None,
                'orden': orden,
                'activo': True,
            },
        )


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_alter_informeresultado_target_not_null'),
    ]

    operations = [
        migrations.RunPython(limit_tipo_autopsia_options, restore_tipo_autopsia_options),
    ]
