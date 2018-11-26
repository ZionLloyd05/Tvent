var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

//============================================
//  Routes that requires user to be logged in
//============================================

router.get('/create-event', isLoggedIn, function(req, res, next){
  res.render('user/cevent');
})

router.get('/logout', isLoggedIn, function(req, res, next){
  req.session.destroy(function(err){
    if(err)
      next(err);
    else{
      req.logout();
      res.redirect('/user/signin');
    }
  })
})


//============================================
//  Public Routes
//============================================

router.all('/', isNotLoggedIn, function(req, res, next){
  next();
})

router.get('/signin', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signin',  {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
})

router.post('/signin', saveSession, passport.authenticate('local.signin', {
  successRedirect: '/',
  failureRedirect: '/user/signin',
  failureFlash: true
}));

module.exports = router;

//  custom functions
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/user/signin');
}

function saveSession(req, res, next){
  req.session.email = req.body.email;
  next();
}

function isNotLoggedIn(req, res, next){
  if (!req.isAuthenticated()){
    return next();
  }
  res.redirect('/user/signin');
}