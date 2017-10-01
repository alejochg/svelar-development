var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
    console.log("Got here");
    //Validations
    // req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
    // req.checkBody('password', 'Password must be between 8 characters long.').len(8, 100);
    // req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);


    const errors = req.validationErrors(); // access the errors from validation
    if (errors) { // if errors is found do the following
        res.send("Failed validations")
    } else{
        res.send("Validaiton satisfied")
    }
});


router.get('/', function (req,res,next) {
    res.render('wr_test', {title: 'Testing', errors: undefined});
});

module.exports = router;