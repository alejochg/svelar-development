var express = require('express');
var router = express.Router();
var queries = require('../modules/queries');
var db = require('../db');
var async = require('async'); // this module is used to run function asyn parallel at the same time

/*
router.get('/:id', queries.obtainDevice('item')); // See data base file to see the rendering to test
*/
router.get('/:id', function (req,res) {
    var stack = {};

   stack.obtainDevice = function (callback) {
        var pool = db.pool;
        var id = req.params.id;
        pool.getConnection(function(err,connection){
            connection.query('SELECT * FROM items WHERE id = ?', [id] ,function (error, results, fields){
                connection.release();
                if (error) throw error;
                callback(error, results); // results are added in callback
            });
        });
    };

    stack.obtainReviews = function (callback) {
        var pool = db.pool;
        var id = req.params.id;
        pool.getConnection(function(err,connection){
            connection.query('SELECT * FROM reviews WHERE id_stuff = ?', [id] ,function (error, results, fields){
                connection.release();
                if (error) throw error;
                callback(error, results);
            });
        });
    };

    async.parallel(stack, function (err, result) { // Run all function in object stack in parallel. All rows obtained from queries are stored in result
        if (err){
            consoler.err(err);
            return;
        }
        res.render('item', {stuff: result.obtainDevice, reviews: result.obtainReviews, reviews_rows: result.obtainReviews.length  ,errors: undefined})
    })
});


router.get('/', function (req,res) {
    res.render('deviceStatic');
});

module.exports = router;
