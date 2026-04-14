# Usuwa zadanie harmonogramu CentrumWiedzy-Docker
Unregister-ScheduledTask -TaskName "CentrumWiedzy-Docker" -Confirm:$false -ErrorAction SilentlyContinue
Write-Host "Usunięto zadanie CentrumWiedzy-Docker (jeśli istniało)."
