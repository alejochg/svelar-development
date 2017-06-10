var express = require('express');
var router = express.Router();
var queries = require('../modules/queries');
var db = require('../db');

router.get('/:id', queries.obtainDevice('item')); // See data base file to see the rendering to test

router.get('/', function (req,res) {
    res.render('deviceStatic');
});

module.exports = router;
