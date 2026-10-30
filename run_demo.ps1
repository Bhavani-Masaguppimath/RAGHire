# RAGHire — Automated Launch Script for Demonstration
# Tagline: Prepare. Practise. Improve. Get Placement-Ready.

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  RAGHire — AI Placement & Career Readiness Platform (All Streams)  " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start Backend Server
Write-Host "[1/3] Starting FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Yellow
$BackendDir = Join-Path $ScriptDir "backend"
$PythonExe = Join-Path $BackendDir "venv\Scripts\python.exe"

Start-Process -FilePath $PythonExe -ArgumentList "-m uvicorn app.main:app --host 127.0.0.1 --port 8000" -WorkingDirectory $BackendDir -WindowStyle Minimized

Start-Sleep -Seconds 3

# 2. Start Frontend Dev Server
Write-Host "[2/3] Starting Vite React Frontend on http://localhost:5173..." -ForegroundColor Yellow
$FrontendDir = Join-Path $ScriptDir "frontend"
Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -WorkingDirectory $FrontendDir -WindowStyle Minimized

Start-Sleep -Seconds 3

# 3. Open Browser
Write-Host "[3/3] Opening RAGHire in your default web browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host "`n✓ RAGHire is running successfully!" -ForegroundColor Green
Write-Host "  • Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  • Backend API & Swagger Docs: http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "  • Pre-seeded Student: student@raghire.edu / Student@123" -ForegroundColor White
Write-Host "  • Pre-seeded Admin:   admin@raghire.edu / Admin@123`n" -ForegroundColor White
