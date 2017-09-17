var express = require('express');
var router = express.Router();
var multer = require('multer'); // required to obtain data from body. Need to install
var upload = multer();
var queries = require('../modules/queries');
var db = require('../db');
var async = require('async'); // this module is used to run function asyn parallel at the same time
var querystring = require('querystring');
var usersActivity = require('../mongodb');
var mongoose = require('mongoose');


router.get('/', function (req,res) {
    res.render('search', {title: "Svelar list"});
});

router.get('/try', function (req,res) {
    var stack = {};

    if(req.user){ // Get historical likes from mongoDB
        stack.obtainUserLikes = function (callback) {
            usersActivity.findOne({user_id: req.user.id}, function (err, data) { // query mongoDB
                if (err) throw err;
                callback(err, data.likes);
            });
        }
    }

    // Find with specific search and category defined
    if(req.query.find && req.query.category && typeof req.query.type === 'undefined' && typeof req.query.brand === 'undefined') {

        stack.obtainSearch = function (callback) {
            var pool = db.pool;
            pool.getConnection(function (err, connection) {
                if(req.query.category == "Any"){
                    connection.query('SELECT * FROM items WHERE Match(description) Against("?") OR  MATCH(name) Against("?") ORDER BY premium DESC, svelar DESC LIMIT ?, 10', [req.query.find, req.query.find, req.query.page*10-10], function (error, results, fields) {
                        connection.release();
                        if (error) throw error;
                        callback(error, results); // results are added in callback
                    });
                }else{
                    connection.query('SELECT * FROM items WHERE category=? AND Match(description) Against("?") OR category=? AND MATCH(name) Against("?") ORDER BY premium DESC, svelar DESC LIMIT ?,10', [req.query.category,req.query.category, req.query.find,req.query.page*10-10,req.query.page*10], function (error, results, fields) {
                        connection.release();
                        if (error) throw error;
                        callback(error, results); // results are added in callback
                    });
                }
            });
        };

        stack.obtainCount = function (callback) {
            var pool = db.pool;
            var id = req.params.id;
            pool.getConnection(function(err,connection){
                if(req.query.category == "Any"){
                    connection.query('SELECT COUNT(id) AS count FROM items WHERE Match(description) Against("?") OR MATCH(name) Against("?")', [req.query.find, req.query.find] ,function (error, results, fields){
                        connection.release();
                        if (error) throw error;
                        callback(error, results);
                    });
                }else{
                    connection.query('SELECT COUNT(id) AS count FROM items WHERE category=? AND Match(description) Against("?") OR category=? AND MATCH(name) Against("?")', [req.query.category, req.query.find, req.query.category, req.query.find] ,function (error, results, fields){
                        connection.release();
                        if (error) throw error;
                        callback(error, results);
                    });
                }
            });
        };
    }

    // Just looking for category
    if(typeof req.query.find === 'undefined' && req.query.field && req.query.category &&typeof req.query.type === 'undefined' && typeof req.query.brand === 'undefined') {
        stack.obtainSearch = function (callback) {
            var pool = db.pool;
            pool.getConnection(function (err, connection) {
                connection.query('SELECT * FROM items WHERE category=? ORDER BY premium DESC, svelar DESC LIMIT ?, 10', [req.query.category, req.query.page*10-10], function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                    callback(error, results); // results are added in callback
                });
            });
        };
        stack.obtainCount = function (callback) {
            var pool = db.pool;
            var id = req.params.id;
            pool.getConnection(function(err,connection){
                connection.query('SELECT COUNT(id) AS count FROM items WHERE category=?', [req.query.category] ,function (error, results, fields){
                    connection.release();
                    if (error) throw error;
                    callback(error, results);
                });
            });
        };
    }

    // Just looking for type
    if(typeof req.query.find === 'undefined' && typeof req.query.field === 'undefined' && req.query.type && typeof req.query.brand === 'undefined') {
        stack.obtainSearch = function (callback) {
            var pool = db.pool;
            pool.getConnection(function (err, connection) {
                connection.query('SELECT * FROM stuff WHERE type=? ORDER BY premium DESC, svelar DESC LIMIT ?, 10', [req.query.type, req.query.page*10-10], function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                    callback(error, results); // results are added in callback
                });
            });
        };
        stack.obtainCount = function (callback) {
            var pool = db.pool;
            var id = req.params.id;
            pool.getConnection(function(err,connection){
                connection.query('SELECT COUNT(id) AS count FROM items WHERE type=?', [req.query.type] ,function (error, results, fields){
                    connection.release();
                    if (error) throw error;
                    callback(error, results);
                });
            });
        };
    }

    // Just looking for brand
    if(typeof req.query.find === 'undefined' && typeof req.query.field === 'undefined' && typeof req.query.type === 'undefined' && req.query.brand) {
        stack.obtainSearch = function (callback) {
            var pool = db.pool;
            pool.getConnection(function (err, connection) {
                connection.query('SELECT * FROM stuff WHERE brand=? ORDER BY premium DESC, svelar DESC LIMIT ?, 10',[req.query.brand, req.query.page*10-10] , function (error, results, fields) {
                    connection.release();
                    if (error) throw error;
                    callback(error, results); // results are added in callback
                });
            });
        };
        stack.obtainCount = function (callback) {
            var pool = db.pool;
            var id = req.params.id;
            pool.getConnection(function(err,connection){
                connection.query('SELECT COUNT(id) AS count FROM items WHERE brand=?', [req.query.brand] ,function (error, results, fields){
                    connection.release();
                    if (error) throw error;
                    callback(error, results);
                });
            });
        };
    }

    // Not criteria specified but still looking
    if(typeof req.query.find === 'undefined' && req.query.category && typeof req.query.type === 'undefined' && typeof req.query.brand === 'undefined') {
        stack.obtainSearch = function (callback) {
            var pool = db.pool;
            if(req.query.category == "Any"){
                pool.getConnection(function (err, connection) {
                    connection.query('set @rnum:=0', function (error, results, fields) {
                        if (error) throw error;
                        connection.query(
                            'SELECT * FROM (SELECT @rnum:=@rnum + 1 row_number, id, name, brand, description, category, field, type, link, buy_link, premium, svelar, image_1, image_2, image_3, average_rating_1, average_rating_2, average_rating_3, count FROM items ORDER BY premium DESC, svelar DESC) AS T WHERE row_number > ? AND row_number <= ?',
                            [req.query.page*10-10,req.query.page*10],
                            function (error, results, fields) {
                                connection.release();
                                if (error) throw error;
                                callback(error, results);
                            }
                        )
                    });
                });
            }else{
                pool.getConnection(function (err, connection) {
                    connection.query('set @rnum:=0', function (error, results, fields) {
                        if (error) throw error;
                        connection.query(
                            'SELECT * FROM (SELECT @rnum:=@rnum + 1 row_number, id, name, brand, description, category, field, type, link, buy_link, premium, svelar, image_1, image_2, image_3, average_rating_1, average_rating_2, average_rating_3, count FROM items WHERE category = ? ORDER BY premium DESC, svelar DESC) AS T WHERE row_number > ? AND row_number <= ?',
                            [req.query.category, req.query.page*10-10,req.query.page*10], function (error, results, fields) {
                            connection.release();
                            if (error) throw error;
                            callback(error, results); // results are added in callback
                        });
                    });
                });
            }
        };
        stack.obtainCount = function (callback) { // this function counts how many items were obtained by the query
            var pool = db.pool;
            var id = req.params.id;
            if(req.query.category == "Any"){
                pool.getConnection(function(err,connection){
                    connection.query('SELECT COUNT(id) AS count FROM items', function (error, results, fields){
                        connection.release();
                        if (error) throw error;
                        callback(error, results);
                    });
                });
            }else{
                pool.getConnection(function(err,connection){
                    connection.query('SELECT COUNT(id) AS count FROM items WHERE category=?', [req.query.category] ,function (error, results, fields){
                        connection.release();
                        if (error) throw error;
                        callback(error, results);
                    });
                });
            }
        };
    }

    async.parallel(stack, function (err, result) { // Run all function in object stack in parallel. All rows obtained from queries are stored in result
        if (err){
            consoler.err(err);
            return;
        }
        res.render('search', {stuff: result.obtainSearch, rows: result.obtainSearch.length, count: result.obtainCount, userLiked: result.obtainUserLikes, mysearch: req.query.find, condition: req.query.field, page:req.query.page, qs:req.query})
    })
});

// POST /search
router.post('/', upload.none(), function (req,res) {
    if(req.body.mySearch){
        res.redirect('/search/try?find=' + req.body.mySearch + '&field=diabetes&category=' + req.body.category + '&page=1');
    }else{
        res.redirect('/search/try?field=diabetes&category=' + req.body.category + '&page=1');
    }
});

module.exports = router;
