var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

// Handles Ajax request for user information if user is authenticated
router.get('/', function (req, res) {
  console.log('get /user route');
  // check if logged in
  if (req.isAuthenticated()) {
    // send back user object from database
    console.log('logged in', req.user);
    var userInfo = {
      username: req.user.username, 
      userId: req.user.id
    };
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
    var role = req.body.role
    pool.connect(function (err, db, done) {
      if (err) {
        console.log('error connecting', err);
        res.sendStatus(500);
      }
      var queryText = 'UPDATE "users" SET "role" =$1, "confirmed"=$2 WHERE "id" = $3;'
      //insert into users new role and change confirmed to true;
      db.query(queryText, [role, '1', id], function (err, result) {
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


module.exports = router;
