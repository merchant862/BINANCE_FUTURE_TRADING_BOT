const { exec } = require('child_process');

try
{
    const shellCommand = `pm2 start trading_strategies/bollinger/fifteenMinChartMonitoringInEveryThreeMinutes.js --name "fifteenMinChartMonitoring" -- --leverage=20 --symbol=BTCUSDT --interval=15m --klineLimit=100 --period=20 --stdDev=2 --tradeSide=BUY --asset=BTC --tradePosition=LONG --orderType=MARKET --strategyInterval=180`;
                    
    exec(shellCommand, (error, stdout, stderr) => 
    {
        if (error) console.error(error);
        else console.log('Script running!');
    });
}

catch(error)
{
    console.error(error);
}