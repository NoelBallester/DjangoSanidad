# Generated migration
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_merge_20260306_1917'),
    ]

    operations = [
        migrations.AddField(
            model_name='cassette',
            name='tecnico',
            field=models.ForeignKey(blank=True, db_column='tecnico_id', null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.tecnico'),
        ),
    ]
