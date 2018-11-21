'use strict'; 
const db = require('../database/database');
const bcrypt = require('bcrypt');


class User {
  constructor(username, email, password) {
    this.data = {username: username, email: email, password: password};
  }

  save() {
    if (!this.exist()) {
      return false;
    }
    
    this.hashPassword();
    return db.save(this.data, 'users.json');
  }

  authenticate(email, password) {
    let users = db.load('users.json');
    return users.find(user => this.data.email === user.email && bcrypt.compareSync(this.data.password, user.password));
  }

  exist() {
    let users = db.load('users.json');
    return users.find(user => this.data.username === user.username || this.data.email === user.email);
  }

  hashPassword() {
    this.data.password = bcrypt.hashSync(this.data.password, 10);
  }
}

module.exports = User;