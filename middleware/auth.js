var Admin = require('../models/admin');
var User = require('../models/user');
var passport = require('passport');

exports.checkAdmin = async function (req, res, next) {
    try {
        if (req.session.adminId || req.session.passport) {
			// console.log(req.session)
            var admin = await Admin.findById(req.session.passport.user)
			if(!admin) res.redirect('/admin/login')
			res.locals.user = admin;
			next() 
        } else { 
			next()
		}
    } catch (error) {
        next(error);
    }
}

exports.loggedUser = async function (req, res, next) {
    console.log(req.session, "CHECKING PASSPORT");
    try {
        if (req.session.passport || req.session.user) {
            console.log(req.session, "LOGGED USER INFO");
            var id = req.session.user || req.session.passport.user;
            if(req.session.user) {
            var user = await User.findById(id, '-password');
            if(user) {
                req.user = user;
                res.locals.user = {
                    id : user.id,
                    name : user.name,
                    isAdmin : user.isAdmin,
                };   
            }
        } else {
            // console.log(req.session, "LOGGED USER INFO in admin");
			var logged = await Admin.findById(id, '-password');
			// console.log(logged, "Showing logged");
            if(logged) {
                req.userId = logged.id;
                res.locals.user = {
                    id : logged.id,
                    name : logged.name,
					isAdmin : logged.isAdmin,
					username : logged.username,
					email : logged.email
                };   
            }
        }
        next();
    }
 } catch (error) {
        next(error);
    }
}
