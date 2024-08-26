const { BollingerBands } = require('technicalindicators');

const klineData = require('./SDKs/BINANCE/marketData/klineData');

async function calculateBollingerBands(callback) 
{
  //const historicalData = await klineData(symbol, '1m', 30);
  
  const closePrices = (callback).map(candle => parseFloat(candle.close)).filter(price => !isNaN(price));
  
  const input = 
  {
    period: 20,
    values: closePrices,
    stdDev: 2, 
  };

  const bbands = BollingerBands.calculate(input);
  
  if (bbands.length === 0) return 'Not enough data points to calculate Bollinger Bands';
  else return bbands;
}

(async() => 
{
    let BB = await calculateBollingerBands(await klineData('solusdt', '1m', 15));
    console.log(BB)
})();
