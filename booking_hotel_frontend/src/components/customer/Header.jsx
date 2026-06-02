import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { UserCircle, User, Key } from "lucide-react";

import { logoutThunk } from "../../redux/slices/authSlice";
import style from "./Header.module.css";
import LogoHotel from "../../assets/images/logohotel.png";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isActive = (path) => location.pathname === path;

    const { isAuthenticated, user } = useSelector((state) => state.auth || { isAuthenticated: false, user: null });

    const displayAvatar = user?.avatar || null;
    const displayUsername = user?.fullName || user?.username || "Customer";
    const role = user?.role || "CUSTOMER";

    const getProfileLink = () => "customer/profile";
    const getChangePasswordLink = () => "customer/change-password";

    const onLogout = () => {
        // Clear Redux state and local storage.
        dispatch(logoutThunk());

        // Redirect out of the customer area.
        navigate("/login");
    };

    return (
        <header className={style.header}>
            <div className={style.headerContainer}>
                <div className={style.logoArea}>
                    <img src={LogoHotel} alt="LuxeStay" className={style.headerLogo} />
                    <span className={style.logoText}>LuxeStay</span>
                </div>

                <nav className={style.navMenu}>
                    <Link to="/home" className={`${style.navLink} ${isActive("/home") ? style.active : ""}`}>
                        Home
                    </Link>
                    <Link to="/rooms" className={`${style.navLink} ${isActive("/rooms") ? style.active : ""}`}>
                        Rooms
                    </Link>
                    <Link to="/offers" className={`${style.navLink} ${isActive("/offers") ? style.active : ""}`}>
                        Offers
                    </Link>
                    {isAuthenticated && (
                        <Link to="/reservations" className={`${style.navLink} ${isActive("/reservations") ? style.active : ""}`}>
                            My Reservations
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <div className="dropdown ms-3">
                            <div
                                className="d-flex align-items-center gap-2"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                style={{ cursor: "pointer" }}
                            >
                                <div className="rounded-circle overflow-hidden border border-secondary-subtle shadow-sm" style={{ width: "35px", height: "35px" }}>
                                    {displayAvatar ? (
                                        <img src={displayAvatar} alt="Avatar" className="w-100 h-100 object-fit-cover" />
                                    ) : (
                                        <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center text-secondary">
                                            <UserCircle size={24} />
                                        </div>
                                    )}
                                </div>
                                <span className="fw-medium text-dark">{displayUsername}</span>
                            </div>

                            <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-3 p-0" aria-labelledby="userDropdown" style={{ minWidth: "250px", overflow: "hidden" }}>
                                <li className="bg-primary p-3 text-white text-center d-flex flex-column align-items-center">
                                    <div className="rounded-circle border border-2 border-light overflow-hidden mb-2 shadow-sm" style={{ width: "50px", height: "50px" }}>
                                        {displayAvatar ? (
                                            <img src={displayAvatar} alt="Dropdown Avatar" className="w-100 h-100 object-fit-cover" />
                                        ) : (
                                            <div className="w-100 h-100 bg-white d-flex align-items-center justify-content-center text-primary">
                                                <UserCircle size={40} />
                                            </div>
                                        )}
                                    </div>
                                    <h6 className="mb-0 fw-bold">{displayUsername}</h6>
                                    <small style={{ fontSize: "11px", opacity: 0.8 }}>Role: {role}</small>
                                </li>

                                <div className="p-2">
                                    <li>
                                        <Link className="dropdown-item d-flex align-items-center gap-3 py-2 rounded" to="/reservations">
                                            <i className="fa-solid fa-clock-rotate-left text-info" style={{ width: "18px", textAlign: "center" }}></i>
                                            <span>Reservation history</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item d-flex align-items-center gap-3 py-2 rounded" to="/reservations">
                                            <i className="fa-solid fa-star text-success" style={{ width: "18px", textAlign: "center" }}></i>
                                            <span>My reviews</span>
                                        </Link>
                                    </li>

                                    <li><hr className="dropdown-divider" /></li>

                                    <li>
                                        <Link className="dropdown-item d-flex align-items-center gap-3 py-2 rounded" to={getProfileLink()}>
                                            <User size={18} className="text-primary" />
                                            <span>Profile</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item d-flex align-items-center gap-3 py-2 rounded" to={getChangePasswordLink()}>
                                            <Key size={18} className="text-warning" />
                                            <span>Change password</span>
                                        </Link>
                                    </li>

                                    <li><hr className="dropdown-divider" /></li>

                                    <li>
                                        <button className="dropdown-item d-flex align-items-center gap-3 py-2 rounded text-danger" onClick={onLogout}>
                                            <i className="fa-solid fa-right-from-bracket" style={{ width: "18px", textAlign: "center" }}></i>
                                            <span className="fw-medium">Sign out</span>
                                        </button>
                                    </li>
                                </div>
                            </ul>
                        </div>
                    ) : (
                        <Link to="/login" className={`${style.navLink} ${isActive("/login") ? style.active : ""}`}>
                            Sign In
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
