var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var ejs = require("ejs");
var createError = require("http-errors");
var session = require("express-session");
var multer = require("multer");
var passport = require("passport");
const MongoStore = require("connect-mongo")(session);
var auth = require("./middleware/auth");

require("dotenv").config();
require("./modules/passport");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var catalogueRouter = require('./routes/catalogue');
var cartRouter = require('./routes/carts');


//connect to db
mongoose.connect(
  "mongodb://localhost/sample2",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    console.log("Connected", err ? err : true);
  }
  );
  
  // Instantiate express
  var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// creating session to make cookies

//SESSION MAKER

app.use(
	session({
		secret: 'saurabh@altcampus', //secret word to access the hash as an administrator.
		resave: false, //to save your session when you revisit, will extend your session from that point of revisit till the session expires or till you revist and extend the session validity.
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection })
	})
);

app.use(passport.initialize());
app.use(passport.session());

// // app.use(auth.userName);






// ROUTING MIDDLEWARES

app.use('/users', usersRouter);
app.use('/cart', cartRouter);
app.use(auth.checkAdmin);
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/catalogue', catalogueRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
