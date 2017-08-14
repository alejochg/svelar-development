var express = require('express');
var router = express.Router();
var async = require('async');
var usersActivity = require('../mongodb');
var db = require('../db');

/* GET home page. */

router.get('/', function(req, res, next) {
    if(req.user!=undefined) { // check if user has been authenticated
        //console.log(req.user);
        var stack = {};

        stack.obtainUserLikes = function (callback) {
            usersActivity.findOne({user_id: req.user.id}, function (err, data) {
                if (err) throw err;
                callback(err, data.likes);
            });
        };

        async.parallel(stack, function (err, result) { // Run all function in object stack in parallel. All rows obtained from queries are stored in result
            if (err){
                consoler.err(err);
                return;
            }
            var pool = db.pool;
            var user_likes = [];
            result.obtainUserLikes.forEach(function (item) {
                pool.getConnection(function (err, connection) {
                   connection.query('SELECT * FROM items WHERE id=?', [item.id_item], function (error, result) {
                       connection.release();
                       if (error) throw error;
                       user_likes.push(result);
                   });
                   console.log(user_likes);
                });
            });
            res.render('profile', {title: 'Profile', user:req.user, userLiked: result.obtainUserLikes});
        })

    }else{
       res.redirect('/users/login'); // If not redirect to login page
    }
});

module.exports = router;
