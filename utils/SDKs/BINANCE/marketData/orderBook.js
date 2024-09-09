const axios = require('axios');

const binanceConfig = require('./../config');
const filterBidsAndAsksWithADifference = require('./../../../filterBidsAndAsksWithADifference');

const userAgent = require('./../../../userAgents');

async function orderBook(data) 
{
    try 
    {
        const headers = { 'User-Agent': userAgent('desktop') };

        const url = `${binanceConfig.REST_BASE_URL}/fapi/v1/depth?
        symbol=${data.symbol}&
        limit=${data.limit}`;
        
        const response = await axios.get(url, { headers });

        return {
            'symbol': data.symbol,
            'bids'  : filterBidsAndAsksWithADifference(response.data.bids, data.minDifference),
            'asks'  : filterBidsAndAsksWithADifference(response.data.asks, data.minDifference),
        };
    }

    catch (error) 
    {
        console.error(error);
        throw error;
    }
}

/* (async() => 
{
    let ORDER_BOOK = await orderBook(
    {
        symbol: "BTCUSDT",
        limit: 10,
        minDifference: 100
    });
    //console.log(ORDER_BOOK);
    //console.log(ORDER_BOOK.bids[0].price)
})() */

module.exports = orderBook;
