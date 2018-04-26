:start
call git pull
call npm run gameserver
echo "Restarting in ten seconds..."
timeout 5 > NUL
timeout 5 > NUL
GOTO start