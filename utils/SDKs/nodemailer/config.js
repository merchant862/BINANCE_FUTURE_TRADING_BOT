require('dotenv').config();

let emailConfig = 
{
    host:     process.env.EMAIL_HOST,
    user:     process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS
}

module.exports = emailConfig;