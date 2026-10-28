@echo off
call "%~dp0resonance.cmd" uninstall
set "resonance_exit=%errorlevel%"
pause
exit /b %resonance_exit%
