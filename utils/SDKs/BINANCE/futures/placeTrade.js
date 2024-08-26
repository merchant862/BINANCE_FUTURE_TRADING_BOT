const axios = require('axios');

const createSignature = require('./../../../createHMACSignature');
const binanceConfig   = require('./../config');

const setLeverage     = require('./setLeverage');

async function placeFuturesOrder(data) 
{
    try
    {
        //await setLeverage(data.symbol, data.leverage);
  
        const headers = { 'X-MBX-APIKEY': binanceConfig.API_KEY };
    
        const queryString = new URLSearchParams(data).toString();
        const signature = createSignature(binanceConfig.API_SECRET, queryString);
        const url = `${binanceConfig.REST_BASE_URL}/fapi/v1/order?${queryString}&signature=${signature}`;
    
        const response = await axios.post(url, null, { headers });
        return response.data;
    }
    
    catch (error) 
    {
        throw error;
    }
}

/* (async() =>
{
    const data = 
    {
        leverage: 20,
        symbol: 'btcusdt',
        side: 'BUY',
        type: 'MARKET', 
        quantity: 1,
        //price: 50000,
        //timeInForce: 'GTC',
        recvWindow: 5000,
        timestamp: Date.now(),
    };

    console.log(await placeFuturesOrder(data));
})() */

module.exports = placeFuturesOrder;