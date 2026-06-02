import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomerPageShell from "../../components/customer/CustomerPageShell/CustomerPageShell";
import StatusBadge from "../../components/common/StatusBadge/StatusBadge";
import customerBookingService from "../../services/customerBookingService";
import { formatCurrency, formatDateTime, getPageContent } from "../../utils/customerDataUtils";
import styles from "./CustomerPages.module.css";

const ReservationDetailPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await customerBookingService.searchReservations({ bookingId });
        setBooking(getPageContent(response)[0] || null);
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải chi tiết đặt phòng.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <CustomerPageShell active="My Reservations">
        <section className={styles.panel}><h2>Đang tải đặt phòng...</h2></section>
      </CustomerPageShell>
    );
  }

  if (error || !booking) {
    return (
      <CustomerPageShell active="My Reservations">
        <section className={styles.resultState}>
          <h1>Không tìm thấy đặt phòng</h1>
          <p>{error || "Đặt phòng này không khả dụng."}</p>
          <a className={styles.primaryButton} href="/reservations">Quay lại danh sách đặt phòng</a>
        </section>
      </CustomerPageShell>
    );
  }

  return (
    <CustomerPageShell active="My Reservations">
      <div className={styles.detailGrid}>
        <section className={styles.panel}>
          <div className={styles.pageHeader}>
            <div>
              <h1>Chi tiết đặt phòng</h1>
              <p>Mã đặt phòng {booking.bookingId}</p>
            </div>
            <StatusBadge status={booking.bookingStatus} />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.panel}>
              <h2>Thông tin đặt phòng</h2>
              <ul className={styles.infoList}>
                <li><span>Phòng</span><strong>{booking.roomType} {booking.roomNumber}</strong></li>
                <li><span>Nhận phòng</span><strong>{formatDateTime(booking.checkInDate)}</strong></li>
                <li><span>Trả phòng</span><strong>{formatDateTime(booking.checkOutDate)}</strong></li>
                <li><span>Số khách</span><strong>{booking.numGuests}</strong></li>
                <li><span>Tổng tiền</span><strong>{formatCurrency(booking.totalPrice)}</strong></li>
              </ul>
            </div>
            <div className={styles.panel}>
              <h2>Thông tin khách hàng</h2>
              <ul className={styles.infoList}>
                <li><span>Họ và tên</span><strong>{booking.fullName}</strong></li>
                <li><span>Email</span><strong>{booking.email}</strong></li>
                <li><span>Số điện thoại</span><strong>{booking.phone}</strong></li>
                <li><span>Thanh toán</span><strong>{booking.paymentMethod}</strong></li>
              </ul>
            </div>
          </div>
        </section>

        <aside className={styles.summaryCard}>
          <h2>Tiến trình trạng thái</h2>
          <ul className={styles.timeline}>
            {["Đã tạo", "Đang chờ", "Đã xác nhận", "Đã nhận phòng", "Đã trả phòng"].map((item) => (
              <li key={item}><span className={styles.dot} /><span>{item}</span></li>
            ))}
          </ul>
          <div className={styles.buttonRow}>
            <a className={styles.primaryButton} href={`/payment/redirect?bookingId=${booking.bookingId}`}>Thanh toán ngay</a>
            <button className={styles.dangerButton}>Hủy đặt phòng</button>
          </div>
        </aside>
      </div>
    </CustomerPageShell>
  );
};

export default ReservationDetailPage;
