var express = require("express");
var router = express.Router();
var Admin = require("../models/admin");
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

// register admin

router.get("/register", (req, res) => {
  res.render("admin_registration");
});

// create admin
router.post("/register", async (req, res, next) => {
	// console.log(req.body, 'eyxe');
try {
	let transporter = nodemailer.createTransport(smtpTransport({
		service: 'gmail',
		auth: {
		  user: process.env.GMAIL_ID,
		  pass: process.env.GMAIL_PASSCODE,
		},
	  }));
	
	  var verification = Math.random().toString(36).slice(2);
	
	  let mailOptions = {
		from: process.env.GMAIL_ID,
		to: req.body.email,
		subject: "This is a test mail.",
		test: "First mail via nodemailer",
		html: `<h1>From nodemailer</h1> ${verification}`,
	  };
	
	  req.body.verification = verification;
	
	  transporter.sendMail(mailOptions, (err, info) => {
		if (err) return console.log(err);
		console.log("Message sent: %", info.response);
	  });

		var admin = await Admin.create(req.body);
		if (admin) {
			console.log(admin, "CREATED ADMIN");
			// res.send("success");
		  res.status(200).redirect("/admin/login");
		}
	} catch (error) {
		next(error);
	}
});

// VERIFICATION OF ID
router.post('/:adminId/verify', async(req,res) => {
	try{
	  var admin = await Admin.findOne({email: req.params.adminId})
	  if (admin.verification === req.body.verification) {
		var updateAdmin = await Admin.updateOne(
		  { email: req.params.email },
		  { isVerified: true },
		  { new: true }
		);
		res.redirect("/catalogue")
	  } 
	  if(user.verification === req.body.verification){
		res.send("not verified")
	  }
	}catch(err){
	  res.send(err)
	  console.log(err)
	}
  })

// ADMIN LOGIN

router.get('/login', (req, res) => {
	res.render('admin_login');
});

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
			req.session.adminId = admin.id; //this line will create a session on the server side. 5 different users, 5 different sessions, grab the id, make a cookie and send it to the client side.
			req.session.username = admin.name;
			res.redirect(`/admin/${admin.id}/adminProfile`, {admin});
	} catch (error) {
		next(error);
		
	}
});


router.use(auth.checkAdminLogged);

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
})






module.exports = router;