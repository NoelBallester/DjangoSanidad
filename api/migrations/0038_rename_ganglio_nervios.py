from django.db import migrations


OLD_VALUE = 'Ganglio Nervios'
NEW_VALUE = 'Ganglio Nervioso'


def forwards(apps, schema_editor):
    CatalogoOpcion = apps.get_model('api', 'CatalogoOpcion')
    Cassette = apps.get_model('api', 'Cassette')
    Citologia = apps.get_model('api', 'Citologia')
    Necropsia = apps.get_model('api', 'Necropsia')
    Tubo = apps.get_model('api', 'Tubo')
    Hematologia = apps.get_model('api', 'Hematologia')
    Microbiologia = apps.get_model('api', 'Microbiologia')

    CatalogoOpcion.objects.filter(valor=OLD_VALUE).update(valor=NEW_VALUE)

    for model in (Cassette, Citologia, Necropsia, Tubo, Hematologia, Microbiologia):
        model.objects.filter(organo=OLD_VALUE).update(organo=NEW_VALUE)


def backwards(apps, schema_editor):
    CatalogoOpcion = apps.get_model('api', 'CatalogoOpcion')
    Cassette = apps.get_model('api', 'Cassette')
    Citologia = apps.get_model('api', 'Citologia')
    Necropsia = apps.get_model('api', 'Necropsia')
    Tubo = apps.get_model('api', 'Tubo')
    Hematologia = apps.get_model('api', 'Hematologia')
    Microbiologia = apps.get_model('api', 'Microbiologia')

    CatalogoOpcion.objects.filter(valor=NEW_VALUE).update(valor=OLD_VALUE)

    for model in (Cassette, Citologia, Necropsia, Tubo, Hematologia, Microbiologia):
        model.objects.filter(organo=NEW_VALUE).update(organo=OLD_VALUE)


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0037_migrate_binary_to_files'),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
