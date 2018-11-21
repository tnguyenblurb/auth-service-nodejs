const { check, body} = require('express-validator/check');
const UsersManager = require('./usersManager');

const usersValidator = {
  username: check('username').isLength({min: 1}),
  email: check('email').isEmail(),
  password: check('password').isLength({min: 6}),
  existed_email: body('email', 'username').custom(email => {
    if (UsersManager.findUserByEmail(email)) throw new Error('E-mail already in use');

    return true;
  }),
  code: check('code').isUUID,
};

const signup = [
  usersValidator.username,
  usersValidator.email,
  usersValidator.password,
  usersValidator.existed_email
]

const signin = [
  usersValidator.email,
];

const activate = [
  usersValidator.email,
  usersValidator.code
];

module.exports = {signup, signin, activate};