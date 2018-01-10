var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('./strategies/sql.localstrategy');
var sessionConfig = require('./modules/session.config');


// Route includesc
var indexRouter = require('./routes/index.router');
var userRouter = require('./routes/user.router');
var registerRouter = require('./routes/register.router');
var shiftRouter = require('./routes/shift.router');
var availabilityRouter = require('./routes/availability.router');
var messageRouter = require('./routes/message.router');
var forgotRouter = require('./routes/forgot.router');
var port = process.env.PORT || 5000;


// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve back static files
app.use(express.static('./server/public'));

// Passport Session Configuration
app.use(sessionConfig);

// Start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/register', registerRouter);
app.use('/user', userRouter);
app.use('/shifts', shiftRouter);
app.use('/availability', availabilityRouter);
app.use('/message', messageRouter);
app.use('/forgot', forgotRouter);
// Catch all bucket, must be last!
app.use('/', indexRouter);

// Listen //
app.listen(port, '0.0.0.0', function () {
    console.log('Listening on port:', port);
});
