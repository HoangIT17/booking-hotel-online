import styles from "./StatusBadge.module.css";

const statusLabels = {
  READY: "Ready",
  AVAILABLE: "Available",
  UNAVAILABLE: "Unavailable",
  OCCUPIED: "Occupied",
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CHECKED_IN: "Checked in",
  CHECKED_OUT: "Checked out",
  CANCELLED: "Cancelled",
  CANCELED: "Cancelled",
  FAILED: "Failed",
  SUCCESS: "Success",
  PAID: "Paid",
  REFUNDED: "Refunded",
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
