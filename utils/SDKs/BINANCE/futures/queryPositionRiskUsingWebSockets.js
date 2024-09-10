const axios = require('axios');
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

        // Check for ACCOUNT_UPDATE event
        if (data.e === 'ACCOUNT_UPDATE') {
            console.log('Account Update:', data);

            // Extract balances
            const balances = data.a.B;
            balances.forEach(balance => {
                console.log(`Asset: ${balance.a}, Balance: ${balance.wb}`);
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
