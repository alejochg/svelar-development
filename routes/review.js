var express = require('express');
var router = express.Router();

var queries = require('../modules/queries');
var db = require('../db');


// Get /review/recommend
router.get('/recommend', function(req, res, next) {
    if(req.user!=undefined){
        res.render('recommend', { title: 'Svelar', h: req.query.h});
    }else{
        req.flash('error_msg', 'You need to sign up first if you want to suggest to Svelar'); // Flash a message
        res.redirect('/users/signup?h=/review/recommend'); // If not, redirect to signup page
    }
});

router.post('/recommend', function(req, res, next) {
    var pool = db.pool; // get database access
    pool.getConnection(function (error, connection) {
        var date;
        date = getDate();
        var data = new Array(req.body.name, req.body.link, req.body.comment, date, req.user.id);
        console.log(data);
        queries.addSuggestion(data); // add the review to database
        req.flash('success_msg', 'Thank you for your suggestion!!!'); // Flash a message
        res.redirect('/');
    });
});


// Post /review/id   This is when someone is trying to review an item
router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    if(req.user!=undefined) { // check if user has been authenticated
        var pool = db.pool;
        pool.getConnection(function(err,connection){
            connection.query('SELECT * FROM stuff WHERE id = ?', [id] ,function (error, results, fields){
                connection.release();
                if (error) throw error;
                res.render('review', {stuff: results, errors: undefined, h: req.query.h})
            });
        });
    }else{
        req.flash('error_msg', 'You need to sign up first if you want to review in Svelar'); // Flash a message
        res.redirect('/users/signup?h=/review/'+ id); // If not redirect to login page
    }
});


// Post /review    actually adding the review to database
router.post('/', function(req, res, next) {

    // Add review to database
    var pool = db.pool; // get database access
    pool.getConnection(function (error, connection) {
        var date;
        date = getDate();
        var data = new Array(req.body.rating, req.body.comment, req.body.item, date, req.user.id);
        console.log(data);
        queries.addReview(data); // add the review to database
        req.flash('success_msg', 'Thank you for reviewing this item'); // Flash a message
        res.redirect('/item/'+ req.body.item);
    });

});

function getDate(){
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2);
    return date;
}

module.exports = router;