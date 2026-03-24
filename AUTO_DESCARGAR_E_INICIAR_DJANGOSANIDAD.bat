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
echo [DEBUG] Directorio actual: %cd%
echo [DEBUG] Archivo: %~f0
echo.

set "BASE_DIR=%cd%"
set "PROJECT_DIR=%BASE_DIR%\%PROJECT_FOLDER%"
set "LOG_FILE=%BASE_DIR%\deployment_log.txt"

echo [DEBUG] BASE_DIR: %BASE_DIR% >> "%LOG_FILE%" 2>&1
echo [DEBUG] PROJECT_DIR: %PROJECT_DIR% >> "%LOG_FILE%" 2>&1

where powershell >nul 2>&1
if errorlevel 1 (
    echo [ERROR] PowerShell no esta disponible en este Windows.
    echo No se puede continuar automaticamente.
    pause
    exit /b 1
)

if not exist "%PROJECT_DIR%\manage.py" (
    echo.
    echo [INFO] Proyecto no encontrado en esta carpeta. Descargando automaticamente...
    echo [INFO] Este proceso puede tardar varios minutos...
    call :download_project
    if errorlevel 1 (
        echo.
        echo [ERROR] No se pudo descargar el proyecto.
        echo Posibles causas:
        echo   - Sin conexion a internet
        echo   - Problema al descomprimir
        echo   - Permisos insuficientes
        echo.
        type "%LOG_FILE%" 2>nul
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
if errorlevel 1 (
    echo [ERROR] No se puede acceder a la carpeta del proyecto.
    pause
    exit /b 1
)

call :detect_python
if not defined PY_CMD (
    echo [INFO] Python no esta instalado. Intentando instalar automaticamente...
    where winget >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Este equipo no tiene Python ni winget disponible.
        echo Por favor instala Python 3.10+ manualmente desde https://www.python.org/
        echo Despues vuelve a hacer doble clic en este archivo.
        pause
        exit /b 1
    )

    echo [INFO] Instalando Python 3.12 via winget...
    winget install -e --id %PYTHON_WINGET_ID% --accept-package-agreements --accept-source-agreements
    if errorlevel 1 (
        echo [ERROR] Fallo la instalacion de Python.
        pause
        exit /b 1
    )

    call :detect_python
)

if not defined PY_CMD (
    echo [ERROR] No se pudo detectar Python despues de instalarlo.
    echo Intenta cerrar y volver a hacer doble clic en este archivo.
    echo Si el problema persiste, reinicia el equipo.
    pause
    exit /b 1
)

echo [INFO] Python detectado: %PY_CMD%
echo.

if not exist "venv\Scripts\python.exe" (
    echo [INFO] Creando entorno virtual (solo la primera vez, puede tardar 1-2 min)...
    %PY_CMD% -m venv venv >> "%LOG_FILE%" 2>&1
    if errorlevel 1 (
        echo [ERROR] No se pudo crear el entorno virtual.
        echo Ver detalles en: %LOG_FILE%
        pause
        exit /b 1
    )
) else (
    echo [INFO] Entorno virtual ya existe, reutilizando...
)

echo [INFO] Activando entorno virtual...
call "venv\Scripts\activate.bat"
if errorlevel 1 (
    echo [ERROR] No se pudo activar el entorno virtual.
    pause
    exit /b 1
)

echo [INFO] Actualizando pip/setuptools/wheel (puede tardar 30-60 segundos)...
python -m pip install --upgrade pip setuptools wheel >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo [ERROR] Fallo al actualizar pip/setuptools/wheel.
    echo Ver detalles en: %LOG_FILE%
    pause
    exit /b 1
)

if not exist "requirements.txt" (
    echo [ERROR] No existe requirements.txt en el proyecto.
    echo La descarga puede estar incompleta.
    pause
    exit /b 1
)

echo [INFO] Instalando dependencias (puede tardar 2-5 minutos)...
pip install -r requirements.txt >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo [ERROR] Fallo instalando dependencias.
    echo Posibilidades:
    echo  - Sin conexion a internet
    echo  - Conexion inestable
    echo Ver detalles en: %LOG_FILE%
    pause
    exit /b 1
)

