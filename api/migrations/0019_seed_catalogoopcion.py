from django.db import migrations


def seed_catalog_options(apps, schema_editor):
    CatalogoOpcion = apps.get_model('api', 'CatalogoOpcion')

    rows = [
        # Organos
        ('organo', 'Encéfalo', 'Sistema Nervioso', 10),
        ('organo', 'Médula Espinal', 'Sistema Nervioso', 20),
        ('organo', 'Nervio', 'Sistema Nervioso', 30),
        ('organo', 'Ganglio Nervios', 'Sistema Nervioso', 40),
        ('organo', 'Piel', 'Tegumento', 50),
        ('organo', 'Uña', 'Tegumento', 60),
        ('organo', 'Pelo', 'Tegumento', 70),
        ('organo', 'Corazón', 'Cardiovascular', 80),
        ('organo', 'Venas', 'Cardiovascular', 90),
        ('organo', 'Arteria', 'Cardiovascular', 100),
        ('organo', 'Líquido Pericárdico', 'Cardiovascular', 110),
        ('organo', 'Ganglio Linfático', 'Linfático', 120),
        ('organo', 'Timo', 'Linfático', 130),
        ('organo', 'Bazo', 'Linfático', 140),
        ('organo', 'Ganglio cervical', 'Linfático', 150),
        ('organo', 'Ganglio axilar', 'Linfático', 160),
        ('organo', 'Ganglio inguinal', 'Linfático', 170),
        ('organo', 'Médula ósea', 'Linfático', 180),
        ('organo', 'Sangre periférica', 'Linfático', 190),
        ('organo', 'Hipófisis', 'Endocrino', 200),
        ('organo', 'Glándula Tiroides', 'Endocrino', 210),
        ('organo', 'Glándulas Paratiroides', 'Endocrino', 220),
        ('organo', 'Glándulas Suprarrenales', 'Endocrino', 230),
        ('organo', 'Páncreas', 'Endocrino', 240),
        ('organo', 'Fosa Nasal', 'Respiratorio', 250),
        ('organo', 'Faringe', 'Respiratorio', 260),
        ('organo', 'Laringe', 'Respiratorio', 270),
        ('organo', 'Tráquea', 'Respiratorio', 280),
        ('organo', 'Bronquio', 'Respiratorio', 290),
        ('organo', 'Pulmón', 'Respiratorio', 300),
        ('organo', 'Líquido Pleural', 'Respiratorio', 310),
        ('organo', 'Boca', 'Digestivo', 320),
        ('organo', 'Cavidad oral', 'Digestivo', 330),
        ('organo', 'Lengua', 'Digestivo', 340),
        ('organo', 'Glándula Salival', 'Digestivo', 350),
        ('organo', 'Esófago', 'Digestivo', 360),
        ('organo', 'Estómago', 'Digestivo', 370),
        ('organo', 'Hígado', 'Digestivo', 380),
        ('organo', 'Vesícula Biliar', 'Digestivo', 390),
        ('organo', 'Int. Delgado', 'Digestivo', 400),
        ('organo', 'Int. Grueso', 'Digestivo', 410),
        ('organo', 'Ciego', 'Digestivo', 420),
        ('organo', 'Apéndice', 'Digestivo', 430),
        ('organo', 'Recto', 'Digestivo', 440),
        ('organo', 'Ano', 'Digestivo', 450),
        ('organo', 'Líquido Peritoneal', 'Digestivo', 460),
        ('organo', 'Riñón', 'Excretor Urinario', 470),
        ('organo', 'Pelvis Renal', 'Excretor Urinario', 480),
        ('organo', 'Uréter', 'Excretor Urinario', 490),
        ('organo', 'Vejiga Urinaria', 'Excretor Urinario', 500),
        ('organo', 'Uretra', 'Excretor Urinario', 510),
        ('organo', 'Testículo', 'Reproductor Masculino', 520),
        ('organo', 'Mama', 'Reproductor Femenino', 530),
        ('organo', 'Ovario', 'Reproductor Femenino', 540),
        ('organo', 'Trompa de Falopio', 'Reproductor Femenino', 550),
        ('organo', 'Útero', 'Reproductor Femenino', 560),
        ('organo', 'Vagina', 'Reproductor Femenino', 570),
        ('organo', 'Vulva', 'Reproductor Femenino', 580),
        ('organo', 'Cuerpo de Útero', 'Reproductor Femenino', 590),
        ('organo', 'Cuello de Útero', 'Reproductor Femenino', 600),
        ('organo', 'Cavidad Pélvica', 'Reproductor Femenino', 610),
        ('organo', 'Hueso', 'Locomotor', 620),
        ('organo', 'Músculo Esquelético', 'Locomotor', 630),
        ('organo', 'Líquido Sinovial', 'Locomotor', 640),
        ('organo', 'Otros', None, 650),

        # Tinciones
        ('tincion', 'Hematoxilina Eosina (HE)', None, 10),
        ('tincion', 'Giemsa', None, 20),
        ('tincion', 'Gram', None, 30),
        ('tincion', 'Azul de Metileno', None, 40),
        ('tincion', 'Papanicolau', None, 50),
        ('tincion', 'Wright', None, 60),
        ('tincion', 'Ziehl-Neelsen', None, 70),
        ('tincion', 'Tricrómico', None, 80),
        ('tincion', 'Orceína', None, 90),
        ('tincion', 'P.A.S', None, 100),
        ('tincion', 'Otros', None, 110),

        # Tipos citologia
        ('tipo_citologia', 'Improntas', None, 10),
        ('tipo_citologia', 'Punción-aspiración', None, 20),
        ('tipo_citologia', 'Esputo', None, 30),
        ('tipo_citologia', 'Líquido pleural', None, 40),
        ('tipo_citologia', 'Líquido ascítico', None, 50),
        ('tipo_citologia', 'Líquido pericárdico', None, 60),
        ('tipo_citologia', 'Saliva', None, 70),
        ('tipo_citologia', 'Contenido quístico', None, 80),
        ('tipo_citologia', 'Raspados', None, 90),
        ('tipo_citologia', 'Orina', None, 100),
        ('tipo_citologia', 'Cepillado', None, 110),
        ('tipo_citologia', 'Citología respiratoria (BAS y BAL)', None, 120),
        ('tipo_citologia', 'Secreción mamaria', None, 130),
        ('tipo_citologia', 'Muestra vulvar', None, 140),
        ('tipo_citologia', 'Muestra endometrial', None, 150),

        # Tipos autopsia
        ('tipo_autopsia', 'Clínica', None, 10),
        ('tipo_autopsia', 'Médico-legal', None, 20),
        ('tipo_autopsia', 'Forense', None, 30),
        ('tipo_autopsia', 'Anatomopatológica', None, 40),
        ('tipo_autopsia', 'Perinatal', None, 50),
        ('tipo_autopsia', 'Psicológica', None, 60),
        ('tipo_autopsia', 'Verbal', None, 70),
        ('tipo_autopsia', 'Virtual', None, 80),
        ('tipo_autopsia', 'Otros', None, 90),

        # Analisis informe
        ('analisis_informe', 'Perfil hepático', None, 10),
        ('analisis_informe', 'Perfil renal', None, 20),
        ('analisis_informe', 'Perfil lipídico', None, 30),
        ('analisis_informe', 'Glucosa', None, 40),
        ('analisis_informe', 'Análisis de heces', None, 50),
        ('analisis_informe', 'Análisis inmunológico', None, 60),
        ('analisis_informe', 'Análisis citológico', None, 70),
        ('analisis_informe', 'Análisis biopsias', None, 80),
        ('analisis_informe', 'Ionograma', None, 90),
        ('analisis_informe', 'Gasometría', None, 100),
        ('analisis_informe', 'Análisis de sangre', None, 110),
        ('analisis_informe', 'Otros', None, 120),
    ]

    for tipo, valor, categoria, orden in rows:
        CatalogoOpcion.objects.update_or_create(
            tipo=tipo,
            valor=valor,
            defaults={
                'categoria': categoria,
                'orden': orden,
                'activo': True,
            },
        )


def rollback_catalog_options(apps, schema_editor):
    CatalogoOpcion = apps.get_model('api', 'CatalogoOpcion')
    CatalogoOpcion.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_catalogoopcion'),
    ]

    operations = [
        migrations.RunPython(seed_catalog_options, rollback_catalog_options),
    ]
