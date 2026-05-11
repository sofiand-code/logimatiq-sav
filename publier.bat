@echo off
echo.
echo  Mise a jour de l'application Logimatiq SAV...
echo  ------------------------------------------------
cd /d "%~dp0"
git add src/data/users.csv
git commit -m "Mise a jour utilisateurs"
git push origin master
echo.
echo  Deploiement en cours sur Cloudflare (1-2 min)...
echo  L'app sera disponible sur : https://logimatiq-sav.pages.dev/
echo.
pause
