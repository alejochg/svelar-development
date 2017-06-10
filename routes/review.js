var express = require('express');
var router = express.Router();

// Get /review
router.get('/', function(req, res, next) {
    res.render('review', { title: 'Svelar' });
});


// Get /review/recommend
router.get('/recommend', function(req, res, next) {
    res.render('recommend', { title: 'Svelar' });
});

module.exports = router;