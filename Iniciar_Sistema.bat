@echo off
title SOAT La Positiva - Servidor Local
color 0A
cls
echo ========================================================
echo    SOAT LA POSITIVA - SISTEMA LOCAL CON PROXY
echo    AGENCIA: TACNA - HUGO CHURA Y ASOCIADOS CORREDORES
echo ========================================================
echo.
echo Iniciando servidor en puerto 3000...
echo.

start "" "http://localhost:3000/index.html"
node server.js

pause

