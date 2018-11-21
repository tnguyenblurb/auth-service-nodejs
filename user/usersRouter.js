const express = require('express');
const router = express.Router();
const UsersManager = require('./usersManager');
const UsersValidator = require('./UsersValidator');
const { validationResult } = require('express-validator/check');

router.post('/signup', UsersValidator.signup, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  
  let user = UsersManager.parseUser(req.body);
  user = UsersManager.createUser(user);
  if (!user) return res.json({error: 'Something went wrong!'});
  
  res.json({message: `Welcome ${user.username} onboard! Please activate your account by clicking at ${req.get('host')}/users/activate/${user.otp.uuid}`});
});

router.get('/activate/:code', UsersValidator.activate, (req, res, next) => {
  let user = UsersManager.findUserByUuid(req.params.code);
  if (!user) return res.status(422).json({ errors: 'Invalid code' });
  UsersManager.activate(user);
  

  res.json({message: 'Your account has been activated!'});
});

router.post('/signin', UsersValidator.signin, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!UsersManager.authenticate(user)) {
    return res.json({error: 'Invalid email/password!'});
  }

  res.send(`sign in`);
});

router.post('/signout', (req, res, next) => {

  res.send(`sign out`);
});

module.exports = router;
