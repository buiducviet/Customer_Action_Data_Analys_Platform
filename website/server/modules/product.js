const connection = require("../database/connectDB");
connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL!");
    const sql = `
        CREATE TABLE IF NOT EXISTS products (
            productId INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description VARCHAR(255),
            price DECIMAL(10,2),
            oldPrice DECIMAL(10,2),
            discount VARCHAR(50),
            link VARCHAR(255),
            imageUrl VARCHAR(255),
            categoryId INT,
            FOREIGN KEY (categoryId) REFERENCES categories(categoryId)
        )
    `;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Table products created");
    });
});
