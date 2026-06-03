import logoHotel from "../../../assets/images/logohotel.png";
import styles from "./BrandLogo.module.css";

const BrandLogo = ({ label = "LuxeStay", href = "/home", logo = logoHotel }) => {
  return (
    <a className={styles.brand} href={href}>
      <img className={styles.logoImage} src={logo} alt={`${label} logo`} />
      <span>{label}</span>
    </a>
  );
};

export default BrandLogo;
