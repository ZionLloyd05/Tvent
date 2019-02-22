const express = require('express')
const router = express.Router()
const csrf = require('csurf')
const passport = require('passport')
const UserController = require('../controllers/user.ctrl')
const User = require('../models/user')

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
    res.render('user/cevent', {
      csrfToken: req.csrfToken()
    })
  })

  .get('/myevent', isLoggedIn, (req, res) => {
    res.render('user/myevent', {
      csrfToken: req.csrfToken()
    })
  })

  .get('/profile', isLoggedIn, (req, res) => {
    res.render('user/profile', {
      csrfToken: req.csrfToken()
    })
  })

  .get('/logout', (req, res, next) => {
    req.session.destroy(function (err) {
      if (err)
        next(err)
      else {
        req.logout()
        // res.redirect('/')
        res.redirect('/user/signin')

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

  .post('/', passport.authenticate('local.signup', {
    successRedirect: '/user/logout',
    failureRedirect: '/user/signup',
    badRequestMessage: 'Bad Request',
    failureFlash: true
  }))

  .post('/update', function (req, res) {
    if (req.body.password != '')
      req.body.password = User.encryptPassword(req.body.password)
    User.findByIdAndUpdate({
      _id: req.body.id
    }, req.body, {
      new: true
    }, (err, user) => {
      if (err)
        console.log(err)
      if (user)
        res.redirect('/user/logout')
    })
  })

  .post('/quickregister', passport.authenticate('local.signup'), (req, res) => {
    if (req.user) {
      req.logOut()
      res.json({
        status: 'User Created'
      })
    } else {
      res.json({
        status: 'Oops, something went wrong!'
      })
    }
  })


  .post('/signin', passport.authenticate('local.signin', {
    failureFlash: true,
    failureRedirect: '/user/signin'
  }), function (req, res) {
    //console.log(req.user)
    try {
      if (req.user) {
        console.log('here')
        let returnTo = '/'
        if (req.session.returnTo) {
          console.log('here 2')
          returnTo = req.session.returnTo
          delete req.session.returnTo
        }
        if (returnTo == 'http://' + req.headers.host + '/user/signup') {
          console.log('here 3')
          return res.redirect('/')
        }
        res.redirect(returnTo)
      } else {
        console.log('here 5')
        res.redirect('user/signin')
      }

    } catch (error) {
      console.log(error)
    }


  })
  //===========================================================

  //============================================================
  //    FUNCTIONAL ROUTES
  //============================================================

  //Checks uniqueness of email
  .get('/check-email/:email', UserController.isEmailExist);

//===========================================================

module.exports = router

//  custom functions
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  //console.log(req.originalUrl)
  res.redirect(`/user/signin?origin=${req.originalUrl}`)
}

function isNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  res.redirect(`/user/signin?origin=${req.originalUrl}`)
}