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

class UsersManager {

  constructor(req) {
    this.req = req;
  }

  parseUser() {
    let user = UserScheme;
    user.username = this.req.body.username;
    user.email = this.req.body.email;
    user.password = this.req.body.password;
    return user;
  }

  createUser() {
    let user = this.parseUser();
    user.password = UsersManager.hashPassword(user.password);
    user.otp = UsersManager.generateOTP();
    return db.save(user, 'users');
  }

  

  validateOTP() {
    let uuid = this.req.get('uuid');
    if (!uuid) return null;

    let user = UsersManager.findUserByUuid(req.get('uuid'));
    if (!user) return null;

    user.otp = UsersManager.generateOTP();
    UsersManager.updateUser(user);
    return user.otp.uuid;
  }

  activate() {

  }

  authenticate() {
    let user = UsersManager.findUserByEmail(this.user.email);
    return bcrypt.compareSync(user.password, this.user.password);
  }

  static updateUser(user) {
    return db.save(user, 'users');
  }

  static findUserByEmail(email) {
    let users = db.loadTable('users');
    return users.find(user => user.email === email);
  }

  static findUserByUuid(uuid) {
    let users = db.loadTable('users');
    return users.find(user => user.otp.uuid === email);
  }

  static hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  static generateOTP() {
    return {
      uuid: uuidv1(),
      expired_at: new Date(now.getTime + OTP_EXIRED_MINUTES*60*1000)
    }
  }
}

module.exports = UsersManager;