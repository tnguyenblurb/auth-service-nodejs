var express = require('express');
var path = require('path');

const config = require('./config/config');
var headerHandler = require('./middlewares/headerHandler');
var errorHandler = require('./middlewares/errorHandler');
var usersRouter = require('./components/users/usersRouter');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// middleware validate header fields
app.use(headerHandler.headerValidator);

// middleware authenticate, authorize and regenerate OTP
app.use(headerHandler.IGNORE_ACTIONS, headerHandler.authAndRegenerateOTP);
app.use('/api', usersRouter);

// middleware handling errors 
app.use(errorHandler);

app.listen(config.port, () => console.log(`Example app listening on port ${config.port}!`));

module.exports = app;
