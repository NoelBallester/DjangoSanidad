from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0026_soft_delete_samples_and_images'),
    ]

    operations = [
        migrations.AddField(
            model_name='tecnico',
            name='rol',
            field=models.CharField(
                choices=[
                    ('profesor', 'Profesor'),
                    ('anatomia_patologica', 'Anatomía Patológica'),
                    ('laboratorio', 'Laboratorio'),
                ],
                default='laboratorio',
                max_length=30,
            ),
        ),
    ]
