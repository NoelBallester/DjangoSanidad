import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_remove_informeresultado_cassette_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='informeresultado',
            name='content_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype'),
        ),
        migrations.AlterField(
            model_name='informeresultado',
            name='object_id',
            field=models.PositiveIntegerField(),
        ),
    ]
