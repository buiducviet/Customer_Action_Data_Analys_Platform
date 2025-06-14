import classNames from "classnames/bind";
import styles from "./ProductDescription.module.scss";
import React, { useEffect, useState, useContext } from "react";
import { getOneProduct } from "../../../services/getOneProduct";
import { useParams } from "react-router-dom";
import { createCartItemAction } from "../../../reactRedux/action/actions";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../../contexts/AuthContex";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { trackAddToCart } from "@snowplow/browser-plugin-snowplow-ecommerce";
import { AddProduct } from "../../../Tracker";
import { number } from "yup";
import { getListProductPriceByProductId } from "../../../services/admin/productPrice";
import { formatNumber } from "../FormatNumber";
const cx = classNames.bind(styles);
const ProductDescription = () => {
  const navigateTo = useNavigate();
  const { token, user } = useContext(AuthContext);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState([]);
  const [productPrice, setProductPrice] = useState([]);
  const [name, setName] = useState("")
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [price, setPrice] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOneProduct(id);
        setProduct(data.data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchData(); // Gọi hàm lấy dữ liệu khi component được mount

    // Không quên thêm [productId] vào dependencies để useEffect chạy lại khi productId thay đổi
  }, [id]);

  useEffect(() => {
    // Kiểm tra xem có dữ liệu sản phẩm không trước khi thực hiện các thao tác khác
    if (product.length > 0) {
      // Thực hiện các thao tác với dữ liệu sản phẩm ở đây
      const firstProduct = product[0];
      setImgUrl(firstProduct.imageUrl);
      setDescription(firstProduct.description);
      setCategory(firstProduct.categoryName);
      setName(firstProduct.name)
    }
  }, [product]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getListProductPriceByProductId(id);
        // Ensure data.data is always an array
        setProductPrice(Array.isArray(data.data) ? data.data : []);
        console.log(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setProductPrice([]); // fallback to empty array on error
      }
    };

    fetchData();
  }, [id]);



  const handleCreateItem = () => {
    if (token && user && user.role === "user") {
      const email = user.email;
      console.log("emailllllllllll", email);
      //(name, price, id, category, size, qty)
      AddProduct(
        name,
        Number(price),
        id,
        category,
        selectedPrice.variantStorage,
        1,
        String(user.id)
      ) // add event add_to_cart
      console.log("selectedPrice", selectedPrice);
      console.log("variantId", selectedPrice.variantId);
      dispatch(createCartItemAction(email, id, selectedPrice.variantId, 1, price, name, category));
      toast.success("Sản phẩm đã được thêm vào giỏ hàng của bạn");
    } else {
      navigateTo("/login");
      toast.warn("Đăng nhập trước khi thêm vào giỏ hàng!!");
    }
  };
  // State để lưu selectedPrice (storage) và count (số lượng)
  const [selectedPrice, setSelectedPrice] = useState("");
  const [count, setCount] = useState(1);

  // Khi productPrice thay đổi, chọn mặc định là item đầu tiên
  useEffect(() => {
    if (productPrice.length > 0) {
      setSelectedPrice(productPrice[0]);
      setPrice(productPrice[0].price);
      setName(productPrice[0].variantName.replace(/  +/g, ' ').trim());
    }
    console.log(selectedPrice);
    console.log(price);
  }, [productPrice, product]);

  return (
    <div className={cx("productDescription", "row")}>
      <input className="productId" type="text" value={id} disabled style={{ display: "none" }} />
      <input className="category" type="text" value={category} disabled style={{ display: "none" }} />
      <div className={cx("divLeft", "col-12", "col-lg-6")}>
        <img src={imgUrl} alt="Item 1" />
      </div>
      <div className={cx("divRight", "col-xs-12", "col-lg-6")}>
        <h3>{name}</h3>
        <span className={cx("product_id_1")}>Mã sản phẩm: <span className={cx("product_id")}>{id}</span></span><br></br>
        <br></br>
        <div className={cx("productPriceList", "d-flex", "gap-3", "mb-4")}>
          {productPrice.map((item, idx) => (
            <div
              key={item.priceId}
              className={cx(
                "productPriceItem",
                "text-center",
                "rounded",
                {
                  [styles.selected]: selectedPrice === item,
                }
              )}
              style={{
                border: selectedPrice === item.variantStorage ? "2px solid #d70018" : "1px solid #d9d9d9",
                position: "relative",
                minWidth: 180,
                cursor: "pointer",
                background: "#fff"
              }}
              onClick={() => {
                setSelectedPrice(item);
                setPrice(item.price);
                setName(item.variantName);
                return;
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                {item.variantStorage}
              </div>
              <div style={{ fontSize: 16, marginTop: 8 }}>
                {formatNumber(Number(item.price))} đ
              </div>
              {selectedPrice === item.variantStorage && (
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "#d70018",
                    color: "#fff",
                    borderRadius: "0 12px 0 12px",
                    padding: "2px 8px",
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
              )}
            </div>
          ))}
        </div>
        <div className={cx("add_to_cart")}>
          <div onClick={() => handleCreateItem()} className={cx("addCart")}>
            <p>Thêm vào giỏ</p>
          </div>
        </div>

        <div className={cx("product_describe")}>
          <div className={cx("product_describe_head")}>
            <h5>Mô tả sản phẩm</h5>
          </div>
          <div className={cx("product_describe_body")}>
            <p style={{
              fontWeight: 100,
              fontSize: '14px'
            }}
            >
              {description}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDescription;
