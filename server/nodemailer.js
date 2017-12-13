'use strict';
require('dotenv').config();
const nodemailer = require('nodemailer');


// from .env file; the .config searches root file for .env and parses information.

let GMAIL_USER = process.env.GMAIL_USER;
let REFRESH_TOKEN = process.env.REFRESH_TOKEN;
let ACCESS_TOKEN = process.env.ACCESS_TOKEN;
let CLIENT_ID = process.env.CLIENT_ID;
let CLIENT_SECRET = process.env.CLIENT_SECRET;


nodemailer.sendMessage((err, account) => {
    // create reusable transporter object
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
        }
    });

    // setup email data 
    let mailOptions = {
        from: '"Andrew Residence" <andrewresidence2017@gmail.com>', // sender address
        to: 'joshnothum@gmail.com ', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello from NodeMailer!!!, What up Jems?', // plain text body
        html: '<b>Hello from NodeMailer!!! What up JEMS!</b>', // html body
        auth: {
            user: GMAIL_USER,
            refreshToken: REFRESH_TOKEN,
            accessToken: ACCESS_TOKEN,
        }
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);

        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
});