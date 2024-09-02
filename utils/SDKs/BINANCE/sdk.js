const getBalance           = require('./balance/getUserBalance');
const listMarketTrades     = require('./futures/listMarketTrades');
const setLeverage          = require('./futures/setLeverage');
const placeTrade           = require('./futures/placeTrade');
const klineData            = require('./marketData/klineData');
const klineDataOfAContract = require('./marketData/klineDataOfAContract');
const marketPriceOfACoin   = require('./marketData/marketPriceOfACoin');
const orderBook            = require('./marketData/orderBook');

let binanceSDK = 
{
    getBalance,
    listMarketTrades,
    setLeverage,
    placeTrade,
    klineData,
    klineDataOfAContract,
    marketPriceOfACoin,
    orderBook
}

module.exports = binanceSDK;