@echo off
title AVRO Storefront Deployer
echo ================================================================
echo       AVRO STOREFRONT & MERCHANT ADMIN PANEL DEPLOYER
echo             TECHNEXT TECHNOLOGIES COMMERCE ENGINE
echo ================================================================
echo.

echo Select deployment mode:
echo   1. Docker Compose (PostgreSQL 16 + Caddy + Next.js)
echo   2. Local Node.js Production Build (Run directly with npm)
echo   3. Initialize Database Only (Prisma db push and seed)
echo.
set /p MODE="Enter choice [1-3] (Default: 2): "
if "%MODE%"=="" set MODE=2

if not exist .env (
    copy .env.example .env >nul
    echo [INFO] Created .env from .env.example.
)

if "%MODE%"=="1" (
    echo.
    echo [INFO] Starting Docker Compose Stack...
    docker compose up -d --build
    echo.
    echo ================================================================
    echo Storefront Running at: http://localhost:3001
    echo Admin Panel:           http://localhost:3001/admin/login
    echo Default Admin Login:   storeadmin@example.com / storeadmin123
    echo ================================================================
    pause
    exit /b 0
)

if "%MODE%"=="2" (
    echo.
    echo [INFO] Installing dependencies...
    call npm install
    echo [INFO] Synchronizing database...
    call npm run db:push
    echo [INFO] Building Next.js for production...
    call npm run build
    echo.
    echo [INFO] Starting store server on port 3001...
    call npm start
    exit /b 0
)

if "%MODE%"=="3" (
    echo.
    echo [INFO] Installing dependencies...
    call npm install
    echo [INFO] Pushing Prisma database schema...
    call npm run db:push
    echo [INFO] Seeding default catalog and theme...
    call npm run db:seed
    echo.
    echo [SUCCESS] Database ready!
    pause
    exit /b 0
)
