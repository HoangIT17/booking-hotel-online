import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutThunk } from "../../redux/slices/authSlice";
import styles from "../admin/Sidebar.module.css";

import logoImg from "../../assets/images/logohotel.png";

const ManagerSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    dispatch(logoutThunk());
    navigate("/login");
  };

  // 🔥 THÊM MỤC QUẢN LÝ SỰ CỐ VÀO ĐÂY (Dòng cuối cùng trong mảng)
  const menuItems = [
    { path: "/manager/dashboard", icon: "fa-gauge-high", label: "Trang chủ" },
    { path: "/manager/furnitures", icon: "fa-couch", label: "Quản Lý Nội Thất" },
    { path: "/manager/rooms", icon: "fa-door-open", label: "Quản Lý Phòng" },
    { path: "/manager/reviews", icon: "fa-star", label: "Quản Lý Reviews" },
    { path: "/manager/bookings", icon: "fa-calendar-check", label: "Quản Lý Booking" },
    { path: "/manager/vouchers", icon: "fa-ticket", label: "Quản Lý Vouchers" },

    {
      path: "/manager/furnitures",
      icon: "fa-couch",
      label: "Quản Lý Nội Thất",
    },
    { path: "/manager/rooms", icon: "fa-door-open", label: "Quản Lý Phòng" },
    {
      path: "/manager/incidents",
      icon: "fa-triangle-exclamation",
      label: "Quản Lý Sự Cố",
    },
    {
      path: "/manager/incident-reports",
      icon: "fa-chart-pie",
      label: "Báo cáo Mất/Hỏng",
    },

  ];

  return (
    <div className={styles.sidebarWrapper}>
      <div className={styles.logoArea}>
        <img src={logoImg} alt="LuxeStay Logo" className={styles.logoImg} />
        <span>LuxeStay</span>
      </div>

      <nav className={`${styles.navArea} nav nav-pills flex-column`}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
            }
          >
            <i className={`fa-solid ${item.icon}`}></i>
            <span>{item.label}</span>
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

export default ManagerSidebar;
