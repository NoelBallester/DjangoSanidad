from django.db import migrations


def add_diff_quick_tincion_option(apps, schema_editor):
    CatalogoOpcion = apps.get_model('api', 'CatalogoOpcion')
    CatalogoOpcion.objects.update_or_create(
        tipo='tincion',
        valor='Diff Quick',
        defaults={
            'categoria': None,
            'orden': 55,
            'activo': True,
        },
    )


def remove_diff_quick_tincion_option(apps, schema_editor):
    CatalogoOpcion = apps.get_model('api', 'CatalogoOpcion')
    CatalogoOpcion.objects.filter(tipo='tincion', valor='Diff Quick').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0038_rename_ganglio_nervios'),
    ]

    operations = [
        migrations.RunPython(add_diff_quick_tincion_option, remove_diff_quick_tincion_option),
    ]
