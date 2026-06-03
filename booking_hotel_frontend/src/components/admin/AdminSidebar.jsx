import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutThunk } from "../../redux/slices/authSlice";
import styles from "./Sidebar.module.css";

import logoImg from "../../assets/images/logohotel.png";

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    dispatch(logoutThunk());
    navigate("/login");
  };

  const menuItems = [
    { path: "/admin/dashboard", icon: "fa-gauge-high", label: "Trang chủ" },
    { path: "/admin/users", icon: "fa-users", label: "Quản Lý Người Dùng" },
    { path: "/admin/furnitures", icon: "fa-couch", label: "Quản Lý Nội Thất" },
    { path: "/admin/rooms", icon: "fa-door-open", label: "Quản Lý Phòng" },
    {
      path: "/admin/view-tasks",
      icon: "fa-list-check",
      label: "Danh Sách Phòng",
    },
    { path: "/admin/chatbot", icon: "fa-robot", label: "Quản Lý Chatbot" },
    { path: "/admin/reviews", icon: "fa-star", label: "Quản Lý Reviews" },
    {
      path: "/admin/bookings",
      icon: "fa-calendar-check",
      label: "Quản Lý Booking",
    },
    { path: "/admin/vouchers", icon: "fa-ticket", label: "Quản Lý Vouchers" },
    {
      path: "/admin/incidents",
      icon: "fa-triangle-exclamation",
      label: "Quản Lý Sự Cố",
    },
    { path: "/admin/chat-history", icon: "fa-history", label: "Lịch Sử Chat" },
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

export default AdminSidebar;
