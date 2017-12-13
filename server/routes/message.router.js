
require('dotenv').config({ path: './server/.env' });
let express = require('express');
let router = express.Router();
let passport = require('passport');
let path = require('path');
const nodemailer = require('nodemailer');

const plivo = require('plivo');

/* credentials for plivo*/
let AUTH_ID = process.env.PLIVO_AUTH_ID;
let AUTH_TOKEN = process.env.PLIVO_AUTH_TOKEN;
let plivoNumber = '16128519117';//rented plivo number

/* credentials for google oauth w/nodemailer*/
let GMAIL_USER = process.env.GMAIL_USER;
let REFRESH_TOKEN = process.env.REFRESH_TOKEN;
let ACCESS_TOKEN = process.env.ACCESS_TOKEN;
let CLIENT_ID = process.env.CLIENT_ID;
let CLIENT_SECRET = process.env.CLIENT_SECRET;

router.post('/text', function (req, res) {
    let p = plivo.RestAPI({
        authId: AUTH_ID,
        authToken: AUTH_TOKEN,
    });//part of plivo library
    let params = {
        src: plivoNumber, // Sender's phone number with country code
        dst: '16362211997',
        text: "Hi, text from Plivo",
    };
    // Prints the complete response
    p.send_message(params, function (status, response) {
        console.log('Status: ', status);
        console.log('API Response:\n', response);
    });

    res.send(status);
});// end of post textMessage route(message.html -> popupTest.Controller - > shift.service ->message.router(/text))

router.post('/email', function (req, res) {
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
                console.log(error);
                res.send(error);
            }
            console.log('Message sent: %s', info.messageId);
            res.sendStatus(200);
        });

});// end of post textMessage route(message.html -> popupTest.Controller - > shift.service ->message.router(/text))

module.exports = router;