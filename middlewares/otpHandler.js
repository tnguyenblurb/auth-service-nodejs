const IGNORE_ACTIONS = /^(?!.*(\/users\/signup|\/users\/activate|\/users\/signin)).*$/; // list of actions don't need OTP in header
const UsersManager = require('../user/usersManager');

const validator = (req, res, next) => {
  let uuid = req.get('uuid');
  if (!uuid) return next('Invalid uuid');
  
  uuid = UsersManager.validateOTP(uuid);

  // error page
  if (!uuid) return next('Invalid uuid');
  
  res.set('uuid', uuid);

  next();
};

module.exports = {IGNORE_ACTIONS, validator};