Set-Location "d:\claude project"
Write-Host "Current dir: $PWD"

git init
Write-Host "Git init done"

git add .
Write-Host "Git add done"

git commit -m "Initial commit with correct folder structure"
Write-Host "Git commit done"

git branch -M main
Write-Host "Branch renamed to main"

git remote remove origin 2>$null
git remote add origin https://github.com/Saimhassan0003/claude-website.git
Write-Host "Remote added"

Write-Host "Now pushing... (you may be asked for credentials)"
git push -u origin main --force
Write-Host "Push complete!"
