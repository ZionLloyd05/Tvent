var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

const eventController = require('../controllers/event.ctrl')

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('public/index', {
    title: 'Tvent',
    csrfToken: req.csrfToken()
  });
});

// Signup page request
router.get('/signup', function (req, res, next) {
  var messages = req.flash('error');
  res.render('public/signup', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
})

// user signup request
router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/signin',
  failureRedirect: '/signup',
  failureFlash: true
}))

// feeds
router.get('/feeds', async function (req, res) {
  let events = await eventController.getEvents()
  let hasEvent = events.length > 0
  res.render('public/feeds', {
    title: 'Event Feeds',
    csrfToken: req.csrfToken(),
    events,
    hasEvent
  })
})
module.exports = router;