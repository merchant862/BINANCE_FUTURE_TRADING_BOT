const axios = require('axios');

const binanceConfig = require('./../config');

const userAgent = require('./../../../userAgents');

async function marketPriceOfACoin(data) 
{
    try 
    {
        const headers = { 'User-Agent': userAgent('desktop') };

        const url = `${binanceConfig.REST_BASE_URL}/fapi/v2/ticker/price?
        symbol=${data.symbol}`;
        
        const response = await axios.get(url, { headers });
        
        return Number(response.data.price);
    }

    catch (error) 
    {
        console.error(error);
        throw error;
    }
}

/* (async() => 
{
    let data = { symbol: 'btcusdt' }

    console.log(await marketPriceOfACoin(data));
})() */

module.exports = marketPriceOfACoin;