const crypto = require('crypto');

function createSignature(apiSecret, queryString) 
{
  return crypto.createHmac('sha256', apiSecret).update(queryString).digest('hex');
}

module.exports = createSignature;