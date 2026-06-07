import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import CustomerPageShell from "../../components/customer/CustomerPageShell/CustomerPageShell";
import Input from "../../components/common/Input/Input";
import useAuth from "../../hooks/useAuth";
import customerBookingService from "../../services/customerBookingService";
import { formatCurrency, getResponseData } from "../../utils/customerDataUtils";
import styles from "./CustomerPages.module.css";

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const roomId = searchParams.get("roomId");
  const checkInParam = searchParams.get("checkIn") || "";
  const checkOutParam = searchParams.get("checkOut") || "";
  const [room, setRoom] = useState(null);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    roomId: roomId || "",
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
    toast.error("Please sign in to continue booking.");
    navigate(`/login?redirect=${encodeURIComponent(bookingPath)}`, {
      replace: true,
    });
  }, [isCustomer, navigate]);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) return;
      const response = await customerBookingService.getRoomDetail(roomId);
      const responseData = getResponseData(response);
      setRoom(responseData?.data ?? responseData);
    };

    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await customerBookingService.getAvailableVouchers();
        const data = getResponseData(response, []);
        setAvailableVouchers(Array.isArray(data) ? data : []);
      } catch {
        setAvailableVouchers([]);
      }
    };

    fetchVouchers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "voucherCode") {
      setAppliedVoucher(null);
    }
  };

  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut) return 0;
    const start = new Date(form.checkIn);
    const end = new Date(form.checkOut);
    return Math.max(Math.ceil((end - start) / 86400000), 0);
  }, [form.checkIn, form.checkOut]);

  const total = Number(room?.price || 0) * nights;
  const voucherDiscount = useMemo(() => {
    if (!appliedVoucher || total <= 0) return 0;
    const minBookingValue = Number(appliedVoucher.minBookingValue || 0);
    if (total < minBookingValue) return 0;

    const percentDiscount =
      (total * Number(appliedVoucher.discountPercent || 0)) / 100;
    const maxDiscount = Number(appliedVoucher.maxDiscount || 0);
    return Math.min(percentDiscount, maxDiscount || percentDiscount);
  }, [appliedVoucher, total]);
  const finalTotal = Math.max(total - voucherDiscount, 0);
  const appliedVoucherName =
    appliedVoucher?.name || appliedVoucher?.voucherName || appliedVoucher?.code;

  const handleApplyVoucher = () => {
    const voucherCode = form.voucherCode.trim().toUpperCase();
    if (!voucherCode) {
      setAppliedVoucher(null);
      toast.error("Please enter a voucher code.");
      return;
    }

    const matchedVoucher = availableVouchers.find(
      (voucher) => voucher.code?.toUpperCase?.() === voucherCode,
    );

    if (!matchedVoucher) {
      setAppliedVoucher(null);
      toast.error("Invalid voucher code.");
      return;
    }

    const minBookingValue = Number(matchedVoucher.minBookingValue || 0);
    if (total < minBookingValue) {
      setAppliedVoucher(null);
      toast.error("This booking does not meet the voucher minimum value.");
      return;
    }

    setAppliedVoucher(matchedVoucher);
    toast.success("Voucher applied successfully.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        roomId: Number(form.roomId),
        paymentMethod: form.paymentMethod,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        numGuests: Number(form.numGuests),
        voucherCode: appliedVoucher?.code || null,
      };

      const response = await customerBookingService.createBooking(payload);
      const bookingId = response?.data?.bookingId;
      toast.success(response?.data?.message || "Booking created successfully");

      if (form.paymentMethod === "WALLET" && bookingId) {
        const paymentResponse = await customerBookingService.createVnPayPayment(
          {
            bookingId,
            orderInfo: `Thanh toan booking ${bookingId}`,
            locale: "vn",
          },
        );
        if (paymentResponse?.data?.paymentUrl) {
          window.location.href = paymentResponse.data.paymentUrl;
          return;
        }
      }

      window.location.href = "/reservations";
    } catch {
      // axiosInstance already shows API errors globally.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomerPageShell active="Rooms">
      <form className={styles.panel} onSubmit={handleSubmit}>
        <h2>Confirm booking</h2>

        <div className={styles.detailGrid}>
          <div className={styles.stack}>
            <div className={styles.formGrid}>
              <Input
                label="Check-in"
                name="checkIn"
                type="datetime-local"
                step="3600"
                value={form.checkIn}
                onChange={handleChange}
                required
              />
              <Input
                label="Check-out"
                name="checkOut"
                type="datetime-local"
                step="3600"
                value={form.checkOut}
                onChange={handleChange}
                required
              />
              <Input
                label="Guests"
                name="numGuests"
                type="number"
                min="1"
                value={form.numGuests}
                onChange={handleChange}
                required
              />
              <div className={styles.voucherField}>
                <Input
                  label="Voucher code"
                  name="voucherCode"
                  value={form.voucherCode}
                  onChange={handleChange}
                  placeholder="Enter voucher code"
                />
                <button
                  className={styles.applyVoucherButton}
                  type="button"
                  onClick={handleApplyVoucher}
                >
                  APPLY
                </button>
              </div>
            </div>

            <div className={styles.panel}>
              <h2>Payment method</h2>
              <div className={styles.formGrid}>
                <label
                  className={`${styles.card} ${
                    form.paymentMethod === "WALLET"
                      ? styles.paymentMethodSelected
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="WALLET"
                    checked={form.paymentMethod === "WALLET"}
                    onChange={handleChange}
                  />
                  <strong>WALLET / VNPAY</strong>
                  <p>Secure online payment</p>
                </label>
                <label
                  className={`${styles.card} ${
                    form.paymentMethod === "CASH"
                      ? styles.paymentMethodSelected
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH"
                    checked={form.paymentMethod === "CASH"}
                    onChange={handleChange}
                  />
                  <strong>CASH</strong>
                  <p>Pay at the hotel</p>
                </label>
              </div>
            </div>
          </div>

          <aside className={styles.summaryCard}>
            <h2>Cost summary</h2>
            <ul className={styles.infoList}>
              <li>
                <span>Room</span>
                <strong>
                  {room ? `${room.roomType} ${room.roomNumber}` : "-"}
                </strong>
              </li>
              <li>
                <span>Room price</span>
                <strong>{formatCurrency(room?.price)}</strong>
              </li>
              <li>
                <span>Nights</span>
                <strong>{nights}</strong>
              </li>
              <li>
                <span>Guests</span>
                <strong>{form.numGuests}</strong>
              </li>
              {appliedVoucher && (
                <li className={styles.voucherApplied}>
                  <span>Voucher</span>
                  <strong>{appliedVoucherName}</strong>
                </li>
              )}
              {voucherDiscount > 0 && (
                <li>
                  <span>Discount</span>
                  <strong>-{formatCurrency(voucherDiscount)}</strong>
                </li>
              )}
            </ul>
            <h1>Total {formatCurrency(finalTotal)}</h1>
            <button
              className={styles.primaryButton}
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Booking..." : "Confirm booking"}
            </button>
          </aside>
        </div>
      </form>
    </CustomerPageShell>
  );
};

export default BookingPage;
