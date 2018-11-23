'use strict'; 
const db = require('../database/database');
const bcrypt = require('bcrypt');
const OTP_EXIRED_MINUTES = 30;
const uuidv1 = require('uuid/v1');

var _this = this;

exports.parseUser = function(body) {
  let user = {};
  user.name = body.name;
  user.email = body.email;
  user.password = body.password;
  user.role = body.role || 'user';
  return user;
}

exports.createUser = function(user) {

  user.password = hashPassword(user.password);
  user.activate_code = uuidv1();
  user.created_at = new Date();
  user.tokens = [];
  return db.save(user, 'users');
}

exports.validateAndRegenerateOTP = function(uuid) {
  let {user, token} = _this.findUserAndTokenByUuid(uuid);
  if (!user) return null;
  let expired = token.expired_at >= (new Date()).toString();
  if (expired) {
    console.log(`${user.email} uuid is expired`);
    _this.resetToken(uuid);
    return null;
  }

  let newToken = generateToken(uuid);
  user.tokens[user.tokens.indexOf(token)] = newToken;
  updateUser(user);
  return newToken;
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
  if (!user) return {};
  let result = bcrypt.compareSync(password, user.password);
  if (!result) return {};

  // user needs to activate his account after registering
  if (result && user.activate_code) return {user: user};

  // support user to login on multi devices/platform
  console.log('UsersManager.authenticate generateToken');

  let token = generateToken()
  user.tokens.push(token);
  user.last_login_at = new Date();
  updateUser(user);

  return {
    user: user,
    token: token
  };
}

exports.resetToken = function(uuid) {
  let {user, token} = _this.findUserAndTokenByUuid(uuid);
  if (!user || !token) return false;

  user.tokens = user.tokens.map(token => token.uuid === uuid ? token = {} : token);
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
      if (!user.name.startsWith(searchData.name)) return false;
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
  return `${req.protocol}://${req.get('host')}/api/activate/${user.email}/${user.activate_code}`;
}

exports.findUserAndTokenByUuid = function(uuid) {
  let users = db.loadTable('users');
  var result = {};
  users.forEach(user => {
    let token = user.tokens.find(token => token.uuid === uuid);
    if (token) {
      result = {
        user: user,
        token: token
      };
      return;
    }
  });
  return result;
}

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function generateToken() {
  return {
    uuid: uuidv1(),
    expired_at: new Date((new Date()).getTime() + OTP_EXIRED_MINUTES*60*1000)
  }
}

function updateUser(user) {
  return db.save(user, 'users');
}