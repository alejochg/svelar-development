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
        queries.addSuggestion(data); // add the review to database
        req.flash('success_msg', 'Thank you for your suggestion!!!'); // Flash a message
        res.redirect('/');
    });
});


// Post /review/id   This is when someone is trying to review an item
router.get('/item/:id', function(req, res, next) {
    var id = req.params.id;
    if(req.user!=undefined) { // check if user has been authenticated
        var pool = db.pool;
        pool.getConnection(function(err,connection){
            connection.query('SELECT * FROM stuff WHERE id = ?', [id] ,function (error, results, fields){
                connection.release();
                if (error) throw error;
                res.render('review', { stuff: results, errors: undefined, h: req.query.h})
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
        var data = new Array(req.body.rating_1, req.body.rating_2,req.body.rating_3,req.body.comment, req.body.item, date, req.user.id, req.user.username);
        queries.addReview(data); // add the review to database
        req.flash('success_msg', 'Thank you for reviewing this item'); // Flash a message
        res.redirect('/item/'+ req.body.item);
    });
});

router.get('/like', function(req, res, next) {
    var pool = db.pool;
    pool.getConnection(function (error, connection) {
        var date;
        date = getDate();
        var data = new Array(req.query.id, req.user.id, req.query.like_status,date)
        console.log(data);
        var pool = db.pool; // obtain database login attributes
        pool.getConnection(function (error, connection) {
            connection.query(
                'INSERT INTO likes(id_stuff, id_user, like_status, date) VALUES(?,?,?,?)',
                [data[0], data[1], data[2],data[3]],
                function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                }
            )
        });
        res.redirect('/item/'+req.query.id);
    })
});

function getDate(){
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2);
    return date;
}

module.exports = router;