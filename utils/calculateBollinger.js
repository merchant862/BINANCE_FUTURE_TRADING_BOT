const { BollingerBands } = require('technicalindicators');

async function calculateBollingerBands(prices) 
{
  //closePrices = (callback).map(candle => parseFloat(candle.close)).filter(price => !isNaN(price));
  
  const input = 
  {
    period: 20,
    values: prices,
    stdDev: 2, 
  };

  const bbands = BollingerBands.calculate(input);
  
  if (bbands.length === 0) return 'Not enough data points to calculate Bollinger Bands';
  else return bbands;
}

module.exports = calculateBollingerBands;
