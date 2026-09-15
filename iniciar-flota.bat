@echo off
title FLOTA - Gestor de flota
cd /d "%~dp0"

echo ============================================
echo   FLOTA - Gestor de flota GPS
echo ============================================
echo.

:: 1. Verificar e iniciar Traccar
echo [1/4] Verificando Traccar...
sc query traccar | find "RUNNING" >nul 2>&1
if %errorlevel%==0 (
    echo       Traccar ya esta corriendo.
) else (
    echo       Iniciando Traccar...
    net start traccar >nul 2>&1
    if %errorlevel%==0 (
        echo       Traccar iniciado correctamente.
    ) else (
        echo       ERROR: No se pudo iniciar Traccar.
        echo       Ejecuta como administrador o inicia Traccar manualmente.
    )
)

:: 2. Esperar a que Traccar este listo
echo [2/4] Esperando a que Traccar responda...
set /a intentos=0
:esperar_traccar
set /a intentos+=1
curl -s -o nul -w "%%{http_code}" http://localhost:8082 2>nul | find "200" >nul 2>&1
if %errorlevel%==0 (
    echo       Traccar listo.
) else (
    if %intentos% lss 15 (
        timeout /t 2 /nobreak >nul
        goto esperar_traccar
    ) else (
        echo       Traccar no responde. Verifica que este instalado.
    )
)

:: 3. Iniciar proxy
echo [3/4] Iniciando proxy...
tasklist /FI "WINDOWTITLE eq Proxy FLOTA" 2>nul | find "cmd.exe" >nul 2>&1
if %errorlevel%==0 (
    echo       Proxy ya esta corriendo.
) else (
    start "Proxy FLOTA" /min cmd /c "node proxy-server.js"
    timeout /t 2 /nobreak >nul
    echo       Proxy iniciado.
)

:: 4. Verificar Tailscale
echo [4/4] Verificando Tailscale...
"%ProgramFiles%\Tailscale\tailscale.exe" status 2>nul | find "100." >nul 2>&1
if %errorlevel%==0 (
    echo       Tailscale conectado.
) else (
    echo       Tailscale no esta conectado.
    echo       Abre Tailscale en el celular para acceso remoto.
)

echo.
echo ============================================
echo   Todo listo. Abriendo navegador...
echo ============================================
echo.
echo   Local:   http://localhost:3000
echo   Traccar: http://localhost:8082
echo.

timeout /t 2 /nobreak >nul
start "" http://localhost:3000
