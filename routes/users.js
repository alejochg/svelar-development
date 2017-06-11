var express = require('express');
var router = express.Router();
var passport = require('passport');//!! Need to install
var LocalStrategy = require('passport-local').Strategy;//!!!
var bcrypt = require('bcrypt-nodejs');//!!!! this encrypt the password so it cannot get hack

var db = require('../db');
var queries = require('../modules/queries');

// Register
router.get('/signup', function(req, res, next) {
    res.render('signup', {tittle: "signup", errors: undefined, h: req.query.h});
});

// Login
router.get('/login', function(req, res){
    res.render('login', {tittle: "Log in", errors: undefined, h: req.query.h});
});

// Register new user
router.post('/signup', function(req, res){
    // validations:
    req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
    req.checkBody('password', 'Password must be between 8 characters long.').len(8, 100);
    req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);

    const errors = req.validationErrors(); // access the errors from validation

    if(errors){ // if errors is found do the following
        var errorRows = errors.length;
        res.render('signup', {tittle: 'Registration', errors: errors, errorRows: errorRows}); // passing errors with render
    }else{ // if passed validations: check if user already is taken
        var pool = db.pool; // get database access
        pool.getConnection(function (error, connection) {
            connection.query('SELECT * FROM users WHERE email = ?',[req.body.email], function (error, user) {
                connection.release();
                if (error) throw error;
                if(user.length){ // If a user email has been taken do the following:
                    req.flash('error_msg', 'The email is already taken.');
                    res.redirect('/users/signup');
                }else{
                    // Registering a new user
                    var data = new Array(req.body.name, req.body.lastname, req.body.password, req.body.email, req.body.birthday);
                    queries.registerUser(data); // register user
                    req.flash('success_msg', 'You are registered and can now login'); // Flash a message
                    res.redirect('/users/login');
                }
            });
        });
    }
});

// passport validation
passport.use(new LocalStrategy(
    function(username, password, done) {
        var pool = db.pool; // get access to database
        pool.getConnection(function (error, connection) {
            connection.query("SELECT * FROM users WHERE email = ?", [username], function (err, user) {
                connection.release();
                if (err) return done(err);
                if (!user.length) { // if user email is not found do the following
                    return done(null, false, { message: 'Email do not exist.' });
                }
                if (!bcrypt.compareSync(password, user[0].password)) { // compare passwords
                    return done(null, false, { message: 'Oops! Wrong password.' });
                }
                return done(null, user[0]) // user has been authenticated and his data now is available at req.user
            });
        });
    }
));

// Serialization need to manage user sessions
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    var pool = db.pool;
    pool.getConnection(function (error, connection) {
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, user){
            connection.release();
            done(err, user[0]);
        });
    })
});


// This action wil happen when someone try to login
router.post('/login',
    passport.authenticate('local', {failureRedirect:'/users/login', failureFlash: true}),
    function(req, res) {
        if(req.query.h){
            res.redirect(req.query.h+"?h=users/login"); // redirect from coming page
        }else{
            res.redirect('/'); // redirected to home
        }
    }
);


// This will happen when someone log outs
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out'); // flash message
    res.redirect('/users/login');// redirect to login page
});



module.exports = router;
