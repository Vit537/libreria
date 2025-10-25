@echo off
REM Script para hacer build y deploy manual del frontend a Cloud Storage (Windows)

echo ==========================================
echo   Deploy Frontend a Cloud Storage
echo ==========================================
echo.

REM Verificar que estamos en el directorio correcto
if not exist "frontend\package.json" (
    echo ERROR: Ejecuta este script desde la raiz del proyecto
    pause
    exit /b 1
)

REM Obtener project ID
for /f "tokens=*" %%i in ('gcloud config get-value project 2^>nul') do set PROJECT_ID=%%i

if "%PROJECT_ID%"=="" (
    echo ERROR: No hay proyecto configurado
    echo Ejecuta: gcloud config set project TU_PROJECT_ID
    pause
    exit /b 1
)

set BUCKET_NAME=%PROJECT_ID%-frontend

REM Verificar que el bucket existe
gsutil ls -b gs://%BUCKET_NAME% >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Bucket gs://%BUCKET_NAME% no existe
    echo Ejecuta primero: setup-cloud-storage.bat
    pause
    exit /b 1
)

REM Preguntar por la URL del backend
set /p BACKEND_URL="Ingresa la URL del backend (ejemplo: https://libreria-backend-xxx.run.app): "

if "%BACKEND_URL%"=="" (
    echo No se proporciono URL del backend, usando localhost
    set BACKEND_URL=http://localhost:8000
)

echo.
echo Configuracion:
echo    Backend URL: %BACKEND_URL%
echo    Bucket: gs://%BUCKET_NAME%
echo.

set /p CONFIRM="Continuar con el deploy? (s/n): "
if /i not "%CONFIRM%"=="s" (
    echo Cancelado
    pause
    exit /b 1
)

REM 1. Instalar dependencias
echo.
echo 1. Instalando dependencias...
cd frontend
call npm ci
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo la instalacion de dependencias
    cd ..
    pause
    exit /b 1
)

REM 2. Build
echo.
echo 2. Building Next.js (static export)...
set NEXT_PUBLIC_API_URL=%BACKEND_URL%
set NEXT_OUTPUT_MODE=export
set NODE_ENV=production
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo el build
    cd ..
    pause
    exit /b 1
)

REM Verificar que se genero la carpeta out
if not exist "out" (
    echo ERROR: No se genero la carpeta 'out'
    echo Verifica next.config.ts y que output='export'
    cd ..
    pause
    exit /b 1
)

echo Build completado

REM 3. Upload a Cloud Storage
echo.
echo 3. Subiendo archivos a Cloud Storage...

REM Subir archivos estaticos con cache largo
echo    Subiendo archivos estaticos (_next)...
gsutil -m -h "Cache-Control:public, max-age=31536000, immutable" rsync -r -d out\_next gs://%BUCKET_NAME%/_next

REM Subir HTML y otros archivos con cache corto
echo    Subiendo HTML y assets...
gsutil -m -h "Cache-Control:public, max-age=3600" rsync -r -d -x ".*/_next/.*" out\ gs://%BUCKET_NAME%/

echo Upload completado

cd ..

REM 4. Mostrar informacion
echo.
echo ==========================================
echo   Deploy Completado
echo ==========================================
echo.
echo URLs disponibles:
echo    https://storage.googleapis.com/%BUCKET_NAME%/index.html
echo    http://storage.googleapis.com/%BUCKET_NAME%/index.html
echo.
echo Informacion:
echo    Bucket: gs://%BUCKET_NAME%
echo    Backend: %BACKEND_URL%
echo.
echo Proximos pasos:
echo    1. Verifica que el sitio carga correctamente
echo    2. Actualiza CORS en Django para incluir:
echo       https://storage.googleapis.com
echo    3. (Opcional) Configura Cloud CDN para mejor rendimiento
echo    4. (Opcional) Configura dominio custom
echo.
echo ==========================================
echo.
pause
