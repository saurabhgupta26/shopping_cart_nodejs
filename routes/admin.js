var express = require("express");
var router = express.Router();
var Admin = require("../models/admin");
var auth = require('../middleware/auth');
var multer = require('multer');
var path = require('path');
var nodemailer = require('nodemailer');
var User = require('../models/user');
var smtpTransport = require('nodemailer-smtp-transport');


// using multer

var storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, path.join(__dirname, "../public/images/uploads"));
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

var upload = multer({storage : storage});

// ADMIN LOGIN

router.get('/login', (req, res) => {
	// console.log(req.session);
	res.render('admin_login');
});

// Admin Login Post

router.post('/login', async (req, res, next) => {
	var { email, password } = req.body;
	if (!email || !password)
		return res.status(400).send({
			success: false,
			error: 'Email/Password Required'
		})
	try {
		var admin = await Admin.findOne({ email });
			if (!admin) {
				console.log('wrong email');
				// req.flash('error', 'email is not registered');
				return res.redirect('/admin/login');
			}
			if (!admin.verifyPassword(password)) {
				console.log('Wrong password');
				return res.redirect('/admin/login');
			}
			//creating a session on the server side
			req.session.userId = user.id; //this line will create a session on the server side. 5 different users, 5 different sessions, grab the id, make a cookie and send it to the client side.
			req.session.username = user.name;
			res.locals.admin = true;
			res.redirect(`/catalogue/list`);
	} catch (error) {
		next(error);
		
	}
});


router.use(auth.checkAdmin);

router.get('/:adminId/adminProfile', async function (req, res, next) {
	// console.log(req.body, 'koke');
	try {
		var adminId = req.params.adminId;
		var admin = await Admin.findById(adminId);
		console.log(admin, "ADMIN PROFILE");
		res.render('admin_profile');
	} catch (error) {
		next(error);
	}
});

router.get('/:adminId/editAdmin', async function (req, res, next) {
	try {
		var adminId  = req.params.adminId;
		var admin = await Admin.findById(adminId);
		// console.log(admin, "admin update");
			res.render('editAdmin', {admin});
	} catch (error) {
		next(error);
	}
});

router.post('/:adminId/editAdmin', upload.single("image"), async function (req, res, next) {
	try {
		var adminId = req.params.adminId;
		req.body.image = req.file.filename;
		var admin = await Admin.findByIdAndUpdate(adminId, req.body, { new: true });
		console.log(admin);
		res.redirect(`/admin/${adminId}/adminProfile`);
	} catch (error) {
		next(error);
	}
});

// GET ALL USERS IN THE LIST

router.get('/users/', auth.checkAdmin, async function(req, res, next) {
	try {
		var totalUsers = await User.find({});
		res.render('users', {totalUsers});
	} catch (error) {
		next(error);
	}

});

// BLOCK and UNBLOCK
router.get('/:id/block/', auth.checkAdmin, async function (req, res, next) {
	try {
		var userId = req.params.id;
		var blocked = await User.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });		
		console.log("THE USER IS BLOCKED");
		res.redirect('/admin/users/');

	} catch (error) {
		next(error);
	}
})

router.get('/:id/unblock/', auth.checkAdmin, async function (req, res, next) {
	try {
		var userId = req.params.id;
		var unblocked = await User.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
		console.log(unblocked, "THE USER IS UNBLOCKED");
		res.redirect('/admin/users/');

	} catch (error) {
		next(error);
	}
})




router.get('/logout', (req, res) => {
	delete req.session.adminId; //DELETE THE specific session userId
	req.session.destroy();
	res.clearCookie('connect.sid');
	res.redirect('/admin/login');
});






module.exports = router;