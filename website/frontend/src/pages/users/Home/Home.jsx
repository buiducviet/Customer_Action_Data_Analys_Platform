import classNames from "classnames/bind";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Home.module.scss";
import Carousel from 'react-bootstrap/Carousel';

import Slider from "react-slick";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../../services/admin/categories";
const cx = classNames.bind(styles);
const Home = () => {
  const [listCategory, setlistcategory] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    async function getAllCategory() {
      getCategories()
        .then((data) => {
          setlistcategory(data);
          console.log(data);
        })
        .catch((error) => console.error("Error fetching categoris list:", error));
    }
    getAllCategory();
  }, []);

  const handleClicks = (categoryId) => {
    Navigate(`/listProduct/${categoryId}`);
  };
  const settings = {
    className: "gallery",
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    /*autoplay: true,
    autoplaySpeed: 2000,*/
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
  };
  return (
    <div className="wrapper">
      <div className={cx("banner")}>
       
       <Carousel>
        <Carousel.Item>
            <div>
                <img  src="https://cdn.hoanghamobile.com/i/home/Uploads/2025/05/13/thu-cu-wweb.png" alt="" />
                    
            </div>
        </Carousel.Item>
        <Carousel.Item>
            <div>
                <img  src="https://cdn.hoanghamobile.com/i/home/Uploads/2025/05/13/redmi-13-copyweb.jpg" alt="" />
                    
            </div>
        </Carousel.Item>
        <Carousel.Item>
            <div>
                <img  src="https://cdn.hoanghamobile.com/i/home/Uploads/2025/05/06/a56-a36-atsh-1200x375.jpg" alt="" />
                    
            </div>
        </Carousel.Item>
        <Carousel.Item>
            <div>
                <img  src="https://cdn.hoanghamobile.com/i/home/Uploads/2025/04/02/iphone-16-series-w.png" alt="" />
                    
            </div>
        </Carousel.Item>
        </Carousel>
      </div>
      <div className={cx("list-category")}>
        <h2> Danh mục sản phẩm</h2>
        
        <div className={cx("list-category-content")}>
        <Slider {...settings}>
           {listCategory &&
            listCategory.map((category, index) => (
            
              <div key={category.categoryId} className={cx("category-item")} onClick={() => handleClicks(category.categoryId)}>
                {category.categoryId === 1 && (
                   <img src={"https://cdn.tgdd.vn/Products/Images/42/329149/iphone-16-pro-max-sa-mac-thumb-1-600x600.jpg"} alt="category image" />
                )}
                {category.categoryId === 2 && (
                  <img src={"https://cdn.tgdd.vn/Products/Images/44/335362/macbook-air-13-inch-m4-xanh-da-troi-600x600.jpg"} alt="category image" />
                )}
                {category.categoryId === 3 && (
                  <img src={"https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/522/336738/samsung-galaxy-tab-s10-fe-5g-070425-120906-571-600x600.jpg"} alt="category image" />
                )}
                {category.categoryId === 4 && (
                  <img src={"https://cdn.tgdd.vn/Products/Images/7077/322848/garmin-forerunner-165-den-tb-600x600.jpg"} alt="category image" />
                )}
                {category.categoryId === 5 && (
                  <img src={"https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/332587/tai-nghe-chup-tai-soundcore-space-one-a3035-291124-114959-845-600x600.jpg"} alt="category image" />
                )}
                {category.categoryId === 6 && (
                  <img src={"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/_/1_75_29.jpg"} alt="category image" />
                )}
               
                <span className={cx("name")}>{category.name}</span>
              </div>
             
            ))} 
            {/* <div  className={cx("category-item")} onClick={() => handleClicks(category.id)}>
                <img src="https://theme.hstatic.net/1000277297/1001091004/14/season_coll_2_img_large.png?v=393" alt="category image" />
                <span className={cx("name")}>Ao khoac</span>
            </div>
            <div  className={cx("category-item")} onClick={() => handleClicks(category.id)}>
              <img src="https://theme.hstatic.net/1000277297/1001091004/14/season_coll_2_img_large.png?v=393" alt="category image" />
              <span className={cx("name")}>Ao khoac</span>
            </div>
 */}
          </Slider>
        </div>
        
      </div>
      <div className={cx("top-new-product")}>
          <div className={cx("top-new-heading")}>
            <h2 class={cx("heading-bar__title")}>NANA SHOP</h2>
            <span class={cx("heading-bar__bottom")}>New Arrivals</span>
          </div>
      </div>
    </div>
  );
};

export default Home;
