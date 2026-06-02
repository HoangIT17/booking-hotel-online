import Header from "../Header";
import Footer from "../Footer";
import styles from "./CustomerPageShell.module.css";

const CustomerPageShell = ({ children }) => {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default CustomerPageShell;
