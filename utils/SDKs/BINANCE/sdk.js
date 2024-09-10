const getBalance             = require('./user/getUserBalance');
const accessKeyForWebSockets = require('./user/accessKeyForWebSockets');
const listMarketTrades       = require('./futures/listMarketTrades');
const setLeverage            = require('./futures/setLeverage');
const placeTrade             = require('./futures/placeTrade');
const queryPositionRisk      = require('./futures/queryPositionRisk'); 
const klineData              = require('./marketData/klineData');
const klineDataOfAContract   = require('./marketData/klineDataOfAContract');
const marketPriceOfACoin     = require('./marketData/marketPriceOfACoin');
const orderBook              = require('./marketData/orderBook');

let binanceSDK = 
{
    getBalance,
    accessKeyForWebSockets,
    listMarketTrades,
    setLeverage,
    placeTrade,
    queryPositionRisk,
    klineData,
    klineDataOfAContract,
    marketPriceOfACoin,
    orderBook
}

module.exports = binanceSDK;