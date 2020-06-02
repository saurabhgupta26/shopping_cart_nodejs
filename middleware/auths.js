var Admin = require('../models/Admin');
var User = require('../models/user');
var passport = require('passport');

exports.checkAdmin = async function (req, res, next) {
    try {
        if (req.session.adminId || req.session.passport) {
            var admin = await Admin.findById(req.admin)
            if(user.isVerified) {
                if(admin.isAdmin) {
                    next();
            } else {
                res.redirect('/admin/login')
            }
        } else {
            return res.redirect('/verify');
        }
        } else { 
        res.redirect('/admin/login');
        }
    } catch (error) {
        next(error);
    }
}

exports.loggedUser = async function (req, res, next) {
    // console.log(req.session, "CHECKING PASSPORT");
    try {
        if (req.session.passport || req.session.userId) {
            // console.log(req.session, "LOGGED USER INFO");
            var id = req.session.userId || req.session.passport.user;
            if(req.session.userId) {
            var logged = await User.findById(id, '-password');
            if(logged) {
                req.userId = user.id;
                res.locals.user = {
                    id : user.id,
                    name : user.name,
                    isAdmin : user.isAdmin,
                };   
            }
        } else {
            // console.log(req.session, "LOGGED USER INFO in admin");
            var logged = await Admin.findById(id, '-password');
            if(logged) {
                req.userId = user.id;
                res.locals.user = {
                    id : user.id,
                    name : user.name,
                    isAdmin : user.isAdmin,
                };   
            }
        }
        next();
    }
 } catch (error) {
        next(error);
    }
}
