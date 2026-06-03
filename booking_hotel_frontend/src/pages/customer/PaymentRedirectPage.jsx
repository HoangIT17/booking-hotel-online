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
        setError("Missing booking ID.");
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
          setError("Payment URL is not available.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Unable to create VNPAY payment.");
      }
    };

    redirectToVnPay();
  }, [bookingId]);

  return (
    <CustomerPageShell active="My Reservations">
      <section className={styles.resultState}>
        <div className={styles.resultIcon}>...</div>
        <h1>Redirecting to VNPAY</h1>
        <p>
          {error || `Booking #${bookingId}. Please do not close this page or pay twice.`}
        </p>
        <button className={styles.primaryButton} disabled>Processing payment</button>
      </section>
    </CustomerPageShell>
  );
};

export default PaymentRedirectPage;
