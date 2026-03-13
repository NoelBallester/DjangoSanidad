from django.test import TestCase, Client
from django.test import RequestFactory
from django.urls import reverse
from django.contrib.auth.hashers import make_password
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.contenttypes.models import ContentType
from django.db import connection
from django.db.utils import OperationalError
from unittest.mock import patch

from api.models import (
    Tecnico, Cassette, Muestra, Imagen, Citologia, MuestraCitologia,
    ImagenCitologia, Hematologia, MuestraHematologia, ImagenHematologia, Necropsia, MuestraNecropsia,
    InformeResultado,
)
from core.error_views import custom_404, custom_500
from web.views import _imagen_bytes_a_base64, _mime_tipo_desde_bytes


# ── Helpers ───────────────────────────────────────────────────────────────────

def make_tecnico(id_tecnico=None, password='pass1234', staff=False):
    """Crea un técnico de prueba con contraseña hasheada."""
    kwargs = dict(
        nombre='Test', apellidos='User',
        email=f'test{id_tecnico or ""}@test.com',
        rol='profesor',
        is_staff=staff, is_active=True,
    )
    t = Tecnico(**kwargs)
    t.password = make_password(password)
    t.save()
    return t


def make_cassette(n=1):
    return Cassette.objects.create(
        cassette=f'C{n:03d}',
        fecha='2024-01-01',
        descripcion='Desc',
        caracteristicas='Caract',
        qr_casette=f'QR{n}',
        organo='Pulmón',
    )


def make_citologia(tecnico=None, n=1):
    return Citologia.objects.create(
        citologia=f'CIT{n:03d}',
        tipo_citologia='Improntas',
        fecha='2024-01-01',
        descripcion='Desc',
        caracteristicas='Caract',
        qr_citologia=f'QRC{n}',
        organo='Pulmón',
        tecnico=tecnico,
    )


def informe_qs_for(obj):
    ct = ContentType.objects.get_for_model(obj.__class__)
    return InformeResultado.objects.filter(content_type=ct, object_id=obj.pk)


PNG_BYTES = (
    b'\x89PNG\r\n\x1a\n'
    b'\x00\x00\x00\rIHDR'
    b'\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00'
    b'\x90wS\xde'
    b'\x00\x00\x00\x0cIDATx\x9cc``\x00\x00\x00\x02\x00\x01'
    b'\x0b\xe7\x02\x9d'
    b'\x00\x00\x00\x00IEND\xaeB`\x82'
)


# ── 1. Autenticación ──────────────────────────────────────────────────────────

class LoginTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.tecnico = make_tecnico(1)
        self.url = reverse('login')

    def test_get_muestra_formulario(self):
        r = self.client.get(self.url)
        self.assertEqual(r.status_code, 200)

    def test_login_correcto_redirige(self):
        r = self.client.post(self.url, {
            'tecnico_id': self.tecnico.pk,
            'password': 'pass1234',
        })
        self.assertRedirects(r, '/index.html', fetch_redirect_response=False)

    def test_login_password_incorrecta(self):
        r = self.client.post(self.url, {
            'tecnico_id': self.tecnico.pk,
            'password': 'mala',
        })
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'incorrectos')

    def test_login_usuario_inexistente(self):
        r = self.client.post(self.url, {
            'tecnico_id': 9999,
            'password': 'pass1234',
        })
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, 'incorrectos')

    def test_ya_autenticado_redirige_sin_pedir_credenciales(self):
        self.client.force_login(self.tecnico)
        r = self.client.get(self.url)
        self.assertRedirects(r, '/index.html', fetch_redirect_response=False)

    def test_login_next_respetado(self):
        r = self.client.post(
            self.url + '?next=/cassettes/',
            {'tecnico_id': self.tecnico.pk, 'password': 'pass1234'},
        )
        self.assertRedirects(r, '/cassettes/', fetch_redirect_response=False)


class LogoutTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.tecnico = make_tecnico(1)
        self.client.force_login(self.tecnico)

    def test_logout_post_elimina_sesion(self):
        r = self.client.post(reverse('logout'))
        self.assertRedirects(r, reverse('login'), fetch_redirect_response=False)
        # Tras logout, acceder a vista protegida redirige al login
        r2 = self.client.get(reverse('cassettes'))
        self.assertRedirects(r2, '/login/?next=/cassettes/', fetch_redirect_response=False)

    def test_logout_get_rechazado(self):
        r = self.client.get(reverse('logout'))
        self.assertEqual(r.status_code, 405)


# ── 2. Control de acceso ──────────────────────────────────────────────────────

class AccesoProtegidoTests(TestCase):

    URLS_PROTEGIDAS = [
        'cassettes', 'citologias', 'usuarios',
    ]

    def setUp(self):
        self.client = Client()
        self.tecnico = make_tecnico(1)

    def test_sin_sesion_redirige_a_login(self):
        for nombre in self.URLS_PROTEGIDAS:
            with self.subTest(url=nombre):
                r = self.client.get(reverse(nombre))
                self.assertEqual(r.status_code, 302)
                self.assertIn('/login/', r['Location'])

    def test_con_sesion_devuelve_200(self):
        self.client.force_login(self.tecnico)
        for nombre in self.URLS_PROTEGIDAS:
            with self.subTest(url=nombre):
                r = self.client.get(reverse(nombre))
                self.assertEqual(r.status_code, 200)

    def test_cabeceras_no_cache_en_cassettes(self):
        self.client.force_login(self.tecnico)
        r = self.client.get(reverse('cassettes'))
        cc = r.get('Cache-Control', '')
        self.assertIn('no-store', cc)

    def test_cabeceras_no_cache_en_citologias(self):
        self.client.force_login(self.tecnico)
        r = self.client.get(reverse('citologias'))
        cc = r.get('Cache-Control', '')
        self.assertIn('no-store', cc)


class AnatomiaPatologicaLegacyDbTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.tecnico = make_tecnico(1)
        self.client.force_login(self.tecnico)

        make_cassette(1)
        make_citologia(self.tecnico, 1)
        Necropsia.objects.create(
            necropsia='N001',
            tipo_necropsia='Clínica',
            fecha='2024-01-01',
            descripcion='Desc',
            caracteristicas='Caract',
            qr_necropsia='QRN1',
            organo='Pulmón',
            tecnico=self.tecnico,
        )
        Hematologia.objects.create(
            hematologia='H001',
            fecha='2024-01-01',
            descripcion='Desc',
            caracteristicas='Caract',
            qr_hematologia='QRH1',
            organo='Pulmón',
            tecnico=self.tecnico,
        )

        with connection.cursor() as cursor:
            cursor.execute('DROP TABLE IF EXISTS catalogo_opciones')

    def test_paginas_anatomia_cargan_sin_catalogo(self):
        urls = ['cassettes', 'citologias', 'necropsias', 'hematologias']
        for nombre in urls:
            with self.subTest(url=nombre):
                response = self.client.get(reverse(nombre))
                self.assertEqual(response.status_code, 200)

    def test_seleccion_detalle_sigue_funcionando_sin_informes_genericos(self):
        cassette = Cassette.objects.first()
        citologia = Citologia.objects.first()
        necropsia = Necropsia.objects.first()
        hematologia = Hematologia.objects.first()

        with patch('web.views.InformeResultado.objects.filter', side_effect=OperationalError('legacy schema')):
            urls = [
                reverse('cassettes') + f'?cassette={cassette.pk}',
                reverse('citologias') + f'?citologia={citologia.pk}',
                reverse('necropsias') + f'?necropsia={necropsia.pk}',
                reverse('hematologias') + f'?hematologia={hematologia.pk}',
            ]
            for url in urls:
                with self.subTest(url=url):
                    response = self.client.get(url)
                    self.assertEqual(response.status_code, 200)
                    self.assertIsNotNone(response.context['selected'])


