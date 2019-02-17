const routes = function(connection) {
  const validatePassword = (req, res, next) => {
    if (req.body.password.length < 8) {
      res.status(400);
      res.send('Password is too short');
      return;
    }
    next();
  };

  const validateUsername = (req, res, next) => {
    if (req.body.username.length < 5) {
      res.status(400);
      res.send('Username is too short');
      return;
    }
    connection.query('SELECT ? FROM users', [req.body.username],
        function(error, results, fields) {
          if (error) throw error;
          if (results.length != 0) {
            res.status(409);
            res.send('Username already exists');
            return;
          };
        });
    next();
  };

  const validateEmail = (req, res, next) => {
    if (/.?@.?./.exec(req.body.email) === null) {
      res.status(400);
      res.send('Email is invalid');
      return;
    }

    connection.query('SELECT * FROM users WHERE email = ?', [req.body.email],
        function(error, results, fields) {
          if (error) throw error;
          if (results.length != 0) {
            res.status(409);
            res.send('User with entered email already exists');
            return;
          };
        });
    next();
  };
  authRouter = require('express').Router();

  authRouter.post('/register', validatePassword, validateUsername,
      validateEmail, (req, res) => {
        console.log(req.body.username);
        res.send('oof');
      });
  return authRouter;
};

module.exports = routes;
