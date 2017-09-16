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
    //validation
    req.checkBody('checkWord', 'Are you human? Please type the check word blue in the box.').equals("blue");
    const errors = req.validationErrors(); // access the errors from validation
    if (errors){
        var errorRows = errors.length;
        res.render('contact', {errors: errors, errorRows: errorRows});
    }else{
        var pool = db.pool; // get database access
        pool.getConnection(function (error, connection) {
            var date = getDate();
            var data = new Array(req.body.reason, req.body.message, req.body.email, date);
            queries.addMessage(data); // add the review to database
            req.flash('success_msg', 'Thank for contacting us, we will be working on it!'); // Flash a message
            res.redirect('/'); // send to home
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