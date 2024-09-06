const { exec } = require('child_process');
const randToken = require('rand-token');

try
{
    let token = randToken.generate(10);
    const shellCommand = `pm2 start trading_strategies/bollinger/fifteenMinChartMonitoringInEveryThreeMinutes.js --name "${token}" -- --leverage=20 --symbol=BTCUSDT --interval=15m --klineLimit=100 --period=20 --stdDev=2 --tradeSide=BUY --asset=BTC --tradePosition=LONG --orderType=MARKET --strategyInterval=180 --minPercentageDiff=0.01 --maxPercentageDiff=1.5 --balancePercentage=3 --recvWindow=10000`;
                    
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