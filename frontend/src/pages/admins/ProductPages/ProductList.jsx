import classNames from "classnames/bind";
import styles from "./ProductList.module.scss";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import customStyles from "./CustomTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap";
import { getProductList } from "../../../services/getProductList";
import { getCategories } from "../../../services/admin/categories";
import { deleteProduct } from "../../../services/admin/products";
import { getAllProduct } from "../../../services/getAllProduct";

import { toast, ToastContainer } from "react-toastify";

const cx = classNames.bind(styles);

const ProductList = () => {
  const columns = [
    {
      name: "Sản Phẩm",
      selector: (row) => row.name,
      sortable: true,
      color: "#007bff",
    },
    {
      name: "Loại",
      selector: (row) => row.categoryName,
    },
    {
      name: "Số lượng",
      selector: (row) => row.quantity,/* quantityTotals[row.productId], */
      sortable: true,
    },
    {
      name: "Giá",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Ảnh",
      cell: (row) => <img src={row.imageUrl} alt={row.name} className={cx("image-cell")} />,
    },
    {
      name: "",
      cell: (row) => (
        <Link to={`/admin/products/${row.productId}`}>
          <FontAwesomeIcon icon={faEdit} />
        </Link>
      ),
    },
  ];
  const [originalProducts, setOriginalProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleClear, setToggleClear] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quantityTotals, setQuantityTotals] = useState({});

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const confirmDelete = () => {
    setShowDeleteModal(true);
  };
  //const navigate = useNavigate()

  useEffect(() => {
    //get all products
    /* async function */ getAllProduct() 
      /* getProductList() */
        .then((data) => {
          const newQuantityTotals = {};
          // Giả sử 'data' là một mảng các sản phẩm
          const uniqueProducts = Array.from(new Set(data.data.map((product) => product.name))).map((name) => data.data.find((product) => product.name === name));
          setProducts(uniqueProducts);
          setOriginalProducts(uniqueProducts);

          /* data.data.forEach((item) => {
            const { productId, quantity } = item;

            if (newQuantityTotals[productId]) {
              newQuantityTotals[productId] += quantity;
            } else {
              newQuantityTotals[productId] = quantity;
            }
          });

          // Cập nhật state với tổng mới
          setQuantityTotals(newQuantityTotals); */
        })
        .catch((error) => console.error("Error fetching product list:", error));
      //lọc theo id sản phẩm sau này thay listProduct bằng data trả về từ be
    
    /* getAllProduct(); */

    //get all category
    async function getAllCategory() {
      getCategories()
        .then((data) => {
          setCategories(data);
        })
        .catch((error) => console.error("Error fetching categoris list:", error));
    }
    getAllCategory();
  }, []);

  function handleSearch(e) {
    const filterData = originalProducts.filter((row) => {
      return row.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setProducts(filterData);
  }

  const handleCategoryChange = (e) => {
    const category = e.target.value;

    if (category) {
      const filterProduct = originalProducts.filter((row) => {
        return row.categoryName === category;
      });

      setProducts(filterProduct);
    } else {
      setProducts(originalProducts);
    }
    setSelectedCategory(category);
  };

  const handleDelete = async () => {
    // Lấy danh sách ID của các sản phẩm đã chọn
    const productIdsToDelete = selectedRows.map((row) => row.productId);

    try {
      await Promise.all(productIdsToDelete.map((productId) => deleteProduct(productId)));
      const updatedProducts = products.filter((product) => !productIdsToDelete.includes(product.productId));
      setProducts(updatedProducts);
      setOriginalProducts(originalProducts.filter((product) => !productIdsToDelete.includes(product.productId)));
      setToggleClear(!toggleClear);
      setSelectedRows([]);
      toast.success("Xóa sản phẩm thành công");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error.message);
      toast.error("Lỗi khi xóa sản phẩm");
    }
    setShowDeleteModal(false);
  };

  return (
    <div className={cx("wrap")}>
      <div className={cx("cd-product")}>
        <button className={cx("delete-btn")} onClick={confirmDelete}>
          Xóa sản phẩm
        </button>
        <Link to="/admin/products/add" className={cx("create-btn")}>
          Thêm sản phẩm
        </Link>
      </div>

      <div className={cx("search-bar")}>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Tất cả loại</option>
          {categories &&
            categories.map((category) => (
              <option key={category.categoryId} value={category.name}>
                {category.name}
              </option>
            ))}
        </select>

        <input
          type="text"
          placeholder="Tìm kiếm theo tên sản phẩm"
          //value={}
          onChange={handleSearch}
        />
      </div>

      <div className={cx("products-list")}>
        <h3>{selectedCategory || "Tất cả sản phẩm"}</h3>
        <DataTable
          columns={columns}
          data={products}
          selectableRows
          fixedHeader
          pagination
          customStyles={customStyles}
          onSelectedRowsChange={({ selectedRows }) => {
            setSelectedRows(selectedRows);
          }}
          clearSelectedRows={toggleClear}
        ></DataTable>
      </div>
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận hủy</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn chắc chắn muốn xóa sản phẩm?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className={cx("btn-close-modal")} style={{ backgroundColor: "#36a2eb" }} onClick={handleCloseDeleteModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductList;
