const express = require('express');
const router = express.Router();
const UsersManager = require('./usersManager');
const UsersValidator = require('./UsersValidator');
const { validationResult } = require('express-validator/check');

router.post('/signup', UsersValidator.signup, (req, res, next) => {
  // validate input fields
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors.array());

  let user = UsersManager.parseUser(req.body);
  user = UsersManager.createUser(user);

  // error page
  if (!user) return next('Something went wrong!');
  
  res.json({
    success: true, 
    activate_url: UsersManager.activateUrl(req, user),
    data: {
      email: user.email,
      name: user.username,
      created_at: user.created_at
  }});
  
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
  res.json({
    success: true, 
    data: {
      email: user.email,
      name: user.username,
      last_login_at: user.last_login_at,
      created_at: user.created_at
  }});
});

router.post('/signout', (req, res, next) => {

  let result = UsersManager.resetOtp(req.get('uuid'));
  if (!result) next('User not found or invalid uuid');

  res.json({
    success: true
  });
});

module.exports = router;
