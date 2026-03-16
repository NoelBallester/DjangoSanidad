from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0029_necropsia_descripcion_microscopica_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='muestranecropsia',
            name='toma_muestras',
            field=models.TextField(blank=True, null=True),
        ),
    ]