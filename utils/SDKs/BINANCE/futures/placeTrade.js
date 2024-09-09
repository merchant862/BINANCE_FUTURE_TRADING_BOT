const axios = require('axios');

const createSignature = require('./../createHMACSignature');
const binanceConfig   = require('./../config');

const userAgent = require('./../../../userAgents');

async function placeFuturesOrder(data) 
{
    try
    {
        const headers = 
        { 
            'X-MBX-APIKEY': binanceConfig.API_KEY, 
            'User-Agent': userAgent('desktop'),
        };
    
        const queryString = new URLSearchParams(data).toString();
        const signature = createSignature(binanceConfig.API_SECRET, queryString);
        const url = `${binanceConfig.REST_BASE_URL}/fapi/v1/order?${queryString}&signature=${signature}`;
    
        const response = await axios.post(url, null, { headers });
        return response.data;
    }
    
    catch (error) 
    {
        console.error(error);
        throw error;
    }
}

/* (async() =>
{
    const data = 
    {
        leverage: 20,
        symbol: 'BTCUSDT',
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