const axios = require('axios');

const createSignature    = require('./../createHMACSignature');
const binanceConfig      = require('./../config');
const marketPriceOfACoin = require('./../marketData/marketPriceOfACoin');

const userAgent = require('./../../../userAgents');

async function queryPositionRisk(data) 
{
    try 
    {
        const headers = 
        { 
            'X-MBX-APIKEY': binanceConfig.API_KEY,
            'User-Agent': userAgent('desktop'),
        };

        const queryString = new URLSearchParams(data).toString();
        const signature = createSignature(binanceConfig.API_SECRET, queryString);
        const url = `${binanceConfig.REST_BASE_URL}/fapi/v2/positionRisk?${queryString}&signature=${signature}`;

        
        const response = await axios.get(url, { headers });
        
        const position = (data.position == "LONG") ? response.data[0] : response.data[1];
        const entryPrice = parseFloat(position.entryPrice);
        const positionSize = parseFloat(position.positionAmt);

        const priceResponse = await marketPriceOfACoin({ symbol: data.symbol });
        const currentPrice = parseFloat(priceResponse);

        let pnl;
        if (positionSize > 0) pnl = (currentPrice - entryPrice) * positionSize;
        else pnl = (entryPrice - currentPrice) * Math.abs(positionSize);

        const initialMargin = (Math.abs(positionSize) * entryPrice) / data.leverage;

        const roi = (pnl / initialMargin) * 100;

        return { Positions: response.data, PnL: pnl, ROI: roi };
    }

    catch (error) 
    {
        console.error(error);
        throw error;
    }
}

/* (async() => 
{
    let data = 
    {
        leverage: 20,
        position: "LONG",
        timestamp: Date.now(),
        symbol: 'BTCUSDT',
        recvWindow: 300000,
    }

    let position = await queryPositionRisk(data);

    console.log(position)

    if(position.Positions[0].positionAmt == "0.000" || position.Positions[1].positionAmt == "0.000")
    {
        console.log("no trade is going on");
    }

    else console.log("trade is going on")
})()
 */
module.exports = queryPositionRisk;