const jwt = require('jsonwebtoken');
const jwtSecret = process.env.jwt_secret;
const UserModel = require('../../users/models/userModel');
const Utils = require('../../../utils/utils');

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
        return res.status(400).send({errors: ['Invalid e-mail or password.']});
    }

    if (!user.get('activated')) {
        return res.status(403).send({errors: ['Your account has not been activated.']});
    }

    req.body = {
        userId: user.get('id'),
        email: user.get('email'),
        role: user.get('role'),
        provider: 'email',
        name: user.get('first_name') + ' ' + user.get('last_name'),
    };
    return next();
};

exports.verifyRefreshBodyField = (req, res, next) => {
    if (req.body && req.body.refresh_token) {
        return next();
    } else {
        return res.status(400).send({errors: ['Need to pass refresh_token field']});
    }
};

exports.validRefreshNeeded = (req, res, next) => {
    let b = new Buffer(req.body.refresh_token, 'base64');
    let refresh_token = b.toString();
    let hash = Utils.hash(req.jwt.userId + jwtSecret, req.jwt.refreshKey);
    if (hash !== refresh_token) {
        return res.status(400).send({errors: ['Invalid refresh token']});
    } 

    req.body = req.jwt;
    return next();
};


exports.validJWTNeeded = (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(401).send();
    }

    try {
        let authorization = req.headers['authorization'].split(' ');
        if (authorization[0] !== 'Bearer') {
            return res.status(401).send();
        } 
        
        req.jwt = jwt.verify(authorization[1], jwtSecret);
        return next();

    } catch (err) {
        return res.status(403).send();
    }
};