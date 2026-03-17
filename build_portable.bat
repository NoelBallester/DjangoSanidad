@echo off
chcp 65001 >nul
echo ================================================
echo   DjangoSanidad - Construccion del ejecutable
echo ================================================
echo.

:: Activar entorno virtual si existe
if exist "venv\Scripts\activate.bat" (
    echo [INFO] Activando entorno virtual...
    call venv\Scripts\activate.bat
) else (
    echo [AVISO] No se encontro entorno virtual. Usando Python del sistema.
)

:: Verificar PyInstaller
python -m PyInstaller --version >nul 2>&1
if errorlevel 1 (
    echo [INFO] Instalando PyInstaller...
    pip install pyinstaller
)

:: Limpiar builds anteriores
echo [INFO] Limpiando builds anteriores...
if exist "build\DjangoSanidad" rmdir /s /q "build\DjangoSanidad"
if exist "dist\DjangoSanidad" rmdir /s /q "dist\DjangoSanidad"

:: Construir
echo [INFO] Construyendo ejecutable...
python -m PyInstaller DjangoSanidadPortable.spec --clean -y

if errorlevel 1 (
    echo.
    echo [ERROR] La construccion ha fallado. Revisa los mensajes anteriores.
    pause
    exit /b 1
)

echo.
echo ================================================
echo   Construccion completada con exito!
echo   Carpeta: dist\DjangoSanidad\
echo   Ejecutable: dist\DjangoSanidad\DjangoSanidad.exe
echo ================================================
echo.
echo Puedes comprimir la carpeta dist\DjangoSanidad\ y enviarsela al cliente.
echo El cliente solo tiene que ejecutar DjangoSanidad.exe
echo.
pause
