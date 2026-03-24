@echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0"
title DjangoSanidad - Inicio Automatico

echo ================================================================
echo   DjangoSanidad - Inicio Automatico (Windows, doble clic)
echo ================================================================
echo.

if not exist "manage.py" (
    echo [ERROR] No se encontro manage.py en esta carpeta.
    echo Copia este .bat en la raiz del proyecto DjangoSanidad.
    pause
    exit /b 1
)

set "PY_CMD="
where py >nul 2>&1
if not errorlevel 1 set "PY_CMD=py -3"
if not defined PY_CMD (
    where python >nul 2>&1
    if not errorlevel 1 set "PY_CMD=python"
)

if not defined PY_CMD (
    echo [INFO] Python no esta instalado. Intentando instalar Python automaticamente...
    where winget >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Este equipo no tiene Python ni winget disponible.
        echo Instala Python 3.10+ y vuelve a hacer doble clic en este archivo.
        pause
        exit /b 1
    )

    winget install -e --id Python.Python.3.12 --accept-package-agreements --accept-source-agreements

    set "PY_CMD="
    where py >nul 2>&1
    if not errorlevel 1 set "PY_CMD=py -3"
    if not defined PY_CMD (
        where python >nul 2>&1
        if not errorlevel 1 set "PY_CMD=python"
    )
)

if not defined PY_CMD (
    echo [ERROR] No se pudo detectar Python tras la instalacion.
    echo Cierra y vuelve a abrir esta ventana, o reinicia el equipo y ejecuta de nuevo.
    pause
    exit /b 1
)

echo [INFO] Usando Python con: %PY_CMD%
echo.

if not exist "venv\Scripts\python.exe" (
    echo [INFO] Preparando entorno interno (solo la primera vez)...
    %PY_CMD% -m venv venv
    if errorlevel 1 (
        echo [ERROR] No se pudo crear el entorno virtual.
        pause
        exit /b 1
    )
)

call "venv\Scripts\activate.bat"
if errorlevel 1 (
    echo [ERROR] No se pudo activar el entorno virtual.
    pause
    exit /b 1
)

echo [INFO] Actualizando herramientas base de Python...
python -m pip install --upgrade pip setuptools wheel
if errorlevel 1 (
    echo [ERROR] Fallo al actualizar pip/setuptools/wheel.
    pause
    exit /b 1
)

echo [INFO] Instalando dependencias del proyecto...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Fallo instalando dependencias. Revisa conexion a internet y vuelve a intentar.
    pause
    exit /b 1
)

if not exist ".env" (
    echo [INFO] Creando configuracion inicial (.env)...
    python -c "import secrets, pathlib; p=pathlib.Path('.env'); p.write_text('DJANGO_SECRET_KEY='+secrets.token_urlsafe(50)+'\nDJANGO_DEBUG=false\nDJANGO_ALLOWED_HOSTS=localhost,127.0.0.1\n', encoding='utf-8')"
)

if not exist "logs" mkdir logs
if not exist "media" mkdir media

echo [INFO] Aplicando migraciones de base de datos...
python manage.py migrate --run-syncdb --noinput
if errorlevel 1 (
    echo [ERROR] Fallo aplicando migraciones.
    pause
    exit /b 1
)

set "PORT=8000"
call :find_port

echo.
echo [OK] Todo listo. Abriendo navegador en: http://127.0.0.1:%PORT%/
echo [INFO] Para apagar el servidor, cierra esta ventana.
echo.
start "" cmd /c "timeout /t 3 >nul && start http://127.0.0.1:%PORT%/"
python manage.py runserver 0.0.0.0:%PORT% --noreload

goto :eof

:find_port
set /a tries=0
:find_port_loop
set /a tries+=1
netstat -ano | findstr /r /c:":%PORT% .*LISTENING" >nul
if errorlevel 1 goto :eof
set /a PORT+=1
if %tries% GEQ 30 (
    echo [ERROR] No se encontro puerto libre entre 8000 y 8029.
    pause
    exit /b 1
)
goto find_port_loop
