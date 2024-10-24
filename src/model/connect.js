const mysql = require('mysql2');
require('dotenv').config();

// Cấu hình kết nối MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,   // Tách riêng cổng
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Kết nối MySQL
connection.connect((err) => {
    if (err) {
        console.error('Kết nối MySQL thất bại: ', err);
        return;
    }
    console.log('Đã kết nối tới MySQL');
});

module.exports = connection;
