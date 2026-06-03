import { Link } from "react-router-dom";
import style from "./Footer.module.css";
import LogoHotel from "../../assets/images/logohotel.png";

const Footer = () => {
    return (
        <footer className={style.footer}>
            <div className={style.footerContainer}>
                {/* Brand column */}
                <div className={style.footerBrand}>
                    <div className={style.logoArea}>
                        <img src={LogoHotel} alt="LuxeStay" className={style.footerLogo} />
                        <span className={style.logoText}>LuxeStay</span>
                    </div>
                    <p className={style.brandDesc}>
                        Enjoy premium stays and excellent service at LuxeStay, where your best travel moments are kept.
                    </p>
                    <div className={style.contactInfo}>
                        <p><i className="fa-solid fa-phone"></i> +84 123 456 789</p>
                        <p><i className="fa-solid fa-envelope"></i> support@luxestay.com</p>
                        <p><i className="fa-solid fa-location-dot"></i> Da Nang, Vietnam</p>
                    </div>
                </div>

                {/* Explore column */}
                <div className={style.footerLinks}>
                    <h4 className={style.linkTitle}>Explore</h4>
                    <Link to="/home" className={style.linkItem}>Home</Link>
                    <Link to="/rooms" className={style.linkItem}>Rooms</Link>
                    <Link to="/home" className={style.linkItem}>Customer Reviews</Link>
                    <Link to="/offers" className={style.linkItem}>Seasonal Deals</Link>
                </div>

                {/* Support and policies column */}
                <div className={style.footerLinks}>
                    <h4 className={style.linkTitle}>Support & Policies</h4>
                    <Link to="/reservations" className={style.linkItem}>Manage Reservations</Link>
                    <Link to="/home" className={style.linkItem}>Customer Support</Link>
                    <Link to="/home" className={style.linkItem}>Terms of Service</Link>
                    <Link to="/home" className={style.linkItem}>Privacy Policy</Link>
                </div>
            </div>

            {/* Copyright bar */}
            <div className={style.footerBottom}>
                <p>&copy; {new Date().getFullYear()} LuxeStay. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
