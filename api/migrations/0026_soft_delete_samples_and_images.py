from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0025_fix_legacy_file_paths_to_binary'),
    ]

    operations = [
        migrations.AddField(
            model_name='imagen',
            name='is_deleted',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AddField(
            model_name='imagencitologia',
            name='is_deleted',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AddField(
            model_name='imagenhematologia',
            name='is_deleted',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AddField(
            model_name='imagenmicrobiologia',
            name='is_deleted',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AddField(
            model_name='imagennecropsia',
            name='is_deleted',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AddField(
            model_name='imagentubo',
            name='is_deleted',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AddField(
            model_name='muestra',
            name='is_deleted',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AddField(
            model_name='muestracitologia',
            name='is_deleted',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AddField(
            model_name='muestrahematologia',
            name='is_deleted',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AddField(
            model_name='muestramicrobiologia',
            name='is_deleted',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AddField(
            model_name='muestranecropsia',
            name='is_deleted',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AddField(
            model_name='muestratubo',
            name='is_deleted',
            field=models.BooleanField(db_index=True, default=False),
        ),
    ]
