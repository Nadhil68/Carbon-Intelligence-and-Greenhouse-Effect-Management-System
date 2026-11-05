@echo off
title Carbon Intelligence ^& Greenhouse Effect Management System
setlocal enabledelayedexpansion

:: Navigate to script directory
cd /d "%~dp0"

echo =====================================================================
echo   Carbon Intelligence ^& Greenhouse Effect Management System - MKCE
echo =====================================================================
echo.

:: 1. Check if Node.js is installed
where.exe node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not detected on your system.
    echo Please install Node.js 18 or higher from https://nodejs.org/ and retry.
    echo.
    pause
    exit /b 1
)

:: 2. Ensure environment file exists
if not exist ".env" (
    if exist ".env.example" (
        echo [INFO] Creating .env from .env.example...
        copy /y ".env.example" ".env" >nul
    )
)

:: 3. Check and install dependencies if node_modules is missing
if not exist "node_modules\" (
    echo [INFO] node_modules not found. Installing project dependencies...
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] npm install encountered an error.
        pause
        exit /b 1
    )
    echo [INFO] Dependencies installed successfully.
    echo.
)

:: 4. Prompt / Open browser and start development server
echo [INFO] Starting development server at http://localhost:3000/ ...
echo Press Ctrl+C in this window anytime to stop the server.
echo.

:: Automatically open default browser after 2 seconds in background
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:3000"

:: 5. Run Vite dev server
call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo [NOTE] Server terminated.
    pause
)
