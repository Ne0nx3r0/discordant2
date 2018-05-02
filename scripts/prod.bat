:start
call git checkout prod
call git pull
call npm run dev
echo "Restarting in ten seconds..."
timeout 5 > NUL
timeout 5 > NUL
GOTO start