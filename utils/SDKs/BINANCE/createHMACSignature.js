const crypto = require('crypto');

function createSignature(apiSecret, queryString) 
{
  try
  {
    return crypto.createHmac('sha256', apiSecret).update(queryString).digest('hex');
  }

  catch(error)
  {
    throw error;
  }
}

module.exports = createSignature;