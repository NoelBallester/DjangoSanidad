from pathlib import Path

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.contrib.contenttypes.models import ContentType
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import connection
from django.test import TestCase
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.test import APIClient

from .models import (
    Cassette,
    Citologia,
    Hematologia,
    Imagen,
    ImagenCitologia,
    ImagenHematologia,
    ImagenMicrobiologia,
    ImagenNecropsia,
    ImagenTubo,
    InformeResultado,
    Microbiologia,
    Muestra,
    MuestraCitologia,
    MuestraHematologia,
    MuestraMicrobiologia,
    MuestraNecropsia,
    MuestraTubo,
    Necropsia,
    Tecnico,
    Tubo,
)
from .views import _sanitize_filename, _validar_imagen_api


def make_tecnico(password="pass1234", email="api@test.com"):
    tecnico = Tecnico(
        nombre="Api",
        apellidos="Tester",
        email=email,
        is_active=True,
    )
    tecnico.password = make_password(password)
    tecnico.save()
    return tecnico


def make_cassette(qr="QRCASS01"):
    return Cassette.objects.create(
        cassette="C001",
        fecha="2024-01-01",
        descripcion="Descripcion",
        caracteristicas="Caracteristicas",
        qr_casette=qr,
        organo="Pulmón",
    )


class ApiPermissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tecnico = make_tecnico(email="perm@test.com")

    def test_rest_framework_uses_only_session_authentication(self):
        auth_classes = settings.REST_FRAMEWORK.get("DEFAULT_AUTHENTICATION_CLASSES", [])
        self.assertIn(
            "rest_framework.authentication.SessionAuthentication", auth_classes
        )
        self.assertNotIn(
            "rest_framework.authentication.BasicAuthentication", auth_classes
        )

    def test_unauthenticated_api_returns_consistent_error_payload(self):
        response = self.client.get("/api/tubos/")
        self.assertIn(
            response.status_code,
            (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
        )
        self.assertIn("error", response.data)

    def test_cassettes_requires_authentication(self):
        response = self.client.get("/api/cassettes/")
        self.assertIn(
            response.status_code,
            (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
        )

    def test_cassettes_allows_authenticated_user(self):
        self.client.force_authenticate(user=self.tecnico)
        response = self.client.get("/api/cassettes/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_sensitive_modules_require_authentication(self):
        endpoints = [
            "/api/tubos/",
            "/api/hematologia/",
            "/api/microbiologias/",
            "/api/informesresultado/",
        ]
        for endpoint in endpoints:
            with self.subTest(endpoint=endpoint):
                response = self.client.get(endpoint)
                self.assertIn(
                    response.status_code,
                    (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
                )

    def test_sensitive_modules_allow_authenticated_user(self):
        self.client.force_authenticate(user=self.tecnico)
        endpoints = [
            "/api/tubos/",
            "/api/hematologia/",
            "/api/microbiologias/",
            "/api/informesresultado/",
        ]
        for endpoint in endpoints:
            with self.subTest(endpoint=endpoint):
                response = self.client.get(endpoint)
                self.assertEqual(response.status_code, status.HTTP_200_OK)


class ApiLoginTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tecnico = make_tecnico(password="clave123", email="login@test.com")

    def test_login_action_allows_anonymous_and_returns_user(self):
        response = self.client.post(
            "/api/tecnicos/login/",
            {
                "tecnico_id": self.tecnico.pk,
                "password": "clave123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id_tecnico"], self.tecnico.pk)

    def test_login_rejects_invalid_password(self):
        response = self.client.post(
            "/api/tecnicos/login/",
            {
                "tecnico_id": self.tecnico.pk,
                "password": "incorrecta",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ImagenEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tecnico = make_tecnico(email="img@test.com")
        self.client.force_authenticate(user=self.tecnico)
        self.client.force_login(self.tecnico)

        cassette = make_cassette(qr="QRCASS02")
        self.muestra = Muestra.objects.create(
            descripcion="Muestra 1",
            fecha="2024-01-01",
            observaciones="Obs",
            tincion="Gram",
            qr_muestra="QRM001",
            cassette=cassette,
        )

        citologia = Citologia.objects.create(
            citologia="CITO-API",
            tipo_citologia="Tipo",
            fecha="2024-01-01",
            descripcion="Desc",
            caracteristicas="Caract",
            qr_citologia="QRCITO-API",
            organo="Pulmón",
        )
        self.muestra_citologia = MuestraCitologia.objects.create(
            descripcion="Sub C",
            fecha="2024-01-01",
            observaciones="Obs",
            tincion="HE",
            qr_muestra="QRMC-API",
            citologia=citologia,
        )

        self.necropsia = Necropsia.objects.create(
            necropsia="N-API",
            tipo_necropsia="Clinica",
            fecha="2024-01-01",
            descripcion="Desc",
            caracteristicas="Caract",
            qr_necropsia="QRN-API",
            organo="Pulmón",
        )
        self.muestra_necropsia = MuestraNecropsia.objects.create(
            descripcion="Sub N",
            fecha="2024-01-01",
            observaciones="Obs",
            tincion="HE",
            qr_muestra="QRMN-API",
            necropsia=self.necropsia,
        )

        self.tubo = Tubo.objects.create(
            tubo="T-API",
            fecha="2024-01-01",
            descripcion="Desc",
            caracteristicas="Caract",
            qr_tubo="QRT-API",
            organo="Pulmón",
        )
        self.muestra_tubo = MuestraTubo.objects.create(
            descripcion="Sub T",
            fecha="2024-01-01",
            observaciones="Obs",
            tincion="Gram",
            qr_muestra="QRMT-API",
            tubo=self.tubo,
        )

        self.hematologia = Hematologia.objects.create(
            hematologia="H-API",
            fecha="2024-01-01",
            descripcion="Desc",
            caracteristicas="Caract",
            qr_hematologia="QRH-API",
            organo="Pulmón",
        )
        self.muestra_hematologia = MuestraHematologia.objects.create(
            descripcion="Sub H",
            fecha="2024-01-01",
            observaciones="Obs",
            tincion="Gram",
            qr_muestra="QRMH-API",
            hematologia=self.hematologia,
        )

        self.microbiologia = Microbiologia.objects.create(
            microbiologia="MB-API",
            fecha="2024-01-01",
            descripcion="Desc",
            caracteristicas="Caract",
            qr_microbiologia="QRMB-API",
            organo="Pulmón",
        )
        self.muestra_microbiologia = MuestraMicrobiologia.objects.create(
            descripcion="Sub MB",
            fecha="2024-01-01",
            observaciones="Obs",
            tincion="Gram",
            qr_muestra="QRMMB-API",
            microbiologia=self.microbiologia,
        )

    def test_por_muestra_returns_expected_serializer_shape(self):
        Imagen.objects.create(
            muestra=self.muestra,
            imagen=ContentFile(b"fake-image-bytes", name="test.png"),
        )

        response = self.client.get(f"/api/imagenes/muestra/{self.muestra.pk}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertIn("id_imagen", response.data[0])
        self.assertIn("muestra", response.data[0])
        self.assertIn("imagen_url", response.data[0])
        self.assertIn("/api/archivo/imagen/", response.data[0]["imagen_url"])
        self.assertNotIn("imagen", response.data[0])

    def test_create_imagen_requires_file_and_muestra(self):
        response = self.client.post("/api/imagenes/", {}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_rejects_disallowed_extension_on_all_sec3_endpoints(self):
        endpoints = [
            ("/api/imagenes/", {"muestra": self.muestra.pk}),
            ("/api/imagenescitologia/", {"muestra": self.muestra_citologia.pk}),
            ("/api/imagenesnecropsia/", {"muestra": self.muestra_necropsia.pk}),
            ("/api/imagenestubo/", {"muestra": self.muestra_tubo.pk}),
            ("/api/imageneshematologia/", {"muestra": self.muestra_hematologia.pk}),
            ("/api/imagenesmicrobiologia/", {"muestra": self.muestra_microbiologia.pk}),
            (
                "/api/muestrastubo/",
                {
                    "tubo": self.tubo.pk,
                    "descripcion": "Nueva muestra tubo",
                    "fecha": "2024-01-01",
                    "tincion": "Gram",
                },
            ),
            (
                "/api/muestrashematologia/",
                {
                    "hematologia": self.hematologia.pk,
                    "descripcion": "Nueva muestra hematologia",
                    "fecha": "2024-01-01",
                    "tincion": "Gram",
                },
            ),
            (
                "/api/muestrasmicrobiologia/",
                {
                    "microbiologia": self.microbiologia.pk,
                    "descripcion": "Nueva muestra microbiologia",
                    "fecha": "2024-01-01",
                    "tincion": "Gram",
                },
            ),
        ]

        for endpoint, payload in endpoints:
            with self.subTest(endpoint=endpoint):
                dato = dict(payload)
                dato["imagen"] = SimpleUploadedFile(
                    "malware.exe",
                    b"MZ\x00\x00\x00\x00",
                    content_type="application/octet-stream",
                )
                response = self.client.post(endpoint, dato, format="multipart")
                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
                self.assertIn("Extension no permitida", str(response.data))

    def test_create_rejects_invalid_magic_bytes(self):
        response = self.client.post(
            "/api/imagenes/",
            {
                "muestra": self.muestra.pk,
                "imagen": SimpleUploadedFile(
                    "falsa.png", b"NO_IMAGE_HEADER", content_type="image/png"
                ),
            },
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("no es una imagen valida", str(response.data).lower())

    def test_create_accepts_valid_png_file(self):
        response = self.client.post(
            "/api/imagenes/",
            {
                "muestra": self.muestra.pk,
                "imagen": SimpleUploadedFile(
                    "ok.png", b"\x89PNG\r\n\x1a\n" + b"0" * 32, content_type="image/png"
                ),
            },
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_proxy_serves_real_mime_for_bin_image(self):
        hematologia = Hematologia.objects.create(
            hematologia="H001",
            fecha="2024-01-01",
            descripcion="Desc",
            caracteristicas="Caract",
            qr_hematologia="QRH-API-1",
            organo="Pulmón",
        )
        muestra = MuestraHematologia.objects.create(
            descripcion="Submuestra",
            fecha="2024-01-01",
            observaciones="Obs",
            tincion="Gram",
            qr_muestra="QRMH001",
            hematologia=hematologia,
        )
        webp_bytes = b"RIFF\x00g\x00\x00WEBPVP8 " + b"0" * 32
        imagen = ImagenHematologia.objects.create(
            muestra=muestra,
            imagen=ContentFile(webp_bytes, name="test.webp"),
        )

        list_response = self.client.get(
            f"/api/imageneshematologia/muestra/{muestra.pk}/"
        )
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertIn("imagen_url", list_response.data[0])

        proxy_response = self.client.get(list_response.data[0]["imagen_url"])
        self.assertEqual(proxy_response.status_code, status.HTTP_200_OK)
        self.assertEqual(proxy_response["Content-Type"], "image/webp")

    def test_proxy_serves_legacy_string_path_image(self):
        self.tecnico.rol = Tecnico.ROL_ANATOMIA
        self.tecnico.save(update_fields=["rol"])

        legacy_rel = "imagenes/test_legacy_proxy.png"
        legacy_abs = Path(settings.MEDIA_ROOT) / legacy_rel
        legacy_abs.parent.mkdir(parents=True, exist_ok=True)
        legacy_abs.write_bytes(b"\x89PNG\r\n\x1a\n" + b"0" * 32)

        imagen = Imagen.objects.create(
            muestra=self.muestra,
            imagen=ContentFile(b"placeholder", name="placeholder.png"),
        )
        with connection.cursor() as cursor:
            cursor.execute(
                "UPDATE imagenes SET imagen = %s WHERE id_imagen = %s",
                [legacy_rel, imagen.pk],
            )
        response = self.client.get(f"/api/archivo/imagen/{imagen.pk}/imagen/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response["Content-Type"], "image/png")


# ── Validación de imagen y funciones de seguridad del proxy ────────────────────


class ValidacionImagenAPITests(TestCase):
    """
    Cubre _validar_imagen_api (tamaño máximo y magic bytes alternativos),
    _sanitize_filename y las cabeceras de seguridad que añade proxy_file.
    """

    def setUp(self):
        self.client = APIClient()
        self.tecnico = make_tecnico(email="valimg@test.com")
        self.tecnico.rol = Tecnico.ROL_PROFESOR
        self.tecnico.save(update_fields=["rol"])
        self.client.force_authenticate(user=self.tecnico)
        self.client.force_login(self.tecnico)

        # Muestra reutilizada en los tests de endpoints
        cassette = make_cassette(qr="QRCAS-VIMGAPI")
        self.muestra = Muestra.objects.create(
            descripcion="Muestra validacion",
            fecha="2024-01-01",
            observaciones="obs",
            tincion="Gram",
            qr_muestra="QRM-VIMGAPI-01",
            cassette=cassette,
        )

    # ── _validar_imagen_api ──────────────────────────────────────────────────

    def test_imagen_rechaza_tamano_superior_20mb(self):
        """_validar_imagen_api lanza ValidationError cuando size supera 20 MB."""
        archivo = SimpleUploadedFile(
            "grande.png", b"\x89PNG\r\n\x1a\n" + b"0" * 8, content_type="image/png"
        )
        # Sobreescribir el atributo size sin reservar 20 MB reales en memoria
        archivo.size = 20 * 1024 * 1024 + 1
        with self.assertRaises(ValidationError) as ctx:
            _validar_imagen_api(archivo)
        self.assertIn("20 MB", str(ctx.exception))

    def test_imagen_acepta_tiff_little_endian(self):
        """Magic bytes II*\\x00 (TIFF little-endian) son aceptados por el endpoint."""
        response = self.client.post(
            "/api/imagenes/",
            {
                "muestra": self.muestra.pk,
                "imagen": SimpleUploadedFile(
                    "micro.tif",
                    b"II*\x00" + b"0" * 60,
                    content_type="image/tiff",
                ),
            },
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_imagen_acepta_bmp(self):
        """Magic bytes BM (BMP) son aceptados por el endpoint de imágenes."""
        response = self.client.post(
            "/api/imagenes/",
            {
                "muestra": self.muestra.pk,
                "imagen": SimpleUploadedFile(
                    "foto.bmp",
                    b"BM" + b"0" * 60,
                    content_type="image/bmp",
                ),
            },
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_imagen_acepta_gif89a(self):
        """Magic bytes GIF89a son aceptados por el endpoint de imágenes."""
        response = self.client.post(
            "/api/imagenes/",
            {
                "muestra": self.muestra.pk,
                "imagen": SimpleUploadedFile(
                    "anim.gif",
                    b"GIF89a" + b"0" * 60,
                    content_type="image/gif",
                ),
            },
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # ── _sanitize_filename ───────────────────────────────────────────────────

    def test_sanitize_filename_elimina_caracteres_peligrosos(self):
        """_sanitize_filename sustituye por _ los caracteres fuera de \\w, punto, guion y espacios."""
        self.assertNotIn("/", _sanitize_filename("path/to/file.jpg"))
        self.assertNotIn('"', _sanitize_filename('foto"; inyeccion'))
        self.assertNotIn(";", _sanitize_filename("foto;.png"))
        # Nombre limpio debe quedar intacto
        self.assertEqual(
            _sanitize_filename("informe-final_v2.pdf"), "informe-final_v2.pdf"
        )

    def test_sanitize_filename_trunca_a_255_caracteres(self):
        """_sanitize_filename limita la longitud del nombre a 255 caracteres."""
        nombre_largo = "a" * 500
        resultado = _sanitize_filename(nombre_largo)
        self.assertEqual(len(resultado), 255)

    def test_sanitize_filename_none_devuelve_archivo(self):
        """_sanitize_filename devuelve 'archivo' cuando el argumento es None."""
        self.assertEqual(_sanitize_filename(None), "archivo")

    # ── proxy_file: cabeceras y casos de error ───────────────────────────────

    def test_proxy_cabeceras_seguridad_completas(self):
        """proxy_file añade X-Frame-Options: DENY, Cache-Control: no-store y X-Content-Type-Options: nosniff."""
        imagen = Imagen.objects.create(
            muestra=self.muestra,
            imagen=ContentFile(b"\x89PNG\r\n\x1a\n" + b"0" * 32, name="seg_test.png"),
        )
        response = self.client.get(f"/api/archivo/imagen/{imagen.pk}/imagen/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["X-Frame-Options"], "DENY")
        self.assertIn("no-store", response["Cache-Control"])
        self.assertEqual(response["X-Content-Type-Options"], "nosniff")

    def test_proxy_modelo_invalido_devuelve_404(self):
        """proxy_file responde 404 si el nombre de modelo no está registrado en FILE_PROXY_MODELS."""
        response = self.client.get("/api/archivo/modelofantasma/1/imagen/")
        self.assertEqual(response.status_code, 404)

    def test_proxy_campo_invalido_devuelve_404(self):
        """proxy_file responde 404 si el campo pedido no está permitido para el modelo."""
        # 'cassette' solo permite 'volante_peticion' e 'informe_imagen', no 'imagen'
        cassette = make_cassette(qr="QRCAS-CAMPINV")
        response = self.client.get(f"/api/archivo/cassette/{cassette.pk}/imagen/")
        self.assertEqual(response.status_code, 404)

    def test_proxy_anonimo_redirige_a_login(self):
        """proxy_file redirige a /login/ si el usuario no está autenticado (@login_required)."""
        client_anonimo = APIClient()
        response = client_anonimo.get("/api/archivo/imagen/1/imagen/")
        self.assertEqual(response.status_code, 302)
        self.assertIn("/login/", response["Location"])


class FileProxyRoleAuthorizationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.lab = make_tecnico(email="lab-proxy@test.com")
        self.lab.rol = Tecnico.ROL_LABORATORIO
        self.lab.save(update_fields=["rol"])

        self.anatomia = make_tecnico(email="anat-proxy@test.com")
        self.anatomia.rol = Tecnico.ROL_ANATOMIA
        self.anatomia.save(update_fields=["rol"])

        self.profesor = make_tecnico(email="profe-proxy@test.com")
        self.profesor.rol = Tecnico.ROL_PROFESOR
        self.profesor.save(update_fields=["rol"])

        # Recurso de laboratorio: imagen de hematologia
        hematologia = Hematologia.objects.create(
            hematologia="H-PROXY",
            fecha="2024-01-01",
            descripcion="Desc",
            caracteristicas="Caract",
            qr_hematologia="QRH-PROXY",
            organo="Pulmón",
        )
        muestra_h = MuestraHematologia.objects.create(
            descripcion="Submuestra H",
            fecha="2024-01-01",
            observaciones="Obs",
            tincion="Gram",
            qr_muestra="QRMH-PROXY",
            hematologia=hematologia,
        )
        self.imagen_h = ImagenHematologia.objects.create(
            muestra=muestra_h,
            imagen=ContentFile(b"\x89PNG\r\n\x1a\n" + b"0" * 20, name="test_h.png"),
        )

        # Recurso de anatomia: imagen de necropsia
        necropsia = Necropsia.objects.create(
            necropsia="N-PROXY",
            tipo_necropsia="Clínica",
            fecha="2024-01-01",
            descripcion="Desc",
            caracteristicas="Caract",
            qr_necropsia="QRN-PROXY",
            organo="Pulmón",
        )
        muestra_n = MuestraNecropsia.objects.create(
            descripcion="Submuestra N",
            fecha="2024-01-01",
            observaciones="Obs",
            tincion="HE",
            qr_muestra="QRMN-PROXY",
            necropsia=necropsia,
        )
        self.imagen_n = ImagenNecropsia.objects.create(
            muestra=muestra_n,
            imagen=ContentFile(b"\x89PNG\r\n\x1a\n" + b"1" * 20, name="test_n.png"),
        )

        ct_nec = ContentType.objects.get_for_model(Necropsia)
        self.informe_nec = InformeResultado.objects.create(
            content_type=ct_nec,
            object_id=necropsia.pk,
            descripcion="Informe necropsia",
            fecha="2024-01-02",
            imagen=ContentFile(b"\x89PNG\r\n\x1a\n" + b"2" * 20, name="informe_n.png"),
        )

    def test_laboratorio_no_puede_ver_imagen_necropsia(self):
        self.client.force_login(self.lab)
        response = self.client.get(
            f"/api/archivo/imagennecropsia/{self.imagen_n.pk}/imagen/"
        )
        self.assertEqual(response.status_code, 404)

    def test_anatomia_no_puede_ver_imagen_hematologia(self):
        self.client.force_login(self.anatomia)
        response = self.client.get(
            f"/api/archivo/imagenhematologia/{self.imagen_h.pk}/imagen/"
        )
        self.assertEqual(response.status_code, 404)

    def test_profesor_puede_ver_ambas_imagenes(self):
        self.client.force_login(self.profesor)
        r_h = self.client.get(
            f"/api/archivo/imagenhematologia/{self.imagen_h.pk}/imagen/"
        )
        r_n = self.client.get(
            f"/api/archivo/imagennecropsia/{self.imagen_n.pk}/imagen/"
        )
        self.assertEqual(r_h.status_code, 200)
        self.assertEqual(r_n.status_code, 200)

    def test_laboratorio_no_puede_ver_informe_de_necropsia(self):
        self.client.force_login(self.lab)
        response = self.client.get(
            f"/api/archivo/informeresultado/{self.informe_nec.pk}/imagen/"
        )
        self.assertEqual(response.status_code, 404)

    def test_anatomia_puede_ver_informe_de_necropsia(self):
        self.client.force_login(self.anatomia)
        response = self.client.get(
            f"/api/archivo/informeresultado/{self.informe_nec.pk}/imagen/"
        )
        self.assertEqual(response.status_code, 200)

    def test_anatomia_no_puede_ver_informe_de_hematologia(self):
        """InformeResultado vinculado a Hematologia es inaccesible para el rol anatomia_patologica."""
        hematologia = Hematologia.objects.create(
            hematologia="H-INF-AT",
            fecha="2024-01-01",
            descripcion="Desc",
            caracteristicas="Caract",
            qr_hematologia="QRH-INF-AT",
            organo="Pulmón",
        )
        ct_hem = ContentType.objects.get_for_model(Hematologia)
        informe_hem = InformeResultado.objects.create(
            content_type=ct_hem,
            object_id=hematologia.pk,
            descripcion="Informe hem para anatomia",
            fecha="2024-01-02",
            imagen=ContentFile(b"\x89PNG\r\n\x1a\n" + b"3" * 20, name="inf_hem_at.png"),
        )
        self.client.force_login(self.anatomia)
        response = self.client.get(
            f"/api/archivo/informeresultado/{informe_hem.pk}/imagen/"
        )
        self.assertEqual(response.status_code, 404)

    def test_laboratorio_puede_ver_informe_de_hematologia(self):
        """InformeResultado vinculado a Hematologia es accesible para el rol laboratorio."""
        hematologia = Hematologia.objects.create(
            hematologia="H-INF-LAB",
            fecha="2024-01-01",
            descripcion="Desc",
            caracteristicas="Caract",
            qr_hematologia="QRH-INF-LAB",
            organo="Pulmón",
        )
        ct_hem = ContentType.objects.get_for_model(Hematologia)
        informe_hem = InformeResultado.objects.create(
            content_type=ct_hem,
            object_id=hematologia.pk,
            descripcion="Informe hem para laboratorio",
            fecha="2024-01-02",
            imagen=ContentFile(
                b"\x89PNG\r\n\x1a\n" + b"4" * 20, name="inf_hem_lab.png"
            ),
        )
        self.client.force_login(self.lab)
        response = self.client.get(
            f"/api/archivo/informeresultado/{informe_hem.pk}/imagen/"
        )
        self.assertEqual(response.status_code, 200)


class ApiCustomActionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tecnico = make_tecnico(email="acciones@test.com")
        self.client.force_authenticate(user=self.tecnico)
        self.cassette = make_cassette(qr="QRCUSTOM01")

    def test_cassette_por_qr_devuelve_registro_esperado(self):
        response = self.client.get("/api/cassettes/qr/QRCUSTOM01/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id_casette"], self.cassette.pk)

    def test_rango_fechas_requiere_inicio_y_fin(self):
        response = self.client.get("/api/cassettes/rango_fechas/")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Se requieren inicio y fin")

    def test_informe_resultado_rechaza_base64_invalido(self):
        hematologia = Hematologia.objects.create(
            hematologia="H002",
            fecha="2024-01-01",
            descripcion="Desc",
            caracteristicas="Caract",
            qr_hematologia="QRH-API-2",
            organo="Pulmón",
        )

        response = self.client.post(
            "/api/informesresultado/",
            {
                "descripcion": "Informe",
                "fecha": "2024-01-02",
                "tincion": "Gram",
                "observaciones": "Obs",
                "hematologia": hematologia.pk,
                "imagen": "no-es-base64",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "La imagen no es base64 válido.")

    def test_timezone_usa_madrid_con_tz_activo(self):
        self.assertEqual(settings.TIME_ZONE, "Europe/Madrid")
        self.assertTrue(settings.USE_TZ)


# ── Validaciones de serializers ──────────────────────────────────────────────────


class SerializadorValidacionTests(TestCase):
    """
    Cubre QrUnicoValidatorMixin y las validaciones de InformeResultadoSerializer:
    destino único, múltiples destinos e imagen en formato data URL.
    """

    def setUp(self):
        self.client = APIClient()
        self.tecnico = make_tecnico(email="serial@test.com")
        self.client.force_authenticate(user=self.tecnico)

    # ── QrUnicoValidatorMixin ──────────────────────────────────────────────

    def test_qr_duplicado_rechazado_en_cassette(self):
        """El campo qr_casette es único: crear dos cassettes con el mismo QR devuelve 400."""
        payload_base = {
            "cassette": "C-DUP",
            "fecha": "2024-01-01",
            "descripcion": "Primero",
            "caracteristicas": "Caract",
            "organo": "Pulmón",
            "qr_casette": "QR-DUPL-SER-001",
        }
        self.client.post("/api/cassettes/", payload_base, format="json")
        # Segundo intento con el mismo QR
        respuesta_dup = self.client.post(
            "/api/cassettes/",
            {**payload_base, "cassette": "C-DUP2", "descripcion": "Segundo"},
            format="json",
        )
        self.assertEqual(respuesta_dup.status_code, status.HTTP_400_BAD_REQUEST)
        # QrUnicoValidatorMixin reemplaza el UniqueValidator auto-generado por DRF
        # con uno de mensaje personalizado; verificamos campo Y mensaje.
        self.assertIn("qr_casette", respuesta_dup.data)
        error_msg = str(respuesta_dup.data["qr_casette"])
        self.assertIn("El QR ya existe.", error_msg)

    # ── InformeResultadoSerializer.validate ───────────────────────────────────

    def test_informe_sin_destino_rechazado(self):
        """El serializer rechaza informes que no especifican ningún modelo destino."""
        response = self.client.post(
            "/api/informesresultado/",
            {"descripcion": "Sin destino", "fecha": "2024-01-01"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("exactamente un destino", str(response.data["error"]))

    def test_informe_multiples_destinos_rechazado(self):
        """El serializer rechaza informes con más de un modelo destino indicado."""
        cassette = make_cassette(qr="QRCAS-MULTI-SER")
        hematologia = Hematologia.objects.create(
            hematologia="H-MULTI-SER",
            fecha="2024-01-01",
            descripcion="Desc",
            caracteristicas="Caract",
            qr_hematologia="QRH-MULTI-SER",
            organo="Pulmón",
        )
        response = self.client.post(
            "/api/informesresultado/",
            {
                "descripcion": "Multi",
                "fecha": "2024-01-01",
                "cassette": cassette.pk,
                "hematologia": hematologia.pk,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("un destino", str(response.data["error"]))

    # ── InformeResultadoSerializer.to_internal_value ───────────────────────────

    def test_informe_con_imagen_data_url_acepta_y_crea(self):
        """El serializer acepta y decodifica imágenes con formato 'data:image/png;base64,...'."""
        import base64

        hematologia = Hematologia.objects.create(
            hematologia="H-B64-SER",
            fecha="2024-01-01",
            descripcion="Desc",
            caracteristicas="Caract",
            qr_hematologia="QRH-B64-SER",
            organo="Pulmón",
        )
        png_b64 = base64.b64encode(b"\x89PNG\r\n\x1a\n" + b"0" * 32).decode("ascii")
        response = self.client.post(
            "/api/informesresultado/",
            {
                "descripcion": "Informe con imagen base64",
                "fecha": "2024-01-01",
                "hematologia": hematologia.pk,
                "imagen": f"data:image/png;base64,{png_b64}",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data.get("imagen_url"))
