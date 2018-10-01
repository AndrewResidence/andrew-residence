var express = require('express');
var router = express.Router();
var Chance = require('chance'),
    chance = new Chance();
var pool = require('../modules/pool.js');
var encryptLib = require('../modules/encryption');

var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

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
                            let updateLink = `<a href="https://andrew-residence.herokuapp.com/#/update?code=${code}">Click Here</a>`;
                            let emailContent =
                                `<body>
                                <p>Hello,</p>
                                <p>Please use the button below to reset your password:</p>
                                <button style="background-color: #4CAF50;background-color:rgb(255, 193, 7);color: white;padding: 15px 32px;text-align: center;font-size: 16px;border-radius: 5px;border: none;">${updateLink}</button>
                                <p>If you are unable to click the button, please copy and paste this link in to your browser: </p>
                                <p>https://andrew-residence.herokuapp.com/#/update?code=${code}</p>
                                <p>Thank you, <br> Andrew Residence</p>
                                </body>`

                            var request = sg.emptyRequest({
                                method: 'POST',
                                path: '/v3/mail/send',
                                body: {
                                    personalizations: [
                                        {
                                            to: [{ email: email }],
                                            subject: 'Andrew Residence: Forgot Password'
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
    console.log(email, 'password:', password);

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