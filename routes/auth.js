const validatePassword = (req, res, next) => {
  if (req.body.password.length < 8) {
    res.status(400);
    res.send('Password is too short');
    return;
  }
  next();
};

const validateUsername = (req, res, next) => {
  if (req.body.password.length < 5) {
    res.status(400);
    res.send('Username is too short');
    return;
  }
  next();
};

const validateEmail = (req, res, next) => {
  if (req.body.password.length < 5) {
    res.status(400);
    res.send('Username is too short');
    return;
  }
  next();
};

const routes = function(connection) {
  authRouter = require('express').Router();

  authRouter.post('/register', validatePassword, validateUsername,
      validateEmail, (req, res) => {
        console.log(req.body.username);
        res.send('oof');
      });
  return authRouter;
};

module.exports = routes;
