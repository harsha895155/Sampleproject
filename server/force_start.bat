@echo off
TASKKILL /F /IM node.exe /T > nul 2>&1
echo Starting backend...
start /B node index.js > server.log 2>&1
echo Backend started in background.
timeout /t 5
type server.log
