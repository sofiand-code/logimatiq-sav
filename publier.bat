@echo off
echo.
echo  Publication de toutes les modifications...
echo  ------------------------------------------------
cd /d "%~dp0"
git add -A
git commit -m "Mise a jour"
git push origin master
echo.
echo  Deploiement en cours sur Cloudflare (1-2 min)...
echo  https://logimatiq-sav.pages.dev/
echo.
pause
