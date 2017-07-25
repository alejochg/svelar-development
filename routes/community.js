/**
 * Created by JST420 on 7/24/2017.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
   res.render('community', {});
}); */


router.get('/', function(req, res, next) {
    if(req.user!=undefined) { // check if user has been authenticated
        res.render('community', {title: 'Community'}); // If yes give access to profile
    }else{
        res.redirect('/users/login'); // If not redirect to login page
    }
});


module.exports = router;