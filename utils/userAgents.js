const UALibrary = require('user-agents');

const userAgent = (deviceType) => 
{
    let deviceTypes = ['mobile', 'desktop', 'tablet'];

    if (!deviceTypes.includes(deviceType)) return false;

    else
    {
        const userAgentInstance = new UALibrary({ deviceCategory: deviceType });
        return userAgentInstance.userAgent;
    }
}

module.exports = userAgent;