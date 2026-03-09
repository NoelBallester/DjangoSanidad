from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.hashers import make_password

from api.models import (
    Tecnico, Cassette, Muestra, Citologia, MuestraCitologia
)


# ── Helpers ───────────────────────────────────────────────────────────────────

def make_tecnico(id_tecnico=None, password='pass1234', staff=False, plain=False):
    """Crea un técnico de prueba. plain=True guarda la contraseña sin hashear."""
    kwargs = dict(
        nombre='Test', apellidos='User',
        email=f'test{id_tecnico or ""}@test.com',
        is_staff=staff, is_active=True,
    )
    t = Tecnico(**kwargs)
    if plain:
        t.password = password          # contraseña en plano (sistema legado)
    else:
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
        tipo_citologia='Exfoliativa',
        fecha='2024-01-01',
        descripcion='Desc',
        caracteristicas='Caract',
        qr_citologia=f'QRC{n}',
        organo='Pulmón',
        tecnico=tecnico,
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

    def test_login_password_plana_legado(self):
        """El sistema soporta contraseñas en plano de la BD antigua."""
        plain_tecnico = make_tecnico(2, password='clave123', plain=True)
        r = self.client.post(self.url, {
            'tecnico_id': plain_tecnico.pk,
            'password': 'clave123',
        })
        self.assertRedirects(r, '/index.html', fetch_redirect_response=False)

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