if not exist ".env" (
    echo [INFO] Creando configuracion inicial (.env)...
    python -c "import secrets, pathlib; p=pathlib.Path('.env'); p.write_text('DJANGO_SECRET_KEY='+secrets.token_urlsafe(50)+'\nDJANGO_DEBUG=false\nDJANGO_ALLOWED_HOSTS=localhost,127.0.0.1\n', encoding='utf-8')" >> "%LOG_FILE%" 2>&1
    if errorlevel 1 (
        echo [ERROR] No se pudo crear .env
        pause
        exit /b 1
    )
)

if not exist "logs" mkdir logs
if not exist "media" mkdir media

echo [INFO] Aplicando migraciones de base de datos...
python manage.py migrate --run-syncdb --noinput >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo [ERROR] Fallo aplicando migraciones.
    echo Ver detalles en: %LOG_FILE%
    pause
    exit /b 1
)

echo [INFO] Buscando puerto disponible...
set "PORT=8000"
call :find_port

echo.
echo ================================================================
echo [OK] INSTALACION COMPLETADA EXITOSAMENTE
echo ================================================================
echo.
echo [INFO] Iniciando servidor en: http://127.0.0.1:%PORT%/
echo [INFO] El navegador se abrira en 3 segundos...
echo.
echo Para DETENER el servidor, cierra esta ventana.
echo ================================================================
echo.

timeout /t 3 >nul
start "" "http://127.0.0.1:%PORT%/"

echo [INFO] Iniciando Django...
python manage.py runserver 0.0.0.0:%PORT% --noreload 2>&1

echo.
echo [INFO] Servidor detenido.
call del "%LOG_FILE%" 2>nul
pause
exit /b 0

:detect_python
set "PY_CMD="
where py >nul 2>&1
if not errorlevel 1 (
    set "PY_CMD=py -3"
    exit /b 0
)
where python >nul 2>&1
if not errorlevel 1 (
    set "PY_CMD=python"
    exit /b 0
)
exit /b 0

:download_project
echo [INFO] Intentando descargar usando Git (si esta disponible)...
where git >nul 2>&1
if not errorlevel 1 (
    git clone --depth 1 "%REPO_GIT_URL%" "%PROJECT_DIR%" >> "%LOG_FILE%" 2>&1
    if not errorlevel 1 (
        echo [OK] Proyecto descargado por Git.
        exit /b 0
    )
    echo [INFO] Git fallo, intentando descarga por ZIP...
)

echo [INFO] Descargando proyecto en ZIP desde GitHub...
set "ZIP_FILE=%TEMP%\djangosanidad_autodeploy_%RANDOM%.zip"
set "UNZIP_DIR=%TEMP%\djangosanidad_unzip_%RANDOM%"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; try { $zip='%ZIP_FILE%'; $dest='%UNZIP_DIR%'; if(Test-Path $zip){Remove-Item $zip -Force}; if(Test-Path $dest){Remove-Item $dest -Recurse -Force}; Write-Host '[INFO] Descargando...'; Invoke-WebRequest -Uri '%REPO_ZIP_URL%' -OutFile $zip; Write-Host '[INFO] Descomprimiendo...'; Expand-Archive -Path $zip -DestinationPath $dest -Force; $folder=@(Get-ChildItem -Path $dest -Directory)[0]; if(!$folder){throw 'No se pudo extraer carpeta del ZIP'}; Move-Item -Path $folder.FullName -Destination '%PROJECT_DIR%'; Remove-Item -Path $zip -Force; Remove-Item -Path $dest -Recurse -Force } catch { Write-Host ('[ERROR] '+$_.Exception.Message); exit 1 }" >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo [ERROR] La descarga ZIP fallo.
    exit /b 1
)

echo [OK] Proyecto descargado por ZIP.
exit /b 0

:find_port
set /a tries=0
:find_port_loop
set /a tries+=1
netstat -ano | findstr /r /c:":%PORT% .*LISTENING" >nul 2>&1
if errorlevel 1 exit /b 0
set /a PORT+=1
if %tries% GEQ 30 (
    echo [ERROR] No se encontro puerto libre entre 8000 y 8029.
    pause
    exit /b 1
)
goto find_port_loop
