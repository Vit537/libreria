@echo off
REM Script para configurar Cloud Storage para Next.js Frontend (Windows)

echo ==========================================
echo   Configuracion de Cloud Storage
echo   para Next.js Frontend
echo ==========================================
echo.

REM Verificar que gcloud este instalado
where gcloud >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: gcloud CLI no esta instalado
    echo Instala desde: https://cloud.google.com/sdk/docs/install
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

echo Proyecto: %PROJECT_ID%
echo.

REM Configurar variables
set BUCKET_NAME=%PROJECT_ID%-frontend
set REGION=us-central1

echo Bucket: gs://%BUCKET_NAME%
echo Region: %REGION%
echo.

set /p CONFIRM="Continuar con la configuracion? (s/n): "
if /i not "%CONFIRM%"=="s" (
    echo Cancelado
    pause
    exit /b 1
)

REM 1. Crear bucket
echo.
echo 1. Creando bucket...
gsutil ls -b gs://%BUCKET_NAME% >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Bucket ya existe, continuando...
) else (
    gsutil mb -p %PROJECT_ID% -c STANDARD -l %REGION% gs://%BUCKET_NAME%
    echo Bucket creado
)

REM 2. Configurar como publico
echo.
echo 2. Configurando bucket como publico...
gsutil iam ch allUsers:objectViewer gs://%BUCKET_NAME%
echo Bucket configurado como publico

REM 3. Configurar como website estatico
echo.
echo 3. Configurando como website estatico...
gsutil web set -m index.html -e 404.html gs://%BUCKET_NAME%
echo Website estatico configurado

REM 4. Configurar CORS
echo.
echo 4. Configurando CORS...
(
echo [
echo   {
echo     "origin": ["*"],
echo     "method": ["GET", "HEAD", "OPTIONS"],
echo     "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
echo     "maxAgeSeconds": 3600
echo   }
echo ]
) > %TEMP%\cors.json

gsutil cors set %TEMP%\cors.json gs://%BUCKET_NAME%
del %TEMP%\cors.json
echo CORS configurado

REM 5. Mostrar informacion
echo.
echo ==========================================
echo   Configuracion Completada
echo ==========================================
echo.
echo Informacion del Bucket:
echo    Nombre: gs://%BUCKET_NAME%
echo    URL publica: https://storage.googleapis.com/%BUCKET_NAME%/index.html
echo.
echo Proximos pasos:
echo    1. Build del frontend:
echo       cd frontend
echo       npm run build
echo.
echo    2. Upload de archivos:
echo       gsutil -m rsync -r -d out gs://%BUCKET_NAME%
echo.
echo    3. Verificar:
echo       https://storage.googleapis.com/%BUCKET_NAME%/index.html
echo.
echo    4. (Opcional) Configurar Cloud CDN:
echo       Ver: CLOUD_STORAGE_SETUP.md
echo.
echo ==========================================
echo.
pause
