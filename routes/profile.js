var express = require('express');
var router = express.Router();
var async = require('async');
var usersActivity = require('../mongodb');
var db = require('../db');

/* GET home page. */

router.get('/', function(req, res, next) {
    if(req.user!=undefined) { // check if user has been authenticated
        var stack = {};

        stack.obtainUserLikes = function (callback) {
            usersActivity.findOne({user_id: req.user.id}, function (err, data) {
                if (err) throw err;
                var user_likes = [];
                data.likes.forEach(function (item) {
                    if(item.like_status=='like'){
                        user_likes.push(item.id_item);
                    }
                });
                var pool = db.pool;
                pool.getConnection(function (err, connection) {
                    connection.query('SELECT * FROM items WHERE id in (?)', [user_likes], function (error, result) {
                        connection.release();
                        if (error) throw error;
                        callback(error, result);
                    });
                });
            });
        };

        stack.obtainUserDislikes = function (callback) {
            usersActivity.findOne({user_id: req.user.id}, function (err, data) {
                if (err) throw err;
                var user_dislikes = [];
                data.likes.forEach(function (item) {
                    if(item.like_status=='like'){

                    }else{
                        user_dislikes.push(item.id_item);
                    }
                });
                var pool = db.pool;
                pool.getConnection(function (err, connection) {
                    connection.query('SELECT * FROM items WHERE id in (?)', [user_dislikes], function (error, result) {
                        connection.release();
                        if (error) throw error;
                        callback(error, result);
                    });
                });
            });
        };

        stack.obtainUserReviews = function (callback) {
            var pool = db.pool;
            pool.getConnection(function (err, connection) {
                connection.query('SELECT * FROM (SELECT stuff.name, stuff.id, stuff.category, reviews.id_user, reviews.rating_1, reviews.rating_2, reviews.rating_3, reviews.comment, reviews.date FROM stuff, reviews WHERE stuff.id=reviews.id_stuff) AS combined WHERE id_user = ?', [req.user.id], function (error, result) {
                    connection.release();
                    if (error) throw error;
                    callback(error, result);
                });
            });
        };

        async.parallel(stack, function (err, result) { // Run all function in object stack in parallel. All rows obtained from queries are stored in result
            if (err){
                consoler.err(err);
                return;
            }
            res.render('profile', {
                    title: 'Profile',
                    user: req.user,
                    userLikes: result.obtainUserLikes,
                    userDislikes: result.obtainUserDislikes,
                    userReviews: result.obtainUserReviews
                    }
            );
        })

    }else{
       res.redirect('/users/login'); // If not redirect to login page
    }
});

module.exports = router;
