const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {type: String, required: true},
  first_name: {type: String, required: true},
  last_tname: {type: String, required: true},
  password: {type: String, required: true, min: 6},
  username: {type: String, required: true},
  is_active: Boolean,
  is_locked: Boolean,
  last_login_at: Date,
  public_id: {type: String, required: true},
  roles: [String],
  access_token: Token,
  refresh_token: Token,
},
{
  timestamps: true
});
const User = mongoose.model('users', userSchema);

const tokenSchema = new mongoose.Schema({
  token: String,
  expired_at: Date,
  client: Client
},
{
  timestamps: true
});
const Token = mongoose.model('tokens', tokenSchema);

const clientSchema = new mongoose.Schema({
  name: {type: String, required: true},
  secret: {type: String, required: true},
  resource_ids: [String],
  authorities: [String],
  enable: Boolean
});
const Client = mongoose.model('clients', clientSchema);


module.exports = User;