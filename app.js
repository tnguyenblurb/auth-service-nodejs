require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

require('./database/database.js');
// var errorHandler = require('./components/common/middlewares/errorHandlerMiddleware');
const authRouter = require('./components/auth/authRoutesConfig');
const usersRouter = require('./components/users/userRoutesConfig');

const app = express();

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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

app.use('/api', usersRouter);
app.use('/api', authRouter);

// middleware handling errors 
// app.use(errorHandler);

app.listen(process.env.port, () => console.log(`Example app listening on port ${process.env.port}!`));

module.exports = app;
