'use strict';
require('dotenv').config();
const nodemailer = require('nodemailer');



nodemailer.createTestAccount((err, account) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
        }
    });

    console.log('logged this', transporter);

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Andrew Residence" <andrewresidence2017@gmail.com>', // sender address
        to: 'joshnothum@gmail.com ', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello from NodeMailer!!!, What up Jems?', // plain text body
        html: '<b>Hello from NodeMailer!!! What up JEMS! This is with Andrew Residence credentials</b>', // html body
        auth: {
            user: process.env.GMAIL_USER,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: process.env.ACCESS_TOKEN,

        }
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});