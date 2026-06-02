import { Fragment, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import CustomerPageShell from "../../components/customer/CustomerPageShell/CustomerPageShell";
import Input from "../../components/common/Input/Input";
import StatusBadge from "../../components/common/StatusBadge/StatusBadge";
import customerBookingService from "../../services/customerBookingService";
import {
  formatCurrency,
  formatDateTime,
  getPageContent,
} from "../../utils/customerDataUtils";
import styles from "./CustomerPages.module.css";

const READ_ONLY_BOOKING_STATUSES = ["CANCELLED", "CONFIRMED"];
const REVIEWABLE_BOOKING_STATUSES = ["CHECKED_OUT", "CHECKOUT", "CHECKEDOUT"];

const getEditFormFromBooking = (booking) => ({
  bookingId: booking?.bookingId || "",
  checkIn: booking?.checkInDate || "",
  checkOut: booking?.checkOutDate || "",
  paymentMethod: booking?.paymentMethod || "WALLET",
});

const ReservationsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    last: true,
  });
  const [selected, setSelected] = useState(null);
  const [actionPanelOpen, setActionPanelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [editForm, setEditForm] = useState({
    bookingId: "",
    checkIn: "",
    checkOut: "",
    paymentMethod: "",
  });

  const fetchBookings = async (page = 0) => {
    try {
      setLoading(true);
      const response = await customerBookingService.searchReservations({ page });
      const content = getPageContent(response);
      setBookings(content);
      setPageInfo(response?.data || {
        currentPage: page,
        totalPages: 0,
        totalElements: 0,
        last: true,
      });
      setActionPanelOpen(false);
      if (content.length > 0) {
        setSelected(content[0]);
        setEditForm(getEditFormFromBooking(content[0]));
      } else {
        setSelected(null);
        setEditForm(getEditFormFromBooking(null));
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to load reservations.",
      );
      setBookings([]);
      setPageInfo({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        last: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBookings(0);
  }, []);

  const handlePageChange = (page) => {
    const totalPages = pageInfo.totalPages || 0;
    if (loading || page < 0 || page >= totalPages || page === pageInfo.currentPage) {
      return;
    }
    fetchBookings(page);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleBookingActions = (booking) => {
    const isSameBooking = selected?.bookingId === booking.bookingId;
    setSelected(booking);
    setEditForm(getEditFormFromBooking(booking));
    setActionPanelOpen((prev) => (isSameBooking ? !prev : true));
  };

  const handleUpdate = async () => {
    try {
      await customerBookingService.updateReservation({
        bookingId: Number(editForm.bookingId),
        checkIn: editForm.checkIn || null,
        checkOut: editForm.checkOut || null,
        paymentMethod: editForm.paymentMethod || null,
      });
      toast.success("Reservation updated successfully");
      fetchBookings(pageInfo.currentPage);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to update reservation.",
      );
    }
  };

  const handlePay = () => {
    setPaying(true);
    window.location.href = `/payment/redirect?bookingId=${editForm.bookingId}`;
  };

  const handleCancel = async () => {
    if (!selected) return;
    try {
      await customerBookingService.updateReservation({
        bookingId: Number(selected.bookingId),
        bookingStatus: "CANCELLED",
      });
      toast.success("Reservation cancelled successfully");
      setActionPanelOpen(false);
      fetchBookings(pageInfo.currentPage);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to cancel reservation.",
      );
    }
  };

  const openReviewModal = (booking) => {
    setReviewTarget(booking);
    setReviewForm({ rating: 5, comment: "" });
  };

  const closeReviewModal = () => {
    setReviewTarget(null);
    setReviewForm({ rating: 5, comment: "" });
  };

  const handleReviewChange = (event) => {
    const { name, value } = event.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!reviewTarget) return;

    try {
      setReviewSubmitting(true);
      const response = await customerBookingService.createReview({
        bookingId: Number(reviewTarget.bookingId),
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment || null,
      });
      toast.success(response?.data?.message || "Review submitted successfully");
      closeReviewModal();
    } catch {
      // axiosInstance already shows API errors globally.
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <CustomerPageShell active="My Reservations">
      <section className={`${styles.panel} ${styles.reservationsNoMotion}`}>
        <div className={styles.contentTitle}>
          <div>
            <h1>My reservations</h1>
            <p>Track booking IDs, rooms, total amounts, and statuses.</p>
          </div>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() => fetchBookings(pageInfo.currentPage)}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

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
            {bookings.map((booking) => {
              const isExpanded =
                actionPanelOpen && selected?.bookingId === booking.bookingId;
              const isReadOnlyBooking = READ_ONLY_BOOKING_STATUSES.includes(
                booking.bookingStatus?.toUpperCase?.(),
              );
              const paymentMethod = booking.paymentMethod?.toUpperCase?.();
              const shouldShowPaymentButton =
                isExpanded &&
                !isReadOnlyBooking &&
                (paymentMethod === "WALLET" || paymentMethod === "VNPAY");
              const canReview = REVIEWABLE_BOOKING_STATUSES.includes(
                booking.bookingStatus?.toUpperCase?.(),
              );

              return (
                <Fragment key={booking.bookingId}>
                  <tr>
                    <td>{booking.bookingId}</td>
                    <td>{booking.fullName}</td>
                    <td>{booking.roomNumber}</td>
                    <td>{formatDateTime(booking.checkInDate)}</td>
                    <td>{formatDateTime(booking.checkOutDate)}</td>
                    <td>{booking.paymentMethod}</td>
                    <td>{formatCurrency(booking.totalPrice)}</td>
                    <td>
                      <StatusBadge status={booking.bookingStatus} />
                    </td>
                    <td>
                      <div className={styles.tableActionGroup}>
                        <button
                          className={`${styles.iconButton} ${
                            isExpanded ? styles.iconButtonOpen : ""
                          }`}
                          type="button"
                          onClick={() => toggleBookingActions(booking)}
                          aria-label="Open booking actions"
                          aria-expanded={isExpanded}
                        >
                          <ChevronDown size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr>
                      <td className={styles.expandedTableCell} colSpan={9}>
                        <section
                          className={`${styles.panel} ${styles.bookingActionPanel}`}
                        >
                          <div className={styles.actionPanelHeader}>
                            <div>
                              <h2>
                                {isReadOnlyBooking
                                  ? "Reservation information"
                                  : "Booking actions"}
                              </h2>
                              <p>
                                If you change the payment method, save changes
                                before continuing payment.
                              </p>
                              {isReadOnlyBooking && (
                                <p className={styles.readOnlyNotice}>
                                  Cancelled or confirmed bookings can only be
                                  viewed.
                                </p>
                              )}
                            </div>
                          </div>

                          <div className={styles.formGrid}>
                            <Input
                              label="Check-in date"
                              name="checkIn"
                              type="datetime-local"
                              value={editForm.checkIn?.slice?.(0, 16) || ""}
                              onChange={handleEditChange}
                              disabled={isReadOnlyBooking}
                            />
                            <Input
                              label="Check-out date"
                              name="checkOut"
                              type="datetime-local"
                              value={editForm.checkOut?.slice?.(0, 16) || ""}
                              onChange={handleEditChange}
                              disabled={isReadOnlyBooking}
                            />
                            <select
                              className={styles.select}
                              name="paymentMethod"
                              value={editForm.paymentMethod}
                              onChange={handleEditChange}
                              disabled={isReadOnlyBooking}
                            >
                              <option value="WALLET">WALLET / VNPAY</option>
                              <option value="CASH">CASH</option>
                            </select>
                          </div>

                          <div className={styles.buttonRow}>
                            <button
                              className={styles.secondaryButton}
                              type="button"
                              onClick={() => setActionPanelOpen(false)}
                            >
                              Close
                            </button>
                            {!isReadOnlyBooking && (
                              <button
                                className={styles.primaryButton}
                                type="button"
                                onClick={handleUpdate}
                              >
                                Save changes
                              </button>
                            )}
                            {shouldShowPaymentButton && (
                              <button
                                className={styles.paymentButton}
                                type="button"
                                onClick={handlePay}
                                disabled={paying}
                              >
                                {paying ? "Redirecting payment..." : "Pay"}
                              </button>
                            )}
                            {!isReadOnlyBooking && (
                              <button
                                className={styles.dangerButton}
                                type="button"
                                onClick={handleCancel}
                              >
                                Cancel booking
                              </button>
                            )}
                            {canReview && (
                              <button
                                className={styles.reviewButton}
                                type="button"
                                onClick={() => openReviewModal(booking)}
                              >
                                Write a review
                              </button>
                            )}
                          </div>
                        </section>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
        {!loading && bookings.length === 0 && <p>No reservations yet.</p>}
        {pageInfo.totalPages > 1 && (
          <nav className={styles.pagination} aria-label="Reservations pages">
            <button
              type="button"
              className={styles.paginationButton}
              onClick={() => handlePageChange(pageInfo.currentPage - 1)}
              disabled={loading || pageInfo.currentPage <= 0}
            >
              Previous
            </button>
            {Array.from({ length: pageInfo.totalPages }, (_, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.paginationButton} ${
                  index === pageInfo.currentPage ? styles.paginationButtonActive : ""
                }`}
                onClick={() => handlePageChange(index)}
                disabled={loading}
                aria-current={index === pageInfo.currentPage ? "page" : undefined}
              >
                {index + 1}
              </button>
            ))}
            <button
              type="button"
              className={styles.paginationButton}
              onClick={() => handlePageChange(pageInfo.currentPage + 1)}
              disabled={loading || pageInfo.last}
            >
              Next
            </button>
          </nav>
        )}
      </section>

      {reviewTarget && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <form className={styles.reviewModal} onSubmit={handleReviewSubmit}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Write a review</h2>
                <p>Booking #{reviewTarget.bookingId}</p>
              </div>
              <button type="button" onClick={closeReviewModal}>
                x
              </button>
            </div>

            <label className={styles.modalField}>
              <span>Rating</span>
              <select
                className={styles.select}
                name="rating"
                value={reviewForm.rating}
                onChange={handleReviewChange}
                required
              >
                <option value={5}>5 stars</option>
                <option value={4}>4 stars</option>
                <option value={3}>3 stars</option>
                <option value={2}>2 stars</option>
                <option value={1}>1 star</option>
              </select>
            </label>

            <label className={styles.modalField}>
              <span>Comment</span>
              <textarea
                className={styles.textarea}
                name="comment"
                value={reviewForm.comment}
                onChange={handleReviewChange}
                placeholder="Share your experience..."
              />
            </label>

            <div className={styles.buttonRow}>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={closeReviewModal}
              >
                Close
              </button>
              <button
                className={styles.primaryButton}
                type="submit"
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? "Submitting..." : "Submit review"}
              </button>
            </div>
          </form>
        </div>
      )}
    </CustomerPageShell>
  );
};

export default ReservationsPage;
