import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import managementService from "../../../services/managementService";
import {
  formatCurrency,
  formatDateTime,
  getPageContent,
} from "../../../utils/customerDataUtils";
import styles from "./ManagementPages.module.css";

const BOOKING_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
  "REFUNDED",
];
const ROOM_STATUSES = ["READY", "OCCUPIED", "CLEANING", "MAINTAIN", "DIRTY"];
const PAYMENT_METHODS = ["BANK", "WALLET", "CASH"];

const toInputDateTime = (value) => value?.slice?.(0, 16) || "";
const PAGE_SIZE = 10;

const emptyFilters = {
  bookingId: "",
  customerName: "",
  roomNumber: "",
  checkIn: "",
  checkOut: "",
  roomStatus: "",
  bookingStatus: "",
  paymentMethod: "",
};

const BookingManagementPage = () => {
  const [bookings, setBookings] = useState([]);
  const [pageInfo, setPageInfo] = useState({ currentPage: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [filters, setFilters] = useState(emptyFilters);
  const [form, setForm] = useState({
    bookingId: "",
    checkIn: "",
    checkOut: "",
    bookingStatus: "PENDING",
  });

  const buildParams = (page, f) => {
    const params = { page, size: PAGE_SIZE };
    if (f.bookingId) params.bookingId = Number(f.bookingId);
    if (f.customerName) params.customerName = f.customerName;
    if (f.roomNumber) params.roomNumber = f.roomNumber;
    if (f.checkIn) params.checkIn = f.checkIn + ":00";
    if (f.checkOut) params.checkOut = f.checkOut + ":00";
    if (f.roomStatus) params.roomStatus = f.roomStatus;
    if (f.bookingStatus) params.bookingStatus = f.bookingStatus;
    if (f.paymentMethod) params.paymentMethod = f.paymentMethod;
    return params;
  };

  const fetchBookings = async (page = 0, currentFilters = filters) => {
    try {
      setLoading(true);
      const response = await managementService.searchBookings(buildParams(page, currentFilters));
      setBookings(getPageContent(response));
      setPageInfo(response?.data || { currentPage: page, totalPages: 0 });
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const skipDebounce = useRef(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBookings(0, emptyFilters);
  }, []);

  useEffect(() => {
    if (skipDebounce.current) {
      skipDebounce.current = false;
      return;
    }
    const timer = setTimeout(() => fetchBookings(0, filters), 500);
    return () => clearTimeout(timer);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    skipDebounce.current = true;
    setFilters(emptyFilters);
    fetchBookings(0, emptyFilters);
  };

  const openEdit = (booking) => {
    setEditing(booking);
    setForm({
      bookingId: booking.bookingId,
      checkIn: toInputDateTime(booking.checkInDate),
      checkOut: toInputDateTime(booking.checkOutDate),
      bookingStatus: booking.bookingStatus || "PENDING",
    });
  };

  const closeEdit = () => setEditing(null);
  const closeView = () => setViewing(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await managementService.updateBooking({
        bookingId: Number(form.bookingId),
        checkIn: form.checkIn || null,
        checkOut: form.checkOut || null,
        bookingStatus: form.bookingStatus || null,
      });
      toast.success("Booking updated successfully");
      closeEdit();
      fetchBookings(pageInfo.currentPage, filters);
    } catch {
      // axiosInstance shows API errors globally.
    }
  };

  const emptyRows = Math.max(PAGE_SIZE - bookings.length, 0);

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1>Booking Management</h1>
          <p>Receptionist, Manager, and Admin can update check-in, check-out, and booking status.</p>
        </div>
        <button className={styles.secondaryButton} type="button" onClick={() => fetchBookings(pageInfo.currentPage, filters)}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.field}>
          <label>Booking ID</label>
          <input
            type="number"
            name="bookingId"
            value={filters.bookingId}
            onChange={handleFilterChange}
            placeholder="ID..."
          />
        </div>
        <div className={styles.field}>
          <label>Tên khách hàng</label>
          <input
            type="text"
            name="customerName"
            value={filters.customerName}
            onChange={handleFilterChange}
            placeholder="Tên..."
          />
        </div>
        <div className={styles.field}>
          <label>Số phòng</label>
          <input
            type="text"
            name="roomNumber"
            value={filters.roomNumber}
            onChange={handleFilterChange}
            placeholder="P101..."
          />
        </div>
        <div className={styles.field}>
          <label>Check-in từ</label>
          <input
            type="datetime-local"
            name="checkIn"
            value={filters.checkIn}
            onChange={handleFilterChange}
          />
        </div>
        <div className={styles.field}>
          <label>Check-out đến</label>
          <input
            type="datetime-local"
            name="checkOut"
            value={filters.checkOut}
            onChange={handleFilterChange}
          />
        </div>
        <div className={styles.field}>
          <label>Trạng thái phòng</label>
          <select name="roomStatus" value={filters.roomStatus} onChange={handleFilterChange}>
            <option value="">Tất cả</option>
            {ROOM_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label>Trạng thái booking</label>
          <select name="bookingStatus" value={filters.bookingStatus} onChange={handleFilterChange}>
            <option value="">Tất cả</option>
            {BOOKING_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label>Thanh toán</label>
          <select name="paymentMethod" value={filters.paymentMethod} onChange={handleFilterChange}>
            <option value="">Tất cả</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterActions}>
          <button className={styles.secondaryButton} type="button" onClick={handleReset} disabled={loading}>
            Xóa filter
          </button>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.bookingId}>
                <td>{booking.bookingId}</td>
                <td>{booking.fullName}</td>
                <td>{booking.roomNumber}</td>
                <td>{formatDateTime(booking.checkInDate)}</td>
                <td>{formatDateTime(booking.checkOutDate)}</td>
                <td>{booking.paymentMethod}</td>
                <td>{formatCurrency(booking.totalPrice)}</td>
                <td>{booking.bookingStatus}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.secondaryButton} type="button" onClick={() => setViewing(booking)}>
                      View
                    </button>
                    <button className={styles.secondaryButton} type="button" onClick={() => openEdit(booking)}>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {Array.from({ length: emptyRows }, (_, index) => (
              <tr key={`empty-booking-row-${index}`} aria-hidden="true">
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageInfo.totalPages > 0 && (
        <div className={styles.pagination}>
          <button type="button" disabled={pageInfo.currentPage <= 0} onClick={() => fetchBookings(pageInfo.currentPage - 1, filters)}>
            {"<"}
          </button>
          <button type="button" className={styles.activePage}>
            {pageInfo.currentPage + 1}
          </button>
          <button type="button" disabled={pageInfo.currentPage >= pageInfo.totalPages - 1} onClick={() => fetchBookings(pageInfo.currentPage + 1, filters)}>
            {">"}
          </button>
        </div>
      )}

      {editing && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Edit booking #{editing.bookingId}</h2>
              <button type="button" onClick={closeEdit}>x</button>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label>Check-in</label>
                <input
                  type="datetime-local"
                  value={form.checkIn}
                  onChange={(event) => setForm((prev) => ({ ...prev, checkIn: event.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>Check-out</label>
                <input
                  type="datetime-local"
                  value={form.checkOut}
                  onChange={(event) => setForm((prev) => ({ ...prev, checkOut: event.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>Booking status</label>
                <select
                  value={form.bookingStatus}
                  onChange={(event) => setForm((prev) => ({ ...prev, bookingStatus: event.target.value }))}
                >
                  {BOOKING_STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className={styles.modalActions}>
                <button className={styles.secondaryButton} type="button" onClick={closeEdit}>Cancel</button>
                <button className={styles.primaryButton} type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewing && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Booking details #{viewing.bookingId}</h2>
              <button type="button" onClick={closeView}>x</button>
            </div>
            <div className={styles.form}>
              {Object.entries(viewing).map(([key, value]) => (
                <div key={key} className={styles.field}>
                  <label>{key}</label>
                  <input value={value == null ? "-" : String(value)} readOnly />
                </div>
              ))}
              <div className={styles.modalActions}>
                <button className={styles.secondaryButton} type="button" onClick={closeView}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagementPage;
