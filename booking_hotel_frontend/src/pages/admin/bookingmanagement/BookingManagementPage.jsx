import { useEffect, useState } from "react";
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

const toInputDateTime = (value) => value?.slice?.(0, 16) || "";
const PAGE_SIZE = 10;

const BookingManagementPage = () => {
  const [bookings, setBookings] = useState([]);
  const [pageInfo, setPageInfo] = useState({ currentPage: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState({
    bookingId: "",
    checkIn: "",
    checkOut: "",
    bookingStatus: "PENDING",
  });

  const fetchBookings = async (page = 0) => {
    try {
      setLoading(true);
      const response = await managementService.searchBookings({ page, size: PAGE_SIZE });
      setBookings(getPageContent(response));
      setPageInfo(response?.data || { currentPage: page, totalPages: 0 });
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBookings(0);
  }, []);

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
      fetchBookings(pageInfo.currentPage);
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
        <button className={styles.secondaryButton} type="button" onClick={() => fetchBookings(pageInfo.currentPage)}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
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
          <button type="button" disabled={pageInfo.currentPage <= 0} onClick={() => fetchBookings(pageInfo.currentPage - 1)}>
            {"<"}
          </button>
          <button type="button" className={styles.activePage}>
            {pageInfo.currentPage + 1}
          </button>
          <button type="button" disabled={pageInfo.currentPage >= pageInfo.totalPages - 1} onClick={() => fetchBookings(pageInfo.currentPage + 1)}>
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
