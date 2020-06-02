var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/failure' }), (req, res) => {
  // console.log(req.session.passport.user.admin.id,"from index",req.session.passport.user.id)
  console.log(req,"from index")
  req.session.userId = req.session.passport.user.id
	res.redirect('/catalogue/list');
});

// verification route

// router.post("/verify", async (req, res) => {
//   try {
//     // console.log(req.params.adminId, "adminID");
//     var user = await User.findById(req.params.userId);
//     if (user.verification === req.body.verification) {
//       var updateUser = await User.findByIdAndUpdate(
//         req.params.userId,
//         { isVerified: true },
//         { new: true }
//       );
//       console.log(updateUser, "reached second");
//       res.redirect(`/catalogue/list`);
//     }
//     if (!user.verification === req.body.verification) {
//       console.log(req.body.verification, "BODY verify");
//       res.send("not verified");
//     }
//   } catch (err) {
//     res.send(err);
//     console.log(err);
//   }
// });





module.exports = router;
