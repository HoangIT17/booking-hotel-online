import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import CustomerPageShell from "../../components/customer/CustomerPageShell/CustomerPageShell";
import styles from "./CustomerPages.module.css";

const RoomUnavailablePage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "UNAVAILABLE";
  const availableCount = searchParams.get("availableCount") || "0";
  const timeConflict = searchParams.get("timeConflict") || "-";
  const message = searchParams.get("message") || "Phòng đã chọn không còn trống trong khoảng ngày này.";

  return (
    <CustomerPageShell active="Rooms">
      <section className={styles.resultState}>
        <div className={styles.resultIcon} style={{ background: "#ffe3e3", color: "#ea5455" }}>
          <X size={32} />
        </div>
        <h1>Phòng không khả dụng</h1>
        <p>{message}</p>
        <ul className={styles.infoList}>
          <li><span>Trạng thái</span><strong>{status}</strong></li>
          <li><span>Số phòng còn trống</span><strong>{availableCount} phòng</strong></li>
          <li><span>Thời gian xung đột</span><strong>{timeConflict}</strong></li>
        </ul>
        <div className={styles.buttonRow}>
          <a className={styles.primaryButton} href="/rooms">Chọn phòng khác</a>
          <a className={styles.secondaryButton} href="/rooms">Đổi ngày</a>
        </div>
      </section>
    </CustomerPageShell>
  );
};

export default RoomUnavailablePage;
