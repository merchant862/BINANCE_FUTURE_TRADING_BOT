const emailConfig = require('./config');

let nodemailer = require("nodemailer");

async function mail(mailOptions)
{
    try
    {
        let transport = nodemailer.createTransport(
        {
            host: emailConfig.host,
            auth:
            {
                user: emailConfig.user,
                pass: emailConfig.password
                
            },
            
        });
        
        await transport.sendMail(mailOptions);
    }

    catch(error)
    {
        console.error(error);
        return false;
    }
}

module.exports = { mail, emailConfig };

