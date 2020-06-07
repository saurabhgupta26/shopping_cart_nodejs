var Admin = require('../models/admin');
var User = require('../models/user');
var Product = require('../models/product');
var passport = require('passport');

exports.checkAdmin = async function (req, res, next) {
    try {
        if (req.session.adminId || req.session.passport) {
			console.log(req.session, "THIS IS IN CHECK ADMIN AUTH ==================================");
            var admin = await Admin.findById(req.session.passport.user)
			if(!admin) {
                res.redirect('/admin/login')
            } else {
            res.locals.user = admin;
            res.locals.admin = {
                id : admin.id,
                name : admin.name,
                isAdmin : admin.admin,
                username : admin.username,
                email : admin.email
            };

            }
			next() 
        } else { 
			next()
		}
    } catch (error) {
        next(error);
    }
}
// <% if(user.id && user.email === "saurabhguptaviet@gmail.com" ) { %>

exports.loggedUser = async function (req, res, next) {
    console.log(req.session, "CHECKING PASSPORT");
    try {
        if (req.session.passport || req.session.user) {
            console.log(req.session.user, "LOGGED USER INFO");
            var id = req.session.user || req.session.passport.user;
            if(req.session.user) {
            var user = await User.findById(id, '-password');
            if(user) {
                req.user = user;
                res.locals.user = {
                    id : user.id,
                    name : user.name
                };   
            }
        } else {
            console.log(req.session, "LOGGED USER INFO in admin");
			var logged = await Admin.findById(id, '-password');
			// console.log(logged, "Showing logged");
            if(logged) {
                req.userId = logged.id;
                res.locals.user = {
                    id : logged.id,
                    name : logged.name,
					isAdmin : logged.admin,
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
