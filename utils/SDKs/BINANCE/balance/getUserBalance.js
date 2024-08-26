const axios = require('axios');

const createSignature = require('./../../../createHMACSignature');
const binanceConfig   = require('./../config');

async function getAccountBalance() 
{
    try 
    {
        const data = { timestamp: Date.now() };

        const headers = { 'X-MBX-APIKEY': binanceConfig.API_KEY };

        const queryString = new URLSearchParams(data).toString();
        const signature = createSignature(binanceConfig.API_SECRET, queryString);
        const url = `${binanceConfig.REST_BASE_URL}/fapi/v2/balance?${queryString}&signature=${signature}`;

        
        const response = await axios.get(url, { headers });
        console.log(response.data);
    }

    catch (error) 
    {
        console.error('Error fetching balance:', error.response ? error.response.data : error.message);
    }
}

(async() => 
{
    await getAccountBalance()
})()

module.exports = getAccountBalance;