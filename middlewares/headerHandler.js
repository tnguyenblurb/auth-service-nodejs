const IGNORE_ACTIONS = /^(?!.*(\/signup|\/activate|\/signin|\/signout)).*$/; // list of actions don't need OTP in header
const usersBusiness = require('../components/users/usersBusiness');
const config = require('../config/config');
const authorizationConfig = require('../config/authorization');

const authAndRegenerateOTP = (req, res, next) => {
  let uuid = req.get('uuid');
  if (!uuid) return next('[authAndRegenerateOTP] uuid is required');
  
  // authenciate by uuid
  let {user, token} = usersBusiness.authenticateByUUID(uuid);
  if (!user || !token) return next('Invalid uuid');

  // authorize ACL
  if (!authorizeUser(req, user)) return next('Permission denied!');

  // regenerate UUID
  let newToken = usersBusiness.regenerateToken(user, token);
  
  res.set('uuid', newToken.uuid);

  next();
};

const authorizeUser = (req, user) => {
  let actions = authorizationConfig[user.role];
  if (actions === 'all') return true;
  return actions && actions.find(action => req.path.includes(action));
};

const headerValidator = (req, res, next) => {
  if ( !config.DeviceSupport.includes(req.get(config.XDeviceKey)) || !config.LanguageSupport.includes(req.get(config.XLanguageKey)) ) {
    return next('Invalid header');
  };

  next();
};

module.exports = {IGNORE_ACTIONS, authAndRegenerateOTP, headerValidator};