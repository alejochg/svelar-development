var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/term_of_service', function(req, res, next) {

    res.render('index', {title: 'Svelar', errors: undefined, categories:categories, qs:req.query});
});


router.get('/privacy_agreement', function(req, res, next) {

    res.render('index', {title: 'Svelar', errors: undefined, categories:categories, qs:req.query});
});

module.exports = router;