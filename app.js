var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator'); // Need to install module!!!!!!!
var flash = require('connect-flash');// Neede for flash!!!
var session = require('express-session'); //!!!
var passport = require('passport'); //!!!
var LocalStrategy = require('passport-local').Strategy; // install!!

var index = require('./routes/index');
var users = require('./routes/users');
var profile = require('./routes/profile');
var search = require('./routes/search');
var item = require('./routes/item');
var review = require('./routes/review');
var about = require('./routes/about');
var wr_test = require('./routes/wr_test');
var mongoDB = require('./routes/mongoDB');
var community = require('./routes/community');
var bootstrap = require('./routes/bootstrap');

var app = express();

// Redirecting all request from http to https
// This force the user all the times to run in secure server that uses SSL protocols
// more info at http://blog.ayanray.com/2015/06/adding-https-ssl-to-express-4-x-applications/
app.set('port_https', 3443);
app.all('*', function (req, res, next) {
   if(req.secure){
       return next();
   }
   res.redirect('https://' + req.hostname + ':' + app.get('port_https') + req.url);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // This is required for express validator!!!!!!!!! Right here after bodypaerser
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Express Session!!!!
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    maxAge: 60000
}));

// Passport init!!!
app.use(passport.initialize());
app.use(passport.session());

// Express Validator!!!
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// Connect Flash!!!
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


// Handle request to routing
app.use('/', index);
app.use('/users', users);
app.use('/profile', profile);
app.use('/search', search);
app.use('/item', item);
app.use('/review', review);
app.use('/about', about);
app.use('/about/contact',about);
app.use('/review/recommend', review);
app.use('/test', wr_test);
app.use('/mongoDB', mongoDB);
app.use('/community', community);
app.use('/bootstrap', bootstrap);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
