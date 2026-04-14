# Uruchamia Centrum Wiedzy w Dockerze (docker compose up -d).
# Czeka na gotowość demona Docker (np. po starcie Windows).
# Uruchom z katalogu projektu lub przez zaplanowane zadanie.

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

$maxWait = 180
$waited = 0
while ($waited -lt $maxWait) {
    try {
        docker info 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) { break }
    } catch {}
    Start-Sleep -Seconds 3
    $waited += 3
}

if ($waited -ge $maxWait) {
    Write-Error "Docker nie odpowiada po $maxWait s. Uruchom Docker Desktop i spróbuj ponownie."
    exit 1
}

# Bez --build – szybki start; pierwszy raz lub po zmianach kodu: docker compose up -d --build
docker compose up -d
exit $LASTEXITCODE
