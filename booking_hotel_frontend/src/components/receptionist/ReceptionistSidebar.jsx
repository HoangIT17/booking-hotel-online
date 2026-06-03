import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutThunk } from "../../redux/slices/authSlice";
import styles from "../admin/Sidebar.module.css";

import logoImg from "../../assets/images/logohotel.png";

const ReceptionistSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    dispatch(logoutThunk());
    navigate("/login");
  };

  const menuItems = [
    { path: "/receptionist/dashboard", icon: "fa-gauge-high", label: "Trang chủ" },
    { path: "/receptionist/bookings", icon: "fa-calendar-check", label: "Quản Lý Booking" },
    {
      path: "/receptionist/cleaning-tasks",
      icon: "fa-broom",
      label: "Quản lý dọn dẹp",
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

export default ReceptionistSidebar;
