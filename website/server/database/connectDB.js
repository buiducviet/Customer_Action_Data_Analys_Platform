
require('dotenv').config({ path: "C:/Users/Duc Viet/Documents/Đatn/Customer_Action_Data_Analys_Platform/website/server/database/connectDB.env" });
// get the client
const mysql = require("mysql2");
console.log(100000);
console.log(process.env['SOCKET_PATH']);
console.log(process.env.PASS);
// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PASS,
  database: process.env.DATABASE,
  multipleStatements: true,
});
connection.connect();
module.exports = connection;
