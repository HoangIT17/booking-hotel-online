import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, User, Key } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk } from '../../redux/slices/authSlice';
import { getMyProfileThunk } from '../../redux/slices/profileSlice'; // 🌟 BỔ SUNG: Thunk lấy profile
import styles from './Header.module.css';

const Header = ({ portalName }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 🌟 ĐỒNG BỘ: Lấy thông tin profile trực tiếp từ Redux Store toàn cục
    const { profileData } = useSelector((state) => state.profile);

    // Đọc object user từ localStorage làm phương án dự phòng khi vừa F5 trang
    const storedUser = useMemo(() => {
        const saved = localStorage.getItem('user');
        return saved && saved !== "undefined" && saved !== "null" ? JSON.parse(saved) : null;
    }, []);

    const role = useMemo(() => storedUser?.role?.toUpperCase() || 'CUSTOMER', [storedUser]);

    // 🌟 TỐI ƯU HIỂN THỊ: Ưu tiên lấy data từ Redux Profile, nếu chưa load kịp thì lấy từ localStorage
    const displayUsername = profileData?.fullName || storedUser?.username || 'Người dùng';
    const displayAvatar = profileData?.avatar || null;

    // Tự động kích hoạt gọi API lấy hồ sơ nếu Redux Store chưa có dữ liệu
    useEffect(() => {
        if (!profileData) {
            dispatch(getMyProfileThunk());
        }
    }, [profileData, dispatch]);

    const onLogout = async () => {
        dispatch(logoutThunk());
        navigate('/login');
    };

    // Tính toán đường dẫn trang đổi mật khẩu động khớp 100% với AppRoutes
    const getChangePasswordLink = () => {
        return `/${role.toLowerCase()}/change-password`;
    };

    // Tính toán đường dẫn trang cá nhân động khớp 100% với AppRoutes
    const getProfileLink = () => {
        return `/${role.toLowerCase()}/profile`;
    };

    return (
        <header className={styles.header}>
            {/* Cụm bên trái: Tên phân hệ đang làm việc */}
            <div className="d-flex align-items-center">
                <span className={`badge rounded-pill bg-light text-dark border ${styles.badgeCustom}`}>
                    <i className="fa-solid fa-layer-group me-2 text-primary"></i>
                    {portalName}
                </span>
            </div>

            {/* Cụm bên phải: Thẻ tài khoản dropdown */}
            <div className="d-flex align-items-center gap-3">
                <div className="dropdown">
                    <div 
                        className={`${styles.userSection} dropdown-toggle border-0 bg-transparent d-flex align-items-center`} 
                        id="userDropdown" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="text-end d-none d-sm-block me-2">
                            <p className="mb-0 fw-bold text-dark small">{displayUsername}</p>
                            <p className="mb-0 text-muted" style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>{role}</p>
                        </div>
                        
                        {/* 🌟 THAY ĐỔI: Hiển thị ảnh đại diện thật từ DB, nếu trống mới dùng icon mặc định */}
                        <div className={`${styles.avatarCircle} overflow-hidden border`}>
                            {displayAvatar ? (
                                <img src={displayAvatar} alt="User Avatar" className="w-100 h-100 object-fit-cover" />
                            ) : (
                                <UserCircle size={26} className="text-secondary" />
                            )}
                        </div>
                    </div>

                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-0" aria-labelledby="userDropdown" style={{ minWidth: '240px', overflow: 'hidden' }}>
                        <li className="bg-primary p-3 text-white text-center d-flex flex-column align-items-center">
                            {/* 🌟 THAY ĐỔI: Đồng bộ ảnh đại diện lớn bên trong ruột Dropdown */}
                            <div className="rounded-circle border border-2 border-light overflow-hidden mb-2 shadow-sm" style={{ width: '50px', height: '50px' }}>
                                {displayAvatar ? (
                                    <img src={displayAvatar} alt="Dropdown Avatar" className="w-100 h-100 object-fit-cover" />
                                ) : (
                                    <div className="w-100 h-100 bg-white d-flex align-items-center justify-content-center text-primary">
                                        <UserCircle size={40} />
                                    </div>
                                )}
                            </div>
                            <h6 className="mb-0 fw-bold">{displayUsername}</h6>
                            <small style={{ fontSize: '11px', opacity: 0.8 }}>Vai trò: {role}</small>
                        </li>
                        
                        <div className="p-2">
                            <li>
                                {/* 🌟 ĐỒNG BỘ: Link dẫn tới trang xem hồ sơ cá nhân theo vai trò */}
                                <Link className="dropdown-item d-flex align-items-center gap-3 py-2 rounded" to={getProfileLink()}>
                                    <User size={18} className="text-primary" />
                                    <span>Thông tin cá nhân</span>
                                </Link>
                            </li>
                            
                            <li>
                                <Link className="dropdown-item d-flex align-items-center gap-3 py-2 rounded" to={getChangePasswordLink()}>
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