while true
do
    git pull
    tsc -p ./
    npm run gameserver
    
    echo "Restarting in ten seconds..."
    sleep 10
done