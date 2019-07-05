const mongoose = require('mongoose');
const db = require('../../database/database');

exports.createUser = function(user) {
  return db.save(user, 'users');
}

exports.updateUser = function(user) {
  return db.save(user, 'users');
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

exports.search = function(searchData) {
  let startIndex = searchData.page * searchData.limit;
  let endIndex = searchData.page * searchData.limit + searchData.limit;
  let users = db.loadTable('users');
  users = users.filter(user => {
    if (searchData.name) {
      if (!user.name.toLowerCase().startsWith(searchData.name.toLowerCase())) return false;
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

exports.findUserByEmail = function(email) {
  let users = db.loadTable('users');
  return users.find(user => user.email === email);
}

