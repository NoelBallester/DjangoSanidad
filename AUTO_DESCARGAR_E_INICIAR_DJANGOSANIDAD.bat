@echo off
setlocal EnableExtensions EnableDelayedExpansion

:: ================================================================
:: CONFIGURACION (ya predefinida para tu repositorio)
:: ================================================================
set "REPO_GIT_URL=https://github.com/NoelBallester/DjangoSanidad"
set "REPO_ZIP_URL=https://github.com/NoelBallester/DjangoSanidad/archive/refs/heads/main.zip"
set "PROJECT_FOLDER=DjangoSanidad"
set "PYTHON_WINGET_ID=Python.Python.3.12"

cd /d "%~dp0"
title DjangoSanidad - Autodespliegue 1 clic

echo ================================================================
echo   DjangoSanidad - Autodespliegue Automatico (1 clic)
echo ================================================================
echo.

set "BASE_DIR=%cd%"
set "PROJECT_DIR=%BASE_DIR%\%PROJECT_FOLDER%"

where powershell >nul 2>&1
if errorlevel 1 (
    echo [ERROR] PowerShell no esta disponible en este Windows.
    echo No se puede continuar automaticamente.
    pause
    exit /b 1
)

if not exist "%PROJECT_DIR%\manage.py" (
    echo [INFO] Proyecto no encontrado en esta carpeta. Descargando automaticamente...
    call :download_project
    if errorlevel 1 (
        echo [ERROR] No se pudo descargar el proyecto.
        pause
        exit /b 1
    )
) else (
    echo [INFO] Proyecto ya existente. Se reutilizara: %PROJECT_DIR%
)

if not exist "%PROJECT_DIR%\manage.py" (
    echo [ERROR] No existe manage.py tras la descarga. Proyecto incompleto.
    pause
    exit /b 1
)

cd /d "%PROJECT_DIR%"

call :detect_python
if not defined PY_CMD (
    echo [INFO] Python no esta instalado. Intentando instalar automaticamente...
    where winget >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Este equipo no tiene Python ni winget.
        echo Instala Python 3.10+ y vuelve a hacer doble clic.
        pause
        exit /b 1
    )

    winget install -e --id %PYTHON_WINGET_ID% --accept-package-agreements --accept-source-agreements

    call :detect_python
)

if not defined PY_CMD (
    echo [ERROR] No se pudo detectar Python despues de instalarlo.
    echo Cierra y vuelve a abrir este archivo (o reinicia el equipo).
    pause
    exit /b 1
)

echo [INFO] Python detectado: %PY_CMD%
echo.

if not exist "venv\Scripts\python.exe" (
    echo [INFO] Creando entorno interno (solo la primera vez)...
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

echo [INFO] Actualizando herramientas base (pip/setuptools/wheel)...
python -m pip install --upgrade pip setuptools wheel
if errorlevel 1 (
    echo [ERROR] Fallo al actualizar herramientas de Python.
    pause
    exit /b 1
)

if not exist "requirements.txt" (
    echo [ERROR] No existe requirements.txt en el proyecto descargado.
    pause
    exit /b 1
)

echo [INFO] Instalando dependencias del proyecto...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Fallo instalando dependencias. Revisa la conexion a internet.
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
exit /b 0

:detect_python
set "PY_CMD="
where py >nul 2>&1
if not errorlevel 1 set "PY_CMD=py -3"
if not defined PY_CMD (
    where python >nul 2>&1
    if not errorlevel 1 set "PY_CMD=python"
)
exit /b 0

:download_project
echo [INFO] Intentando descargar usando Git (si esta disponible)...
where git >nul 2>&1
if not errorlevel 1 (
    git clone --depth 1 "%REPO_GIT_URL%" "%PROJECT_DIR%"
    if not errorlevel 1 (
        echo [OK] Proyecto descargado por Git.
        exit /b 0
    )
    echo [AVISO] Git fallo. Se intentara descarga por ZIP.
)

echo [INFO] Descargando proyecto en ZIP desde GitHub...
set "ZIP_FILE=%TEMP%\djangosanidad_autodeploy.zip"
set "UNZIP_DIR=%TEMP%\djangosanidad_autodeploy_%RANDOM%%RANDOM%"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $zip='%ZIP_FILE%'; $dest='%UNZIP_DIR%'; if(Test-Path $zip){Remove-Item $zip -Force}; if(Test-Path $dest){Remove-Item $dest -Recurse -Force}; Invoke-WebRequest -Uri '%REPO_ZIP_URL%' -OutFile $zip; Expand-Archive -Path $zip -DestinationPath $dest -Force; $folder=Get-ChildItem -Path $dest -Directory | Select-Object -First 1; if(-not $folder){throw 'No se pudo extraer carpeta del ZIP'}; Move-Item -Path $folder.FullName -Destination '%PROJECT_DIR%';"
if errorlevel 1 exit /b 1

echo [OK] Proyecto descargado por ZIP.
exit /b 0

:find_port
set /a tries=0
:find_port_loop
set /a tries+=1
netstat -ano | findstr /r /c:":%PORT% .*LISTENING" >nul
if errorlevel 1 exit /b 0
set /a PORT+=1
if %tries% GEQ 30 (
    echo [ERROR] No se encontro puerto libre entre 8000 y 8029.
    pause
    exit /b 1
)
goto find_port_loop
