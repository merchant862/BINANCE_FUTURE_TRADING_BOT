const schedule = require('node-schedule');
const { exec } = require('child_process');

const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const fifteenMinChartMonitoringInEveryThreeMinutes = require('./trading_strategies/bollinger/fifteenMinChartMonitoringInEveryThreeMinutes');
const binanceConfig = require('./utils/SDKs/BINANCE/sdk');

eventEmitter.on('rerun', async() => 
{
    setTimeout((async() => 
    {
        await tradingBot()
    }), 180)
});

const tradingBot = async () => 
{
    try
    {
        let moniterMarket = await fifteenMinChartMonitoringInEveryThreeMinutes(
        {
            symbol: 'BTCUSDT',
            interval: '15m',
            klineLimit: 100,
            period: 20,
            stdDev: 2
        });
    
        if(!moniterMarket || moniterMarket == false) 
        {
            console.log('No buying opportunity!\n Re-running thr bot!');
            eventEmitter.emit('rerun');
        }

        else
        {
            await binanceConfig.setLeverage(
            {
                symbol: 'BTCUSDT',
                leverage: 20,
                timestamp: Date.now(),
            });
            
            let userBalance = await binanceConfig.getBalance();
            let userUSDTBalance = userBalance.find(item => item.asset === 'BTC');

            if(!userUSDTBalance.availableBalance || userUSDTBalance.availableBalance == 0 || userUSDTBalance.availableBalance == '0.00000000')
            {
                console.log('Not enough balance!\n Re-running thr bot!');
                eventEmitter.emit('rerun');
            }
 
            else
            {
                let coinPrice = await binanceConfig.marketPriceOfACoin({ symbol: 'BTCUSDT' });
                let quantitytoSpend = parseFloat(((parseFloat(userUSDTBalance.availableBalance) / 100) * 1) / parseFloat(coinPrice)).toFixed(2);
                
                let placetrade = await binanceConfig.placeTrade(
                {
                    symbol: 'BTCUSDT',
                    side: 'BUY',
                    positionSide: 'LONG',
                    type: 'MARKET', 
                    quantity: quantitytoSpend,
                    recvWindow: '20000',
                    timestamp: Date.now(),
                });

                console.log(placetrade)
            }
        }
    }

    catch(error)
    {
        console.error(`${error}\n Re-running thr bot!`);
        eventEmitter.emit('rerun');
    }
};

try
{
    let SCRIPT = async() => 
    {
        //setInterval(scrap, CONFIG.lander_to_lander_delay);
        await tradingBot();
    }

    SCRIPT();
}

catch(error)
{
    console.error(error);
}

module.exports = tradingBot;