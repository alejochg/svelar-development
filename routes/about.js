var express = require('express');
var router = express.Router();

// Get /about
router.get('/', function(req, res, next) {
    res.render('about', { title: 'Svelar' });
});

// Get /about/contact
router.get('/contact', function(req, res, next) {
    res.render('contact', { title: 'Svelar' });
});


module.exports = router;