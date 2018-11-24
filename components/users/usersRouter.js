const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator/check');
const jsonTemplate = require('json-templater/object');
const usersBusiness = require('./usersBusiness');
const usersValidator = require('./usersValidator');
const config = require('../../config/config');

router.post('/signup', usersValidator.signup, (req, res, next) => {
  // validate input fields
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors.array());

  let user = usersBusiness.parseUser(req.body);
  user = usersBusiness.createUser(user);

  console.log(`/signup created user: ${user}`);
  // error page
  if (!user) return next('Something went wrong. Can not create user!');
  
  res.json(jsonTemplate(
    require(`../../view/jsonTemplate/signup.${req.get(config.XDeviceKey)}.json`),
    {
      email: user.email,
      name: user.name,
      role: user.role,
      created_at: user.created_at
    }
  ));
});

router.get('/activate/:email/:code', (req, res, next) => {
  let result = usersBusiness.activate(req.params.email, req.params.code);

  if (!result) return next('Invalid code');

  res.json({message: 'Your account has been activated!'});
});

router.post('/signin', usersValidator.signin, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors.array());

  let email = req.body.email;
  let password = req.body.password;
  let {user, token} = usersBusiness.login(email, password);

  console.log(`/signin authenticated: ${user}`);
  
  if (!user) return next('Invalid email/password!');
  if (user.activate_code) return next (`Please activate your account by clicking at ${usersBusiness.activateUrl(req, user)}`);

  res.set('uuid', token.uuid);

  res.json(jsonTemplate(
    require(`../../view/jsonTemplate/signin.${req.get(config.XDeviceKey)}.json`),
    {
      email: user.email,
      name: user.name,
      role: user.role,
      last_login_at: user.last_login_at,
      created_at: user.created_at
    }
  ));
});

router.post('/signout', (req, res, next) => {

  let result = usersBusiness.resetToken(req.get('uuid'));

  console.log(`/signout signed out: ${result}`);
  if (!result) next('Invalid uuid');

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

  console.log(`/search search user by ${searchData}`);
  let users = usersBusiness.search(searchData);

  res.json({
    success: true,
    data: users.map(user => jsonTemplate(
      require(`../../view/jsonTemplate/search.json`),
      {
        email: user.email,
        name: user.name,
        role: user.role,
      }
    ))
  })

});

module.exports = router;
