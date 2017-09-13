var mysql = require('mysql');

//This provides the  properties needed to make a connection to the database

var pool = mysql.createPool({
    connectionLimit: 10,
    // host: 'localhost',
    host     : '54.88.13.5',
    port: '3306',
    user: 'alexan',
    password: 'svelar2017',
    database: 'svelar'
});

function getDate(){
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2);
    return date;
}

function getDateTime(){
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2)+ ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);
    return date;
}

module.exports.pool = pool;
module.exports.getDate = getDate;
module.exports.getDateTime = getDateTime;

