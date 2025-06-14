const connection = require("../database/connectDB");

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL!");
    const sql = `
        CREATE TABLE IF NOT EXISTS categories (
            categoryId INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
    `;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Table categories created");
    });
});