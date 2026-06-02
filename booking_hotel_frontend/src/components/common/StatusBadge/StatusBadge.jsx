import styles from "./StatusBadge.module.css";

const statusLabels = {
  READY: "Sẵn sàng",
  AVAILABLE: "Còn trống",
  UNAVAILABLE: "Không khả dụng",
  OCCUPIED: "Đang sử dụng",
  PENDING: "Đang chờ",
  CONFIRMED: "Đã xác nhận",
  CHECKED_IN: "Đã nhận phòng",
  CHECKED_OUT: "Đã trả phòng",
  CANCELLED: "Đã hủy",
  CANCELED: "Đã hủy",
  FAILED: "Thất bại",
  SUCCESS: "Thành công",
  PAID: "Đã thanh toán",
  REFUNDED: "Đã hoàn tiền",
};

const StatusBadge = ({ status }) => {
  const key = String(status || "default").toLowerCase();
  const label = statusLabels[String(status || "").toUpperCase()] || status;

  return (
    <span className={`${styles.badge} ${styles[key] || styles.default}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
