from django.contrib.auth.hashers import make_password
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from .models import Tecnico, Cassette, Muestra, Imagen, Hematologia, MuestraHematologia, ImagenHematologia


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
