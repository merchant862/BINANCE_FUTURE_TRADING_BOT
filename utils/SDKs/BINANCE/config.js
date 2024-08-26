require('dotenv').config();

let binanceConfig = 
{
    REST_BASE_URL      : process.env.REST_BASE_URL,
    WEBSOCKET_BASE_URL : process.env.WEBSOCKET_BASE_URL,
    API_KEY            : process.env.API_KEY,
    API_SECRET         : process.env.API_SECRET
}

module.exports = binanceConfig;