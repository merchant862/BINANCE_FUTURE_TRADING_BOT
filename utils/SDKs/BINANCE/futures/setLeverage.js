const axios = require('axios');

const createSignature = require('./../../../createHMACSignature');
const binanceConfig   = require('./../config');

async function setLeverage(symbol, leverage = 1) 
{
    try
    {
        const data = 
        {
            symbol: symbol,
            leverage: leverage,
            //recvWindow: 5000,
            timestamp: Date.now(),
        };

        const headers = { 'X-MBX-APIKEY': binanceConfig.API_KEY };
    
        const queryString = new URLSearchParams(data).toString();
        const signature = createSignature(binanceConfig.API_SECRET, queryString);
        const url = `${binanceConfig.REST_BASE_URL}/fapi/v1/leverage?${queryString}&signature=${signature}`;
    
        
        const response = await axios.post(url, null, { headers });
        console.log(`Leverage set to ${leverage}x for ${symbol}:`, response.data);
    }
    
    catch (error) 
    {
      console.error('Error setting leverage:', error.response ? error.response.data : error.message);
    }
}

module.exports = setLeverage;