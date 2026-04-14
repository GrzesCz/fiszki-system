# Rejestruje zadanie harmonogramu Windows: po zalogowaniu (z opóźnieniem)
# uruchamia aplikację Docker (Centrum Wiedzy na http://localhost:4321).
# Uruchom raz w PowerShell (może poprosić o potwierdzenie zadania).

$ErrorActionPreference = "Stop"
$TaskName = "CentrumWiedzy-Docker"
$ScriptPath = Join-Path $PSScriptRoot "docker-start.ps1"

if (-not (Test-Path $ScriptPath)) {
    Write-Error "Brak pliku: $ScriptPath"
    exit 1
}

$Argument = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$ScriptPath`""

# Usuń stare zadanie o tej nazwie
Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue

$Action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $Argument
# Po zalogowaniu + 90 s opóźnienia (czas na start Docker Desktop)
$Trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Hours 0)

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $Action `
    -Trigger $Trigger `
    -Settings $Settings `
    -Description "Uruchamia Centrum Wiedzy (Docker) na localhost:4321 po starcie systemu" `
    -RunLevel LeastPrivilege

Write-Host "OK: Zadanie '$TaskName' zarejestrowane (po zalogowaniu; skrypt czeka na Docker)."
Write-Host "Upewnij się, że w Docker Desktop włączone jest: Settings → General → Start Docker Desktop when you sign in to your computer."
Write-Host "Aplikacja: http://localhost:4321/"
