require('dotenv').config({ path: '../group-project/.env' });
var pool = require('../modules/pool.js');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var nodemailer = require('nodemailer');
var cron = require('node-cron');
var plivo = require('plivo');
var moment = require('moment');
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

console.log('Hello, JEMS! Happy working!');


var weeklyDigest = cron.schedule('45 7 * * FRI', function () {
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
        to: 'martapeterson@gmail.com, joshnothum@gmail, emma.stout01@gmail.com, sarah.soberg@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello from NodeMailer!!!, What up Jems?', // plain text body
        html: '<p>Hello from NodeMailer!!! What up JEMS! This was auto-delivered by using node-cron. Cool, right? I will see you soon!</p>', // html body
        auth: {
            user: GMAIL_USER,
            refreshToken: REFRESH_TOKEN,
            accessToken: ACCESS_TOKEN,
        }
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.send(error);
        }
        console.log('Message sent: %s', info.messageId);
        res.sendStatus(200);
    });
}, false);
weeklyDigest.start();

router.post('/text', function (req, res) {

    var p = plivo.RestAPI({
        authId: AUTH_ID,
        authToken: AUTH_TOKEN,
    });//part of plivo library
    var params = {
        src: plivoNumber, // Sender's phone number with country code
        dst: '17637448725',
        text: "The MonGod provides",
    };
    // Prints the complete response
    p.send_message(params, function (status, response) {
        console.log('Status: ', status);
        console.log('API Response:\n', response);
    });
    res.send(status);
});// end of node-cron weekly digest email

let dateArray = [];
router.post('/email', function (req, res) {
    if (req.isAuthenticated()) {
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                var queryText = 'SELECT * FROM "post_shifts"';
                db.query(queryText, function (errorMakingQuery, result) {
                    done(); // add + 1 to pool
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        result.rows.forEach(function (shift) {
                            dateArray.push('<li>'+ moment(shift.date).format('MMMM Do YYYY') + '<span>'+':'+shift.shift +'</span></li>');
                        });
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
                            let emailMessage = dateArray.join();
                            var mailOptions = {
                                from: '"Andrew Residence" <andrewresidence2017@gmail.com>', // sender address
                                to: 'joshnothum@gmail.com', // list of receivers
                                subject: 'Weekly Digest from Andrew Residence', // Subject line
                                html: '<ul>' + emailMessage + '</ul>',
                                auth: {
                                    user: GMAIL_USER,
                                    refreshToken: REFRESH_TOKEN,
                                    accessToken: ACCESS_TOKEN,
                                }
                            };
                            // send mail with defined transport object
                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                    res.send(error);
                                }
                                console.log('Message sent: %s', info.messageId);
                                res.sendStatus(200);
                            });
                        // res.sendStatus(201);
                    }
                }); // END QUERY
            }
        }); // end pool connect
    } // end req.isAuthenticated
    else {
        console.log('User is not authenticated');
    }
    // console.log('returned result', result.rows[0]);
    // if (result.rows[0].adl) {
    //     var role = 'ADL';
    //     var queryText =
    //         'SELECT "phone"' +
    //         'FROM "users"' +
    //         'WHERE "role" = $1';
    //     db.query(queryText, [role], function (err, result) {
    //         done();
    //         if (err) {
    //             console.log("Error getting phone: ", err);
    //             res.sendStatus(500);
    //         } else {
    //             // console.log('help:', result.rows);
    //             result.rows.forEach(function (role) {
    //                 console.log(role.phone + '>');
    //                 console.log('');

    //             });
    //         }
    //     });
    // }
    // if (errorMakingQuery) {
    //     console.log('Error making query', errorMakingQuery);
    //     res.sendStatus(500);
    //     return;
    //     //return urgent column from posted shift; if urgent, use plivo library to send text message
    // } else if (result.rows[0].urgent) {
    //     var p = plivo.RestAPI({
    //         authId: AUTH_ID,
    //         authToken: AUTH_TOKEN,
    //     }); //part of plivo library

    //     var params = {
    //         src: plivoNumber, // Sender's phone number with country code
    //         dst: '6362211997',
    //         text: "Hi, text from Plivo",
    //     };
    //     // Prints the complete response
    //     p.send_message(params, function (status, response) {
    //         console.log('Status: ', status);
    //         console.log('API Response:\n', response);
    //     });
    //                             // }
    //                         });
    //                 } //end for loop
    //                 res.sendStatus(201);
    //             }
    //         });
    //     } // end req.isAuthenticated //end if statement
    //     else {
    //         console.log('User is not authenticated');
    //     }
    // }); //end post route for new shifts
    //get route for post_shifts 
});// end of post emailMessage route(message.html -> popupTest.Controller - > shift.service ->message.router(/text))

module.exports = router;