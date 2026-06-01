import styles from "./PaymentStatusCard.module.css";

const statuses = ["Pending", "Paid", "Failed", "Canceled"];
const statusLabels = {
  Pending: "Đang chờ",
  Paid: "Đã thanh toán",
  Failed: "Thất bại",
  Canceled: "Đã hủy",
};

const PaymentStatusCard = ({ active = "Pending" }) => {
  return (
    <section className={styles.card}>
      <h2>Trạng thái thanh toán</h2>
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
        <strong>Đồng bộ hệ thống</strong>
        <p>Cổng thanh toán cập nhật trạng thái đặt phòng và lưu giao dịch mới nhất.</p>
      </div>
    </section>
  );
};

export default PaymentStatusCard;
