var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('community_test', {});
});

router.post('/main', function (req, res, next) {
    // JSON object for main post
    if(req.user){
        var data_main = {
            "type": req.body.type,
            "title": req.body.title,
            "post": req.body.post,
            "user_id": req.user.id,
            "reply": "0",
            "date": db.getDateTime()
        };

        var pool = db.pool;
        pool.getConnection(function (error, connection) {
           connection.query(
               'INSERT INTO community(type, title, post, user_id, reply, date) VALUES(?,?,?,?,?,?)',
               [data_main.type, data_main.title, data_main.post, data_main.user_id, data_main.reply,data_main.date],
               function (error,results, field) {
                   connection.release();
                   if (error) throw error;
                   console.log('added to database');
               }
           )
        });

        res.send('added to database!');
    }else {
        res.redirect('/users/login');
    }
});

router.post('/reply', function (req, res, next) {
    // JSON object for main post
    if(req.user){
        var data_reply = {
            "type": req.body.type,
            "post": req.body.post,
            "user_id": req.user.id,
            "reply": "1",
            "reply_to": "1",
            "date": db.getDateTime()
        };

        var pool = db.pool;
        pool.getConnection(function (error, connection) {
            connection.query(
                'INSERT INTO community(type, post, user_id, reply,reply_to, date) VALUES(?,?,?,?,?,?)',
                [data_reply.type, data_reply.post, data_reply.user_id, data_reply.reply, data_reply.reply_to, data_reply.date],
                function (error,results, field) {
                    connection.release();
                    if (error) throw error;
                    console.log('added to database');
                }
            )
        });

        res.send('added to database!');
    }else {
        res.redirect('/users/login');
    }
});

module.exports = router;