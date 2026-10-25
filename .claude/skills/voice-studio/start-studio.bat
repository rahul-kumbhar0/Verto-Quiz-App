@echo off
REM Windows: double-click this file. First run installs everything (needs Python 3.10-3.13), then opens the studio.
cd /d "%~dp0scripts"
set PY=
where py >nul 2>nul && py -3.12 -c "print()" >nul 2>nul && set PY=py -3.12
if not defined PY where py >nul 2>nul && set PY=py -3
if not defined PY where python >nul 2>nul && set PY=python
if not defined PY (
  echo Python was not found. Install Python 3.12 from https://www.python.org/downloads/release/python-3128/
  echo and tick "Add python.exe to PATH" on the first screen of the installer.
  pause & exit /b 1
)
echo Using %PY%
set NEED=0
if not exist "%USERPROFILE%\voice-studio\models\voices-v1.0.bin" set NEED=1
"%USERPROFILE%\voice-studio\venv\Scripts\python.exe" -c "import kokoro_onnx, soundfile, pocketsphinx" >nul 2>nul || set NEED=1
if "%NEED%"=="1" (
  %PY% studio.py setup || (pause & exit /b 1)
)
%PY% studio.py serve
pause
