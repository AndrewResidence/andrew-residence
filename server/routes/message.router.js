
require('dotenv').config({ path: './server/.env' });
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var nodemailer = require('nodemailer');

var plivo = require('plivo');

/* credentials for plivo*/
var AUTH_ID = process.env.PLIVO_AUTH_ID;
var AUTH_TOKEN = process.env.PLIVO_AUTH_TOKEN;
var plivoNumber = '16128519117';//rented plivo number

/* credentials for google oauth w/nodemailer*/
var GMAIL_USER = process.env.GMAIL_USER;
var REFRESH_TOKEN = process.env.REFRESH_TOKEN;
var ACCESS_TOKEN = process.env.ACCESS_TOKEN;
var CLIENT_ID = process.env.CLIENT_ID;
var CLIENT_SECRET = process.env.CLIENT_SECRET;

router.post('/text', function (req, res) {
    var p = plivo.RestAPI({
        authId: AUTH_ID,
        authToken: AUTH_TOKEN,
    });//part of plivo library
    var params = {
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
        var transporter = nodemailer.createTransport({
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
        var mailOptions = {
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
        transporter.sendMail(mailOptions, function (error, info){
            if (error) {
                console.log(error);
                res.send(error);
            }
            console.log('Message sent: %s', info.messageId);
            res.sendStatus(200);
        });

});// end of post emailMessage route(message.html -> popupTest.Controller - > shift.service ->message.router(/text))

module.exports = router;