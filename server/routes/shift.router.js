var pool = require('../modules/pool.js');
require('dotenv').config();
var express = require('express');
var router = express.Router();
var moment = require('moment');
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

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
                    var queryText =
                        'INSERT INTO "post_shifts" ("created_by", "date", "urgent", "shift", "adl", "mhw", "nurse", "shift_comments", "notify", "filled", "floor", "shift_status" )' +
                        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING "shift_status", "shift_id", "filled", "created_by";';
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
                res.sendStatus(201);
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
        var firstDayofShifts = req.body.firstDayofShifts;
        var lastDayofShifts = req.body.lastDayofShifts;
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
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
                        // console.log('result.rows in shifts', result.rows);
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
                        } else {
                            var queryText = 'UPDATE "post_shifts" SET "shift_status" = $1 WHERE "shift_id" = $2;';
                            db.query(queryText, ["Pending", req.body.id],
                                function (errorMakingQuery, result) {
                                    done();
                                    if (errorMakingQuery) {
                                        res.sendStatus(500);
                                        return;
                                    } else {
                                        res.sendStatus(201);
                                        getSupervisorsNotify(shiftBid.id).then(function (email) {
                                            let date = moment(shiftBid.date).format('MM/DD/YY');
                                            let shift = shiftBid.shift;
                                            let role;
                                            if (shiftBid.mhw === true) {
                                                role = 'MHW';
                                            }
                                            if (shiftBid.nurse === true) {
                                                role = 'Nurse';
                                            }
                                            if (shiftBid.adl === true) {
                                                role = 'ADL';
                                            }
                                            let emailContent = '<body>' +
                                                '<p> A request to pick up the shift for: <strong>' + date + ', ' + shift + ', ' + role + ', ' + shiftBid.floor + '</strong>' +
                                                'has been received.</p>' +
                                                '<p> Please log in to review the pending request.</p>'
                                            '</body>'

                                            var request = sg.emptyRequest({
                                                method: 'POST',
                                                path: '/v3/mail/send',
                                                body: {
                                                    personalizations: [
                                                        {
                                                            to: [{ email: 'andrewresidence2017@gmail.com' }],
                                                            bcc: email,
                                                            subject: 'Shift Pickup for: ' + date + ' ' + shift
                                                        },
                                                    ],
                                                    from: {
                                                        email: '"Andrew Residence" <andrewresidence2017@gmail.com>'
                                                    },
                                                    content: [
                                                        {
                                                            type: 'text/plain',
                                                            value: 'Shift Bid',
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
                                                    console.log(response.statusCode);
                                                    console.log(response.body);
                                                    console.log(response.headers);
                                                })
                                                .catch(error => {
                                                    console.log(error.response);
                                                });
                                        })
                                    }
                                });
                        }
                    });
            }
        }); // end req.isAuthenticated //end if statement
    } else {
        console.log('User is not authenticated');
        res.sendStatus(403);
    }
}); //end post route for new shifts


//GET Shift bids
router.get('/shiftBid/:today', function (req, res) {
    if (req.isAuthenticated()) {
        var today = req.params.today;
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
                        } else {
                            console.log('got shift bids');
                            res.send(result.rows);
                        }
                    });
            }

        }); // end req.isAuthenticated //end if statement
    } else {
        console.log('User is not authenticated');
        res.sendStatus(403);
    }
}); //end post route for new shifts

//GET Shift bids
router.get('/shiftBidToConfirm/:id', function (req, res) {
    if (req.isAuthenticated()) {
        var shiftId = req.params.id;
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                var queryText =
                    'SELECT "post_shifts".*, "shift_bids"."shift_id", "shift_bids"."bid_id", "shift_bids"."staff_comments", "users"."id",' +
                    '"users"."name", "users"."role" FROM "shift_bids" JOIN "users" ON "shift_bids"."user_id" ="users".id JOIN "post_shifts"' +
                    'ON "post_shifts"."shift_id" = "shift_bids"."shift_id" WHERE "shift_bids"."shift_id" = $1;';
                db.query(queryText, [shiftId], function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                        return;
                    } else {
                        res.send(result.rows);
                    }
                });
            }
        }); // end req.isAuthenticated //end if statement
    } else {
        console.log('User is not authenticated');
        res.sendStatus(403);
    }
}); //end post route for new shifts

