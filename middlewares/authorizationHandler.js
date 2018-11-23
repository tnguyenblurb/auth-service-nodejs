const UsersManager = require('../user/usersManager');
const config = require('../config/config');
const authorizationConfig = require('../config/authorization');

const authorization = (req, res, next) => {
  let uuid = req.get('uuid');
  if (!uuid) return next();
  
  let {user, token} = UsersManager.findUserAndTokenByUuid(uuid);
  if (!user) return next('Something went wrong!');

  let actions = authorizationConfig[user.role];
  if (actions === 'all') return next();
  if (!actions || !actions.find(action => req.path.includes(action))) return next('Permission denied!'); 

  next();
};

module.exports = {authorization};