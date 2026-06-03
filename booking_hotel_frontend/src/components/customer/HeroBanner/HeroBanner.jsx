import styles from "./HeroBanner.module.css";

const HeroBanner = ({ image, alt, title, description, children }) => {
  return (
    <section className={styles.hero}>
      <div className={styles.imageFrame}>
        <img src={image} alt={alt || title} />
        <div className={styles.overlay} />

        <div className={styles.copy}>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
      </div>

      {children}
    </section>
  );
};

export default HeroBanner;
