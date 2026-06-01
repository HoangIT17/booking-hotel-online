import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomerPageShell from "../../components/customer/CustomerPageShell/CustomerPageShell";
import Input from "../../components/common/Input/Input";
import ReviewForm from "../../components/customer/ReviewForm/ReviewForm";
import StatusBadge from "../../components/common/StatusBadge/StatusBadge";
import customerBookingService from "../../services/customerBookingService";
import { formatCurrency, formatDateTime, getPageContent } from "../../utils/customerDataUtils";
import styles from "./CustomerPages.module.css";

const MyBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    bookingId: "",
    fullName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    paymentMethod: "",
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await customerBookingService.searchReservations({});
      const content = getPageContent(response);
      setBookings(content);
      if (content.length > 0 && !selected) {
        setSelected(content[0]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể tải danh sách đặt phòng.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setEditForm({
      bookingId: selected.bookingId,
      fullName: selected.fullName || "",
      email: selected.email || "",
      phone: selected.phone || "",
      checkIn: selected.checkInDate || "",
      checkOut: selected.checkOutDate || "",
      paymentMethod: selected.paymentMethod || "WALLET",
    });
  }, [selected]);

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await customerBookingService.updateReservation({
        bookingId: Number(editForm.bookingId),
        fullName: editForm.fullName,
        email: editForm.email,
        phone: editForm.phone,
        checkIn: editForm.checkIn || null,
        checkOut: editForm.checkOut || null,
        paymentMethod: editForm.paymentMethod || null,
      });
      toast.success("Cập nhật đặt phòng thành công");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể cập nhật đặt phòng.");
    }
  };

  const handleCancel = async () => {
    if (!selected) return;
    try {
      await customerBookingService.updateReservation({
        bookingId: Number(selected.bookingId),
        bookingStatus: "CANCELLED",
      });
      toast.success("Hủy đặt phòng thành công");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể hủy đặt phòng.");
    }
  };

  return (
    <CustomerPageShell active="My Reservations">
      <section className={styles.panel}>
        <div className={styles.pageHeader}>
          <div>
            <h1>Đặt phòng của tôi</h1>
            <p>Theo dõi mã đặt phòng, phòng, tổng tiền và trạng thái.</p>
          </div>
          <button className={styles.secondaryButton} onClick={fetchBookings}>
            {loading ? "Đang làm mới..." : "Làm mới"}
          </button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã đặt phòng</th>
              <th>Khách hàng</th>
              <th>Phòng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.bookingId}>
                <td>{booking.bookingId}</td>
                <td>{booking.fullName}</td>
                <td>{booking.roomNumber}</td>
                <td>{formatCurrency(booking.totalPrice)}</td>
                <td><StatusBadge status={booking.bookingStatus} /></td>
                <td>
                  <button type="button" onClick={() => setSelected(booking)}>Sửa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && bookings.length === 0 && <p>Chưa có đặt phòng.</p>}
      </section>

      <div className={styles.grid} style={{ marginTop: 34 }}>
        <section className={styles.panel}>
          <h2>Chỉnh sửa đặt phòng đã chọn</h2>
          <div className={styles.formGrid}>
            <Input label="Họ và tên" name="fullName" value={editForm.fullName} onChange={handleEditChange} />
            <Input label="Số điện thoại" name="phone" value={editForm.phone} onChange={handleEditChange} />
            <Input label="Email" name="email" type="email" value={editForm.email} onChange={handleEditChange} />
            <Input label="Nhận phòng" name="checkIn" type="datetime-local" value={editForm.checkIn?.slice?.(0, 16) || ""} onChange={handleEditChange} />
            <Input label="Trả phòng" name="checkOut" type="datetime-local" value={editForm.checkOut?.slice?.(0, 16) || ""} onChange={handleEditChange} />
            <select className={styles.select} name="paymentMethod" value={editForm.paymentMethod} onChange={handleEditChange}>
              <option value="WALLET">WALLET / VNPAY</option>
              <option value="BANK">BANK</option>
              <option value="CASH">CASH</option>
            </select>
          </div>
          <div className={styles.buttonRow}>
            <button className={styles.secondaryButton}>Hủy</button>
            <button className={styles.primaryButton} type="button" onClick={handleUpdate}>Lưu thay đổi</button>
          </div>
        </section>

        <section className={styles.panel}>
          <h2>Hủy đặt phòng</h2>
          <p>{selected ? `Đặt phòng đã chọn: ${selected.bookingId} - ${formatDateTime(selected.checkInDate)}` : "Vui lòng chọn một đặt phòng trước."}</p>
          <div className={styles.buttonRow}>
            <button className={styles.secondaryButton}>Hủy</button>
            <button className={styles.dangerButton} type="button" onClick={handleCancel}>Hủy đặt phòng</button>
          </div>
        </section>

        <ReviewForm note="Hệ thống lưu thời gian đánh giá và hiển thị bình luận công khai." />
      </div>
    </CustomerPageShell>
  );
};

export default MyBookingPage;
