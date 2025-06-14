const connection = require("../database/connectDB");

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL!");

    const sql = `
        CREATE TABLE IF NOT EXISTS colors (
            colorId INT AUTO_INCREMENT PRIMARY KEY,
            productId INT,
            colorName VARCHAR(50),
            image VARCHAR(255),
            FOREIGN KEY (productId) REFERENCES products(productId) ON DELETE CASCADE
        )
    `;

    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Table colors created");
    });
});
