var express = require('express');
var api = express.Router();
var passport = require('passport');
var path = require('path');
let plivoNumber = '16128519117';

var plivo = require('plivo');
var p = plivo.RestAPI({
    authId: process.env.PLIVO_AUTH_ID,
    authToken: process.env.PLIVO_AUTH_TOKEN,
});

app.post('/textMessage', function (req, res) {
    console.log(req.user.phone);
    
    var params = {
        src: plivoNumber, // Sender's phone number with country code
        dst: '16362211997', // Receiver's phone Number with country code
        text: "Hi, text from Plivo", // Your SMS Text Message - English
    };

    // Prints the complete response
    p.send_message(params, function (status, response) {
        console.log('Status: ', status);
        console.log('API Response:\n', response);
        console.log('Message UUID:\n', response['message_uuid']);
        console.log('Api ID:\n', response['api_id']);
    });
    
});