// POST confirmed shift
// When a supervisor confirms a staff person for a shift, post the shift in the 'confirmed' table and update the 'post_shifts' table so the shift status is 'filled'. 
router.post('/confirm', function (req, res) {
    if (req.isAuthenticated()) {
        var staffMember = req.body;
        let role;
        if (staffMember.mhw === true) {
            role = 'MHW';
        }
        if (staffMember.nurse === true) {
            role = 'Nurse';
        }
        if (staffMember.adl === true) {
            role = 'ADL';
        }
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                var queryText =
                    'INSERT INTO "confirmed" ("shift_id", "user_id", "shift_bid_id", "confirmed_by_id")' +
                    'VALUES ($1, $2, $3, $4) RETURNING "shift_id", "user_id"';
                db.query(queryText, [staffMember.shift_id, staffMember.id, staffMember.bid_id, req.user.id],
                    function (errorMakingQuery, result) {
                        let user_id = result.rows[0].user_id;
                        let shift_id = result.rows[0].shift_id;
                        let date = moment(staffMember.date).format('MM/DD/YY');
                        confirmedShiftEmail(user_id, shift_id).then(function (emailDetails) {
                            let emailContent =
                                '<body>' +
                                '<p>Hello, you have been <strong>confirmed</strong> to work the shift below: <br>' +
                                date + ', ' + role + ' Floor: ' + staffMember.floor +
                                '<p>If you are no longer able to work this shift, please reach out to your supervisor.</p>'
                            '</body>'

                            var request = sg.emptyRequest({
                                method: 'POST',
                                path: '/v3/mail/send',
                                body: {
                                    personalizations: [
                                        {
                                            to: [{ email: `${emailDetails.username}` }],
                                            subject: 'Shift confrmation for ' + date + ' ' + role + ' floor: ' + staffMember.floor
                                        },
                                    ],
                                    from: {
                                        email: '"Andrew Residence" <andrewresidence2017@gmail.com>'
                                    },
                                    content: [
                                        {
                                            type: 'text/plain',
                                            value: 'Shift Bid',
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
                                    console.log(response.statusCode);
                                    console.log(response.body);
                                    console.log(response.headers);
                                })
                                .catch(error => {
                                    console.log(error.response);
                                });
                            return notSelectedForShiftEmail(shift_id, user_id, emailDetails);
                        }).then(function (email) {
                            let emails = [];
                            email.emailAddresses.forEach(em => {
                                emails.push({ email: em });
                            })
                            if (email.emailAddresses.join('') !== null && email.emailAddresses.join('') !== '') {
                                let emailContent =
                                    '<body>' +
                                    '<p>Hello, the shift you bid on has been filled by another staff memember. <br>' +
                                    date + ', ' + role + ' Floor: ' + staffMember.floor +
                                    '<p>If you have any questions, please reach out to your supervsior.</p>'
                                '</body>'

                                var request = sg.emptyRequest({
                                    method: 'POST',
                                    path: '/v3/mail/send',
                                    body: {
                                        personalizations: [
                                            {
                                                to: [{ email: 'andrewresidence2017@gmail.com' }],
                                                bcc: emails,
                                                subject: 'Andrew Residence shift filled by another staff member' + date + ' ' + role + ' floor: ' + staffMember.floor
                                            },
                                        ],
                                        from: {
                                            email: '"Andrew Residence" <andrewresidence2017@gmail.com>'
                                        },
                                        content: [
                                            {
                                                type: 'text/plain',
                                                value: 'Shift Bid',
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
                                        console.log(response.statusCode);
                                        console.log(response.body);
                                        console.log(response.headers);
                                    })
                                    .catch(error => {
                                        console.log(error.response);
                                    });
                            }

                        });
                        if (errorMakingQuery) {
                            console.log('Error making query', errorMakingQuery);
                            res.sendStatus(500);
                        } else {
                            var queryText = 'UPDATE "post_shifts" SET "shift_status" = $1 WHERE "shift_id" = $2;';
                            db.query(queryText, ["Filled", req.body.shift_id],
                                function (errorMakingQuery, result) {
                                    done();
                                    if (errorMakingQuery) {
                                        console.log('Error making query', errorMakingQuery);
                                        res.sendStatus(500);
                                        return;
                                    } else {
                                        res.sendStatus(201);
                                    }
                                });
                        }
                    });
            }
        }); // end req.isAuthenticated //end if statement
    } else {
        console.log('User is not authenticated');
        res.sendStatus(403);
    }
}); //end post route for new shifts

//gets logged in user shifts
router.put('/getmyshifts', function (req, res) {
    if (req.isAuthenticated()) {
        var userId = req.user.id;
        var firstDayofShifts = req.body.firstDayofShifts;
        var lastDayofShifts = req.body.lastDayofShifts;
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } //end if error connection to db
            else {
                var queryText =
                    'SELECT "post_shifts"."date", "post_shifts"."shift", "post_shifts"."shift_comments", "post_shifts"."shift_status", "post_shifts"."mhw", "post_shifts"."nurse", "post_shifts"."adl", "user_shifts"."shift_id", "post_shifts"."floor"' +
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

// delete shift from post_shifts
router.delete('/delete:id/', function (req, res) {
    if (req.isAuthenticated()) {
        var deleteShift = req.params.id;
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
                } else {
                    res.sendStatus(201); // send back success
                }
            } //end query function 
            ); // end query parameters
        } //end pool function
        ); // end pool connect     
    } // end if req.isAuthenticated
    else {
        console.log('User is not authenticated');
        res.sendStatus(401);
        // TODO: return response
    } //end authentication else statement
}); //end delete route

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
        } //end first pool connect
        ); //end pool connect
    } //end if authenticated
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
// post route to confirm table upon adding a shift

