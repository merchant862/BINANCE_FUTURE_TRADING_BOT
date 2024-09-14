const args = require('minimist')(process.argv.slice(2));

let binanceSDK              = require('../../utils/SDKs/BINANCE/sdk');
let calculateBollingerBands = require('../../utils/calculateBollinger');

let { mail, emailConfig } = require('./../../utils/SDKs/nodemailer/mail');

const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

let tradesData = []; 

eventEmitter.on('rerun', async(data) => 
{
    setTimeout((async() => 
    {
        await XMinChartMonitoringInEveryXMinutes(data)
    }), data.strategyInterval/* 180000 */)
});

async function XMinChartMonitoringInEveryXMinutes(data)
{
    try
    {
        let queryPosition = await binanceSDK.queryPositionRisk(
        {
            leverage: data.leverage,
            position: data.tradePosition,
            timestamp: Date.now(),
            symbol: data.symbol,
            recvWindow: data.recvWindow,
        });

        if(queryPosition.Positions[0].positionAmt == "0.000" && queryPosition.Positions[1].positionAmt == "0.000")
        {
            await binanceSDK.klineData(
            {
                symbol: data.symbol,
                interval: data.interval,
                limit: data.klineLimit
            })
            .then(async(klineData) => 
            {
                let closePrices = klineData.map(candle => parseFloat(candle.close)).filter(price => !isNaN(price));
        
                let BB = await calculateBollingerBands(
                {
                    prices: closePrices,
                    period: data.period,
                    stdDev: data.stdDev
                });
            
                let bollingerLowest = BB.reduce((min, item) => Math.min(min, item.lower), Infinity);
            
                await binanceSDK.marketPriceOfACoin({ symbol: data.symbol })
                .then(async(marketPriceOfACoin) => 
                {
                    let percentageDifference = Math.abs((marketPriceOfACoin - bollingerLowest) / bollingerLowest) * 100;
                
                    if (percentageDifference >= data.minPercentageDiff && percentageDifference <= data.maxPercentageDiff) 
                    {
                        await binanceSDK.setLeverage(
                        {
                            symbol: data.symbol,
                            leverage: data.leverage,
                            recvWindow: data.recvWindow,
                            timestamp: Date.now(),
                        })
                        .then(async() => 
                        {
                            await binanceSDK.getBalance(
                            { 
                                recvWindow: data.recvWindow,
                                timestamp: Date.now() 
                            })
                            .then(async(userBalance) => 
                            {
                                let userUSDTBalance = userBalance.find(item => item.asset === data.asset);
    
                                if(!userUSDTBalance.availableBalance || userUSDTBalance.availableBalance == 0 || userUSDTBalance.availableBalance == '0.00000000')
                                {
                                    console.log('Not enough balance!\n Re-running the bot!\n\n');
                                    eventEmitter.emit('rerun', data);
                                }
                        
                                else
                                {
                                    await binanceSDK.orderBook(
                                    {
                                        symbol: data.symbol,
                                        limit: data.orderBookValuesLimit,
                                        minDifference: data.orderBookPriceMinimumDifference
                                    })
                                    .then(async(orderBook) => 
                                    {
                                        if(orderBook.bids.length == 0 || !orderBook.bids.length)
                                        {
                                            console.log('Not enough bids in the order book!\n Re-running the bot!\n\n');
                                            eventEmitter.emit('rerun', data);
                                        }
        
                                        else
                                        {
                                            let highestBidPrice = orderBook.bids[0].price;
        
                                            let priceDifferenceBetweenHighestBidPriceAndMarketPrice = Math.abs(highestBidPrice - marketPriceOfACoin);
        
                                            if(priceDifferenceBetweenHighestBidPriceAndMarketPrice <= data.priceDifferenceBetweenHighestBidPriceAndMarketPrice) 
                                            {
                                                //let quantitytoSpend = parseFloat(((parseFloat(userUSDTBalance.availableBalance) / 100) * data.balancePercentage) / parseFloat(marketPriceOfACoin)).toFixed(3);
                                            
                                                let quantitytoSpend = parseFloat((userUSDTBalance.availableBalance * data.leverage * data.balancePercentage / 100) / marketPriceOfACoin).toFixed(3);


                                                /* let placetrade =  */await binanceSDK.placeTrade(
                                                {
                                                    symbol: data.symbol,
                                                    side: data.tradeSide,
                                                    positionSide: data.tradePosition,
                                                    type: data.orderType,
                                                    quantity: quantitytoSpend,
                                                    recvWindow: data.recvWindow,
                                                    timestamp: Date.now(),
                                                })
                                                .then(async(placeTrade) => 
                                                {
                                                    console.log(placeTrade);
                                                    data.quantitytoSpend = quantitytoSpend
                                                    await monitorROIAndPnL(data);
                                                })
                                                .catch((error) => 
                                                {
                                                    console.log(`${error.message}\n Re-running the bot!\n\n`);
                                                    eventEmitter.emit('rerun', data);
                                                });
                                    
                                                /* return [percentageDifference, bollingerLowest, marketPriceOfACoin]; */
                                            }
        
                                            else
                                            {
                                                console.log('Price difference too high!\n Re-running the bot!\n\n');
                                                eventEmitter.emit('rerun', data);
                                            }
                                        }
                                    })
                                    .catch((error) => 
                                    {
                                        console.log(`${error.message}\n Re-running the bot!\n\n`);
                                        eventEmitter.emit('rerun', data);
                                    });
                                }
                            })
                            .catch((error) => 
                            {
                                console.log(`${error.message}\n Re-running the bot!\n\n`);
                                eventEmitter.emit('rerun', data);
                            });
                        })
                        .catch((error) => 
                        {
                            console.log(`${error.message}\n Re-running the bot!\n\n`);
                            eventEmitter.emit('rerun', data);
                        });
                    }
                
                    else 
                    {
                        console.log(`${error.message}\n Re-running the bot!\n\n`);
                        eventEmitter.emit('rerun', data);
                    }
                })
                .catch((error) => 
                {
                    console.log(`${error.message}\n Re-running the bot!\n\n`);
                    eventEmitter.emit('rerun', data);
                });
            })
            .catch((error) => 
            {
                console.log(`${error.message}\n Re-running the bot!\n\n`);
                eventEmitter.emit('rerun', data);
            });
        }

        else
        {
            console.log(`A trade for ${data.symbol} is already placed!\n Re-running the bot!\n\n`);
            eventEmitter.emit('rerun', data);
        }
    }

    catch(error)
    {
        console.error(error);
        eventEmitter.emit('rerun', data);
    }
}

