@ECHO OFF
ECHO.
ECHO *** BACKEND ***
CD backend

REM *** Install uv if it doesn't exist ***
WHERE /q uv
IF %ERRORLEVEL% NEQ 0 (
    ECHO - Installing uv...
    ECHO ON
    powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
    @ECHO OFF
) ELSE (
    ECHO - uv already installed.
)

IF NOT EXIST .\.venv\ (
    ECHO - Creating .venv... 
    uv venv
) ELSE (
    ECHO - .venv already exists.
)

ECHO - Installing backend packages...
uv sync
CD ..
PAUSE


ECHO.
ECHO *** FRONTEND ***
CD frontend

REM *** Check for npm ***
WHERE /q npm
IF %ERRORLEVEL% NEQ 0 (
    ECHO - npm is not installed. Please install Node.js and npm from https://nodejs.org/ and run this script again.
) ELSE (
    ECHO - Installing frontend packages...
    call npm install
    IF %ERRORLEVEL% NEQ 0 (
        ECHO - npm install failed!
    ) ELSE (
        ECHO - Installation complete.
    )
)

CD ..
PAUSE