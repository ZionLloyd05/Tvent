const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');

const csrfProtection = csrf();
router.use(csrfProtection);

//============================================
//  Routes that requires user to be logged in
//============================================

router.get('/create-event', isLoggedIn, function (req, res, next) {
  res.render('user/cevent', {csrfToken: req.csrfToken()});
})



router.get('/logout', isLoggedIn, function (req, res, next) {
  req.session.destroy(function (err) {
    if (err)
      next(err);
    else {
      req.logout();
      res.redirect('/user/signin');
    }
  })
})


//============================================
//  Public Routes
//============================================

router.all('/', isNotLoggedIn, function (req, res, next) {
  next();
})

router.get('/signin', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
})

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/',
  failureRedirect: '/user/signin',
  failureFlash: true
}));

module.exports = router;

//  custom functions
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/user/signin');
}

// function saveSession(req, res, next){
//   req.session.email = req.body.email;
//   next();
// }

function isNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/user/signin');
}