class ImageHelperTests(TestCase):

    def test_helpers_leen_filefield_correctamente(self):
        cassette = make_cassette(99)
        muestra = Muestra.objects.create(
            cassette=cassette,
            descripcion='Muestra test',
            fecha='2024-01-01',
            observaciones='obs',
            tincion='Otros',
            qr_muestra='QR-TEST-IMG',
        )
        imagen = Imagen.objects.create(
            muestra=muestra,
            imagen=PNG_BYTES,
        )

        self.assertEqual(_mime_tipo_desde_bytes(imagen.imagen), 'image/png')
        self.assertTrue(_imagen_bytes_a_base64(imagen.imagen))

    def test_helpers_leen_bytes_legacy_correctamente(self):
        self.assertEqual(_mime_tipo_desde_bytes(PNG_BYTES), 'image/png')
        self.assertTrue(_imagen_bytes_a_base64(PNG_BYTES))


class ErrorViewTests(TestCase):

    def setUp(self):
        self.factory = RequestFactory()

    def test_custom_404_renderiza_plantilla_propia(self):
        request = self.factory.get('/ruta-inexistente/')
        response = custom_404(request, Exception('missing'))

        self.assertEqual(response.status_code, 404)
        self.assertIn(b'404', response.content)
        self.assertIn(b'La pagina solicitada no existe', response.content)

    def test_custom_500_renderiza_plantilla_propia(self):
        request = self.factory.get('/error/')
        response = custom_500(request)

        self.assertEqual(response.status_code, 500)
        self.assertIn(b'500', response.content)
        self.assertIn(b'Se ha producido un error interno', response.content)


class MuestrasSinImagenTemplateTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.tecnico = make_tecnico(101)
        self.client.force_login(self.tecnico)

    def test_cassettes_muestra_sin_imagen_muestra_placeholder(self):
        cassette = make_cassette(501)
        muestra = Muestra.objects.create(
            cassette=cassette,
            descripcion='Sin imagen',
            fecha='2024-01-01',
            observaciones='obs',
            tincion='Otros',
            qr_muestra='QR-NO-IMG-CAS',
        )

        response = self.client.get(reverse('cassettes') + f'?cassette={cassette.pk}&muestra={muestra.pk}')

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Sin imagen adjunta')
        self.assertContains(response, 'no_disponible.jpg')

    def test_citologias_muestra_sin_imagen_muestra_placeholder(self):
        citologia = make_citologia(self.tecnico, 601)
        muestra = MuestraCitologia.objects.create(
            citologia=citologia,
            descripcion='Sin imagen',
            fecha='2024-01-01',
            observaciones='obs',
            tincion='Otros',
            qr_muestra='QR-NO-IMG-CIT',
        )

        response = self.client.get(reverse('citologias') + f'?citologia={citologia.pk}&muestra={muestra.pk}')

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Sin imagen adjunta')
        self.assertContains(response, 'no_disponible.jpg')

    def test_necropsias_muestra_sin_imagen_muestra_placeholder(self):
        necropsia = Necropsia.objects.create(
            necropsia='N901',
            tipo_necropsia='Clínica',
            fecha='2024-01-01',
            descripcion='Desc',
            caracteristicas='Caract',
            qr_necropsia='QRN901',
            organo='Pulmón',
            tecnico=self.tecnico,
        )
        muestra = MuestraNecropsia.objects.create(
            necropsia=necropsia,
            descripcion='Sin imagen',
            fecha='2024-01-01',
            observaciones='obs',
            qr_muestra='QR-NO-IMG-NEC',
            examen_interno_cadaver='dato',
            tecnica_apertura='tecnica',
            datos_relevantes_region='region',
        )

        response = self.client.get(reverse('necropsias') + f'?necropsia={necropsia.pk}&muestra={muestra.pk}')

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Sin imagen adjunta')
        self.assertContains(response, 'no_disponible.jpg')

    def test_hematologias_muestra_sin_imagen_muestra_placeholder(self):
        hematologia = Hematologia.objects.create(
            hematologia='H901',
            fecha='2024-01-01',
            descripcion='Desc',
            caracteristicas='Caract',
            qr_hematologia='QRH901',
            organo='Pulmón',
            tecnico=self.tecnico,
        )
        muestra = MuestraHematologia.objects.create(
            hematologia=hematologia,
            descripcion='Sin imagen',
            fecha='2024-01-01',
            observaciones='obs',
            tincion='Otros',
            qr_muestra='QR-NO-IMG-HEM',
        )

        response = self.client.get(reverse('hematologias') + f'?hematologia={hematologia.pk}&muestra={muestra.pk}')

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Sin imagen adjunta')


# ── 3. Permisos de staff ──────────────────────────────────────────────────────

class PermisosStaffTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.normal = make_tecnico(1)
        self.staff = make_tecnico(2, staff=True)

    def test_no_staff_no_puede_crear_tecnico(self):
        self.client.force_login(self.normal)
        self.client.post(reverse('usuario_create'), {
            'nombre': 'Nuevo', 'apellidos': 'Tecnico',
            'email': 'nuevo@test.com', 'password': 'abc123',
        })
        self.assertFalse(Tecnico.objects.filter(email='nuevo@test.com').exists())

    def test_staff_puede_crear_tecnico(self):
        self.client.force_login(self.staff)
        self.client.post(reverse('usuario_create'), {
            'nombre': 'Nuevo', 'apellidos': 'Tecnico',
            'email': 'nuevo@test.com', 'password': 'abc123',
            'username': 'nuevotecnico',
        })
        self.assertTrue(Tecnico.objects.filter(email='nuevo@test.com').exists())

    def test_no_staff_no_puede_eliminar_tecnico(self):
        victima = make_tecnico(3)
        self.client.force_login(self.normal)
        self.client.post(reverse('usuario_delete', args=[victima.pk]))
        self.assertTrue(Tecnico.objects.filter(pk=victima.pk).exists())

    def test_staff_puede_eliminar_tecnico(self):
        victima = make_tecnico(3)
        self.client.force_login(self.staff)
        self.client.post(reverse('usuario_delete', args=[victima.pk]))
        self.assertFalse(Tecnico.objects.filter(pk=victima.pk).exists())

    def test_staff_no_puede_eliminarse_a_si_mismo(self):
        self.client.force_login(self.staff)
        self.client.post(reverse('usuario_delete', args=[self.staff.pk]))
        self.assertTrue(Tecnico.objects.filter(pk=self.staff.pk).exists())


# ── 4. CRUD Cassettes ─────────────────────────────────────────────────────────

class CassetteCRUDTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.tecnico = make_tecnico(1)
        self.client.force_login(self.tecnico)

    def test_listar_sin_filtros_devuelve_10(self):
        for i in range(15):
            make_cassette(i + 1)
        r = self.client.get(reverse('cassettes'))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.context['cassettes']), 10)

    def test_filtro_por_organo(self):
        make_cassette(1)
        Cassette.objects.create(
            cassette='C999', fecha='2024-01-01', descripcion='D',
            caracteristicas='C', qr_casette='QR999', organo='Riñon',
        )
        r = self.client.get(reverse('cassettes') + '?organo=Riñon')
        self.assertEqual(len(r.context['cassettes']), 1)
        self.assertEqual(r.context['cassettes'][0].organo, 'Riñon')

    def test_crear_cassette(self):
        self.client.post(reverse('cassette_create'), {
            'cassette': 'C001', 'fecha': '2024-06-01',
            'descripcion': 'Desc', 'caracteristicas': 'Caract',
            'qr_casette': 'QR001', 'organo': 'Pulmón',
        })
        self.assertTrue(Cassette.objects.filter(cassette='C001').exists())

    def test_editar_cassette(self):
        c = make_cassette(1)
        self.client.post(reverse('cassette_update', args=[c.pk]), {
            'cassette': c.cassette, 'fecha': c.fecha,
            'descripcion': 'Nueva desc', 'caracteristicas': c.caracteristicas,
            'qr_casette': c.qr_casette, 'organo': c.organo,
        })
        c.refresh_from_db()
        self.assertEqual(c.descripcion, 'Nueva desc')

    def test_eliminar_cassette(self):
        c = make_cassette(1)
        self.client.post(reverse('cassette_delete', args=[c.pk]))
        self.assertFalse(Cassette.objects.filter(pk=c.pk).exists())

    def test_detalle_cassette_por_param(self):
        c = make_cassette(1)
        r = self.client.get(reverse('cassettes') + f'?cassette={c.pk}')
        self.assertEqual(r.context['selected'].pk, c.pk)


# ── 5. CRUD Citologías ────────────────────────────────────────────────────────

class CitologiaCRUDTests(TestCase):

    DATOS_VALIDOS = {
        'citologia': 'CIT001', 'tipo_citologia': 'Improntas',
        'fecha': '2024-06-01', 'descripcion': 'Desc',
        'caracteristicas': 'Caract', 'organo': 'Pulmón',
    }

    def setUp(self):
        self.client = Client()
        self.tecnico = make_tecnico(1)
        self.client.force_login(self.tecnico)

    def test_crear_citologia(self):
        r = self.client.post(reverse('citologia_create'), self.DATOS_VALIDOS)
        self.assertEqual(r.status_code, 302)
        self.assertTrue(Citologia.objects.filter(citologia='CIT001').exists())

    def test_crear_citologia_genera_qr(self):
        self.client.post(reverse('citologia_create'), self.DATOS_VALIDOS)
        c = Citologia.objects.get(citologia='CIT001')
        self.assertTrue(c.qr_citologia.startswith('--cit--'))

    def test_crear_citologia_asocia_tecnico(self):
        self.client.post(reverse('citologia_create'), self.DATOS_VALIDOS)
        c = Citologia.objects.get(citologia='CIT001')
        self.assertEqual(c.tecnico, self.tecnico)

    def test_crear_citologia_sin_tipo_no_crea(self):
        """ChoiceField required=True — tipo vacío debe rechazarse."""
        datos = {**self.DATOS_VALIDOS, 'tipo_citologia': ''}
        self.client.post(reverse('citologia_create'), datos)
        self.assertFalse(Citologia.objects.filter(citologia='CIT001').exists())

    def test_crear_citologia_sin_organo_no_crea(self):
        datos = {**self.DATOS_VALIDOS, 'organo': ''}
        self.client.post(reverse('citologia_create'), datos)
        self.assertFalse(Citologia.objects.filter(citologia='CIT001').exists())

    def test_crear_citologia_sin_descripcion_no_crea(self):
        datos = {**self.DATOS_VALIDOS, 'descripcion': ''}
        self.client.post(reverse('citologia_create'), datos)
        self.assertFalse(Citologia.objects.filter(citologia='CIT001').exists())

    def test_crear_citologia_tipo_invalido_no_crea(self):
        """Un tipo que no existe en TIPOS_CITOLOGIA debe rechazarse."""
        datos = {**self.DATOS_VALIDOS, 'tipo_citologia': 'Exfoliativa'}
        self.client.post(reverse('citologia_create'), datos)
        self.assertFalse(Citologia.objects.filter(citologia='CIT001').exists())

    def test_crear_citologia_sin_sesion_redirige_login(self):
        self.client.logout()
        r = self.client.post(reverse('citologia_create'), self.DATOS_VALIDOS)
        self.assertEqual(r.status_code, 302)
        self.assertIn('/login/', r['Location'])
        self.assertFalse(Citologia.objects.filter(citologia='CIT001').exists())

    def test_editar_citologia(self):
        c = make_citologia(self.tecnico, 1)
        self.client.post(reverse('citologia_update', args=[c.pk]), {
            'citologia': c.citologia, 'tipo_citologia': 'Improntas',
            'fecha': c.fecha, 'descripcion': 'Desc actualizada',
            'caracteristicas': c.caracteristicas, 'organo': c.organo,
        })
        c.refresh_from_db()
        self.assertEqual(c.descripcion, 'Desc actualizada')

    def test_editar_citologia_tipo_invalido_no_modifica(self):
        c = make_citologia(self.tecnico, 1)
        desc_original = c.descripcion
        self.client.post(reverse('citologia_update', args=[c.pk]), {
            'citologia': c.citologia, 'tipo_citologia': 'TipoFalso',
            'fecha': c.fecha, 'descripcion': 'Desc cambiada',
            'caracteristicas': c.caracteristicas, 'organo': c.organo,
        })
        c.refresh_from_db()
        self.assertEqual(c.descripcion, desc_original)

    def test_eliminar_citologia(self):
        c = make_citologia(self.tecnico, 1)
        self.client.post(reverse('citologia_delete', args=[c.pk]))
        self.assertFalse(Citologia.objects.filter(pk=c.pk).exists())

    def test_eliminar_citologia_inexistente_devuelve_404(self):
        r = self.client.post(reverse('citologia_delete', args=[99999]))
        self.assertEqual(r.status_code, 404)

    def test_listar_sin_filtros_devuelve_10(self):
        for i in range(15):
            make_citologia(self.tecnico, i + 1)
        r = self.client.get(reverse('citologias'))
        self.assertEqual(len(r.context['citologias']), 10)


