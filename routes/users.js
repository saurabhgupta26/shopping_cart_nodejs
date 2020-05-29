var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, createdUser) => {
    if (err) return next(err);
    if (createdUser) {
      res.redirect('/users/login');
    }
  })
});



module.exports = router;
