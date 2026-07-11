n@echo off
title SkillBridge Launcher
echo ===================================================
echo   SkillBridge MERN Vocational Training Platform
echo ===================================================
echo.
echo 1. Installing root workspace manager...
call npm install
echo.
echo 2. Re-seeding databases (MongoDB + JSON fallback)...
call npm run seed-all
echo.
echo 3. Launching backend (Port 5000) and frontend (Port 5173)...
echo.
npm run dev
pause
