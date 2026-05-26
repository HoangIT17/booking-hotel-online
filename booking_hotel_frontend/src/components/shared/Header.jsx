import { Link, useNavigate } from 'react-router-dom';
import { Bell, UserCircle, User, Key } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutThunk } from '../../redux/slices/authSlice';
import styles from './Header.module.css';

const Header = ({ portalName }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 🌟 Lấy đúng Key từ localStorage dựa theo data hiện tại
    const username = localStorage.getItem('username') || 'Admin';
    const role = localStorage.getItem('role') || 'ADMIN';

    const onLogout = async () => {
        // Gọi Redux để xóa state + local storage, sau đó đá về login
        dispatch(logoutThunk());
        navigate('/login');
    };

    return (
      <header className={styles.header}>
        {/* Cụm bên trái */}
        <div className="d-flex align-items-center">
          <span className={`badge rounded-pill bg-light text-dark border ${styles.badgeCustom}`}>
            <i className="fa-solid fa-layer-group me-2 text-primary"></i>
            {portalName}
          </span>
        </div>

        {/* Cụm bên phải */}
        <div className="d-flex align-items-center gap-3">
          <button className={`${styles.notificationBtn} position-relative`}>
            <Bell size={20} />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{ fontSize: '10px' }}>3</span>
          </button>

          <div className="dropdown">
            <div 
              className={`${styles.userSection} dropdown-toggle border-0 bg-transparent`} 
              id="userDropdown" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
              style={{ cursor: 'pointer' }}
            >
              <div className="text-end d-none d-sm-block me-2">
                {/* 🌟 Đổi thành Username */}
                <p className="mb-0 fw-bold text-dark small">{username}</p>
                <p className="mb-0 text-muted" style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>{role}</p>
              </div>
              <div className={styles.avatarCircle}>
                <UserCircle size={26} />
              </div>
            </div>

            <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-0" aria-labelledby="userDropdown" style={{ minWidth: '240px', overflow: 'hidden' }}>
              <li className="bg-primary p-3 text-white text-center">
                  <UserCircle size={40} className="mb-2" />
                  <h6 className="mb-0">{username}</h6>
                  <small style={{ fontSize: '11px', opacity: 0.8 }}>Vai trò: {role}</small>
              </li>
              
              <div className="p-2">
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-3 py-2 rounded" to="/admin/profile">
                      <User size={18} className="text-primary" />
                      <span>Thông tin cá nhân</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-3 py-2 rounded" to="/change-password">
                      <Key size={18} className="text-warning" />
                      <span>Đổi mật khẩu</span>
                    </Link>
                  </li>
                  
                  <li><hr className="dropdown-divider" /></li>
                  
                  <li>
                    <div className={styles.logoutArea}>
                      <button className={styles.logoutBtn} onClick={onLogout}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </li>
              </div>
            </ul>
          </div>
        </div>
      </header>
    );
};

export default Header;