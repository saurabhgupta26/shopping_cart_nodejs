var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../models/user');
var Admin = require('../models/admin');

// passport.use(
// 	new GitHubStrategy(
// 		{
// 			clientID: process.env.CLIENT_ID,
// 			clientSecret: process.env.CLIENT_SECRET,
// 			callbackURL: 'http://localhost:3000/auth/github/callback'
// 		},
// 		function(accessToken, refreshToken, profile, done) {
// 			// console.log(profile);
// 			var newUser = {
// 				email: profile.emails[0].value || null,
// 				username: profile._json.login,
// 				id: profile.id,
// 				providers: [ profile.provider ]
// 			};
// 			console.log(newUser, 'NEW USER');
// 			User.findOne({ email: profile._json.email }, (err, user) => {
// 				if (err) return done(null, false);
// 				if (!user) {
// 					User.create(newUser, (err, user) => {
// 						done(null, user);
// 					});
// 				} else if (user.providers.includes('github')) {
// 					console.log(profile);
// 					//  console.log(user, 'user not found');
// 					return done(null, user);
// 				} else {
// 					User.findByIdAndUpdate(user.id, { $addToSet: { providers: profile.provider } }, (err, user) => {
// 						if (err) return done(null, false);
// 						console.log(user, 'GITHUB USER');
// 						return done(null, user);
// 					});
// 				}
// 			});
// 		}
// 	)
// );

// passport.use(
// 	new FacebookStrategy(
// 		{
// 			clientID: process.env.APP_ID,
// 			clientSecret: process.env.APP_SECRET,
// 			callbackURL: 'http://localhost:3000/auth/facebook/callback',
// 			profileFields: [ 'id', 'email', 'displayName', 'photos', 'gender' ]
// 		},
// 		function(accessToken, refreshToken, profile, done) {
// 			console.log(profile);
// 			var newUser = {
// 				email: profile._json.email || null,
// 				name: profile.displayName,
// 				id: profile.id,
// 				providers: [ profile.provider ]
// 			};
// 			console.log(newUser, 'NEW USER');
// 			User.findOne({ email: profile._json.email }, (err, user) => {
// 				if (err) return done(null, false);
// 				if (!user) {
// 					User.create(newUser, (err, user) => {
// 						done(null, user);
// 					});
// 				} else if (user.providers.includes('facebook')) {
// 					console.log(profile);
// 					//  console.log(user, 'user not found');
// 					return done(null, user);
// 				} else {
// 					User.findByIdAndUpdate(user.id, { $addToSet: { providers: profile.provider } }, (err, user) => {
// 						if (err) return done(null, false);
// 						console.log(user, 'FACEBOOK USER');
// 						return done(null, user);
// 					});
// 				}
// 			});
// 		}
// 	)
// );

// passport.use(
// 	new GoogleStrategy(
// 		{
// 			clientID: process.env.GOOGLE_ID,
// 			clientSecret: process.env.GOOGLE_SECRET,
// 			callbackURL: 'http://localhost:3000/auth/google/callback',
// 			profileFields: [ 'id', 'email', 'displayName' ]
// 		},
// 		function(accessToken, refreshToken, profile, done) {
// 			console.log(profile);
// 			var newUser = {
// 				email: profile._json.email || null,
// 				name: profile.displayName,
// 				id: profile.id,
// 				providers: [ profile.provider ]
// 			};
// 			console.log(newUser, 'NEW USER');
// 			User.findOne({ email: profile._json.email }, (err, user) => {
// 				if (err) return done(null, false);
// 				if (!user) {
// 					User.create(newUser, (err, user) => {
// 						done(null, user);
// 					});
// 				} else if (user.providers.includes('google')) {
// 					console.log(profile, 'CHECKING AGAIN FOR RELOGIN GOOGLE');
// 					//  console.log(user, 'user not found');
// 					return done(null, user);
// 				} else {
// 					User.findByIdAndUpdate(user.id, { $addToSet: { providers: profile.provider } }, (err, user) => {
// 						if (err) return done(null, false);
// 						console.log(user, 'GOOGLE USER');
// 						return done(null, user);
// 					});
// 				}
// 			});
// 		}
// 	)
// );

// when user logs in, the session is created cause of serializeUser
passport.serializeUser((user, done) => {
	// console.log(user, "NEW USER IN THE SERIALIZER")
	// done(null, user._id); //this is a github id, not our database ID, KEEP IT IN MIND
	done(null, user.id);
});

// job of the deserializer is to fetch the information from the session and retrieve it into the user info
// it is called everytime the logged in user does a request.
passport.deserializeUser((id, done) => {
	// console.log(id, "NEW USER IN THE DESERIALIZER");
	User.findById(id, (err, user) => {
		if (err) return done(err);
		// console.log(user, "NEW USER IN THE DESERIALIZER");
		done(null, user);
	});
	// var user = { email: 'saurabhguptaviet@gmail.com', username: 'saurabhgupta26' };
	// done(null, id);
});
