"""
Launcher portable para DjangoSanidad.
Detecta la ruta base, configura el entorno, aplica migraciones y arranca el servidor.
"""
import sys
import os
import secrets
import time
import threading
import webbrowser
import socket


def get_base_dir():
    """Devuelve el directorio base de la aplicación (junto al .exe o al .py)."""
    if getattr(sys, 'frozen', False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))


def find_free_port(start=8000):
    """Encuentra un puerto libre a partir de start."""
    for port in range(start, start + 20):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('127.0.0.1', port))
                return port
            except OSError:
                continue
    return start


def setup_env(base_dir):
    """Crea .env con valores por defecto si no existe y lo carga en os.environ."""
    env_path = os.path.join(base_dir, '.env')

    if not os.path.exists(env_path):
        secret_key = secrets.token_urlsafe(50)
        with open(env_path, 'w', encoding='utf-8') as f:
            f.write(f'DJANGO_SECRET_KEY={secret_key}\n')
            f.write('DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:8000,http://127.0.0.1:8000\n')
            f.write('DJANGO_DEBUG=false\n')
            f.write('DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1\n')
        print('[Sanidad] Configuracion inicial creada.')

    with open(env_path, encoding='utf-8') as f:
        for raw in f:
            line = raw.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            key, value = line.split('=', 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = value


def main():
    base_dir = get_base_dir()

    # Añadir base_dir a sys.path para que Django encuentre los módulos
    if base_dir not in sys.path:
        sys.path.insert(0, base_dir)

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

    setup_env(base_dir)

    # Directorio de logs
    os.makedirs(os.path.join(base_dir, 'logs'), exist_ok=True)

    # Directorio de media (por si el cliente no lo tiene)
    os.makedirs(os.path.join(base_dir, 'media'), exist_ok=True)

    port = find_free_port(8000)
    url = f'http://localhost:{port}'

    # Actualizar CORS con el puerto real si es distinto de 8000
    if port != 8000:
        current_cors = os.environ.get('DJANGO_CORS_ALLOWED_ORIGINS', '')
        extra = f'http://localhost:{port},http://127.0.0.1:{port}'
        os.environ['DJANGO_CORS_ALLOWED_ORIGINS'] = f'{current_cors},{extra}' if current_cors else extra

    print('=' * 50)
    print('  DjangoSanidad - Iniciando...')
    print('=' * 50)

    import django
    django.setup()

    from django.core.management import call_command

    print('[Sanidad] Aplicando migraciones de base de datos...')
    call_command('migrate', '--run-syncdb', verbosity=0)

    print(f'[Sanidad] Servidor listo en {url}')
    print('[Sanidad] El navegador se abrira automaticamente.')
    print('[Sanidad] Cierra esta ventana para detener la aplicacion.')
    print('-' * 50)

    def open_browser():
        time.sleep(2)
        webbrowser.open(url)

    threading.Thread(target=open_browser, daemon=True).start()

    call_command('runserver', f'0.0.0.0:{port}', '--noreload')


if __name__ == '__main__':
    main()
