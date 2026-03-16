from django.db import migrations


ANALISIS_VALORES = [
    'perfil hepático',
    'perfil renal',
    'perfil lipídico',
    'glucosa',
    'análisis de heces',
    'raspados',
    'fluidos biológicos',
    'esputos',
    'analisis de sangre',
    'ionograma',
    'gasometría',
    'analisis inmunológicos',
    'análisis citológico',
    'resultado biopsias',
    'improntas',
    'otros',
]


def forward_set_analisis_options(apps, schema_editor):
    CatalogoOpcion = apps.get_model('api', 'CatalogoOpcion')
    CatalogoOpcion.objects.filter(tipo='analisis_informe').delete()

    for index, valor in enumerate(ANALISIS_VALORES, start=1):
        CatalogoOpcion.objects.create(
            tipo='analisis_informe',
            valor=valor,
            categoria=None,
            orden=index * 10,
            activo=True,
        )


def backward_restore_seed_like_values(apps, schema_editor):
    CatalogoOpcion = apps.get_model('api', 'CatalogoOpcion')
    CatalogoOpcion.objects.filter(tipo='analisis_informe').delete()

    seed_like_values = [
        'Perfil hepático',
        'Perfil renal',
        'Perfil lipídico',
        'Glucosa',
        'Análisis de heces',
        'Análisis inmunológico',
        'Análisis citológico',
        'Análisis biopsias',
        'Ionograma',
        'Gasometría',
        'Análisis de sangre',
        'Otros',
    ]
    for index, valor in enumerate(seed_like_values, start=1):
        CatalogoOpcion.objects.create(
            tipo='analisis_informe',
            valor=valor,
            categoria=None,
            orden=index * 10,
            activo=True,
        )


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0031_merge_20260316_1910'),
    ]

    operations = [
        migrations.RunPython(forward_set_analisis_options, backward_restore_seed_like_values),
    ]
