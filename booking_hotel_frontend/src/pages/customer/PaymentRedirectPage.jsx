import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CustomerPageShell from "../../components/customer/CustomerPageShell/CustomerPageShell";
import customerBookingService from "../../services/customerBookingService";
import styles from "./CustomerPages.module.css";

const PaymentRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [error, setError] = useState("");

  useEffect(() => {
    const redirectToVnPay = async () => {
      if (!bookingId) {
        setError("Thiếu mã đặt phòng.");
        return;
      }

      try {
        const response = await customerBookingService.createVnPayPayment({
          bookingId: Number(bookingId),
          orderInfo: `Thanh toan booking ${bookingId}`,
          locale: "vn",
        });
        if (response?.data?.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else {
          setError("Chưa có đường dẫn thanh toán.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tạo thanh toán VNPAY.");
      }
    };

    redirectToVnPay();
  }, [bookingId]);

  return (
    <CustomerPageShell active="My Reservations">
      <section className={styles.resultState}>
        <div className={styles.resultIcon}>...</div>
        <h1>Đang chuyển hướng sang VNPAY</h1>
        <p>
          {error || `Mã đặt phòng ${bookingId}. Vui lòng không đóng trang này hoặc thanh toán hai lần.`}
        </p>
        <button className={styles.primaryButton} disabled>Đang xử lý thanh toán</button>
      </section>
    </CustomerPageShell>
  );
};

export default PaymentRedirectPage;
