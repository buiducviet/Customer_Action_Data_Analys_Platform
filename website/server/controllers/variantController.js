const connection = require("../database/connectDB");

const variantController = {
  getAll: async (req, res) => {
    try {
      const [rows] = await connection.promise().query("SELECT * FROM variants");
      res.json({ data: rows });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Không thể lấy danh sách variants" });
    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await connection.promise().query("SELECT * FROM variants WHERE variantId = ?", [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: "Không tìm thấy variant" });
      }
      res.json({ data: rows[0] });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Không thể lấy variant" });
    }
  },

  create: async (req, res) => {
    try {
      const { productId, storage } = req.body;
      const sql = "INSERT INTO variants (productId, storage) VALUES (?, ?)";
      const [result] = await connection.promise().query(sql, [productId, storage]);
      res.json({ message: "Tạo variant thành công", variantId: result.insertId });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Không thể tạo variant" });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { productId, storage } = req.body;
      const sql = "UPDATE variants SET productId = ?, storage = ? WHERE variantId = ?";
      const [result] = await connection.promise().query(sql, [productId, storage, id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Không tìm thấy variant để cập nhật" });
      }
      res.json({ message: "Cập nhật variant thành công" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Không thể cập nhật variant" });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const sql = "DELETE FROM variants WHERE variantId = ?";
      const [result] = await connection.promise().query(sql, [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Không tìm thấy variant để xóa" });
      }
      res.json({ message: "Xóa variant thành công" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Không thể xóa variant" });
    }
  },
};

module.exports = variantController;