class NecropsiaMuestrasTests(TestCase):

    DATOS_VALIDOS = {
        'citologia': 'CIT001',
        'tipo_citologia': 'Improntas',
        'fecha': '2024-06-01',
        'descripcion': 'Paciente A',
        'caracteristicas': 'Caract',
        'organo': 'Pulmón',
    }

    def setUp(self):
        self.client = Client()
        self.tecnico = make_tecnico(1)
        self.client.force_login(self.tecnico)
        self.necropsia = Necropsia.objects.create(
            necropsia='N001',
            tipo_necropsia='Clínica',
            fecha='2024-01-01',
            descripcion='Desc',
            caracteristicas='Caract',
            qr_necropsia='QRN1',
            organo='Pulmón',
            tecnico=self.tecnico,
        )

    def test_crear_muestra_necropsia_acepta_tincion_hidden_legacy(self):
        response = self.client.post(reverse('muestra_necropsia_create', args=[self.necropsia.pk]), {
            'descripcion': 'Muestra necropsia',
            'fecha': '2026-03-11',
            'examen_interno_cadaver': 'dato',
            'tecnica_apertura': 'tecnica',
            'datos_relevantes_region': 'region',
            'tincion': 'Otros',
            'observaciones': 'obs',
        })

        self.assertEqual(response.status_code, 302)
        self.assertTrue(MuestraNecropsia.objects.filter(necropsia=self.necropsia, descripcion='Muestra necropsia').exists())

    def test_filtro_por_organo(self):
        make_citologia(self.tecnico, 1)  # organo='Pulmón'
        Citologia.objects.create(
            citologia='CIT999', tipo_citologia='Improntas', fecha='2024-01-01',
            descripcion='D', caracteristicas='C', qr_citologia='QRCFILTRO',
            organo='Riñón',
        )
        r = self.client.get(reverse('citologias') + '?organo=Riñón')
        self.assertEqual(len(r.context['citologias']), 1)
        self.assertEqual(r.context['citologias'][0].organo, 'Riñón')

    def test_detalle_citologia_por_param(self):
        c = make_citologia(self.tecnico, 1)
        r = self.client.get(reverse('citologias') + f'?citologia={c.pk}')
        self.assertEqual(r.context['selected'].pk, c.pk)

    def test_todos_los_tipos_validos_crean_citologia(self):
        tipos = ['Improntas', 'Punción-aspiración', 'Esputo', 'Muestra endometrial']
        for i, tipo in enumerate(tipos):
            datos = {**self.DATOS_VALIDOS, 'citologia': f'T{i}', 'tipo_citologia': tipo}
            self.client.post(reverse('citologia_create'), datos)
        self.assertEqual(Citologia.objects.count(), len(tipos))


# ── 6. Muestras ───────────────────────────────────────────────────────────────

class MuestraTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.tecnico = make_tecnico(1)
        self.client.force_login(self.tecnico)
        self.cassette = make_cassette(1)

    def test_crear_muestra_asociada_a_cassette(self):
        self.client.post(
            reverse('muestra_create', args=[self.cassette.pk]),
            {
                'descripcion': 'Muestra 1', 'fecha': '2024-06-01',
                'tincion': 'Hematoxilina Eosina (HE)',
            },
        )
        self.assertTrue(
            Muestra.objects.filter(cassette=self.cassette, descripcion='Muestra 1').exists()
        )

    def test_eliminar_muestra(self):
        m = Muestra.objects.create(
            descripcion='M', fecha='2024-01-01', tincion='HE',
            qr_muestra='QRM2', cassette=self.cassette,
        )
        self.client.post(reverse('muestra_delete', args=[m.pk]))
        self.assertFalse(Muestra.objects.filter(pk=m.pk).exists())

    def test_eliminar_cassette_elimina_muestras_en_cascada(self):
        Muestra.objects.create(
            descripcion='M', fecha='2024-01-01', tincion='HE',
            qr_muestra='QRM3', cassette=self.cassette,
        )
        pk = self.cassette.pk
        self.cassette.delete()
        self.assertEqual(Muestra.objects.filter(cassette_id=pk).count(), 0)


# ── Helpers adicionales ───────────────────────────────────────────────────────

def make_hematologia(tecnico=None, n=1):
    return Hematologia.objects.create(
        hematologia=f'HEM{n:03d}',
        fecha='2024-01-01',
        descripcion='Paciente prueba',
        caracteristicas='Caract',
        qr_hematologia=f'QRH{n}',
        organo='Pulmón',
        tecnico=tecnico,
    )


def make_muestra(cassette, n=1):
    return Muestra.objects.create(
        descripcion=f'Muestra {n}',
        fecha='2024-01-01',
        tincion='Hematoxilina Eosina (HE)',
        qr_muestra=f'QRM{n}',
        cassette=cassette,
    )


def make_muestra_citologia(citologia, n=1):
    return MuestraCitologia.objects.create(
        descripcion=f'Muestra CIT {n}',
        fecha='2024-01-01',
        tincion='Papanicolau',
        qr_muestra=f'QRMC{n}',
        citologia=citologia,
    )


def make_muestra_hematologia(hematologia, n=1):
    return MuestraHematologia.objects.create(
        descripcion=f'Muestra HEM {n}',
        fecha='2024-01-01',
        tincion='Wright',
        qr_muestra=f'QRMH{n}',
        hematologia=hematologia,
    )


def fake_image(name='test.jpg'):
    """Imagen JPEG mínima válida para pruebas de subida."""
    return SimpleUploadedFile(
        name,
        b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00'
        b'\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t'
        b'\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a'
        b'\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\x1e!'
        b'\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00'
        b'\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00'
        b'\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b'
        b'\xff\xda\x00\x08\x01\x01\x00\x00?\x00\xfb\xff\xd9',
        content_type='image/jpeg',
    )


# ── 7. Cassette: QR, técnico, filtros adicionales ─────────────────────────────

class CassetteExtrasTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.tecnico = make_tecnico(1)
        self.client.force_login(self.tecnico)

    def test_crear_cassette_genera_qr_automaticamente(self):
        self.client.post(reverse('cassette_create'), {
            'cassette': 'C100', 'fecha': '2024-06-01',
            'descripcion': 'D', 'caracteristicas': 'C', 'organo': 'Pulmón',
        })
        c = Cassette.objects.filter(cassette='C100').first()
        self.assertIsNotNone(c)
        self.assertTrue(c.qr_casette.startswith('--c--'))

    def test_crear_cassette_asocia_tecnico_actual(self):
        self.client.post(reverse('cassette_create'), {
            'cassette': 'C101', 'fecha': '2024-06-01',
            'descripcion': 'D', 'caracteristicas': 'C', 'organo': 'Riñón',
        })
        c = Cassette.objects.get(cassette='C101')
        self.assertEqual(c.tecnico, self.tecnico)

    def test_crear_cassette_redirige_al_detalle(self):
        r = self.client.post(reverse('cassette_create'), {
            'cassette': 'C102', 'fecha': '2024-06-01',
            'descripcion': 'D', 'caracteristicas': 'C', 'organo': 'Hígado',
        })
        c = Cassette.objects.get(cassette='C102')
        self.assertRedirects(
            r, reverse('cassettes') + f'?cassette={c.pk}',
            fetch_redirect_response=False,
        )

    def test_crear_cassette_sin_descripcion_no_crea(self):
        self.client.post(reverse('cassette_create'), {
            'cassette': 'C103', 'fecha': '2024-06-01',
            'descripcion': '', 'caracteristicas': 'C', 'organo': 'Pulmón',
        })
        self.assertFalse(Cassette.objects.filter(cassette='C103').exists())

    def test_crear_cassette_sin_sesion_redirige_login(self):
        self.client.logout()
        r = self.client.post(reverse('cassette_create'), {
            'cassette': 'C104', 'fecha': '2024-06-01',
            'descripcion': 'D', 'caracteristicas': 'C', 'organo': 'Pulmón',
        })
        self.assertEqual(r.status_code, 302)
        self.assertIn('/login/', r['Location'])
        self.assertFalse(Cassette.objects.filter(cassette='C104').exists())

    def test_filtro_por_numero_cassette(self):
        make_cassette(1)   # 'C001'
        make_cassette(2)   # 'C002'
        r = self.client.get(reverse('cassettes') + '?numero=C001')
        self.assertEqual(len(r.context['cassettes']), 1)
        self.assertEqual(r.context['cassettes'][0].cassette, 'C001')

    def test_filtro_por_rango_fechas(self):
        Cassette.objects.create(
            cassette='CDATE1', fecha='2023-01-10', descripcion='D',
            caracteristicas='C', qr_casette='QRDATE1', organo='Pulmón',
        )
        Cassette.objects.create(
            cassette='CDATE2', fecha='2024-06-15', descripcion='D',
            caracteristicas='C', qr_casette='QRDATE2', organo='Pulmón',
        )
        r = self.client.get(reverse('cassettes') + '?inicio=2024-01-01&fin=2024-12-31')
        self.assertEqual(len(r.context['cassettes']), 1)
        self.assertEqual(r.context['cassettes'][0].cassette, 'CDATE2')

    def test_get_en_cassette_create_rechazado(self):
        r = self.client.get(reverse('cassette_create'))
        self.assertEqual(r.status_code, 405)

    def test_get_en_cassette_delete_rechazado(self):
        c = make_cassette(1)
        r = self.client.get(reverse('cassette_delete', args=[c.pk]))
        self.assertEqual(r.status_code, 405)

    def test_eliminar_cassette_inexistente_devuelve_404(self):
        r = self.client.post(reverse('cassette_delete', args=[99999]))
        self.assertEqual(r.status_code, 404)

    def test_editar_cassette_redirige_al_detalle(self):
        c = make_cassette(1)
        r = self.client.post(reverse('cassette_update', args=[c.pk]), {
            'cassette': c.cassette, 'fecha': c.fecha,
            'descripcion': 'Desc editada', 'caracteristicas': c.caracteristicas,
            'organo': c.organo,
        })
        self.assertRedirects(
            r, reverse('cassettes') + f'?cassette={c.pk}',
            fetch_redirect_response=False,
        )


