var express = require("express");
var router = express.Router();
var Admin = require("../models/admin");
var Product = require('../models/product');
var auth = require('../middleware/auth');
var multer = require('multer');
var path = require('path');
var nodemailer = require('nodemailer');
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

router.use(auth.checkAdminLogged);

router.get('/:adminId/list', async function(req, res, next) {
    console.log("catalogue")
    if(!req.adminId.isVerified){
        console.log("user not verified");
    //    return res.send("please verify first")
       return res.render("verify", {id:req.adminId})
    }
    console.log("inside profile router.", req.adminId.isVerified);
    // var product = [];
    var product = await Product.find({});
    console.log(product, "Product got here")
    res.render('catalogue', {product});
    
})

router.get('/:adminId/add_product', function(req, res, next) {
    res.render('add_product');
});

router.post('/:adminId/add_product', upload.single("image"), async function(req, res, next) {
        req.body.image = req.file.filename;
    try {    


            var product = await Product.create(req.body);
            if (product) {
                console.log(product, "CREATED PRODUCT");
                // res.send("success");
              res.redirect(`/catalogue/${req.params.adminId}/list`);
            }
        } catch (error) {
            next(error);
        }
    });





module.exports = router;