function confirmedShiftEmail(user_id, shift_id) {
    let emailDetails = {};
    return new Promise(function (resolve, reject) {
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting in confirmedShiftEmail', errorConnectingToDb);
                reject();
            } else { //end if error connection to db
                var queryText = 'SELECT "username"' +
                    'FROM "users"' +
                    'WHERE "id" = $1';
                db.query(queryText, [user_id], function (err, result) {
                    done();
                    if (err) {
                        console.log("Error getting email in confirmedShiftEmail: ", err);
                        reject();
                    } else {
                        emailDetails.username = result.rows[0].username;
                        var queryText = 'SELECT "shift", "date"' +
                            'FROM "post_shifts"' +
                            'WHERE "shift_id" = $1';
                        db.query(queryText, [shift_id], function (err, result) {
                            if (err) {

                                reject();
                            } else {
                                emailDetails.date = result.rows[0].date;
                                emailDetails.shift = result.rows[0].shift;
                                resolve(emailDetails);
                            }
                        });
                    }
                });
            }
        });
    });
};

function notSelectedForShiftEmail(shift_id, confirmed_id, email) {
    var emailArray = [];
    return new Promise(function (resolve, reject) {
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting in notSelectedForShiftEmail', errorConnectingToDb);
                reject();
            } else { //end if error connection to db

                var queryText = 'SELECT "users"."username" FROM "users"' +
                    'JOIN "shift_bids" ON "shift_bids"."user_id" = "users"."id"' +
                    'WHERE "shift_bids"."shift_id" = $1 AND "users"."id" <> $2';
                db.query(queryText, [shift_id, confirmed_id], function (err, result) {
                    done();
                    if (err) {
                        console.log("notSelectedForShiftEmail error ", err);
                        reject();
                    }
                    else {
                        result.rows.forEach(function (userEmail) {
                            emailArray.push(userEmail.username);
                        });
                        email.emailAddresses = emailArray;
                        resolve(email);
                    }
                });
            }
        });
    });
}

function getSupervisorsNotify(shiftId) {
    var superEmails = [];
    return new Promise(function (resolve, reject) {
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting to DB to get supers to notify on shift pick up')
                res.sendStatus(500);
            } else {
                var queryText =
                    'SELECT "username" FROM "super_notify" WHERE "shift_id" = $1';
                db.query(queryText, [shiftId], function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        result.rows.forEach(function (userEmail) {
                            superEmails.push({ email: userEmail.username })
                        })
                        resolve(superEmails);
                    }
                })
            }
        })
    })
}

module.exports = router;