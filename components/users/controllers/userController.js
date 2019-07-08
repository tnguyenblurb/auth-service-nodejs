const UserModel = require('../models/userModel');
const Utils = require('../../../utils/utils');
var nodemailer = require("nodemailer");

exports.create = async (req, res) => {
    req.body.password = Utils.generatePassword(req.body.password);
    req.body.permissionLevel = 1;
    let user = await UserModel.create(req.body);
    if (!user) {
        return res.status(500).send({errors: ['Saving error!']});
    }
    return res.status(201).send({id: user.get('id')});
};

exports.list = async (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    let result = await UserModel.list(limit, page);

    return res.status(200).send(result);
};

exports.getById = async (req, res) => {
    let result = await UserModel.findById(req.params.userId);
    return res.status(200).send(result);
};
exports.patchById = async (req, res) => {
    if (req.body.password) {
        req.body.password = Utils.generatePassword(req.body.password);
    }

    if (req.jwt.email !== req.body.email.toLowerCase()) {
        let existedUser = await UserModel.findByEmail(req.body.email);
        if (existedUser) {
            return res.status(400).send({errors: ['E-mail already in use']});
        }
    }

    let updateData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password,
        email: req.body.email.toLowerCase()
    };    

    let user = await UserModel.update(req.params.userId, updateData);

    if (!user) {
        return res.status(500).send({errors: ['Saving error!']});
    }

    res.status(204).send({});
};

exports.removeById = (req, res) => {
    UserModel.removeById(req.params.userId)
        .then((result)=>{
            res.status(204).send({});
        });
};