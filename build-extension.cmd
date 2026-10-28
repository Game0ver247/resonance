@echo off
setlocal
py -3 -c "import sys; assert sys.version_info >= (3,9)" >nul 2>nul
if not errorlevel 1 goto use_py
python -c "import sys; assert sys.version_info >= (3,9)" >nul 2>nul
if not errorlevel 1 goto use_python
echo Resonance requires Python 3.9 or newer. Install Python and reopen this terminal.
exit /b 2
:use_py
py -3 "%~dp0build.py" %*
exit /b %errorlevel%
:use_python
python "%~dp0build.py" %*
exit /b %errorlevel%
