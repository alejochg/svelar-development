var express = require('express');
var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//     var categories = {
//       "categories": ["Food", "Education", "Self Management", "Physical Exercise","Apparel"]
//     };
//     res.render('index', {title: 'Svelar', errors: undefined, categories:categories, qs:req.query});
// });

router.get('/', function (req,res,next) {
    res.render('index2', {errors: undefined, qs:req.query});
});


module.exports = router;
