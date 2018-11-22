const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator/check');
var jsonTemplate = require('json-templater/object');
const UsersManager = require('./usersManager');
const UsersValidator = require('./UsersValidator');
const config = require('../config');

router.post('/signup', UsersValidator.signup, (req, res, next) => {
  // validate input fields
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors.array());

  let user = UsersManager.parseUser(req.body);
  user = UsersManager.createUser(user);

  // error page
  if (!user) return next('Something went wrong!');
  
  res.json(jsonTemplate(
    require(`../view/jsonTemplate/signup.${req.get(config.XDeviceKey)}.json`),
    {
      email: user.email,
      name: user.username,
      role: user.role,
      created_at: user.created_at
    }
  ));
});

router.get('/activate/:email/:code', (req, res, next) => {
  let result = UsersManager.activate(req.params.email, req.params.code);

  if (!result) return next('Invalid code');

  res.json({message: 'Your account has been activated!'});
});

router.post('/signin', UsersValidator.signin, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors.array());

  let email = req.body.email;
  let password = req.body.password;
  let user = UsersManager.authenticate(email, password);

  if (!user) return next('Invalid email/password!');
  if (user.activate_code) return next (`Please activate your account by clicking at ${UsersManager.activateUrl(req, user)}`);

  res.set('uuid', user.otp.uuid);

  res.json(jsonTemplate(
    require(`../view/jsonTemplate/signin.${req.get(config.XDeviceKey)}.json`),
    {
      email: user.email,
      name: user.username,
      role: user.role,
      last_login_at: user.last_login_at,
      created_at: user.created_at
    }
  ));
});

router.post('/signout', (req, res, next) => {

  let result = UsersManager.resetOtp(req.get('uuid'));
  if (!result) next('User not found or invalid uuid');

  res.json({
    success: true
  });
});

router.get('/search', (req, res, next) => {
  let searchData = {
    name: req.query.name,
    email: req.query.email,
    latest_access: req.query.latest_access,
    page: Math.max(req.query.page || 0, 0),
    limit: Math.max(req.query.limit || 100, 0), 
  };

  let users = UsersManager.search(searchData);

  res.json({
    success: true,
    data: users.map(user => jsonTemplate(
      require(`../view/jsonTemplate/search.json`),
      {
        email: user.email,
        name: user.username,
        role: user.role,
      }
    ))
  })

});

module.exports = router;
