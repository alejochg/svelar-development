var express = require('express');
var router = express.Router();
var multer = require('multer'); // required to obtain data from body. Need to install
var upload = multer();
var queries = require('../modules/queries');
var db = require('../db');

router.get('/', function (req,res) {
    res.render('search', {title: "Svelar list"});
});

router.get('/try', queries.search2());

router.post('/', upload.none(), function (req,res) {
    if(req.body.mysearch){
        console.log(req.body.mysearch);
        console.log(req.body.condition);
        res.redirect('/search/try?find='+ req.body.mySearch + '&field=' + req.body.condition);
    }else{
        res.redirect('/search/try?field=' + req.body.condition);
    }
});


// This will acquire the data obtained from the searchBar and use db.search to look in the database
//router.post('/', upload.none(), queries.search());

module.exports = router;
