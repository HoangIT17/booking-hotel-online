import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import CustomerPageShell from "../../components/customer/CustomerPageShell/CustomerPageShell";
import styles from "./CustomerPages.module.css";

const RoomUnavailablePage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "UNAVAILABLE";
  const availableCount = searchParams.get("availableCount") || "0";
  const timeConflict = searchParams.get("timeConflict") || "-";
  const message = searchParams.get("message") || "The selected room is no longer available for these dates.";

  return (
    <CustomerPageShell active="Rooms">
      <section className={styles.resultState}>
        <div className={styles.resultIcon} style={{ background: "#ffe3e3", color: "#ea5455" }}>
          <X size={32} />
        </div>
        <h1>Room unavailable</h1>
        <p>{message}</p>
        <ul className={styles.infoList}>
          <li><span>Status</span><strong>{status}</strong></li>
          <li><span>Available room count</span><strong>{availableCount} rooms</strong></li>
          <li><span>Conflict time</span><strong>{timeConflict}</strong></li>
        </ul>
        <div className={styles.buttonRow}>
          <a className={styles.primaryButton} href="/rooms">Choose another room</a>
          <a className={styles.secondaryButton} href="/rooms">Change dates</a>
        </div>
      </section>
    </CustomerPageShell>
  );
};

export default RoomUnavailablePage;
