var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var categories = {
      "categories": ["Food", "Education", "Self Management", "Physical Activity", "Service", "Miscellaneous", "Drugs", "Apparel"]
    };
    res.render('index', { title: 'Svelar', errors: undefined, categories:categories});
});


module.exports = router;
