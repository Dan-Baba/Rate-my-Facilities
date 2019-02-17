var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = passport.use(new JwtStrategy({jwtFromRequest: (req, res, next) => {
  console.log(req);
  const authorization = req.get('authorization');
  const token = authorization.split('Bearer ')[1];
  next();
}, secretOrKey: 'brick-hack-secret',
issuer: 'accounts.rate-my-facilities', audience: 'rate-my-facilities.com'}, function (jwt_payload, done) {
  console.log(jwt_payload);
}));
