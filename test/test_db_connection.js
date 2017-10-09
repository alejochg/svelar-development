
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : '54.88.13.5',
    port     : '3306',
    user     : 'developer',
    password : 'developer',
    database: 'svelar_test'
});

connection.connect(function(err) {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }

    console.log('Connected to database.');
});

connection.end();