async function monitorROIAndPnL(data, quantitytoSpend) 
{
    try 
    {
        let stopMonitoring = false;

        while (!stopMonitoring) 
        {
            await binanceSDK.queryPositionRisk(
            {
                leverage: data.leverage,
                position: data.tradePosition,
                timestamp: Date.now(),
                symbol: data.symbol,
                recvWindow: data.recvWindow,
            })
            .then(async(positionRisk) => 
            {
                let roi = positionRisk.ROI;
                let pnl = positionRisk.PnL;

                console.log(`Current ROI: ${roi}%`);

                if (roi >= data.positiveROI || roi <= data.negativeROI) 
                {
                    await binanceSDK.setLeverage(
                    {
                        symbol: data.symbol,
                        leverage: data.leverage,
                        recvWindow: data.recvWindow,
                        timestamp: Date.now(),
                    })
                    .then(async() => 
                    {
                        await binanceSDK.placeTrade(
                        {
                            symbol: data.symbol,
                            side: (data.tradeSide == "BUY") ? "SELL" : "BUY",
                            positionSide: data.tradePosition,
                            type: data.orderType,
                            quantity: data.quantitytoSpend,
                            recvWindow: data.recvWindow,
                            timestamp: Date.now(),
                        })
                        .then(async(placeTrade) => 
                        {
                            console.log(placeTrade);
                            console.log(`ROI reached ${roi}%, stopping the bot and closing the position!\n\n`);
                            stopMonitoring = true;
                            console.log(`Trade successfully completed!\n Re-running the bot!\n\n`);

                            tradesData.push(
                            {
                                symbol: data.symbol,
                                roi: roi,
                                pnl: pnl,
                                datetime: (new Date()).toUTCString(),
                            });  

                            let statsText = tradesData.map(trade => `Trade: ${trade.symbol}, ROI: ${trade.roi}%, 
                            PnL: ${trade.pnl} USDT, Time: ${trade.datetime},`).join('\n');

                            let noOfTrades = tradesData.length;

                            if(noOfTrades <=2) eventEmitter.emit('rerun', data);

                            else
                            {
                                let mailOptions = 
                                {
                                    from: emailConfig.host,
                                    to: data.emailToSend,
                                    subject: 'Bot Trade Statistics',
                                    text: `Number of Trades: ${noOfTrades}\nTrade Summary:\n${statsText}`
                                }

                                await mail(mailOptions);

                                noOfTrades = [];

                                eventEmitter.emit('rerun', data);
                            }

                            //process.exit(0);
                        })
                        /* .catch((error) => 
                        {
                            console.log(`${error.message}\n Re-running the bot!\n\n`);
                            eventEmitter.emit('rerun', data);
                        }); */
                    })
                    /* .catch((error) => 
                    {

                    }) */
                } 
            })
            /* .catch((error) => 
            {
                console.log(`${error.message}\n Re-running the bot!\n\n`);
                eventEmitter.emit('rerun', data);
            }); */

            await new Promise(resolve => setTimeout(resolve, data.roiCheckInterval));
        }
    } 
    
    catch (error) 
    {
        throw error;
    }
}

try
{
    let SCRIPT = async() => 
    {
        let data = 
        {
            leverage: args.leverage, //20
            symbol: args.symbol, //'BTCUSDT',
            asset: args.asset, //BTC
            interval: args.interval, //'15m',
            klineLimit: args.klineLimit, //100,
            period: args.period, //20,
            stdDev: args.stdDev, //2,
            tradeSide: args.tradeSide, //'BUY',
            tradePosition: args.tradePosition, //'LONG',
            orderType: args.orderType, //'MARKET', 
            strategyInterval: args.strategyInterval, //180
            balancePercentage: args.balancePercentage, //3
            minPercentageDiff: args.minPercentageDiff, //0.01
            maxPercentageDiff: args.maxPercentageDiff, //1.5
            recvWindow: args.recvWindow, //10000
            priceDifferenceBetweenHighestBidPriceAndMarketPrice: args.priceDifferenceBetweenHighestBidPriceAndMarketPrice, //50
            orderBookValuesLimit: args.orderBookValuesLimit, //10
            orderBookPriceMinimumDifference: args.orderBookPriceMinimumDifference, //100
            positiveROI: args.positiveROI, //8
            negativeROI: args.negativeROI,// -50
            roiCheckInterval: args.roiCheckInterval, //5000
            emailToSend: args.emailToSend // saifk429@gmail.com
        }
        
        await XMinChartMonitoringInEveryXMinutes(data);
    }

    SCRIPT();
}

catch(error)
{
    console.error(error);
}

module.exports = XMinChartMonitoringInEveryXMinutes;