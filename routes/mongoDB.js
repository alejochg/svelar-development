var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var usersActivity = require('../mongodb');

/* GET home page. */
router.post('/like', function(req, res, next) {
    usersActivity.findOne({user_id: req.user.id}, function (err, data) {
        if (err) throw err;
        data.likes.push(req.body);
        data.save();
    });
    res.sendStatus(200);
});

/* GET home page. */
router.post('/dislike', function(req, res, next) {
    usersActivity.findOne({user_id: req.user.id}, function (err, data) {
        if (err) throw err;
        data.likes.push(req.body);
        data.save();
    });
    res.sendStatus(200);
});

module.exports = router;