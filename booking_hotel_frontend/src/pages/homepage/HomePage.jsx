import { useCallback, useEffect, useRef, useState } from "react";
import SectionHeader from "../../components/common/SectionHeader/SectionHeader";
import StaySearchForm from "../../components/common/StaySearchForm/StaySearchForm";
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";
import HeroBanner from "../../components/customer/HeroBanner/HeroBanner";
import ReviewCard from "../../components/customer/ReviewCard/ReviewCard";
import RoomCard from "../../components/customer/RoomCard/RoomCard";
import customerBookingService from "../../services/customerBookingService";
import {
  formatCurrency,
  formatDate,
  getPageContent,
  getRoomImageUrl,
} from "../../utils/customerDataUtils";
import { getDefaultStayDates } from "../../utils/dateInputUtils";
import styles from "./HomePage.module.css";

const heroImage =
  "https://images.unsplash.com/photo-1771293549382-62829fad8f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1800";

const HomePage = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [publicReviews, setPublicReviews] = useState([]);
  const [reviewPageInfo, setReviewPageInfo] = useState({
    currentPage: 0,
    totalPages: 0,
    last: true,
  });
  const [reviewSwipeDirection, setReviewSwipeDirection] = useState("next");
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const reviewsPanelRef = useRef(null);
  const reviewWheelLockRef = useRef(0);
  const [search, setSearch] = useState(() => ({
    location: "",
    ...getDefaultStayDates(),
    numGuests: 1,
  }));

  const normalizeReviews = (reviews) =>
    reviews
      .filter((review) => review.comment || review.rating)
      .map((review) => ({
        id: review.reviewId,
        rating: review.rating,
        comment: review.comment,
        author: review.username || "Customer",
        date: formatDate(review.createdAt),
      }));

  const fetchReviews = useCallback(async (page = 0, direction = "next") => {
    try {
      setReviewSwipeDirection(direction);
      setReviewsLoading(true);
      const response = await customerBookingService.getReviews({
        page,
        size: 3,
      });
      setPublicReviews(normalizeReviews(getPageContent(response)));
      setReviewPageInfo(
        response?.data || {
          currentPage: page,
          totalPages: 0,
          last: true,
        },
      );
    } catch {
      setPublicReviews([]);
      setReviewPageInfo({
        currentPage: 0,
        totalPages: 0,
        last: true,
      });
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const roomsResponse = await customerBookingService.searchRooms({
          size: 3,
        });
        const rooms = getPageContent(roomsResponse);
        setFeaturedRooms(rooms);
      } catch {
        setFeaturedRooms([]);
      }
    };

    fetchHomeData();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReviews(0, "next");
  }, [fetchReviews]);

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearch((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.checkIn) params.set("checkIn", search.checkIn);
    if (search.checkOut) params.set("checkOut", search.checkOut);
    if (search.numGuests) params.set("numGuests", search.numGuests);
    window.location.href = `/rooms?${params.toString()}`;
  };

  const handleReviewsWheel = useCallback(
    (event) => {
      if (Math.abs(event.deltaY) < 20) return;

      event.preventDefault();
      event.stopPropagation();

      if (reviewsLoading || reviewPageInfo.totalPages <= 1) return;

      const now = Date.now();
      if (now - reviewWheelLockRef.current < 450) return;
      reviewWheelLockRef.current = now;

      const direction = event.deltaY > 0 ? 1 : -1;
      const nextPage = reviewPageInfo.currentPage + direction;
      if (nextPage < 0 || nextPage >= reviewPageInfo.totalPages) return;

      fetchReviews(nextPage, direction > 0 ? "next" : "previous");
    },
    [
      fetchReviews,
      reviewPageInfo.currentPage,
      reviewPageInfo.totalPages,
      reviewsLoading,
    ],
  );

  useEffect(() => {
    const panel = reviewsPanelRef.current;
    if (!panel) return undefined;

    panel.addEventListener("wheel", handleReviewsWheel, { passive: false });
    return () => {
      panel.removeEventListener("wheel", handleReviewsWheel);
    };
  }, [handleReviewsWheel]);

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <HeroBanner
          image={heroImage}
          alt="Modern luxury hotel"
          title="Find the perfect stay with a luxury experience"
          description="Enjoy premium hospitality in the heart of the city. Book your dream stay today."
        >
          <StaySearchForm
            values={search}
            onChange={handleSearchChange}
            onSubmit={handleSubmit}
            guestLabel="Guests"
          />
        </HeroBanner>

        <section className={styles.section} id="rooms">
          <SectionHeader
            title="Featured rooms"
            description="Recommended options for a comfortable stay."
            actionLabel="View all rooms"
            actionHref="/rooms"
          />

          <div className={styles.roomGrid}>
            {featuredRooms.map((room) => (
              <RoomCard
                key={room.roomId}
                image={getRoomImageUrl(room)}
                name={`${room.roomType} room ${room.roomNumber}`}
                formattedPrice={formatCurrency(room.price)}
                priceUnit="/ night"
                rating={room.averageRating?.toFixed?.(1) || "0"}
                onAction={() => {
                  window.location.href = `/rooms/${room.roomId}`;
                }}
              />
            ))}
          </div>
          {featuredRooms.length === 0 && (
            <section className={styles.publicReviews}>
              <h2>No featured rooms yet</h2>
              <p>
                Rooms will appear here when the backend returns available room
                data.
              </p>
            </section>
          )}
        </section>

        <section className={styles.reviews}>
          <div className={styles.publicReviews} ref={reviewsPanelRef}>
            <h2>Public reviews</h2>
            {publicReviews.length > 0 ? (
              <div
                key={reviewPageInfo.currentPage}
                className={`${styles.reviewGrid} ${
                  reviewSwipeDirection === "next"
                    ? styles.reviewSwipeNext
                    : styles.reviewSwipePrevious
                }`}
              >
                {publicReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    rating={review.rating}
                    author={review.author}
                    comment={review.comment}
                    date={review.date}
                  />
                ))}
              </div>
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
