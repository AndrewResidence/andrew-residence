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

//send grid
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
let weeklyDigestEmailArray = [];
let weeklyDigestShiftsArray = [];

//node-cron function to send weekly recap email
var weeklyEmailTimer = cron.schedule('0 0 12 * * WED', function () {
    // console.log('cron job running');
    getEmailRecAndShifts();
})

function getEmailRecAndShifts() {
    return new Promise (function(resolve, reject) {
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                return;
            } //end if error connection to db
            else {
                var queryText = 
                    "SELECT username AS email FROM users WHERE (role = 'Nurse' OR role = 'MHW' OR role = 'ADL') AND (username != 'null') ;";
                db.query(queryText, function (errorMakingQuery, result) {
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        return;
                    } else {
                        weeklyDigestEmailArray = result.rows;
                    }
                });
                queryText = 
                    "SELECT * FROM post_shifts WHERE (shift_status = 'Open' OR shift_status = 'Pending') AND (date > now() AND date < (now() + interval '1 month')) ORDER BY date::DATE;";
                db.query(queryText, function (errorMakingQuery, result) {
                    done(); // add + 1 to pool
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        return;
                    } else {
                        let nurse = '';
                        let mhw = '';
                        let adl = '';
                        result.rows.forEach(function (shift) {
                            if (shift.nurse === true) {
                                nurse = 'Nurse';
                            }
                            if (shift.mhw === true) {
                                mhw = 'MHW';
                            }
                            if (shift.adl === true) {
                                adl = 'ADL';
                            }
                            weeklyDigestShiftsArray.push('<p>Shift: ' + moment(shift.date).format('MMMM DD, YYYY') + ' ' + 
                                '<span>Floor: ' + shift.floor + '</span>' +
                                '<span>' + '<span>&nbsp; &nbsp;</span>' + shift.shift + 
                                '<span>&nbsp; &nbsp;</span>' + nurse + 
                                '<span>&nbsp; &nbsp;</span>' + mhw + 
                                '<span>&nbsp; &nbsp;</span>' + adl + 
                                '</span></p>');
                            [nurse, mhw, adl] = ['', '', ''];
                        });
                        resolve(weeklyDigestEmailArray, weeklyDigestShiftsArray);
                        weeklyDigestEmailSend(weeklyDigestEmailArray, weeklyDigestShiftsArray);
                    }
                })
            }
        })
    })
}

function weeklyDigestEmailSend(emails, shifts) {
    // console.log(emails);
    let emailContent = 
        `<body>
        <h1>Andrew Residence</h1>
        <h3>Currently available on-call shifts:</h3>
        ${shifts.join('')}
        <p>Please go to the scheduling app to sign-up for a shift.</p>
        <a href="https://andrew-residence.herokuapp.com/">Let\'s Pick-up Some Shifts!</a>
        <p> We appreciate yor support!</p>
        </body>`

    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: {
            personalizations: [
                {
                    to: [{ email: 'andrewresidence2017@gmail.com' }],
                    bcc: emails,
                    subject: 'Weekly Digest from Andrew Residence',
                },
            ],
            from: {
                email: '"Andrew Residence" <andrewresidence2017@gmail.com>',
            },
            content: [
                {
                    type: 'text/plain',
                    value: 'On-call shifts are available at Andrew Residence',
                },
                {
                    type: 'text/html',
                    value: emailContent,
                }
            ],
        },
    });
    sg.API(request)
        .then(response => {
            console.log('SG API', response.statusCode);
            console.log(response.body);
            console.log(response.headers);
        })
        .catch(error => {
            console.log(error.response);
        });
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
                            // console.log('urgent', urgent.phone);
                            phoneNumberArray.push(urgent.phone);
                        });
                        var datesForText = req.body.shiftDate;
                        var textDates = [];
                        // console.log(datesForText);
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
    } // end req.isAuthenticated //end if statement
    else {
        console.log('User is not authenticated');
        res.sendStatus(403);
    }
});

router.post('/textmessage', function (req, res) {
    if (req.isAuthenticated()) {
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {

                // console.log('text message thing', req.body)
                var textMessage = req.body.textMessage;
                var roles = [];
                if (req.body.supervisors) {
                    roles.push('Supervisor')
                }
                if (req.body.allStaff) {
                    roles.push('MHW', 'ADL', 'Nurse', 'Social Worker', 'Therapeutic Recreation', 'Living Skills')
                }
                if (req.body.allStaff === false && req.body.mhw) {
                    roles.push('MHW')
                }
                if (req.body.allStaff === false && req.body.adl) {
                    roles.push('ADL')
                }
                if (req.body.allStaff === false && req.body.rn) {
                    roles.push('Nurse')
                }
                if (req.body.allStaff === false && req.body.sw) {
                    roles.push('Social Worker')
                }
                if (req.body.allStaff === false && req.body.tr) {
                    roles.push('Therapeutic Recreation')
                }
                if (req.body.allStaff === false && req.body.lsi) {
                    roles.push('Living Skills')
                }
                // console.log('the roles', roles)

                var queryText = 'SELECT "phone" FROM "users" WHERE "role" = ANY($1::varchar[])';
                db.query(queryText, [roles], function (err, result) {
                    done();
                    if (err) {
                        console.log("Error getting phone: ", err);
                        res.sendStatus(500);
                    } else {
                        result.rows.forEach(function (urgent) {
                            // console.log('urgent', urgent.phone);
                            phoneNumberArray.push(urgent.phone);
                        });

                        var params = {
                            src: plivoNumber, // Sender's phone number with country code
                            dst: phoneNumberArray.join('<'),
                            text: textMessage,
                        };
                        p.send_message(params, function (status, response) {
                            console.log('Status: ', status);
                            console.log('API Response:\n', response);

                            if (status === 200 || status === 202) {
                                res.sendStatus(200);
                            } else {
                                res.sendStatus(403)
                            }

                        });
                        // res.sendStatus(200);
                    }
                });
            }
        });
    } // end req.isAuthenticated //end if statement
    else {
        // console.log('User is not authenticated');
        res.sendStatus(403);
    }
});

module.exports = router;