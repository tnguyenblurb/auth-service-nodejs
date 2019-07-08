const jwtSecret = process.env.jwt_secret;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const uuid = require('node-uuid');
const Utils = require('../../../utils/utils');

exports.doLogin = (req, res) => {
    try {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = Utils.hash(req.body.userId + jwtSecret, salt);

        req.body.refreshKey = salt;
        let accessToken = jwt.sign(req.body, jwtSecret);
        
        let b = new Buffer(hash);
        let refreshToken = b.toString('base64');

        res.status(201).send({accessToken: accessToken, refreshToken: refreshToken});
    } catch (err) {
        res.status(500).send({errors: err});
    }
};

exports.refreshToken = (req, res) => {
    try {
        req.body = req.jwt;
        let accessToken = jwt.sign(req.body, jwtSecret);
        res.status(201).send({accessToken: accessToken, refreshToken: req.body.refresh_token});
    } catch (err) {
        res.status(500).send({errors: err});
    }
};
