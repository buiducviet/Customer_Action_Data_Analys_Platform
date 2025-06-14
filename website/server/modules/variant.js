const connection = require("../database/connectDB");

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL!");
    const sql = `
        CREATE TABLE IF NOT EXISTS variants (
            variantId INT AUTO_INCREMENT PRIMARY KEY,
            productId INT,
            storage VARCHAR(100),
            name VARCHAR(255),
            FOREIGN KEY (productId) REFERENCES products(productId)
        )
    `;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Table variants created");
    });
});