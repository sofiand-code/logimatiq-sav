@echo off
echo  Ouverture de la liste des utilisateurs...
cd /d "%~dp0"
start /wait excel.exe "src\data\users.csv"
echo.
echo  Publication en cours...
git add src/data/users.csv
git commit -m "Mise a jour utilisateurs"
git push origin master
echo.
echo  Termine ! L'app est mise a jour dans 1-2 minutes.
echo  https://logimatiq-sav.pages.dev/
echo.
pause
