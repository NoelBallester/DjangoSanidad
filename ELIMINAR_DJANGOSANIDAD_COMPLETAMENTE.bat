@echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0"
title DjangoSanidad - Desinstalacion y Limpieza

echo ================================================================
echo   DjangoSanidad - Eliminar Todo (Desinstalacion Completa)
echo ================================================================
echo.
echo Este script eliminara:
echo.
echo   - Carpeta del proyecto DjangoSanidad
echo   - Entorno virtual (venv)
echo   - Base de datos SQLite (db.sqlite3)
echo   - Archivos de configuracion (.env)
echo   - Carpeta de media (imagenes, volantes, informes)
echo   - Carpeta de logs
echo   - Cache de Python (__pycache__)
echo   - Archivos temporales
echo.
echo NO se podra recuperar nada despues de esto.
echo.

set /p CONFIRM="Escribe 'SI' en mayusculas y pulsa Enter para confirmar la eliminacion completa (o pulsa Enter para cancelar): "

if /i not "%CONFIRM%"=="SI" (
    echo.
    echo [CANCELADO] No se elimino nada.
    pause
    exit /b 0
)

echo.
echo [INFO] Iniciando limpieza...
echo.

taskkill /IM python.exe /F /FI "WINDOWTITLE eq DjangoSanidad*" >nul 2>&1
timeout /t 1 >nul

set "PROJECT_DIR=%cd%\DjangoSanidad"
set "PYTHON_CACHE=%APPDATA%\Python"
set "TEMP_CACHE=%TEMP%\djangosanidad_*"

if exist "%PROJECT_DIR%" (
    echo [INFO] Eliminando carpeta del proyecto: %PROJECT_DIR%
    rmdir /s /q "%PROJECT_DIR%" 2>nul
    if !errorlevel! equ 0 (
        echo [OK] Carpeta del proyecto eliminada.
    ) else (
        echo [ERROR] No se pudo eliminar la carpeta del proyecto.
        echo Intenta cerrar cualquier archivo que este abierto en esa carpeta.
        pause
        exit /b 1
    )
)

if exist "%cd%\DjangoSanidad-main" (
    echo [INFO] Eliminando carpeta alternativa: %cd%\DjangoSanidad-main
    rmdir /s /q "%cd%\DjangoSanidad-main" 2>nul
)

if exist "%cd%\venv" (
    echo [INFO] Eliminando entorno virtual: %cd%\venv
    rmdir /s /q "%cd%\venv" 2>nul
    if !errorlevel! equ 0 (
        echo [OK] Entorno virtual eliminado.
    ) else (
        echo [ERROR] No se pudo eliminar el entorno virtual.
    )
)

echo [INFO] Limpiando cache de Python en %PYTHON_CACHE%...
if exist "%PYTHON_CACHE%" (
    for /d %%d in ("%PYTHON_CACHE%\*") do (
        rmdir /s /q "%%d" 2>nul
    )
)

echo [INFO] Limpiando archivos temporales temporales...
for /d %%d in (%TEMP_CACHE%) do (
    rmdir /s /q "%%d" 2>nul
)

set "SESSION_FILE=%APPDATA%\Microsoft\Windows\Recent\AutomaticDestinations\f01b4d95cf55d32a.automaticDestinations-ms"
if exist "%SESSION_FILE%" del /f /q "%SESSION_FILE%" 2>nul

echo.
echo ================================================================
echo [OK] Limpieza completada.
echo.
echo Todo rastro de DjangoSanidad ha sido eliminado del sistema.
echo Puedes volver a descargar e instalar cuando lo necesites.
echo ================================================================
echo.
pause
