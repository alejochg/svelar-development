const db = require('../db');
var bcrypt = require('bcrypt-nodejs');//!!!! this encrypt the password so it cannot get hack

function registerUser(data) {
    var pool = db.pool; // obtain database login attributes
    pool.getConnection(function (error, connection) {
        connection.query( // perform query with encrypter password
            'INSERT INTO users(name, lastname, password, email, birthday) VALUES(?, ?, ?, ?, ?)',
            [data[0], data[1], bcrypt.hashSync(data[2], null, null), data[3], data[4]],
            function (error, results, fields) {
                connection.release();
                if (error) throw error;
            }
        )
    });
}

function search() {
    return function (req, res) {
        var mysearch = req.body.mySearch;
        var condition = req.body.condition;
        var pool = db.pool;
        pool.getConnection(function(err,connection){
            connection.query('SELECT * FROM stuff WHERE field=? AND Match(description) Against("?") ORDER BY svelar DESC LIMIT 10',[condition, mysearch] ,function (error, results, fields){
                connection.release();
                if (error) throw error;
                res.render('search', {stuff: results, rows: results.length, title: "Search", mysearch: mysearch, condition: condition})
            });
        });
    }
}

function search2() {
    return function (req, res) {
        var pool = db.pool;

        //Look with search defined
        if(req.query.find && req.query.field && typeof req.query.type === 'undefined' && typeof req.query.brand === 'undefined'){
            pool.getConnection(function(err,connection){
                connection.query('SELECT * FROM stuff WHERE field=? AND Match(description) Against("?") ORDER BY svelar DESC LIMIT 10',[req.query.field, req.query.find] ,function (error, results, fields){
                    connection.release();
                    if (error) throw error;
                    res.render('search', {stuff: results, rows: results.length, title: "Search", mysearch: req.query.find, condition: req.query.field})
                });
            });
        }

        // Just looking for field
        if(typeof req.query.find === 'undefined' && req.query.field && typeof req.query.type === 'undefined' && typeof req.query.brand === 'undefined'){
            pool.getConnection(function(err,connection){
                connection.query('SELECT * FROM stuff WHERE field=? ORDER BY svelar DESC LIMIT 10',[req.query.field] ,function (error, results, fields){
                    connection.release();
                    if (error) throw error;
                    res.render('search', {stuff: results, rows: results.length, title: "Search", mysearch: undefined, condition: req.query.field})
                });
            });
        }

        // Just looking for type
        if(typeof req.query.find === 'undefined' && typeof req.query.field === 'undefined' && req.query.type && typeof req.query.brand === 'undefined'){
            pool.getConnection(function(err,connection){
                connection.query('SELECT * FROM stuff WHERE type=? ORDER BY svelar DESC LIMIT 10',[req.query.type] ,function (error, results, fields){
                    connection.release();
                    if (error) throw error;
                    res.render('search', {stuff: results, rows: results.length, title: "Search", mysearch: undefined, condition: req.query.type})
                });
            });
        }

        // Just looking for brand
        if(typeof req.query.find === 'undefined' && typeof req.query.field === 'undefined' && typeof req.query.type === 'undefined' && req.query.brand){
            pool.getConnection(function(err,connection){
                connection.query('SELECT * FROM stuff WHERE brand=? ORDER BY svelar DESC LIMIT 10',[req.query.brand] ,function (error, results, fields){
                    connection.release();
                    if (error) throw error;
                    res.render('search', {stuff: results, rows: results.length, title: "Search", mysearch: undefined, condition: req.query.brand})
                });
            });
        }

        // Not criteria specified by still looking
        if(typeof req.query.find === 'undefined' && typeof req.query.field === 'undefined' && typeof req.query.type === 'undefined' && typeof req.query.brand === 'undefined'){
            pool.getConnection(function(err,connection){
                connection.query('SELECT * FROM stuff ORDER BY svelar DESC LIMIT 10 ', function (error, results, fields){
                    connection.release();
                    if (error) throw error;
                    res.render('search', {stuff: results, rows: results.length, title: "Search", mysearch: undefined, condition: undefined})
                });
            });
        }
    }
}


// This obtain the data information from requested item in the database. The input argument is the site where info want to be render.
function obtainDevice(view) {
    return function (req, res) {
        var id = req.params.id;
        var pool = db.pool;
        pool.getConnection(function(err,connection){
            connection.query('SELECT * FROM stuff WHERE id = ?', [id] ,function (error, results, fields){
                connection.release();
                if (error) throw error;
                res.render(view, {stuff: results, errors: undefined})
            });
        });
    }
}

// This add a new review to the database
function addReview(data) {
    var pool = db.pool; // obtain database login attributes
    pool.getConnection(function (error, connection) {
        connection.query( // perform query with encrypter password
            'INSERT INTO reviews(comfort, comment, id_stuff, date, id_user) VALUES(?,?,?,?,?)',
            [data[0], data[1], data[2],data[3], data[4]],
            function (error, results, fields) {
                connection.release();
                if (error) throw error;
            }
        )
    });
}


// Add sugguestion to database
function addSuggestion(data) {
    var pool = db.pool; // obtain database login attributes
    pool.getConnection(function (error, connection) {
        connection.query( // perform query with encrypter password
            'INSERT INTO sugguestions(name, link, comment, date, id_users ) VALUES(?,?,?,?,?)',
            [data[0], data[1], data[2],data[3], data[4]],
            function (error, results, fields) {
                connection.release();
                if (error) throw error;
            }
        )
    });
}


// Add inquiry message to database
function addMessage(data) {
    var pool = db.pool; // obtain database login attributes
    pool.getConnection(function (error, connection) {
        connection.query(
            'INSERT INTO messages(reason, message, email, date) VALUES(?,?,?,?)',
            [data[0], data[1], data[2],data[3]],
            function (error, results, fields) {
                connection.release();
                if (error) throw error;
            }
        )
    });
}


module.exports.registerUser = registerUser;
module.exports.search=search;
module.exports.obtainDevice=obtainDevice;
module.exports.addReview=addReview;
module.exports.search2=search2;
module.exports.addSuggestion=addSuggestion;
module.exports.addMessage=addMessage;

