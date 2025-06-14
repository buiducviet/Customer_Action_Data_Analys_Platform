const connection = require("../database/connectDB");

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL!");
    const sql = `
        CREATE TABLE IF NOT EXISTS productPrices (
            priceId INT AUTO_INCREMENT PRIMARY KEY,
            productId INT,
            variantId INT,
            price DECIMAL(10,2),
            FOREIGN KEY (productId) REFERENCES products(productId),
            FOREIGN KEY (variantId) REFERENCES variants(variantId)
        )
    `;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Table prices created");
    });
});