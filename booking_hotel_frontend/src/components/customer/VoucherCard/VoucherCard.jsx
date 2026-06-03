import { CalendarDays, Copy, TicketPercent } from "lucide-react";
import styles from "./VoucherCard.module.css";

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
};

const formatDate = (value) => {
  if (!value) return "No limit";
  return new Date(value).toLocaleDateString("vi-VN");
};

const VoucherCard = ({ voucher, onCopy }) => {
  const remaining = Math.max((voucher.usageLimit || 0) - (voucher.usedCount || 0), 0);

  return (
    <article className={styles.card}>
      <div className={styles.icon}>
        <TicketPercent size={22} />
      </div>

      <div className={styles.content}>
        <div className={styles.top}>
          <span className={styles.badge}>Active</span>
          <span className={styles.remaining}>Remaining {remaining}</span>
        </div>

        <h2>Save {voucher.discountPercent}%</h2>
        <p>Use code <strong>{voucher.code}</strong> for eligible bookings.</p>

        <ul className={styles.meta}>
          <li>
            <span>Max discount</span>
            <strong>{formatCurrency(voucher.maxDiscount)}</strong>
          </li>
          <li>
            <span>Minimum value</span>
            <strong>{formatCurrency(voucher.minBookingValue)}</strong>
          </li>
        </ul>

        <div className={styles.footer}>
          <span>
            <CalendarDays size={14} />
            Expires {formatDate(voucher.endDate)}
          </span>
          <button type="button" onClick={() => onCopy?.(voucher.code)}>
            <Copy size={14} />
            Copy code
          </button>
        </div>
      </div>
    </article>
  );
};

export default VoucherCard;
