var mysql = require('mysql');

//This provides the  properties needed to make a connection to the database

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'alexan',
    password: 'alexan',
    database: 'svelar'
});

module.exports.pool = pool;

