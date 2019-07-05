require('dotenv').config();
const express = require('express');
const path = require('path');
require('./database/database.js');
// const config = require('./config/config');
// var headerHandler = require('./middlewares/headerHandler');
var errorHandler = require('./components/common/middlewares/errorHandlerMiddleware');
// var usersRouter = require('./components/users/routesConfig');
const AuthRouter = require('./components/auth/routesConfig');
const UsersRouter = require('./users/components/routesConfig');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// adding Helmet to enhance your API's security
app.use(helmet());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range, accept-version');
  if (req.method === 'OPTIONS') {
      return res.send(200);
  } else {
      return next();
  }
});

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// middleware validate header fields
// app.use(headerHandler.headerValidator);

// middleware authenticate, authorize and regenerate OTP
// app.use(headerHandler.IGNORE_ACTIONS, headerHandler.authAndRegenerateOTP);
// app.use('/api', usersRouter);

AuthRouter.routesConfig(app);
UsersRouter.routesConfig(app);

// middleware handling errors 
app.use(errorHandler);

app.listen(process.env.port, () => console.log(`Example app listening on port ${process.env.port}!`));

module.exports = app;
