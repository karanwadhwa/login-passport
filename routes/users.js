const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

let User = require('../models/user.js');

//Register Route
router.get('/register', function(req,res,next){
  res.render('register', {title: 'Register'});
});

// Process Registration Form
router.post('/register', function(req,res,next){
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name','Enter your Name').notEmpty();
  req.checkBody('username','Enter your Username').notEmpty();
  req.checkBody('email','Enter your email').notEmpty();
  req.checkBody('email','Enter a valid email address').isEmail();
  req.checkBody('password','Enter a password').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register',{
      title: 'Register',
      errors : errors
    });
  }
  else{
    let newUser = new User({
      name: name,
      username: username,
      email: email,
      password: password
    });

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          }
          else{
            req.flash('success','User Registration Successful');
            res.redirect('/users/login');
            console.log("User Registration Successful");

          }
        });
      });
    });
  }
});

// Login Route
router.get('/login', function(req,res){
  res.render('login', {title: 'Login'});
});

// Process Login Form
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

module.exports = router;
