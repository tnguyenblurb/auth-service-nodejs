var express = require('express');
var router = express.Router();
var User = require('./User');

router.post('/signup', function(req, res, next) {
  console.log(JSON.stringify(req.body));
  let user = new User(req.body.username, req.body.email, req.body.password);
  if (!user.save()) {
    return res.json({error: 'Something went wrong!'});
  }
  res.json({message: `Welcome ${req.body.username} onboard!`});
});

router.get('/signin', function(req, res, next) {
  res.send(`sign in`);
});

router.post('/signout', function(req, res, next) {
  res.send(`sign out`);
});

module.exports = router;
