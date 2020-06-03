var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/failure' }), (req, res) => {
  // console.log(req.session.passport.user.admin.id,"from index",req.session.passport.user.id)
  console.log(req,"from index")
  req.session.userId = req.session.passport.user.id
	res.redirect('/catalogue/list');
});

module.exports = router;
