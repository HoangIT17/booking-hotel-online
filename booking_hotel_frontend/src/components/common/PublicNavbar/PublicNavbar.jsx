import BrandLogo from "../BrandLogo/BrandLogo";
import styles from "./PublicNavbar.module.css";

const PublicNavbar = ({
  brandLabel = "LuxeStay",
  brandHref = "/home",
  links = [],
  action,
  secondaryAction,
}) => {
  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <BrandLogo label={brandLabel} href={brandHref} />

        <nav className={styles.navLinks} aria-label="Primary navigation">
          {links.map((link) => (
            <a
              key={link.href}
              className={link.active ? styles.active : ""}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          {action && (
            <a className={styles.action} href={action.href}>
              {action.label}
            </a>
          )}
          {secondaryAction && (
            <button className={styles.secondaryAction} type="button" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
