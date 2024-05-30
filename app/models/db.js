const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    timezone : "+00:00"
});

connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database");
})

module.exports = connection;