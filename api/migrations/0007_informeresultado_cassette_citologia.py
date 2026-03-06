from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_microbiologia_muestramicrobiologia_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='informeresultado',
            name='cassette',
            field=models.ForeignKey(blank=True, db_column='cassette_id', null=True, on_delete=django.db.models.deletion.CASCADE, to='api.cassette'),
        ),
        migrations.AddField(
            model_name='informeresultado',
            name='citologia',
            field=models.ForeignKey(blank=True, db_column='citologia_id', null=True, on_delete=django.db.models.deletion.CASCADE, to='api.citologia'),
        ),
    ]
