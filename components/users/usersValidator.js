const { check, body} = require('express-validator/check');
const usersDBAccess = require('./usersDBAccess');

const usersValidator = {
  name: check('name').isLength({min: 1}),
  email: check('email').isEmail(),
  password: check('password').isLength({min: 6}).withMessage('Password must contain at least 6 letters.'),
  email_already_in_use: body('email').custom(email => {
    if (usersDBAccess.findUserByEmail(email)) throw new Error('E-mail already in use');

    return true;
  }),
  code: check('code').isUUID,
};

exports.signup = [
  usersValidator.name,
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