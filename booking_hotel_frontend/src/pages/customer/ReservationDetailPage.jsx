import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomerPageShell from "../../components/customer/CustomerPageShell/CustomerPageShell";
import StatusBadge from "../../components/common/StatusBadge/StatusBadge";
import customerBookingService from "../../services/customerBookingService";
import {
  formatCurrency,
  formatDateTime,
  getPageContent,
} from "../../utils/customerDataUtils";
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
        const response = await customerBookingService.searchReservations({
          bookingId,
        });
        setBooking(getPageContent(response)[0] || null);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load reservation details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <CustomerPageShell active="My Reservations">
        <section className={styles.panel}>
          <h2>Loading reservation...</h2>
        </section>
      </CustomerPageShell>
    );
  }

  if (error || !booking) {
    return (
      <CustomerPageShell active="My Reservations">
        <section className={styles.resultState}>
          <h1>Reservation not found</h1>
          <p>{error || "This reservation is not available."}</p>
          <a className={styles.primaryButton} href="/reservations">
            Back to reservations
          </a>
        </section>
      </CustomerPageShell>
    );
  }

  return (
    <CustomerPageShell active="My Reservations">
      <div className={styles.detailGrid}>
        <section className={styles.panel}>
          <div className={styles.contentTitle}>
            <div>
              <h1>Reservation details</h1>
              <p>Booking ID {booking.bookingId}</p>
            </div>
            <StatusBadge status={booking.bookingStatus} />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.panel}>
              <h2>Reservation information</h2>
              <ul className={styles.infoList}>
                <li>
                  <span>Room</span>
                  <strong>
                    {booking.roomType} {booking.roomNumber}
                  </strong>
                </li>
                <li>
                  <span>Check-in</span>
                  <strong>{formatDateTime(booking.checkInDate)}</strong>
                </li>
                <li>
                  <span>Check-out</span>
                  <strong>{formatDateTime(booking.checkOutDate)}</strong>
                </li>
                <li>
                  <span>Guests</span>
                  <strong>{booking.numGuests}</strong>
                </li>
                <li>
                  <span>Total amount</span>
                  <strong>{formatCurrency(booking.totalPrice)}</strong>
                </li>
              </ul>
            </div>
            <div className={styles.panel}>
              <h2>Customer information</h2>
              <ul className={styles.infoList}>
                <li>
                  <span>Full name</span>
                  <strong>{booking.fullName}</strong>
                </li>
                <li>
                  <span>Email</span>
                  <strong>{booking.email}</strong>
                </li>
                <li>
                  <span>Phone number</span>
                  <strong>{booking.phone}</strong>
                </li>
                <li>
                  <span>Payment</span>
                  <strong>{booking.paymentMethod}</strong>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <aside className={styles.summaryCard}>
          <h2>Status timeline</h2>
          <ul className={styles.timeline}>
            {[
              "Created",
              "Pending",
              "Confirmed",
              "Checked in",
              "Checked out",
            ].map((item) => (
              <li key={item}>
                <span className={styles.dot} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className={styles.buttonRow}>
            <a
              className={styles.primaryButton}
              href={`/payment/redirect?bookingId=${booking.bookingId}`}
            >
              Pay now
            </a>
            <button className={styles.dangerButton}>Cancel booking</button>
          </div>
        </aside>
      </div>
    </CustomerPageShell>
  );
};

export default ReservationDetailPage;
