import styles from "./PaymentStatusCard.module.css";

const statuses = ["Pending", "Paid", "Failed", "Canceled"];
const statusLabels = {
  Pending: "Pending",
  Paid: "Paid",
  Failed: "Failed",
  Canceled: "Canceled",
};

const PaymentStatusCard = ({ active = "Pending" }) => {
  return (
    <section className={styles.card}>
      <h2>Payment status</h2>
      <div className={styles.grid}>
        {statuses.map((status) => (
          <span
            key={status}
            className={`${styles.status} ${styles[status.toLowerCase()]} ${active === status ? styles.active : ""}`}
          >
            {statusLabels[status] || status}
          </span>
        ))}
      </div>
      <div className={styles.sync}>
        <strong>System sync</strong>
        <p>The payment gateway updates booking status and stores the latest transaction.</p>
      </div>
    </section>
  );
};

export default PaymentStatusCard;
