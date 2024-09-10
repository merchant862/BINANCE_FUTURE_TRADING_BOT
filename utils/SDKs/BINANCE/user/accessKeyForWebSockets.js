const axios = require('axios');

const createSignature = require('../createHMACSignature');
const binanceConfig   = require('./../config');

async function accessKeyForWebSockets(data) 
{
    try 
    {
        const headers = { 'X-MBX-APIKEY': binanceConfig.API_KEY };

        const queryString = new URLSearchParams(data).toString();
        const signature = createSignature(binanceConfig.API_SECRET, queryString);
        const url = `${binanceConfig.REST_BASE_URL}/fapi/v1/listenKey?${queryString}&signature=${signature}`;

        const response = await axios.post(url, {}, { headers });
        
        return response.data.listenKey;
    }

    catch (error) 
    {
        console.error(error);
        throw error;
    }
}

/* (async() => 
{
    console.log(await accessKeyForWebSockets(
    { 
        recvWindow: 300000,
        timestamp: Date.now() 
    }))
})() */

module.exports = accessKeyForWebSockets;