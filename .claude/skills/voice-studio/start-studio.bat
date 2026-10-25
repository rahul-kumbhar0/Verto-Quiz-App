@echo off
REM Windows: double-click. Installs once (needs Python 3.10+ from python.org), then opens the studio in your browser.
cd /d "%~dp0scripts"
if not exist "%USERPROFILE%\voice-studio\models\voices-v1.0.bin" python studio.py setup
python studio.py serve
pause
