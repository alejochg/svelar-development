/**
 * Created by JST420 on 7/24/2017.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('community', {});
});


module.exports = router;