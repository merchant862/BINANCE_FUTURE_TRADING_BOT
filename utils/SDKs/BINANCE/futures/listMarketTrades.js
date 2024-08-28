const axios = require('axios');

const createSignature = require('./../createHMACSignature');
const binanceConfig   = require('./../config');

async function listMarketTrades(data) 
{
    try 
    {
        const headers = { 'X-MBX-APIKEY': binanceConfig.API_KEY };

        const queryString = new URLSearchParams(data).toString();
        const signature = createSignature(binanceConfig.API_SECRET, queryString);
        const url = `${binanceConfig.REST_BASE_URL}/fapi/v1/trades?${queryString}&signature=${signature}`;

        
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
        symbol: 'btcusdt',
        limit: 10,
    }

    console.log(await listMarketTrades(data));
})() */

module.exports = listMarketTrades;