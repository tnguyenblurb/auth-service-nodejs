const { check, body} = require('express-validator/check');
const { validationResult } = require('express-validator/check');
const usersDBAccess = require('../models/usersDBAccess');

const userValidator = {
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
  userValidator.name,
  userValidator.email,
  userValidator.password,
  userValidator.email_already_in_use
]
exports.signin = [
  userValidator.email,
];

exports.activate = [
  userValidator.code
];

exports.handleInvalid = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.length) {
        return res.status(400).send({errors: errors.join(',')});
    } else {
        return next();
    }
}