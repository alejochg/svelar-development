var express = require('express');
var router = express.Router();

var queries = require('../modules/queries');
var db = require('../db');

// Get /about
router.get('/', function(req, res, next) {
    res.render('about', {title: 'Svelar' });
});

// Get /about/contact
router.get('/contact', function(req, res, next) {
    res.render('contact', { title: 'Svelar', errors: undefined});
});

// Get /about/contact
router.post('/contact', function(req, res, next) {
    var data = { // get the data we need so we don't lose what the user already sent to us
        "reason": req.body.reason,
        "name": req.body.name,
        "lastname": req.body.lastname,
        "email": req.body.email,
        "message": req.body.message
    };
    //validation
    // more about validations reference to https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms
    req.checkBody('checkWord', 'Are you human? Please type the check word blue in the box.').equals("blue");
    req.checkBody('message','Please, we need more information so we can help you better. You need to include at least 65 characters in your message').isLength({min: 65});
    const errors = req.validationErrors(); // access the errors from validation
    if (errors){ // check if errors were detected by the validators
        var errorRows = errors.length; // needed for error messages
        res.render('contact', {errors: errors, errorRows: errorRows, previousInput:data});
    }else{ // if errors were not detected stores values to data base and redirect to home
        var date = getDate();
        var pool = db.pool; // Saving data to mySQL DB
        pool.getConnection(function (error, connection){
            connection.query(
                'INSERT INTO messages(reason, name, lastname, email, message, date) VALUES(?,?,?,?,?,?)',
                [data.reason, data.name, data.lastname,data.email, data.message, date],
                function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                    req.flash('success_msg', 'Thank you for contacting Svelar, we will contact you soon.'); // flash message
                    res.redirect('/') // redirect to home
                }
            );
        });
    }
});

function getDate(){
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2);
    return date;
}

module.exports = router;