var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('public/index', { title: 'Express' });
});

// Signup page request
router.get('/signup', function(req, res, next){
  var messages = req.flash('error');
  res.render('public/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
})

// user signup request
router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/signin',
  failureRedirect: '/signup',
  failureFlash: true
}))
module.exports = router;
