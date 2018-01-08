var express = require('express');
var router = express.Router();


var Chance = require('chance'),
    chance = new Chance();
var pool = require('../modules/pool.js');
var encryptLib = require('../modules/encryption');
router.put('/check', function (req, res) {
    var email = req.body.email;

    pool.connect(function (err, client, done) {
        if (err) {
            console.log('connection err ', err);
            done();
        } else {
            client.query("SELECT * FROM users WHERE username = $1", [email], function (err, result) {
                if (err) {
                    console.log('query err ', err);
                    done();
                }

                user = result.rows[0];

                if (!user) {
                    // If no, return an error response
                    // user not found
                    done();
                    res.sendStatus(404);
                } else {
                    // If yes, then generate a random code and store for that user
                    var code = chance.string({ length: 16, pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' });

                    // user found
                    var queryText = 'UPDATE users SET "code" = $1 WHERE "username" = $2;';
                    client.query(queryText, [code, email], function (err, result) {
                        done();
                        // Handle Errors
                        if (err) {
                            console.log('query err ', err);
                            res.sendStatus(500);
                        } else {
                            // Send out an e-mail via node mailer
                            console.log('The url:', 'localhost:5000/#/updatepass?code=' + code);
                            res.sendStatus(200);
                        }
                    }); // END Update query
                }
            }); // END Select query
        }
    }); // END Pool
}); // END Put route

router.put('/reset', function (req, res) {
    var email = req.body.email;
    var code = req.body.code;
    var password = encryptLib.encryptPassword(req.body.password);
    pool.connect(function (err, client, done) {
        if (err) {
            console.log('connection err ', err);
            done();
        } else {
            client.query("UPDATE users SET password = $1, code = null WHERE username = $2 AND code = $3 AND code IS NOT NULL;",
                [password, email, code],
                function (err, result) {
                    done();
                    console.log(result);
                    if (err) {
                        console.log("Error inserting data: ", err);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                }
            );
        }
    });
});

module.exports = router;