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
        var newShift = req.body
        console.log('new shift', newShift)
        console.log('req.body.shiftDate', req.body.shiftDate)

        var createdBy = req.user.id
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                for (var i = 0; i < newShift.shiftDate.length; i++) {
                    var theDate = newShift.shiftDate[i];
                    console.log('theDate', theDate);
                    var queryText = 'INSERT INTO "post_shifts" ("created_by", "date", "urgent", "shift", "adl", "mhw", "nurse", "shift_comments" ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);';
                    db.query(queryText, [createdBy, theDate, newShift.urgent, newShift.shift, newShift.adl, newShift.mhw, newShift.nurse, newShift.comments],
                        function (errorMakingQuery, result) {
                            done();
                            if (errorMakingQuery) {
                                console.log('Error making query', errorMakingQuery);
                                res.sendStatus(500);
                                return;
                            }
                        })
                }//end for loop
                res.sendStatus(201);
            }
        }
        )
    } // end req.isAuthenticated //end if statement
    else {
        console.log('User is not authenticated');
    }
})//end post route for new shifts
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

//POST shift bids
router.post('/shiftBid', function (req, res) {
    if (req.isAuthenticated()) {
        var shiftBid = req.body
        console.log('new shift bid', shiftBid)
        console.log('req.body.date', req.body.date)
        var createdBy = req.user.id
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                var queryText =
                    'INSERT INTO "shift_bids" ("shift_id", "user_id", "staff_comments")' +
                    'VALUES ($1, $2, $3);'
                db.query(queryText, [shiftBid.id, shiftBid.user, shiftBid.comments],
                    function (errorMakingQuery, result) {
                        done();
                        if (errorMakingQuery) {
                            console.log('Error making query', errorMakingQuery);
                            res.sendStatus(500);
                            return
                        }
                        else {
                            console.log('posted shift bid');
                            var queryText = 'UPDATE "post_shifts" SET "shift_status" = $1 WHERE "shift_id" = $2;'
                            db.query(queryText, ["Pending", req.body.id],
                                function (errorMakingQuery, result) {
                                    done();
                                    if (errorMakingQuery) {
                                        console.log('Error making query', errorMakingQuery);
                                        res.sendStatus(500);
                                        return
                                    }
                                    else {
                                        res.sendStatus(201);
                                        console.log('updated shift status in shift table');
                                    }
                                })
                        }
                    })
            }

        }) // end req.isAuthenticated //end if statement
    }
    else {
        console.log('User is not authenticated')
        res.sendStatus(403);
    }
})//end post route for new shifts

//GET Shift bids
router.get('/shiftBid', function (req, res) {
    if (req.isAuthenticated()) {
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                var queryText =
                    'SELECT * FROM "post_shifts"' +
                    'JOIN "shift_bids" ON "post_shifts"."shift_id" = "shift_bids"."shift_id"' +
                    'WHERE "post_shifts"."shift_status" = $1;'
                db.query(queryText, ["Pending"],
                    function (errorMakingQuery, result) {
                        done();
                        if (errorMakingQuery) {
                            console.log('Error making query', errorMakingQuery);
                            res.sendStatus(500);
                            return
                        }
                        else {
                            console.log('got shift bids');
                            res.send(result.rows);
                        }
                    })
            }

        }) // end req.isAuthenticated //end if statement
    }
    else {
        console.log('User is not authenticated')
        res.sendStatus(403);
    }
})//end post route for new shifts





//GET confirmed shifts




module.exports = router;