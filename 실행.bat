@echo off
chcp 65001 > nul
title Korea Map Master Pro

echo.
echo ==========================================
echo    Korea Map Master Pro
echo ==========================================
echo.

cd /d "%~dp0"

:: Node.js 설치 확인
where node > nul 2>&1
if errorlevel 1 (
    echo [오류] Node.js가 설치되어 있지 않습니다!
    echo.
    echo Node.js를 먼저 설치해주세요:
    echo https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [확인] Node.js 발견!
echo.

:: node_modules 폴더 확인 - 없으면 npm install 실행
if not exist "node_modules" (
    echo [1/2] 필요한 패키지를 설치합니다... ^(최초 1회만^)
    echo      잠시 기다려 주세요...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [오류] 패키지 설치 실패!
        pause
        exit /b 1
    )
    echo.
    echo [완료] 패키지 설치 완료!
    echo.
) else (
    echo [확인] 패키지 이미 설치됨
    echo.
)

echo [2/2] 서버를 시작합니다...
echo.
echo ==========================================
echo    브라우저가 자동으로 열립니다.
echo    종료: 이 창을 닫으세요 또는 Ctrl+C
echo ==========================================
echo.

:: 3초 후 브라우저 열기 (백그라운드)
start "" cmd /c "timeout /t 3 /nobreak > nul && start http://localhost:5173"

:: 개발 서버 실행 (call 사용하여 스크립트 종료 방지)
call npm run dev

:: 서버가 종료된 경우
echo.
echo 서버가 종료되었습니다.
pause
