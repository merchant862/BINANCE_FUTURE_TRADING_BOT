const { exec } = require('child_process');
const randToken = require('rand-token');

try
{
    let token = randToken.generate(10);
    const shellCommand = `pm2 start trading_strategies/bollinger/XMinChartMonitoringInEveryXMinutes.js --name "${token}" -- --leverage=20 --symbol=BTCUSDT --interval=1m --klineLimit=100 --period=20 --stdDev=2 --tradeSide=BUY --asset=USDT --tradePosition=LONG --orderType=MARKET --strategyInterval=1800 --minPercentageDiff=0.01 --maxPercentageDiff=10 --balancePercentage=10 --recvWindow=30000 --priceDifferenceBetweenHighestBidPriceAndMarketPrice=50 --orderBookValuesLimit=50 --orderBookPriceMinimumDifference=100 --positiveROI=8 --negativeROI=-50 --roiCheckInterval=5000`;
                    
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