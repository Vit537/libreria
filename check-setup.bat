@echo off
REM Script de verificación para Windows

echo ===============================================
echo Verificando configuracion del proyecto...
echo ===============================================
echo.

echo Verificando archivos Docker...
if exist "backend\Dockerfile" (
    echo [OK] backend\Dockerfile existe
) else (
    echo [ERROR] backend\Dockerfile no encontrado
)

if exist "frontend\Dockerfile" (
    echo [OK] frontend\Dockerfile existe
) else (
    echo [ERROR] frontend\Dockerfile no encontrado
)

if exist "docker-compose.yml" (
    echo [OK] docker-compose.yml existe
) else (
    echo [ERROR] docker-compose.yml no encontrado
)

echo.
echo Verificando configuracion...
if exist ".env.example" (
    echo [OK] .env.example existe
) else (
    echo [ERROR] .env.example no encontrado
)

if exist ".gitignore" (
    echo [OK] .gitignore existe
) else (
    echo [ERROR] .gitignore no encontrado
)

echo.
echo Verificando GitHub Actions...
if exist ".github\workflows\deploy-to-gcp.yml" (
    echo [OK] GitHub Actions workflow existe
) else (
    echo [ERROR] GitHub Actions workflow no encontrado
)

echo.
echo ===============================================
echo PROXIMOS PASOS:
echo ===============================================
echo.
echo 1. Crear archivo .env basado en .env.example
echo 2. Probar localmente: docker-compose up --build
echo 3. Configurar Google Cloud (ver DEPLOYMENT.md)
echo 4. Configurar GitHub Secrets (ver README.md)
echo 5. Push a GitHub para deployment automatico
echo.
echo Para mas informacion:
echo   - README.md: Documentacion general
echo   - DEPLOYMENT.md: Guia de deployment
echo.
pause
