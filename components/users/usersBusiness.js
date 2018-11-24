'use strict'; 
const bcrypt = require('bcrypt');
const OTP_EXIRED_MINUTES = 120;
const uuidv1 = require('uuid/v1');
const usersDBAccess = require('./usersDBAccess');
const _this = this;

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
  // user.activate_code = uuidv1();
  user.created_at = new Date();
  user.tokens = [];
  return usersDBAccess.createUser(user);
}

exports.authenticateByUUID = function(uuid) {
  let {user, token} = usersDBAccess.findUserAndTokenByUuid(uuid);
  if (!user || !token) return {};
  let expired = (new Date()).toISOString() >= token.expired_at;
  if (expired) {
    console.log(`${user.email} uuid is expired`);
    _this.resetToken(uuid);
    return {};
  }

  return {user: user, token: token};
}

exports.regenerateToken = function(user, token) {
  let newToken = generateToken();
  user.tokens[user.tokens.indexOf(token)] = newToken;
  usersDBAccess.updateUser(user);

  return newToken;
}

exports.activate = function(email, code) {
  let user = usersDBAccess.findUserByEmail(email);
  if (user.activate_code !== code) return false;

  user.activate_code = null;
  usersDBAccess.updateUser(user);

  return true;
}

exports.login = function(email, password) {
  let user = usersDBAccess.findUserByEmail(email);
  if (!user) return {};
  let result = bcrypt.compareSync(password, user.password);
  if (!result) return {};

  // user needs to activate his account after registering
  if (result && user.activate_code) return {user: user};

  console.log('usersBusiness.authenticate generateToken');

  // support user to login on multi devices/platform
  let token = generateToken();
  user.tokens.push(token);
  user.last_login_at = new Date();
  usersDBAccess.updateUser(user);

  return {
    user: user,
    token: token
  };
}

exports.resetToken = function(uuid) {
  let {user, token} = usersDBAccess.findUserAndTokenByUuid(uuid);
  if (!user || !token) return false;


  user.tokens.splice(user.tokens.findIndex(token => token.uuid === uuid), 1);
  usersDBAccess.updateUser(user);
  
  return true;
}

exports.search = function(searchData) {
  return usersDBAccess.search(searchData);
}

exports.activateUrl = function(req, user) {
  return `${req.protocol}://${req.get('host')}/api/activate/${user.email}/${user.activate_code}`;
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