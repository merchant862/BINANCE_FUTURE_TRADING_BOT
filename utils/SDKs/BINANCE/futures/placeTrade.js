const axios = require('axios');

const createSignature = require('./../../../createHMACSignature');
const binanceConfig   = require('./../config');

const setLeverage     = require('./setLeverage');

async function placeFuturesOrder(symbol, side, quantity, price, leverage = 1) 
{
    try
    {
        await setLeverage(symbol, leverage);
  
        const data = 
        {
            symbol: symbol,
            side: side,
            type: 'MARKET', 
            quantity: quantity,
            //price: price,
            //timeInForce: 'GTC',
            recvWindow: 5000,
            timestamp: Date.now(),
        };

        const headers = { 'X-MBX-APIKEY': binanceConfig.API_KEY };
    
        const queryString = new URLSearchParams(data).toString();
        const signature = createSignature(binanceConfig.API_SECRET, queryString);
        const url = `${binanceConfig.REST_BASE_URL}/fapi/v1/order?${queryString}&signature=${signature}`;
    
        const response = await axios.post(url, null, { headers });
        console.log(response.data);
    }
    
    catch (error) 
    {
      console.error('Error placing order:', error.response ? error.response.data : error.message);
    }
}

(async() =>
{
    await placeFuturesOrder('btcusdt', 'BUY', 1, 50000/* , 20 */);
})()

module.exports = placeFuturesOrder;