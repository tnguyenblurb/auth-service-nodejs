const IGNORE_ACTIONS = /^(?!.*(\/users\/signup|\/users\/activate)).*$/;
const UsersManager = require('../users/usersManager');

const validator = (req, res, next) => {
  let usersManager = new UsersManager(req);
  uuid = usersManager.validateOTP();
  if (!uuid) return res.status(422).json({ error: "Invalid uuid" });
  res.set('uuid', uuid);

  next();
}

module.exports = {IGNORE_ACTIONS, validator};