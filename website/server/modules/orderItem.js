const connection = require("../database/connectDB");

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
  var sql = `CREATE TABLE IF NOT EXISTS orderItem (
    orderId INT,
    productId INT,
    quantity INT,
    size VARCHAR(255),
    FOREIGN KEY (orderId) REFERENCES \`order\`(id),
    FOREIGN KEY (productId) REFERENCES products(productId)
  )`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table orderItem created");
  });
});
