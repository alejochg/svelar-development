var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
    var pool = db.pool;
    pool.getConnection(function (error, connection) {
        connection.query('SELECT * FROM community ORDER BY date DESC LIMIT 20',[], function (error, results, field) {
            connection.release();
            if(error) throw error;
            var community_main_posts = [];
            var community_reply_posts = [];
            results.forEach(function (item) {
                if(item.reply == 0){
                    community_main_posts.push(item);
                }else{
                    community_reply_posts.push(item);
                }
            });
            res.render('community', {main_post: community_main_posts, reply_post: community_reply_posts});
        })
    });
});

// post a main post
router.post('/main', function (req, res, next) {
    // JSON object for main post
    if(req.user){
        var data_main = {
            "type": req.body.type,
            "title": req.body.title,
            "post": req.body.post,
            "user_id": req.user.id,
            "user_username": req.user.username,
            "reply": "0",
            "date": db.getDateTime()
        };

        var pool = db.pool;
        pool.getConnection(function (error, connection) {
           connection.query(
               'INSERT INTO community(type, title, post, user_id, user_username, reply, date) VALUES(?,?,?,?,?,?,?)',
               [data_main.type, data_main.title, data_main.post, data_main.user_id, data_main.user_username,data_main.reply,data_main.date],
               function (error,results, field) {
                   connection.release();
                   if (error) throw error;
               }
           )
        });
        res.redirect('/community');
    }else {
        res.redirect('/users/login');
    }
});

// reply to a main post
router.post('/reply', function (req, res, next) {
    // JSON object for main post
    if(req.user){
        var data_reply = {
            "type": req.body.type,
            "post": req.body.post,
            "user_id": req.user.id,
            "user_username": req.user.username,
            "reply": "1",
            "reply_to": req.body.reply_to,
            "date": db.getDateTime()
        };

        var pool = db.pool;
        pool.getConnection(function (error, connection) {
            connection.query(
                'INSERT INTO community(type, post, user_id, user_username,reply,reply_to, date) VALUES(?,?,?,?,?,?,?)',
                [data_reply.type, data_reply.post, data_reply.user_id, data_reply.user_username,data_reply.reply, data_reply.reply_to, data_reply.date],
                function (error,results, field) {
                    connection.release();
                    if (error) throw error;
                }
            )
        });
        res.redirect('/community');
    }else {
        res.redirect('/users/login');
    }
});

module.exports = router;