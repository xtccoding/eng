@echo off
chcp 65001 >nul
title Xtcer Eng - 英语打字学习

echo ========================================
echo   Xtcer Eng 英语打字学习 启动脚本
echo ========================================
echo.

:: 设置窗口标题便于识别
set BACKEND_TITLE=xtcer-eng-backend-8000
set FRONTEND_TITLE=xtcer-eng-frontend-10087

:: 先尝试关闭之前启动的本项目进程（通过窗口标题）
echo [1/4] 清理旧进程...
taskkill /FI "WINDOWTITLE eq %BACKEND_TITLE%" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq %FRONTEND_TITLE%" /F >nul 2>&1
timeout /t 2 /nobreak >nul

:: 启动后端
echo [2/4] 启动后端服务 (端口 8000)...
start "%BACKEND_TITLE%" cmd /k "cd /d %~dp0backend && echo 后端服务启动中... && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

:: 等待后端启动
echo [3/4] 等待后端就绪...
timeout /t 5 /nobreak >nul

:: 启动前端
echo [4/4] 启动前端服务 (端口 10087)...
start "%FRONTEND_TITLE%" cmd /k "cd /d %~dp0frontend && echo 前端服务启动中... && npm run dev"

echo.
echo ========================================
echo   启动完成！
echo ========================================
echo.
echo   前端地址: http://localhost:10087
echo   后端地址: http://localhost:8000
echo   API文档:  http://localhost:8000/docs
echo.
echo   关闭此窗口不影响服务运行
echo   如需停止服务，请运行 stop.bat
echo ========================================

:: 创建停止脚本
(
echo @echo off
echo chcp 65001 ^>nul
echo echo 正在停止 Xtcer Eng 服务...
echo taskkill /FI "WINDOWTITLE eq %BACKEND_TITLE%" /F ^>nul 2^>^&1
echo taskkill /FI "WINDOWTITLE eq %FRONTEND_TITLE%" /F ^>nul 2^>^&1
echo echo 服务已停止
echo timeout /t 3
) > "%~dp0stop.bat"

pause