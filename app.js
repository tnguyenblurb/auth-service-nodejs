var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const config = require('./config/config');
var headerHandler = require('./middlewares/headerHandler');
var errorHandler = require('./middlewares/errorHandler');
var authorizationHandler = require('./middlewares/authorizationHandler');
var usersRouter = require('./user/usersRouter');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// middleware validate OTP
app.use(headerHandler.headerValidator);
app.use(authorizationHandler.authorization);
app.use(headerHandler.IGNORE_ACTIONS, headerHandler.OTPValidator);
app.use('/api', usersRouter);

// middleware handling errors 
app.use(errorHandler);

app.listen(config.port, () => console.log(`Example app listening on port ${config.port}!`))

module.exports = app;
