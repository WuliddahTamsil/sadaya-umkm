# Script untuk fix Git push permission
Write-Host "=== Fix Git Push Permission ===" -ForegroundColor Cyan
Write-Host ""

# Clear cached credentials
Write-Host "Clearing cached credentials..." -ForegroundColor Yellow
git credential-manager-core erase <<< "host=github.com`nprotocol=https`n"

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "1. Try: git push" -ForegroundColor White
Write-Host "2. If prompted, enter your GitHub username and Personal Access Token (not password)" -ForegroundColor White
Write-Host "3. To create Personal Access Token: https://github.com/settings/tokens" -ForegroundColor White
Write-Host ""

