var express = require('express');
var router = express.Router();

const constants = require('../../utils/constants');
const UserValidatorMiddleware = require('./middlewares/userValidatorMiddleware');
const UsersController = require('./controllers/userController');
const PermissionMiddleware = require('../common/middlewares/permissionMiddleware');
const AuthValidationMiddleware = require('../auth/middlewares/authValidationMiddleware');

const ADMIN = constants.role.ADMIN;
const USER = constants.role.USER;

router.post('/users', [
    UserValidatorMiddleware.signup,
    UserValidatorMiddleware.handleInvalid,
    UsersController.create
]);
router.get('/users', [
    AuthValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    UsersController.list
]);
router.get('/users/:userId', [
    AuthValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UsersController.getById
]);
router.patch('/users/:userId', [
    AuthValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(USER),
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UsersController.patchById
]);
router.delete('/users/:userId', [
    AuthValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    UsersController.removeById
]);

module.exports = router;
