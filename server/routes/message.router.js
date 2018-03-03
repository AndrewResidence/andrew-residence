/* dotenv fetches credentials stored in .env file*/
require('dotenv').config();
/* for the database connection*/
var pool = require('../modules/pool.js');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var fs = require('fs');
var cron = require('node-cron');
var moment = require('moment');
/* credentials for plivo*/
var plivo = require('plivo');
var AUTH_ID = process.env.PLIVO_AUTH_ID;
var AUTH_TOKEN = process.env.PLIVO_AUTH_TOKEN;
var plivoNumber = process.env.PLIVO_NUMBER;//rented plivo number

var p = plivo.RestAPI({
    authId: AUTH_ID,
    authToken: AUTH_TOKEN,
});//part of plivo library
/* credentials for google oauth w/nodemailer*/
var nodemailer = require('nodemailer');
var GMAIL_USER = process.env.GMAIL_USER;
var REFRESH_TOKEN = process.env.REFRESH_TOKEN;
var ACCESS_TOKEN = process.env.ACCESS_TOKEN;
var CLIENT_ID = process.env.CLIENT_ID;
var CLIENT_SECRET = process.env.CLIENT_SECRET;
//object for googleOauth
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
console.log('The Home Stretch!!');


// weekly digest email that contains all newly availble unfilled shift
var dateArray = [];
var weeklyDigest = function (userEmails) {
    pool.connect(function (errorConnectingToDb, db, done) {
        if (errorConnectingToDb) {
            console.log('Error connecting', errorConnectingToDb);
            res.sendStatus(500);
        } //end if error connection to db
        else {
            var queryText = 'SELECT * FROM "post_shifts"' +
                'WHERE "post_shifts"."shift_status" = "Open"' +
                'OR "post_shifts"."shift_status" = "Pending";';
            db.query(queryText, function (errorMakingQuery, result) {
                done(); // add + 1 to pool
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    result.rows.forEach(function (shift) {
                        dateArray.push('<li>' + moment(shift.date).format('MMMM Do YYYY') + '<span>' + '------' + shift.shift + '</span></li>');
                    });

                    // setup email data 
                    let emailMessage = dateArray.join('');
                    var mailOptions = {
                        from: '"Andrew Residence" <andrewresidence2017@gmail.com>', // sender address
                        to: userEmails.join(''), // list of receivers
                        subject: 'Weekly Digest from Andrew Residence', // Subject line
                        html: ' <body style ="background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);">' +
                            '<h1>Good Day!</h1><h3>Available Shifts:</h3><ul>' + emailMessage + '</ul>' +
                            '<p>Please go to the scheduling app to sign-up for a shift.</p>' +
                            '<button style="background-color: #4CAF50;background-color:rgb(255, 193, 7);;color: white;padding: 15px 32px;text-align: center;font-size: 16px;">Let\'s Pick-up Some Shifts!</button>' +
                            '<p> We appreciate yor support!</p></body>',
                        // attachments:[{
                        //     filename:'andrew_residence.png',
                        //     path:'../public/images/andrew_residence.png',
                        //     cid:'headerPicture'
                        // }],
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
};
// get users is a function that uses node-cron to retrieve all the users email in the DB.  It returns a promise and chains to weeklyDigest
var getUsers = function () {
    var emailArray = [];
    return new Promise(function (resolve, reject) {
        cron.schedule('42 13 * * WED', function (userEmails) {
            pool.connect(function (errorConnectingToDb, db, done) {
                if (errorConnectingToDb) {
                    console.log('Error connecting', errorConnectingToDb);
                    res.sendStatus(500);
                } //end if error connection to db
                else {
                    var queryText = 'SELECT "username" FROM "users"';
                    db.query(queryText, function (errorMakingQuery, result) {
                        done(); // add + 1 to pool
                        if (errorMakingQuery) {
                            console.log('Error making query', errorMakingQuery);
                            res.sendStatus(500);
                        } else {
                            result.rows.forEach(function (emails) {
                                emailArray.push(emails.username + ',');
                            });
                            resolve(emailArray);
                        }
                    });
                }
            });
        });
    });
};
//get route used to fetch staff phone numbers. Phone numbers are used to send text message indicating the urgent need for that staff member's role.
var phoneNumberArray = [];
router.post('/urgent', function (req, res) {
    if (req.isAuthenticated()) {
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                var roles = [];
                if (req.body.adl) {
                    roles.push('ADL');
                }
                if (req.body.mhw) {
                    roles.push('MHW');
                }
                if (req.body.nurse) {
                    roles.push('Nurse');
                }

                var queryText = 'SELECT "phone" FROM "users" WHERE "role" = ANY($1::varchar[])';
                db.query(queryText, [roles], function (err, result) {
                    done();
                    if (err) {
                        console.log("Error getting phone: ", err);
                        res.sendStatus(500);
                    } else {
                        result.rows.forEach(function (urgent) {
                            console.log('urgent', urgent.phone);
                            phoneNumberArray.push(urgent.phone);
                        });
                        var datesForText = req.body.shiftDate;
                        var textDates = [];
                        console.log(datesForText);
                        for (var i = 0; i < datesForText.length; i++) {

                            textDates.push(moment(datesForText[i]).format('MMM Do YYYY') + ' ' + 'Shift:' + '' + req.body.shift);
                        }


                        var params = {
                            src: plivoNumber, // Sender's phone number with country code
                            dst: phoneNumberArray.join('<'),
                            text: 'Urgent Shift Posted:' + '' + textDates,
                        };
                        p.send_message(params, function (status, response) {
                            console.log('Status: ', status);
                            console.log('API Response:\n', response);

                        });
                    }
                });
            }
        });
        //res.sendStatus(201);
    } // end req.isAuthenticated //end if statement
    else {
        console.log('User is not authenticated');
        res.sendStatus(403);
    }
});
//test route for texting, will be deleted once moved to production
router.post('/text', function (req, res) {
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
    res.send(201);
});
getUsers().then(function (result) {

    console.log('this logged', result.join(''));
});
module.exports = router;