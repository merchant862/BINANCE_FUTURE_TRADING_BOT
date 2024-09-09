const axios = require('axios');

const createSignature = require('./../createHMACSignature');
const binanceConfig   = require('./../config');

const userAgent = require('./../../../userAgents');

async function setLeverage(data) 
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
        const url = `${binanceConfig.REST_BASE_URL}/fapi/v1/leverage?${queryString}&signature=${signature}`;
    
        
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
        symbol: 'btcusdt',
        leverage: 0,
        //recvWindow: 5000,
        timestamp: Date.now(),
    };

    console.log(await setLeverage(data));
})() */

module.exports = setLeverage;