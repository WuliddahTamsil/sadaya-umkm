@echo off
echo ====================================
echo Starting Backend Server
echo ====================================
echo.

cd /d %~dp0

echo Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting server...
echo Backend will run on http://localhost:3000
echo Press Ctrl+C to stop
echo.

npm run dev

pause

