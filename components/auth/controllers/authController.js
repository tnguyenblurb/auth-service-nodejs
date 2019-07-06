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
        let token = jwt.sign(req.body, jwtSecret);
        
        let b = new Buffer(hash);
        let refresh_token = b.toString('base64');

        res.status(201).send({accessToken: token, refreshToken: refresh_token});
    } catch (err) {
        res.status(500).send({errors: err});
    }
};

exports.refreshToken = (req, res) => {
    try {
        req.body = req.jwt;
        let token = jwt.sign(req.body, jwtSecret);
        res.status(201).send({accessToken: token, refreshToken: req.body.refresh_token});
    } catch (err) {
        res.status(500).send({errors: err});
    }
};
