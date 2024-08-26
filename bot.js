
const crypto = require('crypto');

async function getAccountBalance() 
{
  const data = 
  {
    timestamp: Date.now(),
  };

  const queryString = new URLSearchParams(data).toString();
  const signature = createSignature(queryString);
  const url = `${BASE_URL}/fapi/v2/balance?${queryString}&signature=${signature}`;

  try 
  {
    const response = await axios.get(url, { headers });
    console.log(response.data);
  } 
  
  catch (error) 
  {
    console.error('Error fetching balance:', error.response ? error.response.data : error.message);
  }
}

// Example usage:
(async () => {
  await getAccountBalance();
})();
