'use strict'; 
const db = require('../database/database');
const bcrypt = require('bcrypt');
const OTP_EXIRED_MINUTES = 30;
const uuidv1 = require('uuid/v1');

var _this = this;

const UserScheme = {
  id: null,
  username: null,
  email: null,
  password: null,
  activate_code: null,
  otp: {
    uuid: null,
    expired_at: null,
  },
  created_at: null,
  last_login_at: null,
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
  user.activate_code = uuidv1();
  user.created_at = new Date();
  return db.save(user, 'users');
}

exports.validateOTP = function(uuid) {
  let user = findUserByUuid(uuid);
  if (!user) return null;
  let expired = user.otp.expired_at >= (new Date()).toString();
  if (expired) {
    console.log(`${user.email} uuid is expired`);
    user.otp = {};
    updateUser(user);
    return null;
  }

  user.otp = generateOTP();
  updateUser(user);
  return user.otp.uuid;
}

exports.activate = function(email, code) {
  let users = db.loadTable('users');
  let user = users.find(user => user.email === email && user.activate_code === code);
  if (!user) return false;

  user.activate_code = null;
  updateUser(user);

  return true;
}

exports.authenticate = function(email, password) {
  let user = _this.findUserByEmail(email);
  if (!user) return false;
  let result = bcrypt.compareSync(password, user.password);
  if (!result) return false;
  if (result && user.activate_code) return user;

  user.otp = generateOTP();
  user.last_login_at = new Date();
  updateUser(user);

  return user;
}

exports.resetOtp = function(uuid) {
  let user = findUserByUuid(uuid);
  if (!user) return false;

  user.otp = {};
  updateUser(user);
  
  return true;
}

exports.findUserByEmail = function(email) {
  let users = db.loadTable('users');
  return users.find(user => user.email === email);
}

exports.search = function(searchData) {
  let startIndex = searchData.page * searchData.limit;
  let endIndex = searchData.page * searchData.limit + searchData.limit;
  let users = db.loadTable('users');
  users = users.filter(user => {
    if (searchData.name) {
      if (!user.username.startsWith(searchData.name)) return false;
    }
  
    if (searchData.email) {
      if (!user.email.startsWith(searchData.email)) return false;
    }
  
    if (searchData.latest_access) {
      if (user.last_login_at < searchData.latest_access) return false;
    }

    return true;
  }).slice(startIndex, endIndex);
  return users;
}

exports.activateUrl = function(req, user) {
  return `${req.protocol}://${req.get('host')}/users/activate/${user.email}/${user.activate_code}`;
}

function findUserByUuid(uuid) {
  let users = db.loadTable('users');
  return users.find(user => user.otp.uuid === uuid);
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