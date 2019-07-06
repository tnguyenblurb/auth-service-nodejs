const jwt = require('jsonwebtoken');
const jwtSecret = process.env.jwt_secret;
const Utils = require('../../../utils/utils');

exports.verifyRefreshBodyField = (req, res, next) => {
    if (req.body && req.body.refresh_token) {
        return next();
    } else {
        return res.status(400).send({error: 'need to pass refresh_token field'});
    }
};

exports.validRefreshNeeded = (req, res, next) => {
    let b = new Buffer(req.body.refresh_token, 'base64');
    let refresh_token = b.toString();
    let hash = Utils.hash(req.jwt.userId + jwtSecret, req.jwt.refreshKey);
    if (hash !== refresh_token) {
        return res.status(400).send({error: 'Invalid refresh token'});
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