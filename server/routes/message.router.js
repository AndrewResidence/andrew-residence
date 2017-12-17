/* dotenv fetches credentials stored in .env file*/
require('dotenv').config({ path: '../group-project/.env' });
/* for the database connection*/
var pool = require('../modules/pool.js');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
/* for setitng weekly digest and converting format for time*/
var cron = require('node-cron');
var moment = require('moment');
/* credentials for plivo*/
var plivo = require('plivo');
var AUTH_ID = process.env.PLIVO_AUTH_ID;
var AUTH_TOKEN = process.env.PLIVO_AUTH_TOKEN;
var plivoNumber = '16128519117';//rented plivo number
/* credentials for google oauth w/nodemailer*/
var nodemailer = require('nodemailer');
var swig = require('swig-templates');
var GMAIL_USER = process.env.GMAIL_USER;
var REFRESH_TOKEN = process.env.REFRESH_TOKEN;
var ACCESS_TOKEN = process.env.ACCESS_TOKEN;
var CLIENT_ID = process.env.CLIENT_ID;
var CLIENT_SECRET = process.env.CLIENT_SECRET;

console.log('Hello, JEMS! Happy working!');
var phoneNumberArray = [];
var dateArray = [];
var weeklyDigest = cron.schedule('30 12 * * SUN', function () {
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
                            dateArray.push('<li>' + moment(shift.date).format('MMMM Do YYYY') + '<span>' + '------' + shift.shift + '</span></li>');
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
                        let emailMessage = dateArray.join('');
                        var mailOptions = {
                            from: '"Andrew Residence" <andrewresidence2017@gmail.com>', // sender address
                            to: 'martapeterson@gmail.com', // list of receivers
                            subject: 'Weekly Digest from Andrew Residence', // Subject line
                            html: '<p>I wonder how Chris will downplay this?</p><h2>Available Shifts:</h2><ul>' + emailMessage + '</ul><p>Please go to the scheduling app to sign-up for a shift.</p> We appreciate yor support!</p>',
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
}, false);

weeklyDigest.start();

router.post('/urgent', function (req, res) {
    if (req.isAuthenticated()) {
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                if (req.body.adl) {
                    var role = 'ADL';
                    var queryText = 'SELECT "phone" FROM "users" WHERE "role" = $1';
                    db.query(queryText, [role], function (err, result) {
                        done();
                        if (err) {
                            console.log("Error getting phone: ", err);
                            res.sendStatus(500);
                        } else {
                            result.rows.forEach(function (role) {
                                phoneNumberArray.push(role.phone + '<');
                            });
                        }
                    });
                }
                if (req.body.mhw) {
                    var mentalHealthWorker = 'MHW';
                    var mentalHealthWorkerQueryText = 'SELECT "phone" FROM "users" WHERE "role" = $1';
                    db.query(mentalHealthWorkerQueryText, [mentalHealthWorker], function (err, result) {
                        done();
                        if (err) {
                            console.log("Error getting phone: ", err);
                            res.sendStatus(500);
                        } else {
                            console.log('help:', result.rows);
                            result.rows.forEach(function (healthWorker) {
                                phoneNumberArray.push(healthWorker.phone + '<');
                            });
                        }
                    });
                }
                if (req.body.nurse) {
                    var nurse = 'Nurse';
                    var nurseQueryText = 'SELECT "phone" FROM "users" WHERE "role" = $1';
                    db.query(nurseQueryText, [nurse], function (err, result) {
                        done();
                        if (err) {
                            console.log("Error getting phone from Nurse: ", err);
                            res.sendStatus(500);
                        } else {
                            result.rows.forEach(function (nurseWorker) {
                                console.log(nurseWorker.phone);
                                phoneNumberArray.push(nurseWorker.phone + '<');

                            });
                        }
                    });
                }
                var datesForText = req.body.shiftDate;
                var textDates = [];
                for (let i = 0; i < datesForText.length; i++) {
                    moment(datesForText[i]).format('MMM Do YYYY');
                    textDates.push(moment(datesForText[i]).format('MMM Do YYYY') + ' ' + 'Shift:' + '' + req.body.shift);
                }
                var p = plivo.RestAPI({
                    authId: AUTH_ID,
                    authToken: AUTH_TOKEN,
                });//part of plivo library
                var params = {
                    src: plivoNumber, // Sender's phone number with country code
                    dst: '16362211997<',
                    text: 'Urgent Shift Posted:' + '' + textDates,
                };
                // Prints the complete response
                p.send_message(params, function (status, response) {
                    console.log('Status: ', status);
                    console.log('API Response:\n', response);
                });
                res.sendStatus(201);
            }
        });
    } // end req.isAuthenticated //end if statement
    else {
        console.log('User is not authenticated');
    }
}); //end post route for new shifts

router.post('/text', function (req, res) {

    var p = plivo.RestAPI({
        authId: AUTH_ID,
        authToken: AUTH_TOKEN,
    });//part of plivo library
    var params = {
        src: plivoNumber, // Sender's phone number with country code
        dst: '17637448725',
        text: "Be not afraid. You are never alone. The MonGod smiles upon you!",
    };
    // Prints the complete response
    p.send_message(params, function (status, response) {
        console.log('Status: ', status);
        console.log('API Response:\n', response);
    });
    res.sendStatus(status);
});// end of node-cron weekly digest email

module.exports = router;



