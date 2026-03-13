from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.contrib.contenttypes.models import ContentType
from django.db import connection
from pathlib import Path
from rest_framework import status
from rest_framework.test import APIClient

from .models import Tecnico, Cassette, Muestra, Imagen, Hematologia, MuestraHematologia, ImagenHematologia
from .models import Citologia, MuestraCitologia, ImagenCitologia, Tubo, MuestraTubo, ImagenTubo
from .models import Necropsia, MuestraNecropsia, ImagenNecropsia, Microbiologia, MuestraMicrobiologia, ImagenMicrobiologia, InformeResultado


def make_tecnico(password='pass1234', email='api@test.com'):
	tecnico = Tecnico(
		nombre='Api',
		apellidos='Tester',
		email=email,
		is_active=True,
	)
	tecnico.password = make_password(password)
	tecnico.save()
	return tecnico


def make_cassette(qr='QRCASS01'):
	return Cassette.objects.create(
		cassette='C001',
		fecha='2024-01-01',
		descripcion='Descripcion',
		caracteristicas='Caracteristicas',
		qr_casette=qr,
		organo='Pulmón',
	)


class ApiPermissionTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.tecnico = make_tecnico(email='perm@test.com')

	def test_rest_framework_uses_only_session_authentication(self):
		auth_classes = settings.REST_FRAMEWORK.get('DEFAULT_AUTHENTICATION_CLASSES', [])
		self.assertIn('rest_framework.authentication.SessionAuthentication', auth_classes)
		self.assertNotIn('rest_framework.authentication.BasicAuthentication', auth_classes)

	def test_unauthenticated_api_returns_consistent_error_payload(self):
		response = self.client.get('/api/tubos/')
		self.assertIn(response.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))
		self.assertIn('error', response.data)

	def test_cassettes_requires_authentication(self):
		response = self.client.get('/api/cassettes/')
		self.assertIn(response.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

	def test_cassettes_allows_authenticated_user(self):
		self.client.force_authenticate(user=self.tecnico)
		response = self.client.get('/api/cassettes/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_sensitive_modules_require_authentication(self):
		endpoints = [
			'/api/tubos/',
			'/api/hematologia/',
			'/api/microbiologias/',
			'/api/informesresultado/',
		]
		for endpoint in endpoints:
			with self.subTest(endpoint=endpoint):
				response = self.client.get(endpoint)
				self.assertIn(response.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

	def test_sensitive_modules_allow_authenticated_user(self):
		self.client.force_authenticate(user=self.tecnico)
		endpoints = [
			'/api/tubos/',
			'/api/hematologia/',
			'/api/microbiologias/',
			'/api/informesresultado/',
		]
		for endpoint in endpoints:
			with self.subTest(endpoint=endpoint):
				response = self.client.get(endpoint)
				self.assertEqual(response.status_code, status.HTTP_200_OK)


class ApiLoginTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.tecnico = make_tecnico(password='clave123', email='login@test.com')

	def test_login_action_allows_anonymous_and_returns_user(self):
		response = self.client.post('/api/tecnicos/login/', {
			'tecnico_id': self.tecnico.pk,
			'password': 'clave123',
		}, format='json')

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['id_tecnico'], self.tecnico.pk)

	def test_login_rejects_invalid_password(self):
		response = self.client.post('/api/tecnicos/login/', {
			'tecnico_id': self.tecnico.pk,
			'password': 'incorrecta',
		}, format='json')

		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ImagenEndpointTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.tecnico = make_tecnico(email='img@test.com')
		self.client.force_authenticate(user=self.tecnico)
		self.client.force_login(self.tecnico)

		cassette = make_cassette(qr='QRCASS02')
		self.muestra = Muestra.objects.create(
			descripcion='Muestra 1',
			fecha='2024-01-01',
			observaciones='Obs',
			tincion='Gram',
			qr_muestra='QRM001',
			cassette=cassette,
		)

		citologia = Citologia.objects.create(
			citologia='CITO-API',
			tipo_citologia='Tipo',
			fecha='2024-01-01',
			descripcion='Desc',
			caracteristicas='Caract',
			qr_citologia='QRCITO-API',
			organo='Pulmón',
		)
		self.muestra_citologia = MuestraCitologia.objects.create(
			descripcion='Sub C',
			fecha='2024-01-01',
			observaciones='Obs',
			tincion='HE',
			qr_muestra='QRMC-API',
			citologia=citologia,
		)

		self.necropsia = Necropsia.objects.create(
			necropsia='N-API',
			tipo_necropsia='Clinica',
			fecha='2024-01-01',
			descripcion='Desc',
			caracteristicas='Caract',
			qr_necropsia='QRN-API',
			organo='Pulmón',
		)
		self.muestra_necropsia = MuestraNecropsia.objects.create(
			descripcion='Sub N',
			fecha='2024-01-01',
			observaciones='Obs',
			tincion='HE',
			qr_muestra='QRMN-API',
			necropsia=self.necropsia,
		)

		self.tubo = Tubo.objects.create(
			tubo='T-API',
			fecha='2024-01-01',
			descripcion='Desc',
			caracteristicas='Caract',
			qr_tubo='QRT-API',
			organo='Pulmón',
		)
		self.muestra_tubo = MuestraTubo.objects.create(
			descripcion='Sub T',
			fecha='2024-01-01',
			observaciones='Obs',
			tincion='Gram',
			qr_muestra='QRMT-API',
			tubo=self.tubo,
		)

		self.hematologia = Hematologia.objects.create(
			hematologia='H-API',
			fecha='2024-01-01',
			descripcion='Desc',
			caracteristicas='Caract',
			qr_hematologia='QRH-API',
			organo='Pulmón',
		)
		self.muestra_hematologia = MuestraHematologia.objects.create(
			descripcion='Sub H',
			fecha='2024-01-01',
			observaciones='Obs',
			tincion='Gram',
			qr_muestra='QRMH-API',
			hematologia=self.hematologia,
		)

		self.microbiologia = Microbiologia.objects.create(
			microbiologia='MB-API',
			fecha='2024-01-01',
			descripcion='Desc',
			caracteristicas='Caract',
			qr_microbiologia='QRMB-API',
			organo='Pulmón',
		)
		self.muestra_microbiologia = MuestraMicrobiologia.objects.create(
			descripcion='Sub MB',
			fecha='2024-01-01',
			observaciones='Obs',
			tincion='Gram',
			qr_muestra='QRMMB-API',
			microbiologia=self.microbiologia,
		)

	def test_por_muestra_returns_expected_serializer_shape(self):
		Imagen.objects.create(
			muestra=self.muestra,
			imagen=b'fake-image-bytes',
		)

		response = self.client.get(f'/api/imagenes/muestra/{self.muestra.pk}/')

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 1)
		self.assertIn('id_imagen', response.data[0])
		self.assertIn('muestra', response.data[0])
		self.assertIn('imagen_url', response.data[0])
		self.assertIn('/api/archivo/imagen/', response.data[0]['imagen_url'])
		self.assertNotIn('imagen', response.data[0])

	def test_create_imagen_requires_file_and_muestra(self):
		response = self.client.post('/api/imagenes/', {}, format='multipart')
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_create_rejects_disallowed_extension_on_all_sec3_endpoints(self):
		endpoints = [
			('/api/imagenes/', {'muestra': self.muestra.pk}),
			('/api/imagenescitologia/', {'muestra': self.muestra_citologia.pk}),
			('/api/imagenesnecropsia/', {'muestra': self.muestra_necropsia.pk}),
			('/api/imagenestubo/', {'muestra': self.muestra_tubo.pk}),
			('/api/imageneshematologia/', {'muestra': self.muestra_hematologia.pk}),
			('/api/imagenesmicrobiologia/', {'muestra': self.muestra_microbiologia.pk}),
			('/api/muestrastubo/', {
				'tubo': self.tubo.pk,
				'descripcion': 'Nueva muestra tubo',
				'fecha': '2024-01-01',
				'tincion': 'Gram',
			}),
			('/api/muestrashematologia/', {
				'hematologia': self.hematologia.pk,
				'descripcion': 'Nueva muestra hematologia',
				'fecha': '2024-01-01',
				'tincion': 'Gram',
			}),
			('/api/muestrasmicrobiologia/', {
				'microbiologia': self.microbiologia.pk,
				'descripcion': 'Nueva muestra microbiologia',
				'fecha': '2024-01-01',
				'tincion': 'Gram',
			}),
		]

		for endpoint, payload in endpoints:
			with self.subTest(endpoint=endpoint):
				dato = dict(payload)
				dato['imagen'] = SimpleUploadedFile(
					'malware.exe',
					b'MZ\x00\x00\x00\x00',
					content_type='application/octet-stream',
				)
				response = self.client.post(endpoint, dato, format='multipart')
				self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
				self.assertIn('Extension no permitida', str(response.data))

	def test_create_rejects_invalid_magic_bytes(self):
		response = self.client.post(
			'/api/imagenes/',
			{
				'muestra': self.muestra.pk,
				'imagen': SimpleUploadedFile('falsa.png', b'NO_IMAGE_HEADER', content_type='image/png'),
			},
			format='multipart',
		)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertIn('no es una imagen valida', str(response.data).lower())

	def test_create_accepts_valid_png_file(self):
		response = self.client.post(
			'/api/imagenes/',
			{
				'muestra': self.muestra.pk,
				'imagen': SimpleUploadedFile('ok.png', b'\x89PNG\r\n\x1a\n' + b'0' * 32, content_type='image/png'),
			},
			format='multipart',
		)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)

	def test_proxy_serves_real_mime_for_bin_image(self):
		hematologia = Hematologia.objects.create(
			hematologia='H001',
			fecha='2024-01-01',
			descripcion='Desc',
			caracteristicas='Caract',
			qr_hematologia='QRH-API-1',
			organo='Pulmón',
		)
		muestra = MuestraHematologia.objects.create(
			descripcion='Submuestra',
			fecha='2024-01-01',
			observaciones='Obs',
			tincion='Gram',
			qr_muestra='QRMH001',
			hematologia=hematologia,
		)
		webp_bytes = b'RIFF\x00g\x00\x00WEBPVP8 ' + b'0' * 32
		imagen = ImagenHematologia.objects.create(
			muestra=muestra,
			imagen=webp_bytes,
		)

		list_response = self.client.get(f'/api/imageneshematologia/muestra/{muestra.pk}/')
		self.assertEqual(list_response.status_code, status.HTTP_200_OK)
		self.assertIn('imagen_url', list_response.data[0])

		proxy_response = self.client.get(list_response.data[0]['imagen_url'])
		self.assertEqual(proxy_response.status_code, status.HTTP_200_OK)
		self.assertEqual(proxy_response['Content-Type'], 'image/webp')

	def test_proxy_serves_legacy_string_path_image(self):
		self.tecnico.rol = Tecnico.ROL_ANATOMIA
		self.tecnico.save(update_fields=['rol'])

		legacy_rel = 'imagenes/test_legacy_proxy.png'
		legacy_abs = Path(settings.MEDIA_ROOT) / legacy_rel
		legacy_abs.parent.mkdir(parents=True, exist_ok=True)
		legacy_abs.write_bytes(b'\x89PNG\r\n\x1a\n' + b'0' * 32)

		imagen = Imagen.objects.create(muestra=self.muestra, imagen=b'placeholder')
		with connection.cursor() as cursor:
			cursor.execute('UPDATE imagenes SET imagen = %s WHERE id_imagen = %s', [legacy_rel, imagen.pk])
		response = self.client.get(f'/api/archivo/imagen/{imagen.pk}/imagen/')

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response['Content-Type'], 'image/png')


class FileProxyRoleAuthorizationTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.lab = make_tecnico(email='lab-proxy@test.com')
		self.lab.rol = Tecnico.ROL_LABORATORIO
		self.lab.save(update_fields=['rol'])

		self.anatomia = make_tecnico(email='anat-proxy@test.com')
		self.anatomia.rol = Tecnico.ROL_ANATOMIA
		self.anatomia.save(update_fields=['rol'])

		self.profesor = make_tecnico(email='profe-proxy@test.com')
		self.profesor.rol = Tecnico.ROL_PROFESOR
		self.profesor.save(update_fields=['rol'])

		# Recurso de laboratorio: imagen de hematologia
		hematologia = Hematologia.objects.create(
			hematologia='H-PROXY',
			fecha='2024-01-01',
			descripcion='Desc',
			caracteristicas='Caract',
			qr_hematologia='QRH-PROXY',
			organo='Pulmón',
		)
		muestra_h = MuestraHematologia.objects.create(
			descripcion='Submuestra H',
			fecha='2024-01-01',
			observaciones='Obs',
			tincion='Gram',
			qr_muestra='QRMH-PROXY',
			hematologia=hematologia,
		)
		self.imagen_h = ImagenHematologia.objects.create(muestra=muestra_h, imagen=b'\x89PNG\r\n\x1a\n' + b'0' * 20)

		# Recurso de anatomia: imagen de necropsia
		necropsia = Necropsia.objects.create(
			necropsia='N-PROXY',
			tipo_necropsia='Clínica',
			fecha='2024-01-01',
			descripcion='Desc',
			caracteristicas='Caract',
			qr_necropsia='QRN-PROXY',
			organo='Pulmón',
		)
		muestra_n = MuestraNecropsia.objects.create(
			descripcion='Submuestra N',
			fecha='2024-01-01',
			observaciones='Obs',
			tincion='HE',
			qr_muestra='QRMN-PROXY',
			necropsia=necropsia,
		)
		self.imagen_n = ImagenNecropsia.objects.create(muestra=muestra_n, imagen=b'\x89PNG\r\n\x1a\n' + b'1' * 20)

		ct_nec = ContentType.objects.get_for_model(Necropsia)
		self.informe_nec = InformeResultado.objects.create(
			content_type=ct_nec,
			object_id=necropsia.pk,
			descripcion='Informe necropsia',
			fecha='2024-01-02',
			imagen=b'\x89PNG\r\n\x1a\n' + b'2' * 20,
		)

	def test_laboratorio_no_puede_ver_imagen_necropsia(self):
		self.client.force_login(self.lab)
		response = self.client.get(f'/api/archivo/imagennecropsia/{self.imagen_n.pk}/imagen/')
		self.assertEqual(response.status_code, 404)

	def test_anatomia_no_puede_ver_imagen_hematologia(self):
		self.client.force_login(self.anatomia)
		response = self.client.get(f'/api/archivo/imagenhematologia/{self.imagen_h.pk}/imagen/')
		self.assertEqual(response.status_code, 404)

	def test_profesor_puede_ver_ambas_imagenes(self):
		self.client.force_login(self.profesor)
		r_h = self.client.get(f'/api/archivo/imagenhematologia/{self.imagen_h.pk}/imagen/')
		r_n = self.client.get(f'/api/archivo/imagennecropsia/{self.imagen_n.pk}/imagen/')
		self.assertEqual(r_h.status_code, 200)
		self.assertEqual(r_n.status_code, 200)

	def test_laboratorio_no_puede_ver_informe_de_necropsia(self):
		self.client.force_login(self.lab)
		response = self.client.get(f'/api/archivo/informeresultado/{self.informe_nec.pk}/imagen/')
		self.assertEqual(response.status_code, 404)

	def test_anatomia_puede_ver_informe_de_necropsia(self):
		self.client.force_login(self.anatomia)
		response = self.client.get(f'/api/archivo/informeresultado/{self.informe_nec.pk}/imagen/')
		self.assertEqual(response.status_code, 200)


class ApiCustomActionTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.tecnico = make_tecnico(email='acciones@test.com')
		self.client.force_authenticate(user=self.tecnico)
		self.cassette = make_cassette(qr='QRCUSTOM01')

	def test_cassette_por_qr_devuelve_registro_esperado(self):
		response = self.client.get('/api/cassettes/qr/QRCUSTOM01/')

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 1)
		self.assertEqual(response.data[0]['id_casette'], self.cassette.pk)

	def test_rango_fechas_requiere_inicio_y_fin(self):
		response = self.client.get('/api/cassettes/rango_fechas/')

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertEqual(response.data['error'], 'Se requieren inicio y fin')

	def test_informe_resultado_rechaza_base64_invalido(self):
		hematologia = Hematologia.objects.create(
			hematologia='H002',
			fecha='2024-01-01',
			descripcion='Desc',
			caracteristicas='Caract',
			qr_hematologia='QRH-API-2',
			organo='Pulmón',
		)

		response = self.client.post('/api/informesresultado/', {
			'descripcion': 'Informe',
			'fecha': '2024-01-02',
			'tincion': 'Gram',
			'observaciones': 'Obs',
			'hematologia': hematologia.pk,
			'imagen': 'no-es-base64',
		}, format='json')

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertEqual(response.data['error'], 'La imagen no es base64 válido.')

	def test_timezone_usa_madrid_con_tz_activo(self):
		self.assertEqual(settings.TIME_ZONE, 'Europe/Madrid')
		self.assertTrue(settings.USE_TZ)
