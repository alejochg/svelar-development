var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('wr_test', { title: 'Write Review' });
});


module.exports = router;