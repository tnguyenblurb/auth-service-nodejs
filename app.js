var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var otpValidator = require('./middlewares/otpValidator');

const port = 5000;

var usersRouter = require('./user/usersRouter');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(otpValidator.IGNORE_ACTIONS, otpValidator.validator);

app.use('/users', usersRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app;
