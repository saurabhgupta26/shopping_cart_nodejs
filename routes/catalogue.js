var express = require("express");
var router = express.Router();
var Admin = require("../models/admin");
var Product = require('../models/product');
var auth = require('../middleware/auth');
var multer = require('multer');
var path = require('path');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var auth = require('../middleware/auth');

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
router.use(auth.checkAdmin);


router.get('/list', auth.loggedUser, async function(req, res, next) {
    // console.log("catalogue",req.user);
    if(req.user.isVerified) {
        var product = await Product.find({});
        // console.log(product, "Product got here")
        return res.render('catalogue', {product});
    }    
    else {
        // console.log("user not verified");
    //    return res.send("please verify first")
       return res.render("verify", {id:req.user})
    }   
});

router.get('/list/:productId', auth.loggedUser, async function(req, res, next) {
    try {
        // console.log("catalogue",req.params.productId);
        var id = req.params.productId;
        var product = await Product.findById(id);
        // console.log(product, "product info");
        res.render('product', {product});
    } catch (error) {
        next(error);
    }
})






 router.use(auth.checkAdmin);

router.get('/add_product', function(req, res, next) {
    res.render('add_product');
});

router.post('/add_product', upload.single("image"), async function(req, res, next) {
        req.body.image = req.file.filename;
    try {    
            var product = await Product.create(req.body);
            if (product) {
                // console.log(product, "CREATED PRODUCT");
                // res.send("success");
              res.redirect(`/catalogue/list`);
            }
        } catch (error) {
            next(error);
        }
    });

router.get('/edit_product', async function(req, res, next) {
    var productId = req.params.productId;
    // console.log(productId, "productId");
    // var product = await Product.findById(productId);
    // res.render('edit_product', {product});
});

router.post('/edit_product', upload.single("image"), async function (req, res, next) {
	try {
		var adminId = req.params.adminId;
		req.body.image = req.file.filename;
		var product = await Product.findByIdAndUpdate(adminId, req.body, { new: true });
		res.redirect(`/catalogue/${adminId}/list`);
	} catch (error) {
		next(error);
	}
})

module.exports = router;