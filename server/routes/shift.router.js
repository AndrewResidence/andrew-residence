var pool = require('../modules/pool.js');
require('dotenv').config();
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var nodemailer = require('nodemailer');
var plivo = require('plivo');
var _ = require('lodash');
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
                var notify = req.body.notify;
                for (var i = 0; i < newShift.shiftDate.length; i++) {
                    var theDate = newShift.shiftDate[i];
                    console.log('theDate', theDate);
                    var queryText = 'INSERT INTO "post_shifts" ("created_by", "date", "urgent", "shift", "adl", "mhw", "nurse", "shift_comments", "notify", "filled", "floor", "shift_status" ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING "shift_status", "shift_id", "filled", "created_by";';
                    db.query(queryText, [createdBy, theDate, newShift.urgent, newShift.shift, newShift.adl, newShift.mhw, newShift.nurse, newShift.comments, [notify], newShift.filled, newShift.floor, newShift.shift_status],
                        function (errorMakingQuery, result) {
                            done();
                            console.log('hey', result.rows[0].shift_status);
                            if (errorMakingQuery) {
                                console.log('Error making query', errorMakingQuery);
                                res.sendStatus(500);
                                return;
                            }
                            else {
                                if (result.rows[0].shift_status === 'Filled') {
                                    var shiftId = result.rows[0].shift_id;
                                    var filledId = result.rows[0].filled;
                                    var confirmedBy = result.rows[0].created_by;
                                    var queryText = 'INSERT INTO "confirmed" ("confirmed_by_id", "user_id", "shift_id") VALUES ($1, $2, $3);';
                                    db.query(queryText, [confirmedBy, filledId, shiftId], function (errorMakingQuery, result) {
                                        // done(); // add + 1 to pool - we have received a result or error
                                        if (errorMakingQuery) {
                                            console.log('Error making query', errorMakingQuery);
                                            res.sendStatus(500)
                                        }
                                        else {
                                            console.log('success')
                                        }
                                    }
                                    ); // END QUERY
                                }

                            }
                            // res.sendStatus(201)
                        });

                }//end for loop
                console.log('Success');
                res.sendStatus(201);
                // done();
            }
        });
    } // end req.isAuthenticated //end if statement
    else {
        console.log('User is not authenticated');
        res.sendStatus(401);
    }
});//end post route for new shifts

//get route for post_shifts 
router.put('/', function (req, res) {
    if (req.isAuthenticated()) {
        console.log('router month details', req.body)
        var firstDayofShifts = req.body.firstDayofShifts;
        var lastDayofShifts = req.body.lastDayofShifts;
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                console.log('hitting the query');
                //equal to the date or between
                var queryText =
                    'SELECT * FROM "post_shifts"' +
                    'WHERE "date" >= $1 AND "date" <= $2;';
                db.query(queryText, [firstDayofShifts, lastDayofShifts], function (errorMakingQuery, result) {
                    done(); // add + 1 to pool
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                        console.log('result.rows in get shifts', result.rows);
                    }
                }); // END QUERY
            }
        }); // end pool connect
    } // end req.isAuthenticated
    else {
        console.log('User is not authenticated');
        res.sendStatus(401);
    }
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
        res.sendStatus(403);
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
                    'UPDATE "pay_period" ' +
                    'SET "start" = ("start" + \'14 days\'::interval )::date, "end" = ("end" + \'14 days\'::interval)::date ' +
                    'WHERE "id" = $1;';
                db.query(queryText, [rowId], function (errorMakingQuery, result) {
                    done();

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
        res.sendStatus(403);
    }
}); //end update pay period dates

//POST shift bids
router.post('/shiftBid', function (req, res) {
    if (req.isAuthenticated()) {
        var shiftBid = req.body;
        console.log('new shift bid', shiftBid);
        console.log('req.body.date', req.body.date);
        var createdBy = req.user.id;
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                var queryText =
                    'INSERT INTO "shift_bids" ("shift_id", "user_id", "staff_comments")' +
                    'VALUES ($1, $2, $3);';
                db.query(queryText, [shiftBid.id, shiftBid.user, shiftBid.staff_comments],
                    function (errorMakingQuery, result) {
                        if (errorMakingQuery) {
                            console.log('Error making query', errorMakingQuery);
                            res.sendStatus(500);
                            return;
                        }
                        else {
                            console.log('posted shift bid');
                            var queryText = 'UPDATE "post_shifts" SET "shift_status" = $1 WHERE "shift_id" = $2;';
                            db.query(queryText, ["Pending", req.body.id],
                                function (errorMakingQuery, result) {
                                    done();
                                    if (errorMakingQuery) {
                                        console.log('Error making query', errorMakingQuery);
                                        res.sendStatus(500);
                                        return;
                                    }
                                    else {
                                        res.sendStatus(201);
                                        console.log('updated shift status in shift table');
                                    }
                                });
                        }
                    });
            }

        }); // end req.isAuthenticated //end if statement
    }
    else {
        console.log('User is not authenticated');
        res.sendStatus(403);
    }
});//end post route for new shifts

