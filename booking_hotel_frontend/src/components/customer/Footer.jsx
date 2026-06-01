import { Link } from "react-router-dom";
import style from "./Footer.module.css";
import LogoHotel from "../../assets/images/logohotel.png";

const Footer = () => {
    return (
        <footer className={style.footer}>
            <div className={style.footerContainer}>
                {/* Cột 1: Thông tin thương hiệu */}
                <div className={style.footerBrand}>
                    <div className={style.logoArea}>
                        <img src={LogoHotel} alt="LuxeStay" className={style.footerLogo} />
                        <span className={style.logoText}>LuxeStay</span>
                    </div>
                    <p className={style.brandDesc}>
                        Trải nghiệm nghỉ dưỡng đẳng cấp và dịch vụ hoàn hảo tại LuxeStay. Nơi lưu giữ những khoảnh khắc tuyệt vời của bạn.
                    </p>
                    <div className={style.contactInfo}>
                        <p><i className="fa-solid fa-phone"></i> +84 123 456 789</p>
                        <p><i className="fa-solid fa-envelope"></i> support@luxestay.com</p>
                        <p><i className="fa-solid fa-location-dot"></i> Da Nang, Vietnam</p>
                    </div>
                </div>

                {/* Cột 2: Khám phá (Discover) */}
                <div className={style.footerLinks}>
                    <h4 className={style.linkTitle}>Khám Phá</h4>
                    <Link to="/" className={style.linkItem}>Trang Chủ</Link>
                    <Link to="/rooms" className={style.linkItem}>Danh Sách Phòng</Link>
                    <Link to="/history-reviews" className={style.linkItem}>Đánh Giá Khách Hàng</Link>
                    <Link to="/seasonal-deals" className={style.linkItem}>Ưu Đãi Theo Mùa</Link>
                </div>

                {/* Cột 3: Hỗ trợ & Chính sách */}
                <div className={style.footerLinks}>
                    <h4 className={style.linkTitle}>Hỗ Trợ & Chính Sách</h4>
                    <Link to="/book-history" className={style.linkItem}>Quản Lý Đặt Phòng</Link>
                    <Link to="/contact" className={style.linkItem}>Chăm Sóc Khách Hàng</Link>
                    <Link to="/terms" className={style.linkItem}>Điều Khoản Dịch Vụ</Link>
                    <Link to="/privacy" className={style.linkItem}>Chính Sách Bảo Mật</Link>
                </div>
            </div>

            {/* Phần Copyright dưới cùng */}
            <div className={style.footerBottom}>
                <p>&copy; {new Date().getFullYear()} LuxeStay. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;