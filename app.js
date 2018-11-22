var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var otpHandler = require('./middlewares/otpHandler');
var errorHandler = require('./middlewares/errorHandler');
var usersRouter = require('./user/usersRouter');
const PORT = 5000;

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// middleware validate OTP
app.use(otpHandler.IGNORE_ACTIONS, otpHandler.validator);

app.use('/users', usersRouter);

// middleware handling errors 
app.use(errorHandler);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

module.exports = app;
