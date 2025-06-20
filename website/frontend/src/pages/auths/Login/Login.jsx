import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/auth/login";
import { AuthContext } from "../../../contexts/AuthContex";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { getListItem } from "../../../reactRedux/action/actions";
import { AddUserContext, SetEmailUser } from "../../../Tracker";

import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(styles);

export default function Login() {
  const dispatch = useDispatch();
  const { handleLoggedin } = React.useContext(AuthContext);
  const navigateTo = useNavigate();
  const formikForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email không đúng").required("Bạn chưa điền email!"),
      password: Yup.string().min(6, "mật khẩu tối thiểu 6 kí tự").required("Bạn chưa nhập mật khẩu"),
    }),
    onSubmit: async (values) => {
      try {
        console.log("Form values:", values);
        // Gọi hàm login từ service
        const response = await login(values);
        console.log("Login response:", response);

        // Kiểm tra xem đăng nhập có thành công không
        const role = response.user.role;
        if (role && role.toLowerCase() === "user") {
          // Nếu thành công, chuyển hướng đến trang Home
          // const token = response
          // console.log(response);
          const token = response.token;
          const user = response.user;
          handleLoggedin(token, user);
          toast.success("Đăng nhập thành công");
          SetEmailUser(user.email);
          AddUserContext(user.id, user.name, user.phone, user.email)
          navigateTo("/");
          dispatch(getListItem(user.email));
        } else {
          if (role && role.toLowerCase() === "admin") {
            const token = response.token;
            const user = response.user;
            handleLoggedin(token, user);
            toast.success("Đăng nhập thành công");
            navigateTo("/admin");
          } else {
            toast.error("Sai email hoặc mật khẩu");
          }
        }
      } catch (error) {
        console.error("Đăng nhập thất bại:", error);
        toast.error("Đăng nhập thất bại: " + (error?.message || error));
      }
    },
  });

  return (
    <div className={cx("container")}>
      <div className={cx("heading")}>
        <h3>ĐĂNG NHẬP TÀI KHOẢN</h3>
        <p>
          Bạn chưa có tài khoản? Đăng ký <Link to={"/signup"}>tại đây</Link>
        </p>
      </div>

      <form action="" method="POST" className={cx("form")} onSubmit={formikForm.handleSubmit} id="form-2">
        <h3 className={cx("info")}>Thông tin cá nhân</h3>

        <div className="spacer"></div>

        <div className={cx("form-group")}>
          <label htmlFor="email" className={cx("form-label")}>
            Email<span> *</span>
          </label>
          <input required id="email" name="email" type="text" placeholder="Email" value={formikForm.values.email} onChange={formikForm.handleChange} className={cx("form-control")} />
          {formikForm.errors.email && formikForm.touched.email && <span className={cx("form-message")}>{formikForm.errors.email}</span>}
        </div>

        <div className={cx("form-group")}>
          <label htmlFor="password" className={cx("form-label")}>
            Mật khẩu<span> *</span>
          </label>
          <input required id="password" name="password" type="password" placeholder="Mật khẩu" value={formikForm.values.password} onChange={formikForm.handleChange} className={cx("form-control")} />
          {formikForm.errors.phoneNumber && formikForm.touched.phoneNumber && <span className={cx("form-message")}>{formikForm.errors.phoneNumber}</span>}
        </div>

        <button className={cx("form-submit")} type="submit">
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
