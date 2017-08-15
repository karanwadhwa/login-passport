const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.js');
const config = require('../config/database.js');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  // Local Strategy
  passport.use(new LocalStrategy(function(username, password, done) {
    // Match Username
    query = { username: username };
    User.findOne(query, function (err, user) {
      if (err) throw err;
      if (!user){
        return done(null, false, {message: 'Invalid Username'});
      }
      // Match Password
      bcrypt.compare(password, user.password, function(err, isMatch) {
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        }else{
          return done(null, false, {message: 'Invalid Password'});
        }
      });
    });
  }
));
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

}
