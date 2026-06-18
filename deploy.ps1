# ─────────────────────────────────────────────────────────────
# TulipTea Deploy Script
# Run: .\deploy.ps1
# Output: deploy_tuliptea.zip
#
# ZIP structure:
#   .htaccess          <- mod_proxy, SPA routing
#   index.html         <- frontend entry
#   assets/            <- built JS/CSS
#   icons/             <- PWA icons
#   manifest.json
#   service-worker.js
#   backend/
#     index.js
#     db.js
#     init.db.js
#     package.json
#     ecosystem.config.js
#     .env              <- pre-filled credentials
# ─────────────────────────────────────────────────────────────

$ErrorActionPreference = 'Stop'
$ROOT = $PSScriptRoot
$OUT  = "$ROOT\_deploy_tmp"
$ZIP  = "$ROOT\deploy_tuliptea.zip"

Write-Host ""
Write-Host "=== TulipTea Deploy Builder ===" -ForegroundColor Cyan

# 1. Build frontend
Write-Host "`n[1/4] Building frontend..." -ForegroundColor Yellow
Set-Location $ROOT
npm run build
if ($LASTEXITCODE -ne 0) { throw "Frontend build failed" }
Write-Host "      Done -> dist/" -ForegroundColor Green

# 2. Clean previous output
Write-Host "`n[2/4] Preparing output folder..." -ForegroundColor Yellow
if (Test-Path $OUT) { Remove-Item $OUT -Recurse -Force }
if (Test-Path $ZIP) { Remove-Item $ZIP -Force }
New-Item -ItemType Directory -Path $OUT | Out-Null

# 3. Copy files
Write-Host "`n[3/4] Copying files..." -ForegroundColor Yellow

# --- Frontend: copy all dist/* directly into root ---
Copy-Item "$ROOT\dist\*" "$OUT\" -Recurse -Force

# --- .htaccess: mod_proxy to backend port 9999, SPA fallback ---
$htaccess = @'
Options -MultiViews
RewriteEngine On

# Proxy /api/* requests to Node backend on port 9999
RewriteCond %{REQUEST_URI} ^/api/ [NC]
RewriteRule ^(.*)$ http://127.0.0.1:9999/$1 [P,L]

# SPA fallback — serve index.html for all non-file, non-dir requests
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
'@
Set-Content "$OUT\.htaccess" $htaccess -Encoding Ascii

# --- Backend folder ---
$BE = "$OUT\backend"
New-Item -ItemType Directory -Path $BE | Out-Null

$exclude = @('node_modules', '.env', 'ecosystem.config.js')
Get-ChildItem "$ROOT\server" | Where-Object { $_.Name -notin $exclude } | ForEach-Object {
  Copy-Item $_.FullName "$BE\$($_.Name)" -Recurse -Force
}

# --- .env (pre-filled with real credentials) ---
Set-Content "$BE\.env" @'
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=abstechnologieso_tulip
DB_PASSWORD=BHCTF5xsMuCiM
DB_NAME=abstechnologieso_tulip
PORT=9999
JWT_SECRET=tuliptea_super_secret_key_2026
JWT_EXPIRES_IN=24h
'@ -Encoding Ascii

# --- ecosystem.config.js (PM2 config) ---
Set-Content "$BE\ecosystem.config.js" @'
module.exports = {
  apps: [
    {
      name: 'tuliptea-backend',
      script: 'index.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
'@ -Encoding Ascii

Write-Host "      Files copied" -ForegroundColor Green

# 4. Create ZIP
Write-Host "`n[4/4] Creating ZIP..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Compress-Archive -Path "$OUT\*" -DestinationPath $ZIP -Force -ErrorAction Stop
Remove-Item $OUT -Recurse -Force
Write-Host "      Created: deploy_tuliptea.zip" -ForegroundColor Green

Write-Host ""
Write-Host "=== Done! ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Upload & extract deploy_tuliptea.zip to your cPanel root." -ForegroundColor White
Write-Host "Then in terminal:"                                           -ForegroundColor White
Write-Host "  cd backend"                                                -ForegroundColor Yellow
Write-Host "  npm install --production"                                  -ForegroundColor Yellow
Write-Host "  pm2 start ecosystem.config.js"                            -ForegroundColor Yellow
Write-Host "  pm2 save"                                                  -ForegroundColor Yellow
Write-Host ""
