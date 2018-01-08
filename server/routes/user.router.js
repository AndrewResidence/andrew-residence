require('dotenv').config();
var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');
var nodemailer = require('nodemailer');

/* credentials for google oauth w/nodemailer*/
var GMAIL_USER = process.env.GMAIL_USER;
var REFRESH_TOKEN = process.env.REFRESH_TOKEN;
var ACCESS_TOKEN = process.env.ACCESS_TOKEN;
var CLIENT_ID = process.env.CLIENT_ID;
var CLIENT_SECRET = process.env.CLIENT_SECRET;
// Handles Ajax request for user information if user is authenticated
router.get('/', function (req, res) {
  console.log('get /user route');
  // check if logged in
  if (req.isAuthenticated()) {
    // send back user object from database
    console.log('logged in', req.user);
    var userInfo = {
      username: req.user.username,
      userId: req.user.id,
      name: req.user.name,
      phone: req.user.phone,
      role: req.user.role
    };

    console.log(userInfo.name);


    res.send(userInfo);
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});
//GET request for unconfirmed users
router.get('/unconfirmed', function (req, res) {
  if (req.isAuthenticated()) {
    pool.connect(function (err, db, done) {
      if (err) {
        console.log('error connecting', err);
        res.sendStatus(500);
      }
      var queryText = 'SELECT * FROM "users" WHERE "confirmed" = $1;';
      db.query(queryText, ['0'], function (err, result) {
        done();
        if (err) {
          console.log("Error getting data: ", err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    });
  }
});
//GET request for supervisors
router.get('/supervisors', function (req, res) {
  if (req.isAuthenticated()) {
    pool.connect(function (err, db, done) {
      if (err) {
        console.log('error connecting', err);
        res.sendStatus(500);
      }
      var queryText = 'SELECT * FROM "users" WHERE "confirmed" = $1 AND "role" = $2;';
      db.query(queryText, ['1', 'Supervisor'], function (err, result) {
        done();
        if (err) {
          console.log("Error inserting data: ", err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    });
  }
});
//GET request for staff
router.get('/staff', function (req, res) {
  if (req.isAuthenticated()) {
    pool.connect(function (err, db, done) {
      if (err) {
        console.log('error connecting', err);
        res.sendStatus(500);
      }
      var queryText = 'SELECT * FROM "users" WHERE "confirmed" = $1 AND ("role" = $2 OR "role" = $3 OR "role" = $4);';
      db.query(queryText, ['1', 'Nurse', 'MHW', 'ADL'], function (err, result) {
        done();
        if (err) {
          console.log("Error inserting data: ", err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    });
  }
});
//Users PUT route to confirm users and define their role (supervisor, nurse, MHW or ADL) 
router.put('/confirm/:id', function (req, res) {
  if (req.isAuthenticated()) {
    var id = req.params.id;
    var role = req.body.role;
    pool.connect(function (err, db, done) {
      if (err) {
        console.log('error connecting', err);
        res.sendStatus(500);
      }
      var queryText = 'UPDATE "users" SET "role" =$1, "confirmed"=$2 WHERE "id" = $3 RETURNING "username";';
      //insert into users new role and change confirmed to true;
      db.query(queryText, [role, '1', id], function (err, result) {
        done();
        if (err) {
          console.log("Error inserting data: ", err);
          res.sendStatus(500);
        } else {
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
          console.log('username:', result.rows[0].username);

          let emailConfirmAddress = result.rows[0].username;

          // setup email data 
          var mailOptions = {
            from: '"Andrew Residence" <andrewresidence2017@gmail.com>', // sender address
            to: 'martapeterson@gmail.com', // list of receivers
            subject: 'Andrew Residence Account Confirmation ✔', // Subject line
            text: 'You\'re Confirmed!, // plain text body',
            html: '<p>Hello from Andrew Residence!!!  Thank you very much for signing up for the scheduling application. You are OFFICIAL!  We have created your profile and you may now begin picking up shifts. <button style="background-color: #4CAF50; /* Green */"+" See Shifts!</button>  See you soon!</p>', // html body
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
          res.send(result.rows);
        }
      });//end of dbQuery
    });//end of pool connect
  }
});//end of confirm id
//Users PUT route to edit a specific user
router.put('/edit/:id', function (req, res) {
  if (req.isAuthenticated()) {
    var id = req.params.id;
    var userInfo = {
      name: req.body.name,
      username: req.body.username,
      role: req.body.role,
      phone: req.body.phone
    };
    pool.connect(function (err, db, done) {
      if (err) {
        console.log('error connecting', err);
        res.sendStatus(500);
      }
      var queryText = 'UPDATE "users" SET "name" =$1, "username"=$2, "role"=$3, "phone"=$4 WHERE "id" = $5;';
      //insert into users new role and change confirmed to true;
      db.query(queryText, [userInfo.name, userInfo.username, userInfo.role, userInfo.phone, id], function (err, result) {
        done();
        if (err) {
          console.log("Error inserting data: ", err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    });
  }
});
//Users DELETE route
router.delete('/:id', function (req, res) {
  if (req.isAuthenticated()) {
    var id = req.params.id;
    pool.connect(function (err, db, done) {
      if (err) {
        console.log('error connecting', err);
        res.sendStatus(500);
      }
      var queryText = 'DELETE FROM "users" WHERE "id" = $1;'
      //insert into users new role and change confirmed to true;
      db.query(queryText, [id], function (err, result) {
        done();
        if (err) {
          console.log("Error inserting data: ", err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    });
  }
});
// clear all server session information about this user
router.get('/logout', function (req, res) {
  // Use passport's built-in method to log out the user
  console.log('Logged out');
  req.logOut();
  res.sendStatus(200);
});
//post messages/staff notifications created by supervisors
router.post('/message/', function (req, res) {
  if (req.isAuthenticated()) {
    var message = req.body
    var postedBy = req.user.id
    pool.connect(function (errorConnectingToDb, db, done) {
      if (errorConnectingToDb) {
        // No connection to database was made - error
        console.log('Error connecting', errorConnectingToDb);
        res.sendStatus(500);
      } //end if error connection to db
      else {
        var queryText = 'INSERT INTO "notifications" ("posted_by", "headline", "message") VALUES ($1, $2, $3);';
        db.query(queryText, [postedBy, message.headline, message.messageBody], function (errorMakingQuery, result) {
          done(); // add + 1 to pool - we have received a result or error
          if (errorMakingQuery) {
            console.log('Error making query', errorMakingQuery);
            res.sendStatus(500);
          }
          else {

            res.sendStatus(201);
          }
        }
        ); // END QUERY

      }

    }); // end pool connect


  } // end req.isAuthenticated
  else {
    console.log('User is not authenticated');
  }
})//end posting messages
//gets all messages to display for staff and supervisors
router.get('/messages', function (req, res) {
  if (req.isAuthenticated()) {
    pool.connect(function (err, db, done) {
      if (err) {
        console.log('error connecting', err);
        res.sendStatus(500);
      }
      var queryText = 'SELECT * FROM "notifications" JOIN "users" on "users"."id" = "notifications"."posted_by" order by "notifications"."date" DESC;';
      db.query(queryText, function (err, result) {
        done();
        if (err) {
          console.log("Error inserting data: ", err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    });
  }
  else {
    console.log('User is not authenticated.');
  }
})

//deletes the posted message
router.delete('/messages/delete/:id', function (req, res) {
  if (req.isAuthenticated()) {
    deleteId = req.params.id;
    console.log('delete', deleteId)
      pool.connect(function (err, db, done) {
        if (err) {
          console.log('error connecting', err);
          res.sendStatus(500);
        }
        var queryText = 'DELETE FROM "notifications" WHERE "notification_id" = $1;';
        db.query(queryText, [deleteId], function (err, result) {
          done();
          if (err) {
            console.log("Error inserting data: ", err);
            res.sendStatus(500);
          } else {
            res.sendStatus(201);
          }
        });
      });
    }
    else {
      console.log('User is not authenticated.');
    }
  })

router.put('/profile', function (req, res) {
  if (req.isAuthenticated()) {
  console.log('profile id', req.user.id);
  console.log('profileEdit', req.body);
  var profileEdit = {
    id: req.user.id,
    phone: req.body.phone,
    username: req.body.username,
  };
  console.log(profileEdit.username);
  console.log('Profile', profileEdit)
    pool.connect(function (err, db, done) {
      if (err) {
        console.log('error connecting', err);
        res.sendStatus(500);
      }
      var queryText = 'UPDATE "users" SET "username" =$1, "phone"=$2 WHERE "id" = $3;';
      //insert into users new role and change confirmed to true;
      db.query(queryText, [profileEdit.username, profileEdit.phone, profileEdit.id], function (err, result) {
        done();
        if (err) {
          console.log("Error inserting data: ", err);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });
    });
  }
  else {
    console.log('User is not authenticated.');
  }
})

module.exports = router;
