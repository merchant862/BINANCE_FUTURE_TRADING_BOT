const axios = require('axios');

const createSignature    = require('./../createHMACSignature');
const binanceConfig      = require('./../config');
const marketPriceOfACoin = require('./../marketData/marketPriceOfACoin');

const userAgent = require('./../../../userAgents');

async function queryPositionBracket(data) 
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
        const url = `${binanceConfig.REST_BASE_URL}/fapi/v1/leverageBracket?${queryString}&signature=${signature}`;

        
        const response = await axios.get(url, { headers });
        
        return response.data[0].brackets;
    }

    catch (error) 
    {
        console.error(error);
        throw error;
    }
}

/* (async() => 
{
    let data = 
    {
        timestamp: Date.now(),
        symbol: 'BTCUSDT',
        recvWindow: 300000,
    }

    let position = await queryPositionBracket(data);

    console.log(position)
})() */

module.exports = queryPositionBracket;