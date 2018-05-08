:start
call npm run dev
echo "Restarting in two seconds..."
timeout 2 > NUL
GOTO start