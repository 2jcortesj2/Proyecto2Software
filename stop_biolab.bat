@echo off
echo ========================================
echo   BioLab LIS - Deteniendo Sistema
echo ========================================
echo.

echo Cerrando Django Backend...
taskkill /FI "WindowTitle eq Django Backend*" /T /F 2>nul

echo Cerrando Vue Frontend...
taskkill /FI "WindowTitle eq Vue Frontend*" /T /F 2>nul

echo.
echo ========================================
echo   Sistema detenido correctamente!
echo ========================================
echo.
pause
