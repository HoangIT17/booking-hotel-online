import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutThunk } from '../../redux/slices/authSlice';
import styles from './Sidebar.module.css'; 

import logoImg from '../../assets/images/logohotel.png';

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    dispatch(logoutThunk());
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: 'fa-gauge-high', label: 'Bảng Điều Khiển' },
    { path: '/admin/users', icon: 'fa-users', label: 'Quản Lý Người Dùng' },
    { path: '/admin/chatbot', icon: 'fa-robot', label: 'Quản Lý Chatbot' },
  ];

  return (
    <div className={styles.sidebarWrapper}>
      <div className={styles.logoArea}>
        <img src={logoImg} alt="LuxeStay Logo" className={styles.logoImg} />
        <span className={styles.logoText}>LuxeStay</span>
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