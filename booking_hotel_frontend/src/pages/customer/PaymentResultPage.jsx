import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import CustomerPageShell from "../../components/customer/CustomerPageShell/CustomerPageShell";
import StatusBadge from "../../components/common/StatusBadge/StatusBadge";
import customerBookingService from "../../services/customerBookingService";
import { formatCurrency, formatDateTime } from "../../utils/customerDataUtils";
import styles from "./CustomerPages.module.css";

const PaymentResultPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setError("");
        setLoading(true);
        const params = Object.fromEntries(new URLSearchParams(window.location.search));
        const response = await customerBookingService.handleVnPayReturn(params);
        setResult(response?.data || null);
      } catch (err) {
        setError(err.response?.data?.message || "Không thể xác minh kết quả thanh toán.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  const success = result?.success === true;

  return (
    <CustomerPageShell active="My Reservations">
      <section className={styles.resultState}>
        {loading ? (
          <>
            <div className={styles.resultIcon}>...</div>
            <h1>Đang xác minh thanh toán</h1>
            <p>Vui lòng chờ trong khi hệ thống xác minh kết quả thanh toán.</p>
          </>
        ) : (
          <>
        <div className={styles.resultIcon} style={!success ? { background: "#fff0f0", color: "#c53030" } : undefined}>
          {success ? <CheckCircle size={34} /> : <XCircle size={34} />}
        </div>
        <h1>{success ? "Thanh toán thành công" : "Thanh toán thất bại"}</h1>
        <p>{error || result?.message}</p>
        <StatusBadge status={success ? "CONFIRMED" : "FAILED"} />
        <ul className={styles.infoList} style={{ marginTop: 22 }}>
          <li><span>Mã đặt phòng</span><strong>{result?.bookingId || "-"}</strong></li>
          <li><span>Mã giao dịch</span><strong>{result?.transactionNo || "-"}</strong></li>
          <li><span>Mã ngân hàng</span><strong>{result?.bankCode || "-"}</strong></li>
          <li><span>Số tiền</span><strong>{formatCurrency(result?.amount)}</strong></li>
          <li><span>Ngày thanh toán</span><strong>{formatDateTime(result?.payDate)}</strong></li>
        </ul>
        <div className={styles.buttonRow}>
          <a className={styles.primaryButton} href="/reservations">Xem đặt phòng</a>
          <a className={styles.secondaryButton} href="/rooms">Quay lại danh sách phòng</a>
        </div>
          </>
        )}
      </section>
    </CustomerPageShell>
  );
};

export default PaymentResultPage;
