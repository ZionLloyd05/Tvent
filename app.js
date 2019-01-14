const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');
const MongoStore = require('connect-mongo')(session);



const config = require('./config/database');
//========================================
//  Routes Configuration
//========================================
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let eventRouter = require('./routes/event');
let tagRouter = require('./routes/tag');
var expressHbs = require('express-handlebars');

var app = express();

//===========================
//  Connecting Database / Mongoose
//===========================
mongoose.connect(config.database, { useNewUrlParser: true });

// logging database connection status
mongoose.connection.on('connected', () => {
  console.log('Connected to Database ');
});
mongoose.connection.on('error', (err) => {
  console.log('Database Error '+ err);
});
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(validator())
app.use(cookieParser());
app.use(session({
  secret: 'zionsoft123*',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
})

//==========================================
//  Routing Routes
//==========================================
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/event', eventRouter);
app.use('/tag', tagRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
