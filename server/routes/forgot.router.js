var express = require('express');
var router = express.Router();


var Chance = require('chance'),
    chance = new Chance();
var pool = require('../modules/pool.js');
var encryptLib = require('../modules/encryption');
var nodemailer = require('nodemailer');
var GMAIL_USER = process.env.GMAIL_USER;
var REFRESH_TOKEN = process.env.REFRESH_TOKEN;
var ACCESS_TOKEN = process.env.ACCESS_TOKEN;
var CLIENT_ID = process.env.CLIENT_ID;
var CLIENT_SECRET = process.env.CLIENT_SECRET;

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

router.put('/check', function (req, res) {
    var email = req.body.email;
console.log(email);

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
                            let updateLink = '<a href="http://localhost:5000/#/update?code=' + code + '">Click Here</a>';
                            var mailOptions = {
                                from: '"Andrew Residence" <andrewresidence2017@gmail.com>', // sender address
                                to: email, // list of receivers
                                subject: 'Weekly Digest from Andrew Residence', // Subject line
                                html: ' <body style ="background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);">' +
                                    '<h1>Hello!!</h1><h3>Please use this code to reset your password:</h3><ul>'+ updateLink+'</ul>' +
                                    '<p>Thank you</p>',
                              
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
    console.log(email,'password:', password);
    
    pool.connect(function (err, client, done) {
        if (err) {
            console.log('connection err ', err);
            done();
        } else {
            client.query('UPDATE "users" SET "password" = $1, "code" = null WHERE "username" = $2 AND "code" = $3 AND "code" IS NOT NULL;',
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