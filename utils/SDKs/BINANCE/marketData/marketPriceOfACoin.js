const axios = require('axios');

const binanceConfig = require('./../config');

async function marketPriceOfACoin(data) 
{
    try 
    {
        const url = `${binanceConfig.REST_BASE_URL}/fapi/v2/ticker/price?
        symbol=${data.symbol}`;
        
        const response = await axios.get(url);
        
        return Number(response.data.price);
    }

    catch (error) 
    {
        throw error;
    }
}

/* (async() => 
{
    let data = { symbol: 'btcusdt' }

    console.log(await marketPriceOfACoin(data));
})() */

module.exports = marketPriceOfACoin;