# ── 8. Muestras de cassette: update e imagen ──────────────────────────────────

class MuestraCassetteExtrasTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.tecnico = make_tecnico(1)
        self.client.force_login(self.tecnico)
        self.cassette = make_cassette(1)
        self.muestra = make_muestra(self.cassette, 1)

    def test_actualizar_muestra(self):
        self.client.post(reverse('muestra_update', args=[self.muestra.pk]), {
            'descripcion': 'Desc modificada', 'fecha': '2024-07-01',
            'tincion': 'Giemsa',
        })
        self.muestra.refresh_from_db()
        self.assertEqual(self.muestra.descripcion, 'Desc modificada')

    def test_crear_muestra_genera_qr(self):
        self.client.post(
            reverse('muestra_create', args=[self.cassette.pk]),
            {'descripcion': 'Muestra QR', 'fecha': '2024-06-01',
             'tincion': 'Hematoxilina Eosina (HE)'},
        )
        m = Muestra.objects.filter(descripcion='Muestra QR').first()
        self.assertIsNotNone(m)
        self.assertTrue(m.qr_muestra.startswith('--m--'))

    def test_subir_imagen_a_muestra(self):
        img = fake_image()
        self.client.post(
            reverse('imagen_upload', args=[self.muestra.pk]),
            {'imagen': img},
        )
        self.assertEqual(Imagen.objects.filter(muestra=self.muestra).count(), 1)

    def test_subir_imagen_sin_fichero_no_crea(self):
        self.client.post(reverse('imagen_upload', args=[self.muestra.pk]), {})
        self.assertEqual(Imagen.objects.filter(muestra=self.muestra).count(), 0)

    def test_eliminar_imagen(self):
        imagen = Imagen.objects.create(muestra=self.muestra, imagen=fake_image('muestra.jpg').read())
        self.client.post(reverse('imagen_delete', args=[imagen.pk]))
        self.assertFalse(Imagen.objects.filter(pk=imagen.pk).exists())

    def test_eliminar_imagen_redirige_a_cassette(self):
        imagen = Imagen.objects.create(muestra=self.muestra, imagen=fake_image('muestra2.jpg').read())
        r = self.client.post(reverse('imagen_delete', args=[imagen.pk]))
        expected = reverse('cassettes') + f'?cassette={self.cassette.pk}&muestra={self.muestra.pk}'
        self.assertRedirects(r, expected, fetch_redirect_response=False)

    def test_eliminar_imagen_inexistente_devuelve_404(self):
        r = self.client.post(reverse('imagen_delete', args=[99999]))
        self.assertEqual(r.status_code, 404)


# ── 9. Muestras de citología ──────────────────────────────────────────────────

class MuestraCitologiaTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.tecnico = make_tecnico(1)
        self.client.force_login(self.tecnico)
        self.citologia = make_citologia(self.tecnico, 1)

    def test_crear_muestra_citologia(self):
        self.client.post(
            reverse('muestra_citologia_create', args=[self.citologia.pk]),
            {'descripcion': 'Muestra cit 1', 'fecha': '2024-06-01',
             'tincion': 'Papanicolau'},
        )
        self.assertTrue(
            MuestraCitologia.objects.filter(
                citologia=self.citologia, descripcion='Muestra cit 1'
            ).exists()
        )

    def test_crear_muestra_citologia_genera_qr(self):
        self.client.post(
            reverse('muestra_citologia_create', args=[self.citologia.pk]),
            {'descripcion': 'MC QR', 'fecha': '2024-06-01', 'tincion': 'Papanicolau'},
        )
        m = MuestraCitologia.objects.filter(descripcion='MC QR').first()
        self.assertIsNotNone(m)
        self.assertTrue(m.qr_muestra.startswith('--mc--'))

    def test_actualizar_muestra_citologia(self):
        m = make_muestra_citologia(self.citologia, 1)
        self.client.post(reverse('muestra_citologia_update', args=[m.pk]), {
            'descripcion': 'Desc actualizada', 'fecha': m.fecha,
            'tincion': 'Giemsa',
        })
        m.refresh_from_db()
        self.assertEqual(m.descripcion, 'Desc actualizada')

    def test_eliminar_muestra_citologia(self):
        m = make_muestra_citologia(self.citologia, 1)
        self.client.post(reverse('muestra_citologia_delete', args=[m.pk]))
        self.assertFalse(MuestraCitologia.objects.filter(pk=m.pk).exists())

    def test_eliminar_citologia_elimina_muestras_en_cascada(self):
        make_muestra_citologia(self.citologia, 1)
        pk = self.citologia.pk
        self.citologia.delete()
        self.assertEqual(MuestraCitologia.objects.filter(citologia_id=pk).count(), 0)

    def test_subir_imagen_citologia(self):
        m = make_muestra_citologia(self.citologia, 1)
        img = fake_image()
        self.client.post(reverse('imagen_citologia_upload', args=[m.pk]), {'imagen': img})
        self.assertEqual(ImagenCitologia.objects.filter(muestra=m).count(), 1)

    def test_subir_imagen_citologia_sin_fichero_no_crea(self):
        m = make_muestra_citologia(self.citologia, 1)
        self.client.post(reverse('imagen_citologia_upload', args=[m.pk]), {})
        self.assertEqual(ImagenCitologia.objects.filter(muestra=m).count(), 0)

    def test_eliminar_imagen_citologia(self):
        m = make_muestra_citologia(self.citologia, 1)
        imagen = ImagenCitologia.objects.create(muestra=m, imagen=fake_image('citologia.jpg').read())
        self.client.post(reverse('imagen_citologia_delete', args=[imagen.pk]))
        self.assertFalse(ImagenCitologia.objects.filter(pk=imagen.pk).exists())

    def test_eliminar_imagen_citologia_inexistente_devuelve_404(self):
        r = self.client.post(reverse('imagen_citologia_delete', args=[99999]))
        self.assertEqual(r.status_code, 404)


