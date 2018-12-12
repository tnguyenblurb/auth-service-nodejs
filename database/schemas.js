const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {type: String, required: true},
  firstname: {type: String, required: true},
  lasttname: {type: String, required: true},
  password: {type: String, required: true, min: 6},
  username: {type: String, required: true},
  account_enabled: Boolean,
  account_locked: Boolean,
  public_id: {type: String, required: true},
  roles: [String]
},
{
  timestamps: true
});
const User = mongoose.model('users', userSchema);

const tokenSchema = new mongoose.Schema({
  token: {type: String, required: true},
  username: {type: String, required: true},
  
  account_enabled: Boolean,
  account_locked: Boolean,
  public_id: {type: String, required: true}
},
{
  timestamps: true
});
const User = mongoose.model('users', userSchema);


module.exports = User;