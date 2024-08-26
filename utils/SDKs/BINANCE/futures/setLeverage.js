const axios = require('axios');

const createSignature = require('./../../../createHMACSignature');
const binanceConfig   = require('./../config');

async function setLeverage(data) 
{
    try
    {
        const headers = { 'X-MBX-APIKEY': binanceConfig.API_KEY };
    
        const queryString = new URLSearchParams(data).toString();
        const signature = createSignature(binanceConfig.API_SECRET, queryString);
        const url = `${binanceConfig.REST_BASE_URL}/fapi/v1/leverage?${queryString}&signature=${signature}`;
    
        
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
        symbol: 'btcusdt',
        leverage: 0,
        //recvWindow: 5000,
        timestamp: Date.now(),
    };

    console.log(await setLeverage(data));
})() */

module.exports = setLeverage;