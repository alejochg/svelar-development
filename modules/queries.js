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

// This obtain the data information from requested item in the database
function obtainDevice() {
    return function (req, res) {
        var id = req.params.id;
        var pool = db.pool;
        pool.getConnection(function(err,connection){
            connection.query('SELECT * FROM stuff WHERE id = ?', [id] ,function (error, results, fields){
                connection.release();
                if (error) throw error;
                res.render('item', {stuff: results})
            });
        });
    }
}

module.exports.registerUser = registerUser;
module.exports.search=search;
module.exports.obtainDevice=obtainDevice;

