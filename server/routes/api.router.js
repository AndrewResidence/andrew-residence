
require('dotenv').config({ path: './server/.env' });
var express = require('express');
var api = express.Router();
var passport = require('passport');
var path = require('path');
let plivoNumber = '16128519117';

var plivo = require('plivo');

/* credentials for google oauth w/nodemailer and plivo; see .env file for more info*/
var AUTH_ID = process.env.PLIVO_AUTH_ID;
var AUTH_TOKEN = process.env.PLIVO_AUTH_TOKEN;
let GMAIL_USER = process.env.GMAIL_USER;
let REFRESH_TOKEN = process.env.REFRESH_TOKEN;
let ACCESS_TOKEN = process.env.ACCESS_TOKEN;
let CLIENT_ID = process.env.CLIENT_ID;
let CLIENT_SECRET = process.env.CLIENT_SECRET;


process.env.TEAM_JEMS;

api.post('/', function (req, res) {

    let p = plivo.RestAPI({
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
        console.log(p);
        
        console.log('Status: ', status);
        console.log('API Response:\n', response);
    });
    
});

module.exports = api;