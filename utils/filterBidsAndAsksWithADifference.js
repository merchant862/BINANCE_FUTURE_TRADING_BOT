function filterBidsAndAsksWithADifference(data, minDifference)
{
    try
    {
        const filteredData = [];
        let previousDataPrice = null;
    
        for (const [price, quantity] of data) 
        {
            const priceValue = parseFloat(price);
    
            if (previousDataPrice === null || priceValue <= previousDataPrice - minDifference) 
            {
                filteredData.push({price, quantity});
                previousDataPrice = priceValue;
            }
        }
    
        return filteredData;
    }

    catch(error)
    {
        throw error;
    }
};

module.exports = filterBidsAndAsksWithADifference;