from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0039_add_diff_quick_tincion_option'),
    ]

    operations = [
        migrations.AddField(
            model_name='muestranecropsia',
            name='descripcion_microscopica',
            field=models.TextField(blank=True, null=True),
        ),
    ]
