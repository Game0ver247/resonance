@echo off
call "%~dp0resonance.cmd" check
set "resonance_exit=%errorlevel%"
pause
exit /b %resonance_exit%
