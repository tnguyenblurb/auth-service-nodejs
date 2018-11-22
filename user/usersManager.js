'use strict'; 
const db = require('../database/database');
const bcrypt = require('bcrypt');
const OTP_EXIRED_MINUTES = 30;
const uuidv1 = require('uuid/v1');

const UserScheme = {
  username: null,
  email: null,
  password: null,
  actived: false,
  otp: {
    uuid: null,
    expired_at: null,
  }
};

exports.parseUser = function(body) {
  let user = UserScheme;
  user.username = body.username;
  user.email = body.email;
  user.password = body.password;
  return user;
}

exports.createUser = function(user) {
  user.password = hashPassword(user.password);
  user.otp = generateOTP();
  return db.save(user, 'users');
}

exports.validateOTP = function(uuid) {
  if (!uuid) return null;

  let user = findUserByUuid(req.get('uuid'));
  if (!user) return null;

  user.otp = generateOTP();
  updateUser(user);
  return user.otp.uuid;
}

exports.activate = function(user) {
  user.actived = true;
  updateUser(user);
}

exports.authenticate = function(email, password) {
  let user = findUserByEmail(email);
  return bcrypt.compareSync(user.password, password);
}

exports.findUserByEmail = function(email) {
  let users = db.loadTable('users');
  return users.find(user => user.email === email);
}

exports.findUserByUuid = function(uuid) {
  let users = db.loadTable('users');
  return users.find(user => user.otp.uuid === email);
}

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function generateOTP() {
  return {
    uuid: uuidv1(),
    expired_at: new Date((new Date()).getTime() + OTP_EXIRED_MINUTES*60*1000)
  }
}

function updateUser(user) {
  return db.save(user, 'users');
}