//GET Shift bids
router.get('/shiftBid/:today', function (req, res) {
    if (req.isAuthenticated()) {
        var today = req.params.today;
        console.log('today', today);
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                var queryText =
                    'SELECT * FROM "post_shifts"' +
                    'JOIN "shift_bids" ON "post_shifts"."shift_id" = "shift_bids"."shift_id"' +
                    'WHERE "post_shifts"."shift_status" ILIKE $1 AND "post_shifts"."date" >= $2 ORDER BY "post_shifts"."date" ASC;';
                db.query(queryText, ["Pending", today],
                    function (errorMakingQuery, result) {
                        done();
                        if (errorMakingQuery) {
                            console.log('Error making query', errorMakingQuery);
                            res.sendStatus(500);
                            return;
                        }
                        else {
                            console.log('got shift bids');
                            res.send(result.rows);
                        }
                    });
            }

        }); // end req.isAuthenticated //end if statement
    }
    else {
        console.log('User is not authenticated');
        res.sendStatus(403);
    }
});//end post route for new shifts

//GET Shift bids
router.get('/shiftBidToConfirm/:id', function (req, res) {
    if (req.isAuthenticated()) {
        var shiftId = req.params.id;
        console.log('shiftId', shiftId);
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                var queryText = 'SELECT "post_shifts".*, "shift_bids"."shift_id", "shift_bids"."bid_id", "shift_bids"."staff_comments", "users"."id", "users"."name", "users"."role" FROM "shift_bids" JOIN "users" ON "shift_bids"."user_id" ="users".id JOIN "post_shifts" ON "post_shifts"."shift_id" = "shift_bids"."shift_id" WHERE "shift_bids"."shift_id" = $1;';
                db.query(queryText, [shiftId], function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                        return;
                    }
                    else {
                        console.log('got shift bids');
                        res.send(result.rows);
                    }
                });
            }
        }); // end req.isAuthenticated //end if statement
    }
    else {
        console.log('User is not authenticated');
        res.sendStatus(403);
    }
});//end post route for new shifts

//POST confirmed shift
// When a supervisor confirms a staff person for a shift, post the shift in the 'confirmed' table and update the 'post_shifts' table so the shift status is 'filled'. 
router.post('/confirm', function (req, res) {
    if (req.isAuthenticated()) {
        var staffMember = req.body;
        console.log('confirming staff', staffMember);
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                var queryText =
                    'INSERT INTO "confirmed" ("shift_id", "user_id", "shift_bid_id", "confirmed_by_id")' +
                    'VALUES ($1, $2, $3, $4)';
                db.query(queryText, [staffMember.shift_id, staffMember.id, staffMember.bid_id, req.user.id],
                    function (errorMakingQuery, result) {
                        console.log(result.rows[0]);

                        if (errorMakingQuery) {
                            console.log('Error making query', errorMakingQuery);
                            res.sendStatus(500);


                            return;
                        }
                        else {
                            console.log('staff added to confirmed table');
                            var queryText = 'UPDATE "post_shifts" SET "shift_status" = $1 WHERE "shift_id" = $2;';
                            db.query(queryText, ["Filled", req.body.shift_id],
                                function (errorMakingQuery, result) {
                                    done();
                                    if (errorMakingQuery) {
                                        console.log('Error making query', errorMakingQuery);
                                        res.sendStatus(500);
                                        return;
                                    }
                                    else {

                                        res.sendStatus(201);
                                        console.log('updated shift status in shift table');
                                    }
                                });
                        }
                    });
            }

        }); // end req.isAuthenticated //end if statement
    }
    else {
        console.log('User is not authenticated');
        res.sendStatus(403);
    }
});//end post route for new shifts


router.put('/getmyshifts', function (req, res) {
    if (req.isAuthenticated()) {
        var userId = req.user.id;
        var firstDayofShifts = req.body.firstDayofShifts;
        var lastDayofShifts = req.body.lastDayofShifts;
        console.log('get my shifts dates', req.body);
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                var queryText =
                    'SELECT "post_shifts"."date", "post_shifts"."shift", "post_shifts"."shift_comments", "post_shifts"."shift_status", "post_shifts"."mhw", "post_shifts"."nurse", "post_shifts"."adl", "user_shifts"."shift_id"' +
                    'FROM  "user_shifts" JOIN "post_shifts"' +
                    'ON "user_shifts"."shift_id" = "post_shifts"."shift_id"' +
                    'WHERE "post_shifts"."date" > $1 AND "post_shifts"."date" < $2 AND "user_shifts"."user_id" = $3;';
                db.query(queryText, [firstDayofShifts, lastDayofShifts, userId], function (errorMakingQuery, result) {
                    done(); // add + 1 to pool

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
        res.sendStatus(401);
    }
}); //end get shifts

// 'SELECT "post_shifts".*, "users"."name", "shift_bids"."bid_id", "shift_bids"."staff_comments" FROM (("post_shifts"' +
// 'JOIN "shift_bids" ON "post_shifts"."shift_id" = "shift_bids"."shift_id")' +
// 'JOIN "users" ON "shift_bids"."user_id" = "users".id)' + 
// 'WHERE "post_shifts"."shift_status" = $1' +  
// 'ORDER BY "post_shifts"."date" ASC;'

//GET confirmed shifts

// delete shift from post_shifts
router.delete('/delete:id/', function (req, res) {
    if (req.isAuthenticated()) {
        var deleteShift = req.params.id;
        console.log('delete:', deleteShift);
        pool.connect(function (err, client, done) {
            if (err) {
                console.log("Error connecting: ", err);
                res.sendStatus(500);
            }
            var queryText = 'DELETE FROM "post_shifts" WHERE "shift_id" = $1;';
            client.query(queryText, [deleteShift], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                }
                else {
                    res.sendStatus(201); // send back success
                }
            } //end query function 
            ); // end query parameters
        } //end pool function
        ); // end pool connect     
    }// end if req.isAuthenticated
    else {
        console.log('User is not authenticated');
        res.sendStatus(401);
        // TODO: return response
    } //end authentication else statement
}
); //end delete route

