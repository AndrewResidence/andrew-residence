var express = require('express');
var api = express.Router();
var passport = require('passport');
var path = require('path');

var plivo = require('plivo');
var p = plivo.RestAPI({
    authId: process.env.PLIVO_AUTH_ID,
    authToken: process.env.PLIVO_AUTH_TOKEN,
});

router.get('/', function (req, res) {
    if (req.isAuthenticated()) {

        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                // No connection to database was made - error
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
                    }
                    else {

                        res.send(result.rows);
                    }
                }
                ); // END QUERY

            }

        }); // end pool connect


    } // end req.isAuthenticated
    else {
        console.log('User is not authenticated')
    }
}); //end get shifts