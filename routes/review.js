var express = require('express');
var router = express.Router();

// Get /review
router.get('/', function(req, res, next) {
    res.render('review', { title: 'Svelar' });
});


module.exports = router;