router.put('/update/:id', function (req, res) {
    if (req.isAuthenticated()) {
        var shiftId = req.params.id;
        console.log('req.body', req.body);
        var updatedShift = req.body;
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                var queryText =
                    'UPDATE "post_shifts"' +
                    'SET "shift" = $1, "shift_comments" = $2, "adl" = $3, "mhw" = $4, "nurse" = $5, "date" = $6, "floor" = $7' +
                    'WHERE "shift_id" = $8;';
                db.query(queryText, [updatedShift.shift, updatedShift.comments, updatedShift.adl, updatedShift.mhw, updatedShift.nurse, updatedShift.date, updatedShift.floor, shiftId], function (errorMakingQuery, result) {
                    done();

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
        res.sendStatus(401);

    }
}); //end update shift

//fill shift route - shows shift filled
router.put('/filledBy/:id', function (req, res) {
    if (req.isAuthenticated()) {
        console.log('thebody', req.body);
        var confirmedBy = req.user.id;
        var filledBy = req.body.filledBy;
        var shift_status = req.body.shift_status;
        var shiftId = req.params.id;
        console.log('shiftId', shiftId);
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                var queryText =
                    'UPDATE "post_shifts"' +
                    'SET "filled" = $1, "shift_status" = $2' +
                    'WHERE "shift_id" = $3;';
                db.query(queryText, [filledBy, shift_status, shiftId], function (errorMakingQuery, result) {
                    done();

                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        pool.connect(function (errorConnectingToDb, db, done) {
                            if (errorConnectingToDb) {
                                console.log('Error connecting', errorConnectingToDb);
                                res.sendStatus(500);
                            } //end if error connection to db
                            else {
                                var queryText =
                                    'INSERT INTO "confirmed" ("confirmed_by_id", "user_id", "shift_id")' +
                                    'VALUES ($1, $2, $3)';
                                db.query(queryText, [confirmedBy, filledBy, shiftId], function (errorMakingQuery, result) {
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
                    } // end 2nd else
                }); //end query
            } //end else
        }//end first pool connect
        ) //end pool connect
    }//end if authenticated
    else {
        console.log('User is not authenticated');
        res.sendStatus(401);
    }

}); //end filledBy route

//get the name of the person that has the shift
router.get('/filled/who/:id', function (req, res) {
    if (req.isAuthenticated()) {
        var filledBy = req.params.id;
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                var queryText = 'SELECT * FROM "confirmed" JOIN "users" on "users"."id" = "confirmed"."user_id" WHERE "confirmed"."shift_id" = $1;';
                db.query(queryText, [filledBy], function (errorMakingQuery, result) {
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
        res.sendStatus(401);
    }
}); //end get the name of the person that has the shift
function notifyingSupers(supers) {
    var emailArray = [];
    return new Promise(function (resolve, reject) {
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } else { //end if error connection to db

                var queryText = 'SELECT "username" FROM "users" WHERE "id" = ANY($1::integer[])';
                db.query(queryText, [supers], function (err, result) {
                    done();
                    if (err) {
                        console.log("Error getting phone: ", err);
                        res.sendStatus(500);
                    } else {

                        console.log('username', _.uniq(result.rows[0].username));
                        console.log('without lodash', result.rows);
                        result.rows.forEach(function (userEmail) {
                            emailArray.push(userEmail.username);
                        });
                        resolve(emailArray);
                    }
                });
            }

        });
    });
}
//post route to confirm table upon adding a shift

function insertPostShift() {
    return new Promise(function (resolve, reject) {
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                reject();
            } else { //end if error connection to db

                var queryText = 'INSERT INTO "confirmed" ("confirmed_by_id", "user_id", "shift_id") VALUES ($1, $2, $3);';
                db.query(queryText, result.rows, function (err, result) {
                    done();
                    if (err) {
                        console.log("Error getting phone: ", err);
                        reject();
                    } else {

                        result.rows.forEach(function (userEmail) {
                            emailArray.push(userEmail.username);
                        });
                        resolve(emailArray);
                    }
                });
            }

        });
    });
};

module.exports = router;


// SELECT "users"."username" FROM "users" JOIN "shift_bids" ON "shift_bids"."user_id" = "users"."id" WHERE "users"."id" = $1;