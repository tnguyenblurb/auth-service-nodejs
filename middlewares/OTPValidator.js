const IGNORE_ACTIONS = /^(?!.*(\/users\/signup|\/users\/activate)).*$/;
const UsersManager = require('../user/usersManager');

const validator = (req, res, next) => {
  let uuid = req.get('uuid');
  uuid = UsersManager.validateOTP(uuid);
  if (!uuid) return res.status(422).json({ error: "Invalid uuid" });
  res.set('uuid', uuid);

  next();
}

module.exports = {IGNORE_ACTIONS, validator};