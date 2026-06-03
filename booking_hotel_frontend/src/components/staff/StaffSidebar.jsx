import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutThunk } from "../../redux/slices/authSlice";
import styles from "../admin/Sidebar.module.css";
import logoImg from "../../assets/images/logohotel.png";

const StaffSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    dispatch(logoutThunk());
    navigate("/login");
  };

  // ĐƯA TRANG MỚI VÀO MẢNG DỮ LIỆU ĐỂ HỆ THỐNG TỰ ĐỘNG RENDERING ĐỒNG BỘ
  const menuItems = [
    { path: "/staff/dashboard", icon: "fa-gauge-high", label: "Trang chủ" },
    { path: "/staff/view-tasks", icon: "fa-broom", label: "Danh sách phòng" },
    { path: "/staff/my-tasks", icon: "fa-list-check", label: "Phòng cần dọn" }, // <- Thêm dòng này ở đây
  ];

  return (
    <div
      className={styles.sidebarWrapper}
      style={{ minWidth: "260px", width: "260px" }}
    >
      <div className={styles.logoArea}>
        <img src={logoImg} alt="LuxeStay Logo" className={styles.logoImg} />
        <span>LuxeStay</span>
      </div>

      <nav
        className={`${styles.navArea} nav nav-pills flex-column`}
        style={{ gap: "8px" }}
      >
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
            }
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              padding: "12px 16px",
            }}
          >
            <i
              className={`fa-solid ${item.icon}`}
              style={{ width: "20px", marginRight: "10px" }}
            ></i>
            <span style={{ whiteSpace: "nowrap", fontSize: "14px" }}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.logoutArea}>
        <hr className={styles.footerHr} />
        <button className={styles.logoutBtn} onClick={onLogout}>
          <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default StaffSidebar;
