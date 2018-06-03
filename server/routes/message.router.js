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

// SendGrid 
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
// var SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

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
console.log('I can make logs!!');

let weeklyDigestEmailArray = [];
let weeklyDigestShiftsArray = [];
// weekly digest email that contains all newly availble unfilled shift
function weeklyDigestEmailSend(emails, shifts) {
    console.log('in the weekly send function');
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: {
            personalizations: [
                {
                    to: [
                        {
                            email: 'sarah.soberg@gmail.com',
                        }
                    ],
                    subject: 'Weekly Digest from Andrew Residence',
                },
            ],
            from: {
                email: 'andrewresidence2017@gmail.com',
            },
            content: [
                {
                    type: 'text/plain',
                    value: 'Hello, Email!',
                },
                {
                    type: 'text/html',
                    value: 'Hello, Email!',
                }
            ],
        },
    });
    sg.API(request)
        .then(response => {
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
        })
        .catch(error => {
            //error is an instance of SendGridError
            //The full response is attached to error.response
            console.log(error);
        });
}

// console.log("email time yo!")
// // setup email data 
// let emailMessage = dateArray.join('');
// var mailOptions = {
//     from: '"Andrew Residence" <andrewresidence2017@gmail.com>', // sender address
//     to: userEmails.join(''), // list of receivers
//     subject: 'Weekly Digest from Andrew Residence', // Subject line
//     html: ' <body>' +
//         '<h1>THIS EMAIL IS A TEST</h1>' +
//         '<h1>Andrew Residence</h1><h3>Currently available on-call shifts:</h3><ul>' + emailMessage + '</ul>' +
//         '<p>Please go to the scheduling app to sign-up for a shift.</p>' +
//         '<button style="background-color: #4CAF50;background-color:rgb(255, 193, 7);color: white;padding: 15px 32px;text-align: center;font-size: 16px;border-radius: 5px;border: none;" ><a href="https://andrew-residence.herokuapp.com/" style="text-decoration: none; color: white"/>Let\'s Pick-up Some Shifts!</button>' +
//         '<p> We appreciate yor support!</p></body>',
//     // attachments:[{
//     //     filename:'andrew_residence.png',
//     //     path:'../public/images/andrew_residence.png',
//     //     cid:'headerPicture'
//     // }],
//     auth: {
//         user: GMAIL_USER,
//         refreshToken: REFRESH_TOKEN,
//         accessToken: ACCESS_TOKEN,
//     }
// };
// // send mail with defined transport object
// transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//         console.log(error);
//         res.send(error);
//     }
//     console.log('Message sent: %s', error, info);
//     res.sendStatus(200);
// });
// res.sendStatus(200);


//node-cron function to send weekly recap email
var weeklyEmailTimer = cron.schedule('0 1 22 * * SAT', function () {
    console.log('cron job running');
    // getEmailRecAndShifts();
    weeklyDigestEmailSend(null, null);
})

// get users is a function that uses node-cron to retrieve all the users email in the DB.  It returns a promise and chains to weeklyDigest

function getEmailRecAndShifts() {
    pool.connect(function (errorConnectingToDb, db, done) {
        if (errorConnectingToDb) {
            console.log('Error connecting', errorConnectingToDb);
            return;
        } //end if error connection to db
        else {
            var queryText = "SELECT username AS email FROM users WHERE role = 'Nurse' OR role = 'MHW' OR role = 'ADL';";
            db.query(queryText, function (errorMakingQuery, result) {
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    return;
                } else {
                    console.log(result.rows);
                    weeklyDigestEmailArray = result.rows;
                }
            });
            queryText = "SELECT * FROM post_shifts WHERE (shift_status = 'Open' OR shift_status = 'Pending') AND date > now();";
            db.query(queryText, function (errorMakingQuery, result) {
                done(); // add + 1 to pool
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    return;
                } else {
                    result.rows.forEach(function (shift) {
                        weeklyDigestShiftsArray.push('<p>Shift: ' + moment(shift.date).format('MMMM DD, YYYY') + '<span>' + '<span>&nbsp; &nbsp;</span>' + shift.shift + '</span></p>');
                    });
                    console.log(weeklyDigestShiftsArray);
                }
            })
        }
    })
    // weeklyDigestEmailSend(weeklyDigestEmailArray, weeklyDigestShiftsArray);
}


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
                        res.sendStatus(200);
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

module.exports = router;