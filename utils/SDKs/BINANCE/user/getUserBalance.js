const axios = require('axios');

const createSignature = require('../createHMACSignature');
const binanceConfig   = require('../config');

const userAgent = require('../../../userAgents');

async function getAccountBalance(data) 
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
        const url = `${binanceConfig.REST_BASE_URL}/fapi/v2/balance?${queryString}&signature=${signature}`;

        
        const response = await axios.get(url, { headers });
        
        return response.data
    }

    catch (error) 
    {
        console.error(error);
        throw error;
    }
}

/* (async() => 
{
    console.log(await getAccountBalance(
        { 
            recvWindow: 300000,
            timestamp: Date.now() 
        }))
})()
 */
module.exports = getAccountBalance;