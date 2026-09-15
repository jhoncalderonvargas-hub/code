@echo off
title FLOTA - Instalador
echo ============================================
echo   INSTALADOR - Gestor de flota GPS
echo ============================================
echo.
echo Este script instala todo lo necesario para
echo correr el gestor de flota en este equipo.
echo.
echo Requisitos:
echo   - Windows 10/11
echo   - Conexion a internet
echo   - Permisos de administrador
echo.
pause

:: 1. Verificar administrador
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Ejecuta este script como administrador.
    echo Click derecho - Ejecutar como administrador
    pause
    exit /b 1
)

:: 2. Instalar Node.js
echo.
echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel%==0 (
    echo       Node.js ya esta instalado.
) else (
    echo       Descargando e instalando Node.js...
    winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
    if %errorlevel% neq 0 (
        echo       ERROR: No se pudo instalar Node.js.
        echo       Instalalo manualmente desde https://nodejs.org
        pause
        exit /b 1
    )
    echo       Node.js instalado. Reinicia el script despues de la instalacion.
    pause
    exit /b 0
)

:: 3. Instalar Traccar
echo.
echo [2/5] Verificando Traccar...
sc query traccar >nul 2>&1
if %errorlevel%==0 (
    echo       Traccar ya esta instalado.
) else (
    echo       Descargando Traccar...
    echo       Se abrira el instalador de Traccar.
    echo       Sigue los pasos del instalador.
    echo.
    set TRACCAR_URL=https://github.com/traccar/traccar/releases/download/v6.7/Traccar-6.7-Runner.exe
    curl -L -o "%TEMP%\Traccar-Installer.exe" "%TRACCAR_URL%"
    if exist "%TEMP%\Traccar-Installer.exe" (
        start "" "%TEMP%\Traccar-Installer.exe"
        echo.
        echo       Instala Traccar y vuelve a ejecutar este script.
        pause
        exit /b 0
    ) else (
        echo       ERROR: No se pudo descargar Traccar.
        echo       Descargalo manualmente desde https://www.traccar.org/windows/
        pause
    )
)

:: 4. Instalar Tailscale
echo.
echo [3/5] Verificando Tailscale...
"%ProgramFiles%\Tailscale\tailscale.exe" version >nul 2>&1
if %errorlevel%==0 (
    echo       Tailscale ya esta instalado.
) else (
    echo       Descargando e instalando Tailscale...
    winget install --id Tailscale.Tailscale -e --accept-package-agreements --accept-source-agreements
    if %errorlevel%==0 (
        echo       Tailscale instalado. Iniciando...
        "%ProgramFiles%\Tailscale\tailscale.exe" up
    ) else (
        echo       ERROR: No se pudo instalar Tailscale.
        echo       Instalalo manualmente desde https://tailscale.com/download
    )
)

:: 5. Copiar archivos del proyecto
echo.
echo [4/5] Copiando archivos del proyecto...
set DESTINO=C:\Users\%USERNAME%\OneDrive\Documentos\FLOTA
if not exist "%DESTINO%" mkdir "%DESTINO%"
xcopy /E /I /Y "%~dp0assets" "%DESTINO%\assets"
copy /Y "%~dp0proxy-server.js" "%DESTINO%\"
copy /Y "%~dp0index.html" "%DESTINO%\"
copy /Y "%~dp0iniciar-flota.bat" "%DESTINO%\"
echo       Archivos copiados a: %DESTINO%

:: 6. Crear acceso directo en escritorio
echo.
echo [5/5] Creando acceso directo...
set SCRIPT_PATH=%DESTINO%\iniciar-flota.bat
set SHORTCUT_PATH=%USERPROFILE%\Desktop\FLOTA.lnk
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT_PATH%'); $s.TargetPath = '%SCRIPT_PATH%'; $s.WorkingDirectory = '%DESTINO%'; $s.Description = 'Gestor de flota GPS'; $s.Save()"
echo       Acceso directo creado en el escritorio.

echo.
echo ============================================
echo   INSTALACION COMPLETADA
echo ============================================
echo.
echo   Para iniciar: doble clic en "FLOTA" del escritorio
echo   o ejecuta: %DESTINO%\iniciar-flota.bat
echo.
echo   IMPORTANTE: Despues de instalar Traccar:
echo   1. Abre http://localhost:8082
echo   2. Crea tu cuenta de usuario
echo   3. Configura la app con esas credenciales
echo.
pause
