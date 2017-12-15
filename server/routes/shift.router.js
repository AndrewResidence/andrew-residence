var pool = require('../modules/pool.js');
require('dotenv').config({ path: './server/.env' });
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var nodemailer = require('nodemailer');
var IterateObject = require("iterate-object")
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

//post route for new shifts
router.post('/', function (req, res) {
    if (req.isAuthenticated()) {
        var newShift = req.body;
        console.log('new shift', newShift);
        console.log('req.body.shiftDate', req.body.shiftDate);

        var createdBy = req.user.id;
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                for (var i = 0; i < newShift.shiftDate.length; i++) {
                    var theDate = newShift.shiftDate[i];
                    console.log('theDate', theDate);
                    var queryText =
                        'INSERT INTO "post_shifts" ("created_by", "date", "urgent", "shift", "adl", "mhw", "nurse", "shift_comments", "notify" )' +
                        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)' +
                        'RETURNING "urgent", "adl", "mhw", "nurse";';
                    db.query(queryText, [createdBy, theDate, newShift.urgent, newShift.shift, newShift.adl, newShift.mhw, newShift.nurse, newShift.comments, newShift.notify],
                        function (errorMakingQuery, result) {
                            done();
                            console.log('returned result', result.rows[0]);
                            if (result.rows[0].adl) {
                                var role = 'ADL';
                                var queryText =
                                    'SELECT "phone"' +
                                    'FROM "users"' +
                                    'WHERE "role" = $1';
                                db.query(queryText, [role], function (err, result) {
                                    done();
                                    if (err) {
                                        console.log("Error getting phone: ", err);
                                        res.sendStatus(500);
                                    } else {
                                        console.log('help:', result.rows);

                                        result.rows.forEach(function (role) {
                                            console.log(role.phone + '>');
                                            console.log('');

                                        });
                                    }
                                });
                            }
                            if (errorMakingQuery) {
                                console.log('Error making query', errorMakingQuery);
                                res.sendStatus(500);
                                return;
                                //return urgent column from posted shift; if urgent, use plivo library to send text message
                            } else if (result.rows[0].urgent) {
                                var p = plivo.RestAPI({
                                    authId: AUTH_ID,
                                    authToken: AUTH_TOKEN,
                                }); //part of plivo library

                                var params = {
                                    src: plivoNumber, // Sender's phone number with country code
                                    dst: '6362211997',
                                    text: "Hi, text from Plivo",
                                };
                                // Prints the complete response
                                p.send_message(params, function (status, response) {
                                    console.log('Status: ', status);
                                    console.log('API Response:\n', response);
                                });
                            }
                        });
                } //end for loop
                res.sendStatus(201);
            }
        });
    } // end req.isAuthenticated //end if statement
    else {
        console.log('User is not authenticated');
    }
}); //end post route for new shifts
//get route for post_shifts 
router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                var queryText = 'SELECT * FROM "post_shifts";';
                db.query(queryText, function (errorMakingQuery, result) {
                    done(); // add + 1 to pool
                    console.log('result.rows', result);
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                    }
                }); // END QUERY
            }
        }); // end pool connect
    } // end req.isAuthenticated
    else {
        console.log('User is not authenticated');
    };
}); //end get shifts

//gets the current pay period start and end dates
router.get('/payperiod/getdates', function (req, res) {
    if (req.isAuthenticated()) {
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                var queryText = 'SELECT * FROM "pay_period";';
                db.query(queryText, function (errorMakingQuery, result) {
                    done();
                    console.log('result.rows', result);
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                    }
                }) //end db.query
            } //end else in pool.connect
        }); // end pool connect
    } // end req.isAuthenticated
    else {
        console.log('User is not authenticated');
    }
}); //end get pay period dates

//updates the pay period start and end date in the database
router.put('/payperiod/updatedates/:id', function (req, res) {
    if (req.isAuthenticated()) {
        var rowId = req.params.id;
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                var queryText =
                    'UPDATE "pay_period"' +
                    'SET "start" = ("start" + 14), "end" = ("end" + 14)' +
                    'WHERE "id" = $1;';
                db.query(queryText, [rowId], function (errorMakingQuery, result) {
                    done();
                    console.log('result.rows', result);
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                    }
                }); //end db.query
            } //end else in pool.connect
        }); // end pool connect
    } // end req.isAuthenticated
    else {
        console.log('User is not authenticated');
    }
}) //end update pay period dates

//GET Shift bids





//GET confirmed shifts




module.exports = router;
