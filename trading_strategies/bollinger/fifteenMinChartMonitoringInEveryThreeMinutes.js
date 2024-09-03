const args = require('minimist')(process.argv.slice(2));

let binanceSDK              = require('../../utils/SDKs/BINANCE/sdk');
let calculateBollingerBands = require('../../utils/calculateBollinger');

const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

eventEmitter.on('rerun', async(data) => 
{
    setTimeout((async() => 
    {
        await fifteenMinChartMonitoringInEveryThreeMinutes(data)
    }), data.strategyInterval/* 180000 */)
});

async function fifteenMinChartMonitoringInEveryThreeMinutes(data)
{
    try
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
            await binanceConfig.setLeverage(
            {
                symbol: data.symbol,
                leverage: data.leverage,
                timestamp: Date.now(),
            });
            
            let userBalance = await binanceConfig.getBalance();
            let userUSDTBalance = userBalance.find(item => item.asset === data.asset);
    
            if(!userUSDTBalance.availableBalance || userUSDTBalance.availableBalance == 0 || userUSDTBalance.availableBalance == '0.00000000')
            {
                console.log('Not enough balance!\n Re-running the bot!\n\n');
                eventEmitter.emit('rerun', data);
            }
    
            else
            {
                let quantitytoSpend = parseFloat(((parseFloat(userUSDTBalance.availableBalance) / 100) * 1) / parseFloat(marketPriceOfACoin)).toFixed(2);
                
                let placetrade = await binanceConfig.placeTrade(
                {
                    symbol: data.symbol,
                    side: data.tradeSide, //'BUY',
                    positionSide: data.tradePosition, //'LONG',
                    type: data.orderType, //'MARKET', 
                    quantity: quantitytoSpend,
                    //recvWindow: '20000',
                    timestamp: Date.now(),
                });
    
                console.log(placetrade);
                return [percentageDifference, bollingerLowest, marketPriceOfACoin];
            }
        }
    
        else 
        {
            console.log('No buying opportunity!\n Re-running the bot!\n\n');
            eventEmitter.emit('rerun', data);
        }
    }

    catch(error)
    {
        console.error(error);
        eventEmitter.emit('rerun', data);
    }
}

try
{
    let SCRIPT = async() => 
    {
        let data = 
        {
            leverage: args.leverage, //20
            symbol: args.symbol, //'BTCUSDT',
            asset: args.asset, //BTC
            interval: args.interval, //'15m',
            klineLimit: args.klineLimit, //100,
            period: args.period, //20,
            stdDev: args.stdDev, //2,
            tradeSide: args.tradeSide, //'BUY',
            tradePosition: args.tradePosition, //'LONG',
            orderType: args.orderType, //'MARKET', 
            strategyInterval: args.strategyInterval, //180
        }
        
        await fifteenMinChartMonitoringInEveryThreeMinutes(data);
    }

    SCRIPT();
}

catch(error)
{
    console.error(error);
}

//module.exports = fifteenMinChartMonitoringInEveryThreeMinutes;