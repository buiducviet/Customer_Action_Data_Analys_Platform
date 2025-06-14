const connection = require("../database/connectDB");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const customerController = {
  getALL: async (req, res) => {
    try {
      const [rows, fields] = await connection.promise().query("select * from customers where role = 'user'");
      res.json({
        data: rows,
      });
    } catch (error) {
      console.log(error);
      res.json({
        state: "error",
      });
    }
  },
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const [rows, fields] = await connection.promise().query("select * from customers where customerId = ?", [id]);
      res.json({
        data: rows,
      });
    } catch (error) {
      console.log(error);
      res.json({
        state: "error",
      });
    }
  },
  create: async (req, res) => {
    try {
      const { name, email, phone, password, role } = req.body;

      // check format email
      if (!emailRegex.test(email)) {
        return res.json({
          error: "Invalid email format",
        });
      }

      const checkEmailSql = "SELECT * FROM customers WHERE email = ?";
      const [emailRows, emailFields] = await connection.promise().query(checkEmailSql, [email]);

      if (emailRows.length > 0) {
        return res.json({
          error: "Email already exists",
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertSql = "INSERT INTO customers (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)";
        const [rows, fields] = await connection.promise().query(insertSql, [name, email, phone, hashedPassword, role]);
        res.json({
          data: rows,
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        state: "error",
      });
    }
  },
  update: async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      const { id } = req.params;
      const sql = "update customers set name = ?,email = ?,phone = ?,password = ? where customerId = ?";
      const [rows, fields] = await connection.promise().query(sql, [name, email, phone, password, id]);
      res.json({
        data: rows,
      });
    } catch (error) {
      console.log(error);
      res.json({
        state: "error",
      });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const [rows, fields] = await connection.promise().query("delete from customers where customerId = ?", [id]);
      res.json({
        data: rows,
      });
    } catch (error) {
      console.log(error);
      res.json({
        state: "error",
      });
    }
  },
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const [rows] = await connection.promise().query("SELECT * FROM customers WHERE email = ?", [email]);
      if (rows.length === 1) {
        const storedPasswordHash = rows[0].password;
        // So sánh mật khẩu đúng cách
        const passwordMatch = await bcrypt.compare(password, storedPasswordHash);
        if (passwordMatch) {
          const id = rows[0].customerId;
          const role = rows[0].role;
          const name = rows[0].name;
          const phone = rows[0].phone;
          // Kiểm tra giá trị "role"
          if (role && role.toLowerCase() === "user") {
            const customer = {
              id: id,
              email: email,
              role: role,
              name: name,
              phone: phone,
            };
            const token = jwt.sign(customer, "your-secret-key");
            res.header("Authorization", token);
            res.cookie("token", token, { secure: false, httpOnly: false });
            console.log("line 130", token);
            res.status(200).send({ message: "Login successful", token: token, user: customer });
          } else if (role && role.toLowerCase() === "admin") {
            const customer = {
              id: id,
              email: email,
              role: role,
              name: name,
              phone: phone,
            };
            const token = jwt.sign(customer, "your-secret-key");
            res.header("Authorization", token);
            res.cookie("token", token, { secure: false, httpOnly: false });
            console.log("line 130", token);
            res.status(200).send({ message: "Login successful", token: token, user: customer });
          } else {
            res.status(200).json({ message: "fails", error: "Invalid role" });
          }
        } else {
          // Mật khẩu sai
          res.status(200).json({ message: "Email hoặc mật khẩu sai", error: "Login failed" });
        }
      } else {
        res.status(200).json({ message: "Email hoặc mật khẩu sai", error: "Login failed" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  verifyToken: (req, res) => {
    try {
      const { token } = req.body;
      console.log("line149", token);
      let kq = jwt.verify(token, "your-secret-key");
      console.log("JWT Token:", kq);
      if (kq != undefined) {
        res.json({ message: "Verify successful", data: kq });
      }
    } catch (error) {
      console.log("Chua dang nhap !");
      res.status(401).json({ message: "fails", error: "Login failed" });
    }
  },
  verifyTokenAdmin: (req, res) => {
    try {
      const { token } = req.body;
      console.log("line149", token);
      let kq = jwt.verify(token, "your-secret-key");
      console.log("JWT Token:", kq);
      if (kq != undefined) {
        res.json({ message: "Verify successful", data: kq });
      }
    } catch (error) {
      console.log("Chua dang nhap !");
      res.status(401).json({ message: "fails", error: "Login failed" });
    }
  },
  getNewUsersByDateRange: async (req, res) => {
    try {
      const { start, end } = req.query; // start, end dạng 'YYYY-MM-DD'
      const sql = `
      SELECT COUNT(*) as count
      FROM customers
      WHERE role = 'user'
        AND created_at >= ? AND created_at <= ?
    `;
    console.log(sql);
      const [rows] = await connection.promise().query(sql, [start, end]);
      console.log(res);
      res.json({ count: rows[0].count });
    } catch (error) {
      console.log(error);
      res.status(500).json({ state: "error" });
    }
  },
};

module.exports = customerController;
