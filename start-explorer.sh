NETWORK="$1"
if [ -z "$NETWORK" ]; then
    NETWORK="testnet"
fi
HOST="212.83.146.7" PORT="4200" node "/home/laroue/explorer/build/build.js" --network "$NETWORK"
EXPLORER_HOST="212.83.146.7" EXPLORER_PORT="4200" pm2 start /home/laroue/explorer/express-server.js --name explorer
