const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PSWD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to db!');
});

module.exports = connection;