const axios = require('axios');

const createSignature = require('./../createHMACSignature');
const binanceConfig   = require('./../config');

const userAgent = require('./../../../userAgents');

async function queryOpenOrder(data) 
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

        
        const response = await axios.get(url, { headers });
        return response.data
    }

    catch (error) 
    {
        throw error;
    }
}

/* (async() => 
{
    let data = 
    {
        timestamp: Date.now(),
        symbol: 'BTCUSDT',
        orderId: 4057046666,
        clientOrderId: '1RAc0wYGtR1JoHt3LXS7F6',
        recvWindow: 30000,
    }

    console.log(await queryOpenOrder(data));
})() */

module.exports = queryOpenOrder;