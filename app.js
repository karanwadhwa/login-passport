const express = require('express');
const path = require('path');
const bodyParser = require ('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');

// Port
port = 3000;

mongoose.connect('mongodb://localhost/login-passport');
let db = mongoose.connection;

// Check db connection and errors
db.once('open', function(){
  console.log('Connected to MongoDB');
});

db.on('error', function(err){
  console.log(err);
});

// Route Files
const index = require('./routes/index');
const users = require ('./routes/users');

// Init App
const app = express();

// Load View Engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');

// bodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Express Session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// Routes
app.use('/' , index);
app.use('/users', users);

// Start Server
app.listen(port, function(){
  console.log('Server started on port '+port+'...');
});
