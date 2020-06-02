var passport = require("passport");
var GitHubStrategy = require("passport-github").Strategy;
var Admin = require("../models/admin");
// var User = require('../models/user');

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile, "GIT HUB STRATEGY");
      var newAdmin = {
        email: profile.emails[0].value || null,
        username: profile._json.login,
		providers: [profile.provider],
      };
    //   console.log(newAdmin, "NEW USER");
      Admin.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(null, false);
        if (!user) {
          Admin.create(newAdmin, (err, user) => {
            done(null, user);
          });
        } else if (user.providers.includes("github")) {
        //   console.log(profile);
          return done(null, user);
        } else {
          Admin.findByIdAndUpdate(
            admin.id,
            { $addToSet: { providers: profile.provider } },
            (err, user) => {
              if (err) return done(null, false);
            //   console.log(user, "GITHUB USER");
              return done(null, user);
            }
          );
        }
      });
    }
  )
);

// when user logs in, the session is created cause of serializeUser
passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	Admin.findById(id, (err, user) => {
		if (err) return done(err);
    done(null, user);
  });
});
