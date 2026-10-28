@echo off
call "%~dp0resonance.cmd" update
set "resonance_exit=%errorlevel%"
pause
exit /b %resonance_exit%
