const WebSocket = require('ws');

// Binance API credentials
const binanceConfig = require('./../config');
const binanceSDK = require('./../sdk');

// Connect to WebSocket using the listen key
async function connectWebSocket() {
    const listenKey = await binanceSDK.accessKeyForWebSockets(
    {
        recvWindow: 800000,
        timestamp: Date.now(),
    });

    // WebSocket URL for User Data Stream
    const ws = new WebSocket(`${binanceConfig.WEBSOCKET_BASE_URL}/ws/${listenKey}`);

    ws.on('open', () => {
        console.log('Connected to Binance WebSocket for User Data Stream');
    });

    ws.on('message', (message) => {
        const data = JSON.parse(message);

       
        

            const positions = data.a.P; 
            const activePositions = positions.filter(position => position.pa !== '0'); // Only non-zero positions

            if (activePositions.length === 0) {
                console.log('No open positions.');
            } else {
                activePositions.forEach(position => {
                    console.log(`Symbol: ${position.s}, Position: ${position.pa}, Entry Price: ${position.ep}, Unrealized PnL: ${position.upnl}`);
                });
            }
        
    });

    ws.on('close', () => {
        console.log('Disconnected from Binance WebSocket');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
}

// Start the WebSocket connection
connectWebSocket();
