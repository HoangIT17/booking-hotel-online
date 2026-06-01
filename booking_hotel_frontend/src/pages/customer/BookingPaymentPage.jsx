import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import CustomerPageShell from "../../components/customer/CustomerPageShell/CustomerPageShell";
import Input from "../../components/common/Input/Input";
import useAuth from "../../hooks/useAuth";
import customerBookingService from "../../services/customerBookingService";
import { formatCurrency, getResponseData } from "../../utils/customerDataUtils";
import styles from "./CustomerPages.module.css";

const BookingPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const roomId = searchParams.get("roomId");
  const checkInParam = searchParams.get("checkIn") || "";
  const checkOutParam = searchParams.get("checkOut") || "";
  const [room, setRoom] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    roomId: roomId || "",
    fullName: "",
    email: "",
    phone: "",
    paymentMethod: "WALLET",
    checkIn: checkInParam,
    checkOut: checkOutParam,
    numGuests: 1,
    voucherCode: "",
  });
  const isCustomer = isAuthenticated && role?.toUpperCase() === "CUSTOMER";

  useEffect(() => {
    if (isCustomer) return;

    const bookingPath = `${window.location.pathname}${window.location.search}`;
    toast.error("Vui long dang nhap de tiep tuc dat phong.");
    navigate(`/login?redirect=${encodeURIComponent(bookingPath)}`, { replace: true });
  }, [isCustomer, navigate, roomId]);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) return;
      const response = await customerBookingService.getRoomDetail(roomId);
      setRoom(getResponseData(response));
    };

    fetchRoom();
  }, [roomId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut) return 0;
    const start = new Date(form.checkIn);
    const end = new Date(form.checkOut);
    return Math.max(Math.ceil((end - start) / 86400000), 0);
  }, [form.checkIn, form.checkOut]);

  const total = Number(room?.price || 0) * nights;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        ...form,
        roomId: Number(form.roomId),
        numGuests: Number(form.numGuests),
        voucherCode: form.voucherCode || null,
      };

      const response = await customerBookingService.createBooking(payload);
      const bookingId = response?.data?.bookingId;
      toast.success(response?.data?.message || "Tạo đặt phòng thành công");

      if (form.paymentMethod === "WALLET" && bookingId) {
        const paymentResponse = await customerBookingService.createVnPayPayment({
          bookingId,
          orderInfo: `Thanh toan booking ${bookingId}`,
          locale: "vn",
        });
        if (paymentResponse?.data?.paymentUrl) {
          window.location.href = paymentResponse.data.paymentUrl;
          return;
        }
      }

      window.location.href = "/reservations";
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể tạo đặt phòng.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomerPageShell active="Rooms">
      <form className={styles.panel} onSubmit={handleSubmit}>
        <h2>Xác nhận đặt phòng</h2>

        <div className={styles.detailGrid}>
          <div className={styles.stack}>
            <div className={styles.formGrid}>
              <Input label="Mã phòng đã chọn" name="roomId" value={form.roomId} onChange={handleChange} required />
              <Input label="Nhận phòng" name="checkIn" type="datetime-local" step="3600" value={form.checkIn} onChange={handleChange} required />
              <Input label="Trả phòng" name="checkOut" type="datetime-local" step="3600" value={form.checkOut} onChange={handleChange} required />
              <Input label="Số khách" name="numGuests" type="number" min="1" value={form.numGuests} onChange={handleChange} required />
              <Input label="Họ và tên" name="fullName" value={form.fullName} onChange={handleChange} required />
              <Input label="Số điện thoại" name="phone" value={form.phone} onChange={handleChange} required />
              <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
              <Input label="Mã voucher" name="voucherCode" value={form.voucherCode} onChange={handleChange} placeholder="Nhập mã voucher" />
            </div>

            <div className={styles.panel}>
              <h2>Phương thức thanh toán</h2>
              <div className={styles.formGrid}>
                <label className={styles.card}>
                  <input type="radio" name="paymentMethod" value="WALLET" checked={form.paymentMethod === "WALLET"} onChange={handleChange} />
                  <strong>WALLET / VNPAY</strong>
                  <p>Thanh toán online an toàn</p>
                </label>
                <label className={styles.card}>
                  <input type="radio" name="paymentMethod" value="BANK" checked={form.paymentMethod === "BANK"} onChange={handleChange} />
                  <strong>BANK</strong>
                  <p>Chuyển khoản ngân hàng</p>
                </label>
                <label className={styles.card}>
                  <input type="radio" name="paymentMethod" value="CASH" checked={form.paymentMethod === "CASH"} onChange={handleChange} />
                  <strong>CASH</strong>
                  <p>Thanh toán tại khách sạn</p>
                </label>
              </div>
            </div>
          </div>

          <aside className={styles.summaryCard}>
            <h2>Tóm tắt chi phí</h2>
            <ul className={styles.infoList}>
              <li><span>Phòng</span><strong>{room ? `${room.roomType} ${room.roomNumber}` : "-"}</strong></li>
              <li><span>Giá phòng</span><strong>{formatCurrency(room?.price)}</strong></li>
              <li><span>Số đêm</span><strong>{nights}</strong></li>
              <li><span>Số khách</span><strong>{form.numGuests}</strong></li>
            </ul>
            <h1>Tổng {formatCurrency(total)}</h1>
            <button className={styles.primaryButton} type="submit" disabled={submitting}>
              {submitting ? "Đang tạo đặt phòng..." : "Xác nhận đặt phòng"}
            </button>
          </aside>
        </div>
      </form>
    </CustomerPageShell>
  );
};

export default BookingPaymentPage;
