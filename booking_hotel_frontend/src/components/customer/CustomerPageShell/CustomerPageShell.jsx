import styles from "./CustomerPageShell.module.css";

const CustomerPageShell = ({ children }) => {
  return (
    <div className={styles.page}>
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default CustomerPageShell;
