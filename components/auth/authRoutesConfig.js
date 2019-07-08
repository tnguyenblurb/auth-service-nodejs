var express = require('express');
var router = express.Router();

const AuthController = require('./controllers/authController');
const AuthValidationMiddleware = require('./middlewares/authValidationMiddleware');
const UserValidatorMiddleware = require('../users/middlewares/userValidatorMiddleware');

router.post('/auth', [
    UserValidatorMiddleware.auth,
    UserValidatorMiddleware.handleInvalid,
    AuthValidationMiddleware.isPasswordAndUserMatch,
    AuthController.doLogin
]);

router.post('/auth/refresh', [
    AuthValidationMiddleware.validJWTNeeded,
    AuthValidationMiddleware.verifyRefreshBodyField,
    AuthValidationMiddleware.validRefreshNeeded,
    AuthController.refreshToken
]);

module.exports = router;