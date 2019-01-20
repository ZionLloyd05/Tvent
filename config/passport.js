var passport = require('passport')
var User = require('../models/user')
var LocalStrategy = require('passport-local').Strategy

passport.serializeUser(function (user, done) {
    done(null, user._id)
})

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user)
    })
})

// Registeration Strategy
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    //console.log(req)
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail()
    req.checkBody('password', 'Invalid Password').notEmpty().isLength({
        min: 4
    })
    var errors = req.validationErrors()
    if (errors) {
        var messages = []
        errors.forEach(function (error) {
            console.log(error)
            messages.push(error.msg)
        })
        return done(null, false, req.flash('error', messages))
    }
    User.findOne({
        'email': email
    }, function (err, user) {
        if (err) {
            return done(err)
        }
        if (user) {
            console.log('email in use')
            return done(null, false, {
                message: 'Email is already in use'
            })
        }
        var newUser = new User()
        newUser.email = email
        newUser.password = newUser.encryptPassword(password)
        newUser.firstname = req.body.firstname
        newUser.lastname = req.body.lastname
        // console.log(newUser)
        newUser.save(function (err, result) {
            if (err) {
                return done(err)
            }
            return done(null, newUser)
        })
    })
}))

// Sign In Strategy
passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail()
    req.checkBody('password', 'Invalid Password').notEmpty()
    var errors = req.validationErrors()
    if (errors) {
        var messages = []
        errors.forEach(function (error) {
            messages.push(error.msg)
        })
        return done(null, false, req.flash('error', messages))
    }
    User.findOne({
        'email': email
    }, function (err, user) {
        if (err) {
            return done(err)
        }
        if (!user) {
            return done(null, false, {
                message: 'Oops, Your account cannot be found.'
            })
        }
        if (!user.validPassword(password)) {
            return done(null, false, {
                message: 'Incorrect Password'
            })
        }
        // console.log(user)
        req.session._id = user._id
        req.session.email = user.email
        // console.log(req.session)
        return done(null, user)
    })
}))