let binanceSDK              = require('../../utils/SDKs/BINANCE/sdk');
let calculateBollingerBands = require('../../utils/calculateBollinger');

async function fifteenMinChartMonitoringInEveryThreeMinutes(data)
{
    let klineData = await binanceSDK.klineData(
    {
        symbol: data.symbol,
        interval: data.interval,
        limit: data.klineLimit
    });

    let closePrices = klineData.map(candle => parseFloat(candle.close)).filter(price => !isNaN(price));

    let BB = await calculateBollingerBands(
    {
        prices: closePrices,
        period: data.period,
        stdDev: data.stdDev
    });

    let bollingerLowest = BB.reduce((min, item) => Math.min(min, item.lower), Infinity);

    let marketPriceOfACoin = await binanceSDK.marketPriceOfACoin({ symbol: data.symbol });

    let percentageDifference = Math.abs((marketPriceOfACoin - bollingerLowest) / bollingerLowest) * 100;
    
    if (percentageDifference >= 0.01 && percentageDifference <= 1) 
    {
        return [percentageDifference, bollingerLowest, marketPriceOfACoin];
    }

    else return false;
}

module.exports = fifteenMinChartMonitoringInEveryThreeMinutes;