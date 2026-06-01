import styles from "./Input.module.css";

export default function Input({
  label,
  error,
  icon: Icon,
  className = "",
  ...props
}) {
  return (
    <div className={`${styles.field} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}

      <div className={`${styles.inputWrap} ${error ? styles.invalid : ""}`}>
        {Icon && <Icon size={18} className={styles.icon} />}
        <input className={styles.input} {...props} />
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
