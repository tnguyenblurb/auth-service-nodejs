const VerifyUserMiddleware = require('./middlewares/verifyUserMiddleware');
const AuthController = require('./controllers/authController');
const AuthValidationMiddleware = require('../common/middlewares/authValidationMiddleware');
exports.routesConfig = function (app) {

    app.post('/auth', [
        VerifyUserMiddleware.hasAuthValidFields,
        VerifyUserMiddleware.isPasswordAndUserMatch,
        AuthController.doLogin
    ]);

    app.post('/auth/refresh', [
        AuthValidationMiddleware.validJWTNeeded,
        AuthValidationMiddleware.verifyRefreshBodyField,
        AuthValidationMiddleware.validRefreshNeeded,
        AuthController.refreshToken
    ]);
};