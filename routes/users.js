var express = require("express");
var router = express.Router();
var Admin = require("../models/admin");
var auth = require("../middleware/auth");
var multer = require("multer");
var path = require("path");
var Cart = require("../models/cart");
var User = require("../models/user");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

// using multer

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../public/images/uploads"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// Register user form

router.get("/register", (req, res) => {
  res.render("register");
});

// Reguster user POST

router.post("/register", async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password)
  {
    return res.redirect('/users/register');
  }
  try {
    let transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_ID,
          pass: process.env.GMAIL_PASSCODE,
        },
      })
    );
    var verification = Math.random().toString(36).slice(2);
    let mailOptions = {
      from: process.env.GMAIL_ID,
      to: req.body.email,
      subject:
        "Email verification code for the Shopping Cart :- Created By Saurabh Gupta",
      test: "First mail via nodemailer",
      html: `<h1>Dear User,<br>Your One Time Security Code is:</h1> ${verification}. <br> Code is valid for 30 minutes. <br> Please do not reply to this email. `,
    };
    req.body.verification = verification;
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return console.log(err);
      console.log("Message sent: %", info.response);
    });

    var user = await User.create(req.body);
    if (user) {
      console.log(user, "CREATED USER");
      // res.send("success");
      res.status(200).redirect("/users/login");
    }
  } catch (error) {
    next(error);
  }
});

// User login form

router.get("/login", (req, res) => {
  res.render("login");
});

// User Login Post

router.post("/login", async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send({
      success: false,
      error: "Email/Password Required",
    });
  try {
    var user = await User.findOne({ email });
    if (!user) {
      console.log("wrong email");
      // req.flash("error", "email is not registered");
      return res.redirect("/users/login");
    }
    if (!user.verifyPassword(password)) {
      console.log("Wrong password");
      return res.redirect("/users/login");
    }
    //log a user in
    //creating a session on the server side
    req.session.user = user.id; //this line will create a session on the server side. 5 different users, 5 different sessions, grab the id, make a cookie and send it to the client side.
    req.session.username = user.name;
    res.locals.users = false;
    res.redirect("/catalogue/list");
  } catch (error) {
    next(error);
  }
});

// VERIFICATION OF ID
router.post("/:user/verify", async (req, res) => {
  try {
    var user = await User.findById(req.params.user);
    if (user.verification === req.body.verification) {
      var updateUser = await User.findByIdAndUpdate(
        req.params.user,
        { isVerified: true },
        { new: true }
      );
      res.redirect(`/catalogue/list`);
    }
    if (!user.verification === req.body.verification) {
      res.send("not verified");
    }
  } catch (err) {
    res.send(err);
  }
});

router.get("/shoppingBasket/", auth.loggedUser, async function (
  req,
  res,
  next
) {
  try {
    console.log(req.user.id, "CART CONSOLE FROM USERS, Shopping basket id");
    var cart = await Cart.find({ userId: req.user.id }).populate("product");
    console.log(cart, "----------------------------");
    res.render("shoppingBasket", { cart });
  } catch (error) {
    next(error);
  }
});
router.get("/logout", (req, res) => {
  delete req.session.adminId; //DELETE THE specific session userId
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/admin/login");
});

module.exports = router;
