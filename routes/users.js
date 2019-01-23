const express = require('express')
const router = express.Router()
const csrf = require('csurf')
const passport = require('passport')

const csrfProtection = csrf()
router.use(csrfProtection)

// String.prototype.startsWith = function(needle)
// {
//   return(this.indexOf(needle) == 0)
// }

// router.use(function(req, res, next) {
//   if ( !(req.path == '/signin') && req.session.returnTo) {
//     delete req.session.returnTo
//   }
//   next()
// })
//============================================
//  Routes that requires user to be logged in
//============================================

router
.get('/create-event', isLoggedIn, (req, res) => {
  res.render('user/cevent', {csrfToken: req.csrfToken()})
})

.get('/myevent', isLoggedIn, (req, res) => {
  res.render('user/myevent', {csrfToken: req.csrfToken()})
})

.get('/logout', (req, res, next) => {
  req.session.destroy(function (err) {
    if (err)
      next(err)
    else {
      req.logout()
      res.redirect('/')
      //res.redirect('/user/signin')

    }
  })
})


//============================================
//  Public Routes
//============================================

.all('/', isNotLoggedIn, function (req, res, next) {
  next()
})

.get('/signin', function (req, res) {
  if(req.query.origin)
    req.session.returnTo = req.query.origin
  else
    req.session.returnTo = req.header('Referer')
    
  var messages = req.flash('error')
  res.render('user/signin', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  })
})

.get('/signup', function (req, res) {
  var messages = req.flash('error')
  res.render('user/signup', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  })
})

.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/logout',
  failureRedirect: '/user/signup',
  badRequestMessage: 'Bad Request',
  failureFlash: true
}))

// .post('/signin', passport.authenticate('local.signin', {
//   successRedirect: '/',
//   failureRedirect: '/user/signin',
//   failureFlash: true
// }))

.post('/signin', passport.authenticate('local.signin', {failureFlash: true}), function(req, res){
  //console.log(req.user)
  if(req.user){
    let returnTo = '/'
    if(req.session.returnTo){
      returnTo =  req.session.returnTo
      delete req.session.returnTo
    }

    res.redirect(returnTo)
  }else{
    res.redirect('user/signin')
  }
  

})

module.exports = router

//  custom functions
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  //console.log(req.originalUrl)
  res.redirect(`/user/signin?origin=${req.originalUrl}`)
}

// function saveSession(req, res, next){
//   req.session.email = req.body.email
//   next()
// }

function isNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  res.redirect(`/user/signin?origin=${req.originalUrl}`)
}