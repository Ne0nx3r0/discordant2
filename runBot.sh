while true
do
    git pull
    tsc -p ./
    npm run bot
    
    echo "Restarting in ten seconds..."
    sleep 10
done