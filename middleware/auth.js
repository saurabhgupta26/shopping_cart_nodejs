var User = require('../models/user');
var Admin = require('../models/admin');
var passport = require('passport');

exports.checkUserLogged = (req, res, next) => {
	console.log(req.session, 'user session data');
	// var sessionId = req.session.userId || req.session.passport;
	if (req.session.userId || req.session.passport) {
		next();
		// req.session.redirectTo = req.originalUrl;   //to redirect to the original path after the log in is done.
	} else {
		return res.redirect('/users/login');
	}
};

exports.checkAdminLogged = (req, res, next) => {
	console.log(req.session, 'admin session data');
	// var sessionId = req.session.userId || req.session.passport;
	if (req.session.adminId || req.session.passport) {
		next();
		// req.session.redirectTo = req.originalUrl;   //to redirect to the original path after the log in is done.
	} else {
		return res.redirect('/admin/login');
	}
};

exports.adminName = (req, res, next) => {
	// console.log(req.session, "CHECKING PASSPORT");
	if (req.session.passport) {
		console.log(req.session);
		req.session.adminId = req.session.passport.admin;
	}
	if (req.session.adminId) {
		Admin.findById(req.session.adminId, '-password', (err, admin) => {
			// can also put the projection as "-password"
			if (err) return next(err);
			req.adminId = admin;
			res.locals.admin = admin;
			next();
		});
	} else {
		//console.log('In user : no user');
		req.admin = null;
		res.locals.admin = null;
		// res.redirect('/users/login');
		next();
	}
};



exports.userName = (req, res, next) => {
	// console.log(req.session, "CHECKING PASSPORT");
	if (req.session.passport) {
		console.log(req.session);
		req.session.userId = req.session.passport.user;
	}
	if (req.session.userId) {
		User.findById(req.session.userId, '-password', (err, user) => {
			// can also put the projection as "-password"
			if (err) return next(err);
			req.userId = user;
			res.locals.user = user;
			next();
		});
	} else {
		//console.log('In user : no user');
		req.user = null;
		res.locals.user = null;
		// res.redirect('/users/login');
		next();
	}
};
