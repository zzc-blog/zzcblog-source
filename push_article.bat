@echo off
if "%1"=="" (
    set msg=ио╢╚ндуб
) else (
    set msg=%1
)
git add .
git commit -m "%msg%"
git push