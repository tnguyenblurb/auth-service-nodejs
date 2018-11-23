const IGNORE_ACTIONS = /^(?!.*(\/signup|\/activate|\/signin|\/signout)).*$/; // list of actions don't need OTP in header
const UsersManager = require('../user/usersManager');
const config = require('../config/config');

const OTPValidator = (req, res, next) => {
  let uuid = req.get('uuid');
  if (!uuid) return next('Invalid uuid');
  
  let token = UsersManager.validateAndRegenerateOTP(uuid);

  // error page
  if (!token) return next('Invalid uuid');
  
  res.set('uuid', token.uuid);

  next();
};

const headerValidator = (req, res, next) => {
  if ( !config.DeviceSupport.includes(req.get(config.XDeviceKey)) || !config.LanguageSupport.includes(req.get(config.XLanguageKey)) ) {
    return next('Invalid header');
  };

  next();
}

module.exports = {IGNORE_ACTIONS, OTPValidator, headerValidator};