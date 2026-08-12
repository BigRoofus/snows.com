@echo off
setlocal
set PORT=8000
cd /d "%~dp0"

start "snows.com preview server" /min cmd /c "python -m http.server %PORT%"

timeout /t 1 /nobreak >nul

start "" "http://localhost:%PORT%/index.html"

endlocal
