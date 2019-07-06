const { check, body, validationResult} = require('express-validator/check');
const UserModel = require('../models/userModel');

const userValidator = {
  first_name: check('first_name').not().isEmpty(),
  last_name: check('last_name').not().isEmpty(),
  email: check('email').isEmail(),
  password: check('password').isLength({min: 6}).withMessage('Password must contain at least 6 letters.'),
  email_already_in_use: body('email').custom(async email => {
    let user = await UserModel.findByEmail(email);
    if (user) {
      console.log('E-mail already in use');
      throw new Error('E-mail already in use');
    };
    
    return true;
  }),
  code: check('code').isUUID,
};

exports.signup = [
  userValidator.first_name,
  userValidator.last_name,
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