const axios = require('axios');

const binanceConfig = require('./../config');

async function klineData(data) 
{
    try 
    {
        const url = `${binanceConfig.REST_BASE_URL}/fapi/v1/klines?
        symbol=${data.symbol}&
        interval=${data.interval}&
        limit=${data.limit}`;
        
        const response = await axios.get(url);
        
        const candles = response.data.map(candle => (
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
        
        return candles;
    }

    catch (error) 
    {
        throw error;
    }
}

/* (async() => 
{
    let data = 
    {
        symbol: 'btcusdt',
        interval: '5m',
        limit: 3,
    }

    console.log(await klineData(data));
})() */

module.exports = klineData;