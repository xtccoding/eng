@echo off
echo Xtcer Tool - 打字学习网站安装脚本
echo ====================================
echo.

echo 1. 安装后端依赖...
cd backend
echo 正在安装Python依赖...
pip install fastapi uvicorn tortoise-orm aiosqlite pydantic pydantic-settings python-multipart httpx python-jose passlib aerich
cd ..

echo 2. 安装前端依赖...
cd frontend
echo 正在安装Node.js依赖...
npm install
cd ..

echo.
echo 安装完成！
echo.
echo 使用方法：
echo 1. 运行 start.bat 启动服务
echo 2. 访问 http://localhost:10087
echo.
pause