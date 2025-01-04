@echo off
REM Variables de configuration
set "DB_HOST=localhost"
set "DB_USER=root"
set "DB_PASS=root"
set "DB_NAME=dossiers_db"

REM Vérification de la connexion à MySQL
echo Vérification de la connexion à MySQL...
mysql -h %DB_HOST% -u %DB_USER% -p%DB_PASS% -e "USE %DB_NAME%;" >nul 2>&1

IF %ERRORLEVEL% EQU 0 (
    echo Connexion MySQL réussie.
) ELSE (
    echo Impossible de se connecter à MySQL. Vérifiez vos paramètres de connexion.
    EXIT /B 1
)

PAUSE
