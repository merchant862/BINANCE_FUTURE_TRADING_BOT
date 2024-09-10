const axios = require('axios');
const WebSocket = require('ws');
const binanceConfig = require('./../config');

// Fetch listen key for WebSocket stream
async function getListenKey() {
    try {
        const headers = { 'X-MBX-APIKEY': binanceConfig.API_KEY };
        const url = `${binanceConfig.REST_BASE_URL}/fapi/v1/listenKey`;
        const response = await axios.post(url, null, { headers });
        return response.data.listenKey;
    } catch (error) {
        console.error('Error fetching listenKey:', error);
        throw error;
    }
}

// Refresh the listen key every 30 minutes
async function refreshListenKey(listenKey) {
    try {
        const headers = { 'X-MBX-APIKEY': binanceConfig.API_KEY };
        const url = `${binanceConfig.REST_BASE_URL}/fapi/v1/listenKey`;
        await axios.put(url, null, { headers, params: { listenKey } });
        console.log('ListenKey refreshed');
    } catch (error) {
        console.error('Error refreshing listenKey:', error);
    }
}

// Start WebSocket for account updates
async function startWebSocket() {
    const listenKey = await getListenKey();
    const ws = new WebSocket(`${binanceConfig.WEBSOCKET_BASE_URL}/ws/${listenKey}`);

    ws.on('open', () => {
        console.log('Connected to Binance WebSocket');
    });

    ws.on('message', (message) => {
        const event = JSON.parse(message);
        console.log("WebSocket message received:", event);
        handleEvent(event);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    // Refresh the listen key every 30 minutes
    setInterval(() => refreshListenKey(listenKey), 1800000);
}

// Handle WebSocket events
async function handleEvent(event) {
    if (event.e === 'ACCOUNT_UPDATE') {
        const positions = event.a.P; // Account positions
        console.log("Positions:", positions);

        // Find your specific position
        const position = positions.find(p => p.s === 'BTCUSDT'); // Example symbol
        if (position) {
            console.log(`Position update for BTCUSDT:`, position);

            // Process position information
            processPosition(position);
        }
    }
}

// Process position information
function processPosition(position) {
    const entryPrice = parseFloat(position.entryPrice);
    const positionSize = parseFloat(position.positionAmt);
    const currentPrice = getCurrentMarketPrice(); // You need to implement this function

    let pnl;
    if (positionSize > 0) {
        pnl = (currentPrice - entryPrice) * positionSize;
    } else {
        pnl = (entryPrice - currentPrice) * Math.abs(positionSize);
    }

    const initialMargin = (Math.abs(positionSize) * entryPrice) / position.leverage;
    const roi = (pnl / initialMargin) * 100;

    console.log(`PnL: ${pnl}, ROI: ${roi}%`);
}

function getCurrentMarketPrice() {
    // Fetch current market price (implement this based on your setup)
    return 0; // Placeholder
}

// Run the WebSocket
startWebSocket();
