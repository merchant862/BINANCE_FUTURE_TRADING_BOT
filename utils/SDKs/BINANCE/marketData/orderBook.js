const axios = require('axios');

const binanceConfig = require('./../config');
const filterBidsAndAsksWithADifference = require('./../../../filterBidsAndAsksWithADifference');

async function orderBook(data) 
{
    try 
    {
        const url = `${binanceConfig.REST_BASE_URL}/fapi/v1/depth?
        symbol=${data.symbol}&
        limit=${data.limit}`;
        
        const response = await axios.get(url);
        
        return {
            'symbol': data.symbol,
            'bids'  : filterBidsAndAsksWithADifference(response.data.bids, data.minDifference),
            'asks'  : filterBidsAndAsksWithADifference(response.data.asks, data.minDifference),
        };
    }

    catch (error) 
    {
        throw error;
    }
}

module.exports = orderBook;
