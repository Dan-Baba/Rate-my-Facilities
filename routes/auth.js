const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

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
    connection.query('SELECT * FROM users WHERE username = ?', [req.body.username],
        function(error, results, fields) {
          if (error) throw error;
          if (results.length != 0) {
            res.status(409);
            res.send('Username already exists');
            return;
          };
          next();
        });
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
          next();
        });
  };
  authRouter = require('express').Router();

  authRouter.post('/register', validateEmail, validateUsername,
      validatePassword, (req, res) => {
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
          if (err) throw err;
          connection.query('INSERT INTO users(username, password, email) VALUES(?, ?, ?)',
              [req.body.username, hash, req.body.email], function(error, results, fields) {
                if (error) throw error;
              });
        });
        res.send('POST completed');
      });
  
  authRouter.post('/login', (req, res) => {
    const unauthorizedMSG = 'Your username or password is incorrect.';
    connection.query('SELECT * FROM users WHERE username = ?',
        [req.body.username], function(error, results, fields) {
          if (error) throw error;
          if (results.length == 0) {
            res.status(403);
            res.send(unauthorizedMSG);
            return;
          }

          bcrypt.compare(req.body.password, results[0].password, function(err, resb) {
            if (err) throw err;
            console.log(resb);
            if (resb) {
              // TOKEN
            } else {
              res.status(403);
              res.send(unauthorizedMSG);
              return;
            }
            const token = jwt.sign({username: results[0].username, email: results[0].email},
                'brick-hack-private-key', {expiresIn: '1d'});
            console.log(token);
            res.send({token: token});
          });
        });
  });
  return authRouter;
};

module.exports = routes;
