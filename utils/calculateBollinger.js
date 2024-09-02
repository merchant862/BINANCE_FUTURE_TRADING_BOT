const { BollingerBands } = require('technicalindicators');

async function calculateBollingerBands(data) 
{
  try
  {
    //closePrices = (callback).map(candle => parseFloat(candle.close)).filter(price => !isNaN(price));
  
    const input = 
    {
      values: data.prices,
      period: data.period,
      stdDev: data.stdDev, 
    };

    const bbands = BollingerBands.calculate(input);
    
    return bbands;
  }

  catch(error)
  {
    throw error;
  }
}

module.exports = calculateBollingerBands;
