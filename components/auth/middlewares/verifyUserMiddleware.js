const UserModel = require('../../users/models/userModel');
const Utils = require('../../../utils/utils');

exports.hasAuthValidFields = (req, res, next) => {
    let errors = [];
    if (!req.body) {
        return res.status(400).send({errors: 'Missing email and password fields'});
    }

    if (!req.body.email) {
        errors.push('Missing email field');
    }
    if (!req.body.password) {
        errors.push('Missing password field');
    }

    if (errors.length) {
        return res.status(400).send({errors: errors.join(',')});
    }

    return next();
};

exports.isPasswordAndUserMatch = async (req, res, next) => {
    let user = await UserModel.findByEmail(req.body.email);
    if(!user){
        res.status(404).send({});
        return;
    }

    let passwordFields = user.get('password').split('$');
    let salt = passwordFields[0];
    let hash = Utils.hash(req.body.password, salt);

    if (hash !== passwordFields[1]) {
        return res.status(400).send({errors: ['Invalid e-mail or password']});
    }

    req.body = {
        userId: user.id,
        email: user.email,
        role: user.role,
        provider: 'email',
        name: user.firstName + ' ' + user.lastName,
    };
    return next();
};