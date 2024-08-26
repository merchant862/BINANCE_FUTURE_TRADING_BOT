const axios = require('axios');

const binanceConfig = require('./../config');

async function klineDataOfAContract(contractType, pair, interval, limit) 
{
    try 
    {
        const url = `${binanceConfig.REST_BASE_URL}/fapi/v1/continuousKlines?
        contractType=${contractType}&
        pair=${pair}&
        interval=${interval}&
        limit=${limit}`;
        
        const response = await axios.get(url);
        
        const data = response.data.map(candle => (
        {
            openTime                 : candle[0],
            open                     : candle[1],
            high                     : candle[2],
            low                      : candle[3],
            close                    : candle[4],
            volume                   : candle[5],
            closeTime                : candle[6],
            quoteAssetVolume         : candle[7],
            noOfTrades               : candle[8],
            takerBuyBaseAssetVolume  : candle[9],
            takerBuyQuoteAssetVolume : candle[10],
            ignore                   : candle[11],
        }));
        
        return data;
    }

    catch (error) 
    {
        console.error('Error fetching historical data:', error.response ? error.response.data : error.message);
    }
}

/* (async() => 
{
    console.log(await klineDataOfAContract('PERPETUAL','btcusdt','5m',3))
})() */

module.exports = klineDataOfAContract;