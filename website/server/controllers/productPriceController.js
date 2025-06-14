const connection = require("../database/connectDB");

const productPriceController = {
    // Lấy tất cả productPrices
    getAll: async (req, res) => {
        try {
            const [rows] = await connection.promise().query("SELECT * FROM productPrices");
            res.json({ data: rows });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Không thể lấy danh sách productPrices" });
        }
    },

    // Lấy 1 productPrice theo priceId
    getOne: async (req, res) => {
        try {
            const { id } = req.params;
            const [rows] = await connection.promise().query("SELECT * FROM productPrices WHERE priceId = ?", [id]);
            if (rows.length === 0) {
                return res.status(404).json({ error: "Không tìm thấy productPrice" });
            }
            res.json({ data: rows[0] });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Không thể lấy productPrice" });
        }
    },

    // Lấy list productPrice và variant cho 1 productId
    getListByProductId: async (req, res) => {
        try {
            const { productId } = req.params;
            const sql = `
                SELECT ps.*, v.variantId, v.storage AS variantStorage, v.name AS variantName
                FROM productPrices ps
                JOIN variants v ON ps.variantId = v.variantId
                WHERE v.productId = ?
            `;
            const [rows] = await connection.promise().query(sql, [productId]);
            res.json({ data: rows });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Không thể lấy danh sách productPrice theo productId" });
        }
    },

    // Tạo mới productPrice
    create: async (req, res) => {
        try {
            const { variantId, price } = req.body;
            const sql = "INSERT INTO productPrices (variantId, price) VALUES (?, ?)";
            const [result] = await connection.promise().query(sql, [variantId, price]);
            res.json({ message: "Tạo productPrice thành công", priceId: result.insertId });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Không thể tạo productPrice" });
        }
    },

    // Cập nhật productPrice
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { variantId, price } = req.body;
            const sql = "UPDATE productPrices SET variantId = ?, price = ? WHERE priceId = ?";
            const [result] = await connection.promise().query(sql, [variantId, price, id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Không tìm thấy productPrice để cập nhật" });
            }
            res.json({ message: "Cập nhật productPrice thành công" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Không thể cập nhật productPrice" });
        }
    },

    // Xóa productPrice
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const sql = "DELETE FROM productPrices WHERE priceId = ?";
            const [result] = await connection.promise().query(sql, [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Không tìm thấy productPrice để xóa" });
            }
            res.json({ message: "Xóa productPrice thành công" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Không thể xóa productPrice" });
        }
    },
};

module.exports = productPriceController;
