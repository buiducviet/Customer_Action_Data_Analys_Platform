const connection = require("../database/connectDB");

const cartController = {
  getById: async (req, res) => {
    try {
      const { email } = req.params;
      const [rows, fields] = await connection.promise().query(
        `SELECT p.name, c.variantId, c.quantity ,p.description,p.imageUrl,pp.price,c.productId, v.storage AS variantStorage, cc.name AS category
        FROM cartItem c 
        INNER JOIN products p ON c.productId = p.productId
        INNER JOIN variants v ON c.variantId = v.variantId
        INNER JOIN productPrices pp ON pp.variantId = c.variantId
        INNER JOIN categories cc ON cc.categoryId = p.categoryId
        where email = ?`,
        [email]
      );
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
  //Thêm product vào card
  create: async (req, res) => {
    try {
      let { productId, quantity, variantId } = req.body;
      console.log("line 28", req.body);
      const { email } = req.params;
      console.log("line 30", req.params);
      quantity = parseInt(quantity, 10);

      const selectSql = "SELECT * FROM cartItem WHERE email = ? AND productId = ? AND variantId = ?";
      const [selectRows, selectFields] = await connection.promise().query(selectSql, [email, productId, variantId]);

      if (selectRows.length > 0) {
        // Nếu đã tồn tại trong giở hàng thêm quantity vào
        let existingQuantity = selectRows[0].quantity;
        existingQuantity = parseInt(existingQuantity, 10);
        const updatedQuantity = existingQuantity + quantity;

        const updateSql = "UPDATE cartItem SET quantity = ? WHERE email = ? AND productId = ? AND variantId = ?";
        await connection.promise().query(updateSql, [updatedQuantity, email, productId, variantId]);

        res.json({
          data: { email, productId, variantId, quantity: updatedQuantity, errCode: 0 },
          message: "Quantity updated successfully",
        });
      } else {
        // Nếu chưa tồn tại thì thêm vào giỏ hàng
        const insertSql = "INSERT INTO cartItem (email, productId, variantId, quantity) VALUES (?, ?, ?, ?)";
        const [insertRows, insertFields] = await connection.promise().query(insertSql, [email, productId, variantId, quantity]);

        res.json({
          data: { errCode: 0 },
          message: "Item added to the cart",
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        state: "error",
        message: "An error occurred",
      });
    }
  },

  update: async (req, res) => {
    try {
      const { productId, variantId } = req.query;
      const { email } = req.params;
      const { quantity } = req.body;

      // Truy vấn để kiểm tra xem dữ liệu tồn tại hay không
      const [checkRows, checkFields] = await connection.promise().query("SELECT * FROM cartItem WHERE productId = ? AND variantId = ? AND email = ?", [productId, variantId, email]);

      if (checkRows.length === 0) {
        // Dữ liệu không tồn tại, trả về thông báo lỗi hoặc thực hiện các bước khác theo yêu cầu của bạn.
        res.json({
          state: "error",
          message: "Dữ liệu không tồn tại. Không thể cập nhật.",
        });
        return;
      }

      // Nếu dữ liệu tồn tại, thực hiện truy vấn cập nhật
      const sql = "UPDATE cartItem SET quantity = ? WHERE email = ? AND productId = ? AND variantId = ?";
      const [rows, fields] = await connection.promise().query(sql, [quantity, email, productId, variantId]);

      res.json({
        data: { errCode: 0 },
        message: "Update success",
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
      const { productId, variantId } = req.body;
      console.log("line 107", req.body);
      const { email } = req.params;
      console.log("line 109", req.params);
      productId;
      // Truy vấn để kiểm tra xem dữ liệu tồn tại hay không
      const [checkRows, checkFields] = await connection.promise().query("SELECT * FROM cartItem WHERE productId = ? AND variantId = ? AND email = ?", [productId, variantId, email]);

      if (checkRows.length === 0) {
        // Dữ liệu không tồn tại, trả về thông báo lỗi hoặc thực hiện các bước khác theo yêu cầu của bạn.
        res.json({
          state: "error",
          message: "Dữ liệu không tồn tại. Không thể xóa.",
        });
        return;
      }

      // Nếu dữ liệu tồn tại, thực hiện truy vấn xóa
      const [rows, fields] = await connection.promise().query("DELETE FROM cartItem WHERE productId = ? AND variantId = ? AND email = ?", [productId, variantId, email]);

      res.json({
        data: { data: rows, errCode: 0, message: "Delete success!!" },
      });
    } catch (error) {
      console.log(error);
      res.json({
        state: "error",
      });
    }
  },
};

module.exports = cartController;
