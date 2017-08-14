const express = require('express');
const router = express.Router();

// Homepage
router.get('/', function(req,res,next){
  res.render('index', {title: 'Index'});
});


module.exports = router;
