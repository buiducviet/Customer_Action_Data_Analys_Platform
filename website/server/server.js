const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình CORS đúng
app.use(cors({
    origin: 'http://localhost:3000',  // Chỉ định frontend
    credentials: true                 // Cho phép gửi cookie và thông tin xác thực
}));

app.use(cookieParser());

// Tạo bảng
require("./modules/customerModule");
require("./modules/maGiamGia");
require("./modules/addressShop");
require("./modules/categories");
require("./modules/product");
require("./modules/cardItem");
require("./modules/order");
require("./modules/orderItem");
require("./modules/color");
require("./modules/variant");
require("./modules/productPrice");
require("./modules/codeProvince");

// Import router
const customerRouter = require("./routers/customerRouter");
const maGiamGiaRouter = require("./routers/maGiamGiaRouter");
const addressShopRouter = require("./routers/addressShopRouter");
const productRouter = require("./routers/productRouter");
const categoryRouter = require("./routers/categoriesRouter");
const sizeRouter = require("./routers/sizeRouter");
const cartRouter = require("./routers/cartRouter");
const orderRouter = require("./routers/orderRouter");
const codeProvinceRouter = require("./routers/codeProvinceRouter");
const productPriceRouter = require("./routers/productPriceRouter");
const eventActionStatsRouter = require("./routers/eventActionStatsRouter");
// API
app.use("/customer", customerRouter);
app.use("/maGiamGia", maGiamGiaRouter);
app.use("/address-shop", addressShopRouter);
app.use("/product", productRouter);
app.use("/size", sizeRouter);
app.use("/category", categoryRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/codeProvince", codeProvinceRouter);
app.use("/productPrice", productPriceRouter);
app.use("/api", eventActionStatsRouter);

app.listen(3001, () => {
    console.log("Server running at http://localhost:3001");
});
