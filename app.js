var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var helpers = require('handlebars-helpers');
const flash = require('connect-flash');
const expressSession = require('express-session');
const passport = require('passport');
require('dotenv').config();
require('./app_server/models/db');

var indexRouter = require('./app_server/routers/index');
var usersRouter = require('./app_server/routers/users');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');


const hbs = require('./my_handlebars');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(expressSession({
  secret: 'keyboard cat',
  saveUninitialized: true,
  resave: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
  //Authentication
  if (req.isAuthenticated()){
    res.locals.user = req.user;
    res.locals.authenticated = ! req.user.anonymous;
  }
  next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(function(req, res, next) {
  if (req.headers['content-type'] === 'application/json;') {
    req.headers['content-type'] = 'application/json';
  }
  next();
});
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
  res.render('error', {
    layout: false,
    title: "404 Not Found",
    message: "Lỗi trang"
  });
});
module.exports = app;
