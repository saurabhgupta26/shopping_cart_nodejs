var express = require("express");
var router = express.Router();
var Admin = require("../models/admin");

router.get("/register", (req, res) => {
  res.render("admin_registration");
});

router.post("/register", (req, res, next) => {
  Admin.create(req.body, (err, createdAdmin) => {
    if (err) return next(err);
    if (createdAdmin) {
        console.log(createdAdmin);
        res.send("success");
    //   res.redirect("/admin/login");
    }
  });
});

router.get('/login', (req, res) => {
	res.render('admin_login');
});

router.post('/login', (req, res, next) => {
	var { email, password } = req.body;
	// if(!email || !password) // TO CHECK FOR THE LOCAL USER IF THEY DON"T REGISTER WITHOUT THE PASSWORD
	Admin.findOne({ email }, (err, admin) => {
		if (err) return next(err);
		if (!admin) {
			console.log('wrong email');
			// req.flash('error', 'email is not registered');
			return res.redirect('/admin/login');
		}
		if (!admin.verifyPassword(password)) {
			console.log('Wrong password');
			return res.redirect('/admin/login');
		}
		//log a user in
		//creating a session on the server side
		req.session.adminId = admin.id; //this line will create a session on the server side. 5 different users, 5 different sessions, grab the id, make a cookie and send it to the client side.
		req.session.username = admin.name;
        // res.redirect('/articles');
        console.log(admin);
        res.send("Admin logged In");
		// Article.find({}, (err, articles) => {
		// if (err) return next(err);
		// res.render('articlesList', { articles });
	});
});


module.exports = router;