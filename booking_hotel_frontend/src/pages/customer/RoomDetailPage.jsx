import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Armchair,
  Bath,
  BedDouble,
  Lamp,
  Refrigerator,
  Sofa,
  Tv,
  Wifi,
} from "lucide-react";
import toast from "react-hot-toast";
import CustomerPageShell from "../../components/customer/CustomerPageShell/CustomerPageShell";
import Input from "../../components/common/Input/Input";
import RatingStars from "../../components/common/RatingStars/RatingStars";
import ReviewCard from "../../components/customer/ReviewCard/ReviewCard";
import StatusBadge from "../../components/common/StatusBadge/StatusBadge";
import useAuth from "../../hooks/useAuth";
import customerBookingService from "../../services/customerBookingService";
import {
  formatCurrency,
  getRoomImageUrl,
  getResponseData,
} from "../../utils/customerDataUtils";
import {
  getDefaultStayDateTimes,
  toStayDateTimeInputValue,
} from "../../utils/dateInputUtils";
import styles from "./CustomerPages.module.css";

const getFurnitureIcon = (name = "") => {
  const value = String(name || "").toLowerCase();
  if (value.includes("bed") || value.includes("giuong")) return BedDouble;
  if (value.includes("sofa")) return Sofa;
  if (value.includes("tv") || value.includes("television")) return Tv;
  if (value.includes("bath") || value.includes("toilet")) return Bath;
  if (value.includes("fridge") || value.includes("refrigerator"))
    return Refrigerator;
  if (value.includes("wifi")) return Wifi;
  if (value.includes("lamp") || value.includes("light")) return Lamp;
  return Armchair;
};

const RoomDetailPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, role } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stayDates, setStayDates] = useState(() => {
    const defaults = getDefaultStayDateTimes();
    const checkInParam = searchParams.get("checkIn");
    const checkOutParam = searchParams.get("checkOut");
    return {
      checkIn: toStayDateTimeInputValue(checkInParam, "00:00") || defaults.checkIn,
      checkOut: toStayDateTimeInputValue(checkOutParam, "00:00") || defaults.checkOut,
    };
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setError("");
        setLoading(true);
        const response = await customerBookingService.getRoomDetail(roomId);
        const responseData = getResponseData(response);
        setRoom(responseData?.data ?? responseData);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load room details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  if (loading) {
    return (
      <CustomerPageShell active="Rooms">
        <section className={styles.panel}>
          <h2>Loading room details...</h2>
        </section>
      </CustomerPageShell>
    );
  }

  if (error || !room) {
    return (
      <CustomerPageShell active="Rooms">
        <section className={styles.resultState}>
          <h1>Room not found</h1>
          <p>{error || "The selected room does not exist."}</p>
          <a className={styles.primaryButton} href="/rooms">
            Back to room list
          </a>
        </section>
      </CustomerPageShell>
    );
  }

  const reviews = Array.isArray(room.reviews) ? room.reviews : [];
  const features = Array.isArray(room.features) ? room.features : [];
  const furniture = Array.isArray(room.furniture) ? room.furniture : [];
  const isCustomer = isAuthenticated && role?.toUpperCase() === "CUSTOMER";

  const handleStayDateChange = (event) => {
    const { name, value } = event.target;
    setStayDates((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookRoom = () => {
    const params = new URLSearchParams({
      roomId: room.roomId,
      checkIn: stayDates.checkIn,
      checkOut: stayDates.checkOut,
    });
    const bookingPath = `/booking?${params.toString()}`;

    if (!isCustomer) {
      toast.error("Please sign in to continue booking.");
      navigate(`/login?redirect=${encodeURIComponent(bookingPath)}`);
      return;
    }

    navigate(bookingPath);
  };

  return (
    <CustomerPageShell active="Rooms">
      <section className={styles.panel}>
        <h2>Room details</h2>
        <div className={styles.detailGrid}>
          <div>
            <img
              className={styles.heroImage}
              src={getRoomImageUrl(room)}
              alt={`${room.roomType} room`}
            />
            <div className={styles.metaRow} style={{ marginTop: 16 }}>
              <StatusBadge status={room.status} />
              <RatingStars value={5} size={13} />
              <span>Capacity: {room.capacity} guests</span>
            </div>

            <h1>
              {room.roomType} room {room.roomNumber}
            </h1>
            <p>{room.description || "No description yet."}</p>

            <div className={styles.metaRow}>
              {features.map((item) => (
                <StatusBadge key={item} status={item} />
              ))}
            </div>

            {furniture.length > 0 && (
              <section className={styles.panel} style={{ marginTop: 18 }}>
                <h2>Furniture</h2>
                <ul className={styles.iconList}>
                  {furniture.map((item, index) => (
                    <li key={item.name || item.id || `${roomId}-${index}`}>
                      {(() => {
                        const Icon = getFurnitureIcon(item.name);
                        return <Icon size={18} />;
                      })()}
                      <span>{item.name || "Furniture"}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className={styles.summaryCard}>
            <h2>Price per night</h2>
            <h1>{formatCurrency(room.price)}</h1>
            <ul className={styles.infoList}>
              <li>
                <span>Room number</span>
                <strong>{room.roomNumber}</strong>
              </li>
              <li>
                <span>Room type</span>
                <strong>{room.roomType}</strong>
              </li>
              <li>
                <span>Status</span>
                <strong>{room.status}</strong>
              </li>
            </ul>
            <div className={styles.bookingDateBox}>
              <Input
                label="Check-in"
                name="checkIn"
                type="datetime-local"
                step="3600"
                value={stayDates.checkIn}
                onChange={handleStayDateChange}
                required
              />
              <Input
                label="Check-out"
                name="checkOut"
                type="datetime-local"
                step="3600"
                value={stayDates.checkOut}
                onChange={handleStayDateChange}
                required
              />
            </div>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={handleBookRoom}
            >
              Book now
            </button>
          </aside>
        </div>
      </section>

      <section className={styles.panel} style={{ marginTop: 28 }}>
        <h2>Public reviews</h2>
        <div className={styles.reviewGrid}>
          {reviews.map((review, index) => (
            <ReviewCard
              key={`${review.comment}-${index}`}
              rating={review.rating}
              comment={review.comment}
              author="Customer"
              date=""
            />
          ))}
        </div>
        {reviews.length === 0 && <p>No reviews yet.</p>}
      </section>
    </CustomerPageShell>
  );
};

export default RoomDetailPage;
