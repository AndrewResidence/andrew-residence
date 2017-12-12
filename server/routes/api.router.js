'use strict';
require('dotenv').config({ path: './server/.env' });
var express = require('express');
var api = express.Router();
var passport = require('passport');
var path = require('path');
let plivoNumber = '16128519117';


var plivo = require('plivo');

//process.env.PLIVO_AUTH_ID
//process.env.PLIVO_AUTH_TOKEN


var AUTH_ID = process.env.PLIVO_AUTH_ID;
var AUTH_TOKEN = process.env.PLIVO_AUTH_TOKEN;

var p = plivo.RestAPI({
    authId: AUTH_ID,
    authToken: AUTH_TOKEN,
});

api.post('/', function (req, res) {
    console.log(req.user.phone);
    
    var params = {
        src: plivoNumber, // Sender's phone number with country code
        dst: '16362211997', // Receiver's phone Number with country code
        text: "Hi, text from Plivo", // Your SMS Text Message - English
    };

    // Prints the complete response
    p.send_message(params, function (status, response) {
        console.log(p);
        
        console.log('Status: ', status);
        console.log('API Response:\n', response);
    });
    
});

module.exports = api;