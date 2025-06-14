const express = require("express");
const router = express.Router();
const productPriceController = require("../controllers/productPriceController");

// Lấy tất cả productPrices
router.get("/", productPriceController.getAll);

// Lấy 1 productPrice theo priceId
router.get("/:id", productPriceController.getOne);

// Lấy list productPrice và variant cho 1 productId
router.get("/product/:productId", productPriceController.getListByProductId);

// Tạo mới productPrice
router.post("/", productPriceController.create);

// Cập nhật productPrice
router.put("/:id", productPriceController.update);

// Xóa productPrice
router.delete("/:id", productPriceController.delete);

module.exports = router;
