import { Link, useLocation } from "react-router-dom";
import style from "./Header.module.css";
import LogoHotel from "../../assets/images/logohotel.png";

const Header = () => {
    const location = useLocation();
    
    const isActive = (path) => location.pathname === path;
    
    return (
        <header className={style.header}>
            <div className={style.headerContainer}>
                <div className={style.logoArea}>
                    <img src={LogoHotel} alt="LuxeStay" className={style.headerLogo} />
                    <span className={style.logoText}>LuxeStay</span>
                </div>
                <nav className={style.navMenu}>
                    <Link to="/" className={`${style.navLink} ${isActive("/") ? style.active : ""}`}>
                        Home
                    </Link>
                    <Link to="/rooms" className={`${style.navLink} ${isActive("/rooms") ? style.active : ""}`}>
                        Rooms
                    </Link>
                    <Link to="/login" className={`${style.navLink} ${isActive("/login") ? style.active : ""}`}>
                        Sign In
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;