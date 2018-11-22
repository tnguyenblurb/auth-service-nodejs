const { check, body} = require('express-validator/check');
const UsersManager = require('./usersManager');

const usersValidator = {
  username: check('username').isLength({min: 1}),
  email: check('email').isEmail(),
  password: check('password').isLength({min: 6}),
  email_already_in_use: body('email').custom(email => {
    if (UsersManager.findUserByEmail(email)) throw new Error('E-mail already in use');

    return true;
  }),
  code: check('code').isUUID,
};

exports.signup = [
  usersValidator.username,
  usersValidator.email,
  usersValidator.password,
  usersValidator.email_already_in_use
]
exports.signin = [
  usersValidator.email,
];

exports.activate = [
  usersValidator.code
];