var db = require('../db');

var pool = db.pool;
pool.getConnection(function (err, connection) {
    connection.query('set @rnum:=0', function (error, results, fields) {
        if (error) throw error;
        connection.query(
            'SELECT * FROM (SELECT @rnum:=@rnum + 1 row_number, id, name, brand, description, category, field, type, link, buy_link, premium, svelar, image_1, image_2, image_3, average_rating_1, average_rating_2, average_rating_3, count FROM items ORDER BY premium DESC, svelar DESC) AS T WHERE row_number > ? AND row_number <= ?',
            [10,20],
            function (error, results, fields) {
                connection.release();
                if (error) throw error;
                console.log(results);
            }
        )
    });
});
