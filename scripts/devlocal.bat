:start
call npm run dev
echo "Restarting in five seconds..."
timeout 5 > NUL
GOTO start