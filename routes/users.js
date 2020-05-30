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




// if(email === "saurabh@gmail.com") {

// }



router.post('/register', (req, res, next) => {
  User.create(req.body, (err, createdUser) => {
    if (err) return next(err);
    if (createdUser) {
      res.redirect('/users/login');
    }
  })
});

router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/login', (req, res, next) => {
	var { email, password } = req.body;
	// if(!email || !password) // TO CHECK FOR THE LOCAL USER IF THEY DON"T REGISTER WITHOUT THE PASSWORD
	User.findOne({ email }, (err, user) => {
		if (err) return next(err);
		if (!user) {
			console.log('wrong email');
			req.flash('error', 'email is not registered');
			return res.redirect('/users/login');
		}
		if (!user.verifyPassword(password)) {
			console.log('Wrong password');
			return res.redirect('/users/login');
		}
		//log a user in
		//creating a session on the server side
		req.session.userId = user.id; //this line will create a session on the server side. 5 different users, 5 different sessions, grab the id, make a cookie and send it to the client side.
		req.session.username = user.name;
		res.redirect('/articles');
		// Article.find({}, (err, articles) => {
		// if (err) return next(err);
		// res.render('articlesList', { articles });
	});
});

module.exports = router;
