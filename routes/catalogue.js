var express = require("express");
var router = express.Router();
var Admin = require("../models/admin");
var auth = require('../middleware/auth');
var multer = require('multer');
var path = require('path');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

router.use(auth.checkAdminLogged);

router.get('/:adminId/list', async function(req, res, next) {
    if(!req.adminId.isVerified){
        console.log("user not verified");
    //    return res.send("please verify first")
       return res.render("verify", {id:req.adminId})
    }
    console.log("inside profile router.", req.adminId.isVerified);
    res.render('catalogue');
    
})


module.exports = router;