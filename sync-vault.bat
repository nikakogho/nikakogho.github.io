@echo off
setlocal EnableExtensions

rem Always run from the repository root, even when launched by double-click.
cd /d "%~dp0"
title Vault sync - Cloudinary and GitHub

echo ============================================================
echo  Vault sync - Cloudinary and GitHub
echo ============================================================
echo.

where node.exe >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or is not available on PATH.
    echo Install the Node.js LTS release, then run this file again.
    goto :failed
)

where npm.cmd >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed or is not available on PATH.
    echo Reinstall the Node.js LTS release, then run this file again.
    goto :failed
)

where git.exe >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or is not available on PATH.
    echo Install Git for Windows, then run this file again.
    goto :failed
)

if not exist ".env" (
    echo ERROR: The required .env file is missing.
    echo.
    echo 1. Copy .env.example to .env in this folder.
    echo 2. Fill in your Cloudinary cloud name, API key, and API secret.
    echo 3. Run this file again.
    goto :failed
)

if not exist "node_modules\cloudinary\package.json" (
    echo Installing the locked Node.js dependencies for the first run...
    echo.
    call npm.cmd ci
    if errorlevel 1 (
        echo.
        echo ERROR: npm could not install the project dependencies.
        goto :failed
    )
    echo.
)

echo Running scripts\sync-vault.js...
echo.
node.exe "scripts\sync-vault.js" %*
set "SYNC_EXIT_CODE=%ERRORLEVEL%"

echo.
if not "%SYNC_EXIT_CODE%"=="0" (
    echo Vault sync FAILED with exit code %SYNC_EXIT_CODE%.
    goto :finish
)

echo Vault sync completed successfully.
goto :finish

:failed
set "SYNC_EXIT_CODE=1"

:finish
echo.
pause
exit /b %SYNC_EXIT_CODE%