# ── 10. Hematología CRUD ──────────────────────────────────────────────────────

class HematologiaCRUDTests(TestCase):

    DATOS_VALIDOS = {
        'hematologia': 'HEM001', 'fecha': '2024-06-01',
        'descripcion': 'Paciente A', 'caracteristicas': 'Caract',
        'organo': 'Pulmón',
    }

    def setUp(self):
        self.client = Client()
        self.tecnico = make_tecnico(1)
        self.client.force_login(self.tecnico)

    def test_listar_hematologias_devuelve_200(self):
        r = self.client.get(reverse('hematologias'))
        self.assertEqual(r.status_code, 200)

    def test_listar_sin_filtros_devuelve_10(self):
        for i in range(15):
            make_hematologia(self.tecnico, i + 1)
        r = self.client.get(reverse('hematologias'))
        self.assertEqual(len(r.context['hematologias']), 10)

    def test_crear_hematologia(self):
        self.client.post(reverse('hematologia_create'), self.DATOS_VALIDOS)
        self.assertTrue(Hematologia.objects.filter(hematologia='HEM001').exists())

    def test_crear_hematologia_genera_qr(self):
        self.client.post(reverse('hematologia_create'), self.DATOS_VALIDOS)
        h = Hematologia.objects.get(hematologia='HEM001')
        self.assertTrue(h.qr_hematologia.startswith('--h--'))

    def test_crear_hematologia_asocia_tecnico(self):
        self.client.post(reverse('hematologia_create'), self.DATOS_VALIDOS)
        h = Hematologia.objects.get(hematologia='HEM001')
        self.assertEqual(h.tecnico, self.tecnico)

    def test_crear_hematologia_redirige_al_detalle(self):
        r = self.client.post(reverse('hematologia_create'), self.DATOS_VALIDOS)
        h = Hematologia.objects.get(hematologia='HEM001')
        self.assertRedirects(
            r, reverse('hematologias') + f'?hematologia={h.pk}',
            fetch_redirect_response=False,
        )

    def test_crear_hematologia_sin_descripcion_no_crea(self):
        datos = {**self.DATOS_VALIDOS, 'descripcion': ''}
        self.client.post(reverse('hematologia_create'), datos)
        self.assertFalse(Hematologia.objects.filter(hematologia='HEM001').exists())

    def test_crear_hematologia_sin_sesion_redirige_login(self):
        self.client.logout()
        r = self.client.post(reverse('hematologia_create'), self.DATOS_VALIDOS)
        self.assertEqual(r.status_code, 302)
        self.assertIn('/login/', r['Location'])
        self.assertFalse(Hematologia.objects.filter(hematologia='HEM001').exists())

    def test_editar_hematologia(self):
        h = make_hematologia(self.tecnico, 1)
        self.client.post(reverse('hematologia_update', args=[h.pk]), {
            'hematologia': h.hematologia, 'fecha': h.fecha,
            'descripcion': 'Paciente editado', 'caracteristicas': h.caracteristicas,
            'organo': h.organo,
        })
        h.refresh_from_db()
        self.assertEqual(h.descripcion, 'Paciente editado')

    def test_editar_hematologia_redirige_al_detalle(self):
        h = make_hematologia(self.tecnico, 1)
        r = self.client.post(reverse('hematologia_update', args=[h.pk]), {
            'hematologia': h.hematologia, 'fecha': h.fecha,
            'descripcion': 'D', 'caracteristicas': h.caracteristicas,
            'organo': h.organo,
        })
        self.assertRedirects(
            r, reverse('hematologias') + f'?hematologia={h.pk}',
            fetch_redirect_response=False,
        )

    def test_eliminar_hematologia(self):
        h = make_hematologia(self.tecnico, 1)
        self.client.post(reverse('hematologia_delete', args=[h.pk]))
        self.assertFalse(Hematologia.objects.filter(pk=h.pk).exists())

    def test_eliminar_hematologia_inexistente_devuelve_404(self):
        r = self.client.post(reverse('hematologia_delete', args=[99999]))
        self.assertEqual(r.status_code, 404)

    def test_detalle_hematologia_por_param(self):
        h = make_hematologia(self.tecnico, 1)
        r = self.client.get(reverse('hematologias') + f'?hematologia={h.pk}')
        self.assertEqual(r.context['selected'].pk, h.pk)

    def test_filtro_por_numero_hematologia(self):
        make_hematologia(self.tecnico, 1)   # 'HEM001'
        make_hematologia(self.tecnico, 2)   # 'HEM002'
        r = self.client.get(reverse('hematologias') + '?numero=HEM001')
        self.assertEqual(len(r.context['hematologias']), 1)

    def test_filtro_por_organo_hematologia(self):
        make_hematologia(self.tecnico, 1)  # organo='Sangre'
        Hematologia.objects.create(
            hematologia='HEM999', fecha='2024-01-01', descripcion='D',
            caracteristicas='C', qr_hematologia='QRHFILTRO', organo='Médula Ósea',
        )
        r = self.client.get(reverse('hematologias') + '?organo=Médula Ósea')
        self.assertEqual(len(r.context['hematologias']), 1)
        self.assertEqual(r.context['hematologias'][0].organo, 'Médula Ósea')

    def test_get_en_hematologia_create_rechazado(self):
        r = self.client.get(reverse('hematologia_create'))
        self.assertEqual(r.status_code, 405)

    def test_get_en_hematologia_delete_rechazado(self):
        h = make_hematologia(self.tecnico, 1)
        r = self.client.get(reverse('hematologia_delete', args=[h.pk]))
        self.assertEqual(r.status_code, 405)


# ── 11. Muestras de hematología ───────────────────────────────────────────────

class MuestraHematologiaTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.tecnico = make_tecnico(1)
        self.client.force_login(self.tecnico)
        self.hematologia = make_hematologia(self.tecnico, 1)

    def test_crear_muestra_hematologia(self):
        self.client.post(
            reverse('muestra_hematologia_create', args=[self.hematologia.pk]),
            {'descripcion': 'MH 1', 'fecha': '2024-06-01', 'tincion': 'Wright'},
        )
        self.assertTrue(
            MuestraHematologia.objects.filter(
                hematologia=self.hematologia, descripcion='MH 1'
            ).exists()
        )

    def test_crear_muestra_hematologia_genera_qr(self):
        self.client.post(
            reverse('muestra_hematologia_create', args=[self.hematologia.pk]),
            {'descripcion': 'MH QR', 'fecha': '2024-06-01', 'tincion': 'Wright'},
        )
        m = MuestraHematologia.objects.filter(descripcion='MH QR').first()
        self.assertIsNotNone(m)
        self.assertTrue(m.qr_muestra.startswith('--mh--'))

    def test_actualizar_muestra_hematologia(self):
        m = make_muestra_hematologia(self.hematologia, 1)
        self.client.post(reverse('muestra_hematologia_update', args=[m.pk]), {
            'descripcion': 'MH actualizada', 'fecha': m.fecha, 'tincion': 'Giemsa',
        })
        m.refresh_from_db()
        self.assertEqual(m.descripcion, 'MH actualizada')

    def test_eliminar_muestra_hematologia(self):
        m = make_muestra_hematologia(self.hematologia, 1)
        self.client.post(reverse('muestra_hematologia_delete', args=[m.pk]))
        self.assertFalse(MuestraHematologia.objects.filter(pk=m.pk).exists())

    def test_eliminar_hematologia_elimina_muestras_en_cascada(self):
        make_muestra_hematologia(self.hematologia, 1)
        pk = self.hematologia.pk
        self.hematologia.delete()
        self.assertEqual(MuestraHematologia.objects.filter(hematologia_id=pk).count(), 0)

    def test_subir_imagen_hematologia(self):
        m = make_muestra_hematologia(self.hematologia, 1)
        img = fake_image()
        self.client.post(reverse('imagen_hematologia_upload', args=[m.pk]), {'imagen': img})
        self.assertEqual(ImagenHematologia.objects.filter(muestra=m).count(), 1)

    def test_eliminar_imagen_hematologia(self):
        m = make_muestra_hematologia(self.hematologia, 1)
        imagen = ImagenHematologia.objects.create(muestra=m, imagen=fake_image('hematologia.jpg').read())
        self.client.post(reverse('imagen_hematologia_delete', args=[imagen.pk]))
        self.assertFalse(ImagenHematologia.objects.filter(pk=imagen.pk).exists())

    def test_eliminar_imagen_hematologia_redirige(self):
        m = make_muestra_hematologia(self.hematologia, 1)
        imagen = ImagenHematologia.objects.create(muestra=m, imagen=fake_image('hematologia2.jpg').read())
        r = self.client.post(reverse('imagen_hematologia_delete', args=[imagen.pk]))
        expected = reverse('hematologias') + f'?hematologia={self.hematologia.pk}'
        self.assertRedirects(r, expected, fetch_redirect_response=False)


# ── 12. Informes de cassette ──────────────────────────────────────────────────

class InformeCassetteTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.tecnico = make_tecnico(1)
        self.client.force_login(self.tecnico)
        self.cassette = make_cassette(1)

    def test_crear_informe_cassette(self):
        self.client.post(reverse('cassette_informe', args=[self.cassette.pk]), {
            'informe_descripcion': 'Resultado positivo',
            'informe_fecha': '2024-06-01',
            'informe_tincion': 'Hematoxilina Eosina (HE)',
            'informe_observaciones': 'Sin anomalías',
        })
        self.assertTrue(informe_qs_for(self.cassette).exists())

    def test_crear_informe_cassette_guarda_descripcion(self):
        self.client.post(reverse('cassette_informe', args=[self.cassette.pk]), {
            'informe_descripcion': 'Desc informe',
            'informe_fecha': '2024-06-01',
            'informe_tincion': '',
            'informe_observaciones': '',
        })
        informe = informe_qs_for(self.cassette).first()
        self.assertIsNotNone(informe)
        self.assertEqual(informe.descripcion, 'Desc informe')

    def test_actualizar_informe_existente_no_duplica(self):
        informe = InformeResultado.objects.create(
            content_type=ContentType.objects.get_for_model(Cassette),
            object_id=self.cassette.pk,
            descripcion='Original',
            fecha='2024-01-01',
        )
        self.client.post(reverse('cassette_informe', args=[self.cassette.pk]), {
            'informe_id': informe.pk,
            'informe_descripcion': 'Actualizado',
            'informe_fecha': '2024-06-01',
            'informe_tincion': '',
            'informe_observaciones': '',
        })
        self.assertEqual(informe_qs_for(self.cassette).count(), 1)
        informe.refresh_from_db()
        self.assertEqual(informe.descripcion, 'Actualizado')

    def test_eliminar_informe_cassette(self):
        informe = InformeResultado.objects.create(
            content_type=ContentType.objects.get_for_model(Cassette),
            object_id=self.cassette.pk,
            descripcion='A eliminar',
            fecha='2024-01-01',
        )
        self.client.post(
            reverse('cassette_informe_delete', args=[self.cassette.pk, informe.pk])
        )
        self.assertFalse(InformeResultado.objects.filter(pk=informe.pk).exists())

    def test_eliminar_informe_cassette_inexistente_devuelve_404(self):
        r = self.client.post(
            reverse('cassette_informe_delete', args=[self.cassette.pk, 99999])
        )
        self.assertEqual(r.status_code, 404)

    def test_informe_cassette_sin_sesion_redirige_login(self):
        self.client.logout()
        r = self.client.post(reverse('cassette_informe', args=[self.cassette.pk]), {
            'informe_descripcion': 'X', 'informe_fecha': '2024-06-01',
        })
        self.assertEqual(r.status_code, 302)
        self.assertIn('/login/', r['Location'])


# ── 13. Informes de citología ─────────────────────────────────────────────────

class InformeCitologiaTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.tecnico = make_tecnico(1)
        self.client.force_login(self.tecnico)
        self.citologia = make_citologia(self.tecnico, 1)

    def test_crear_informe_citologia(self):
        self.client.post(reverse('citologia_informe', args=[self.citologia.pk]), {
            'informe_descripcion': 'Resultado cit',
            'informe_fecha': '2024-06-01',
            'informe_tincion': 'Papanicolau',
            'informe_observaciones': '',
        })
        self.assertTrue(informe_qs_for(self.citologia).exists())

    def test_eliminar_informe_citologia(self):
        informe = InformeResultado.objects.create(
            content_type=ContentType.objects.get_for_model(Citologia),
            object_id=self.citologia.pk,
            descripcion='A borrar',
            fecha='2024-01-01',
        )
        self.client.post(
            reverse('citologia_informe_delete', args=[self.citologia.pk, informe.pk])
        )
        self.assertFalse(InformeResultado.objects.filter(pk=informe.pk).exists())

    def test_informe_citologia_actualiza_existente(self):
        informe = InformeResultado.objects.create(
            content_type=ContentType.objects.get_for_model(Citologia),
            object_id=self.citologia.pk,
            descripcion='Original',
            fecha='2024-01-01',
        )
        self.client.post(reverse('citologia_informe', args=[self.citologia.pk]), {
            'informe_id': informe.pk,
            'informe_descripcion': 'Actualizado cit',
            'informe_fecha': '2024-06-01',
            'informe_tincion': '',
            'informe_observaciones': '',
        })
        self.assertEqual(informe_qs_for(self.citologia).count(), 1)
        informe.refresh_from_db()
        self.assertEqual(informe.descripcion, 'Actualizado cit')


# ── 14. Gestión de usuarios ───────────────────────────────────────────────────

class UsuarioGestionTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.staff = make_tecnico(1, staff=True)
        self.normal = make_tecnico(2)
        self.client.force_login(self.staff)

    def test_listar_usuarios_devuelve_200(self):
        r = self.client.get(reverse('usuarios'))
        self.assertEqual(r.status_code, 200)

    def test_staff_puede_actualizar_tecnico(self):
        self.client.post(reverse('usuario_update', args=[self.normal.pk]), {
            'nombre': 'Modificado', 'apellidos': self.normal.apellidos,
            'email': self.normal.email, 'username': self.normal.username or '',
        })
        self.normal.refresh_from_db()
        self.assertEqual(self.normal.nombre, 'Modificado')

    def test_no_staff_no_puede_actualizar_tecnico(self):
        self.client.force_login(self.normal)
        self.client.post(reverse('usuario_update', args=[self.staff.pk]), {
            'nombre': 'Hackeado', 'apellidos': self.staff.apellidos,
            'email': self.staff.email,
        })
        self.staff.refresh_from_db()
        self.assertNotEqual(self.staff.nombre, 'Hackeado')

    def test_actualizar_password_queda_hasheada(self):
        self.client.post(reverse('usuario_update', args=[self.normal.pk]), {
            'nombre': self.normal.nombre, 'apellidos': self.normal.apellidos,
            'email': self.normal.email, 'username': self.normal.username or '',
            'password': 'nuevaclave99',
        })
        self.normal.refresh_from_db()
        # La contraseña hasheada no coincide directamente con el texto plano
        self.assertNotEqual(self.normal.password, 'nuevaclave99')
        # Pero sí es correcta a través del hasher
        from django.contrib.auth.hashers import check_password
        self.assertTrue(check_password('nuevaclave99', self.normal.password))

    def test_staff_crea_tecnico_con_password_hasheada(self):
        self.client.post(reverse('usuario_create'), {
            'nombre': 'Nuevo', 'apellidos': 'Tecnico',
            'email': 'nuevo2@test.com', 'username': 'nuevotecnico2',
            'password': 'segura123',
        })
        t = Tecnico.objects.get(email='nuevo2@test.com')
        from django.contrib.auth.hashers import check_password
        self.assertTrue(check_password('segura123', t.password))

    def test_usuario_delete_redirige_a_lista(self):
        victima = make_tecnico(3)
        r = self.client.post(reverse('usuario_delete', args=[victima.pk]))
        self.assertRedirects(r, reverse('usuarios'), fetch_redirect_response=False)

    def test_get_en_usuario_delete_rechazado(self):
        r = self.client.get(reverse('usuario_delete', args=[self.normal.pk]))
        self.assertEqual(r.status_code, 405)


# ── 15. Resolvedor QR ─────────────────────────────────────────────────────────

class QRResolverTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.tecnico = make_tecnico(1)
        self.client.force_login(self.tecnico)

    def test_sin_codigo_redirige_a_cassettes(self):
        r = self.client.get(reverse('qr_resolver'))
        self.assertRedirects(r, reverse('cassettes'), fetch_redirect_response=False)

    def test_codigo_cassette_redirige_al_cassette(self):
        c = make_cassette(1)
        r = self.client.get(reverse('qr_resolver') + f'?code={c.qr_casette}')
        self.assertRedirects(
            r, reverse('cassettes') + f'?cassette={c.pk}',
            fetch_redirect_response=False,
        )

    def test_codigo_citologia_redirige_a_citologia(self):
        cit = make_citologia(self.tecnico, 1)
        r = self.client.get(reverse('qr_resolver') + f'?code={cit.qr_citologia}')
        self.assertRedirects(
            r, reverse('citologias') + f'?citologia={cit.pk}',
            fetch_redirect_response=False,
        )

    def test_codigo_muestra_cassette_redirige(self):
        c = make_cassette(1)
        m = make_muestra(c, 1)
        r = self.client.get(reverse('qr_resolver') + f'?code={m.qr_muestra}')
        self.assertRedirects(
            r, reverse('cassettes') + f'?cassette={c.pk}&muestra={m.pk}',
            fetch_redirect_response=False,
        )

    def test_codigo_muestra_citologia_redirige(self):
        cit = make_citologia(self.tecnico, 1)
        m = make_muestra_citologia(cit, 1)
        r = self.client.get(reverse('qr_resolver') + f'?code={m.qr_muestra}')
        self.assertRedirects(
            r, reverse('citologias') + f'?citologia={cit.pk}&muestra={m.pk}',
            fetch_redirect_response=False,
        )

    def test_codigo_hematologia_redirige(self):
        h = make_hematologia(self.tecnico, 1)
        r = self.client.get(reverse('qr_resolver') + f'?code={h.qr_hematologia}')
        self.assertRedirects(
            r, reverse('hematologias') + f'?hematologia={h.pk}',
            fetch_redirect_response=False,
        )

    def test_codigo_muestra_hematologia_redirige(self):
        h = make_hematologia(self.tecnico, 1)
        m = make_muestra_hematologia(h, 1)
        r = self.client.get(reverse('qr_resolver') + f'?code={m.qr_muestra}')
        self.assertRedirects(
            r, reverse('hematologias') + f'?hematologia={h.pk}&muestra={m.pk}',
            fetch_redirect_response=False,
        )

    def test_codigo_desconocido_redirige_a_cassettes(self):
        r = self.client.get(reverse('qr_resolver') + '?code=NOEXISTE123')
        self.assertRedirects(r, reverse('cassettes'), fetch_redirect_response=False)

    def test_url_completa_como_codigo_se_extrae_correctamente(self):
        """Si se escanea la URL completa en lugar del código, debe funcionar igual."""
        c = make_cassette(1)
        url_completa = f'http://testserver{reverse("qr_resolver")}?code={c.qr_casette}'
        r = self.client.get(reverse('qr_resolver') + f'?code={url_completa}')
        self.assertRedirects(
            r, reverse('cassettes') + f'?cassette={c.pk}',
            fetch_redirect_response=False,
        )

    def test_qr_resolver_sin_sesion_redirige_login(self):
        self.client.logout()
        r = self.client.get(reverse('qr_resolver'))
        self.assertEqual(r.status_code, 302)
        self.assertIn('/login/', r['Location'])


# ── 16. Métodos HTTP incorrectos ──────────────────────────────────────────────

class MetodosHTTPTests(TestCase):
    """Verifica que las vistas de acción solo aceptan POST."""

    def setUp(self):
        self.client = Client()
        self.tecnico = make_tecnico(1)
        self.client.force_login(self.tecnico)
        self.cassette = make_cassette(1)
        self.citologia = make_citologia(self.tecnico, 1)
        self.hematologia = make_hematologia(self.tecnico, 1)

    def _post_only(self, url_name, *args):
        r = self.client.get(reverse(url_name, args=args))
        self.assertEqual(r.status_code, 405, msg=f'{url_name} debe rechazar GET')

    def test_cassette_create_rechaza_get(self):
        self._post_only('cassette_create')

    def test_cassette_update_rechaza_get(self):
        self._post_only('cassette_update', self.cassette.pk)

    def test_cassette_delete_rechaza_get(self):
        self._post_only('cassette_delete', self.cassette.pk)

    def test_citologia_create_rechaza_get(self):
        self._post_only('citologia_create')

    def test_citologia_update_rechaza_get(self):
        self._post_only('citologia_update', self.citologia.pk)

    def test_citologia_delete_rechaza_get(self):
        self._post_only('citologia_delete', self.citologia.pk)

    def test_hematologia_create_rechaza_get(self):
        self._post_only('hematologia_create')

    def test_hematologia_update_rechaza_get(self):
        self._post_only('hematologia_update', self.hematologia.pk)

    def test_hematologia_delete_rechaza_get(self):
        self._post_only('hematologia_delete', self.hematologia.pk)

    def test_muestra_create_rechaza_get(self):
        self._post_only('muestra_create', self.cassette.pk)

    def test_muestra_delete_rechaza_get(self):
        m = make_muestra(self.cassette, 1)
        self._post_only('muestra_delete', m.pk)

    def test_logout_rechaza_get(self):
        self._post_only('logout')
