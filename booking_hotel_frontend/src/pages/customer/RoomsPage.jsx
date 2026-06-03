import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import StaySearchForm from "../../components/common/StaySearchForm/StaySearchForm";
import CustomerPageShell from "../../components/customer/CustomerPageShell/CustomerPageShell";
import RoomFilterSidebar from "../../components/customer/RoomFilterSidebar/RoomFilterSidebar";
import RoomCard from "../../components/customer/RoomCard/RoomCard";
import customerBookingService from "../../services/customerBookingService";
import {
  formatCurrency,
  getPageContent,
  getRoomImageUrl,
} from "../../utils/customerDataUtils";
import { getDefaultStayDates } from "../../utils/dateInputUtils";
import styles from "./CustomerPages.module.css";

const ROOMS_PAGE_SIZE = 4;

const createInitialFilters = () => ({
  ...getDefaultStayDates(),
  numGuests: 1,
  roomType: "",
  minPrice: "",
  maxPrice: "",
  minRating: "",
});

const RoomsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialFilters = createInitialFilters();
  const filtersFromUrl = {
    ...initialFilters,
    checkIn: searchParams.get("checkIn") || initialFilters.checkIn,
    checkOut: searchParams.get("checkOut") || initialFilters.checkOut,
    numGuests: searchParams.get("numGuests") || 1,
    roomType: searchParams.get("roomType") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minRating: searchParams.get("minRating") || "",
  };
  const [filters, setFilters] = useState(filtersFromUrl);
  const [rooms, setRooms] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    pageSize: ROOMS_PAGE_SIZE,
    totalElements: 0,
    totalPages: 0,
    last: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPages =
    pageInfo.totalPages ||
    Math.ceil((pageInfo.totalElements || 0) / (pageInfo.pageSize || ROOMS_PAGE_SIZE)) ||
    (rooms.length > 0 ? 1 : 0);
  const currentPage = pageInfo.currentPage || 0;

  const fetchRooms = async (params, page = 0) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== "" && value !== null && value !== undefined,
      ),
    );

    try {
      setError("");
      setLoading(true);
      const response = await customerBookingService.searchRooms({
        ...cleanParams,
        page,
        size: ROOMS_PAGE_SIZE,
      });
      setRooms(getPageContent(response));
      setPageInfo(response?.data || {
        currentPage: page,
        pageSize: ROOMS_PAGE_SIZE,
        totalElements: 0,
        totalPages: 0,
        last: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load available rooms.",
      );
      setRooms([]);
      setPageInfo({
        currentPage: 0,
        pageSize: ROOMS_PAGE_SIZE,
        totalElements: 0,
        totalPages: 0,
        last: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRooms(filtersFromUrl, 0);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchRooms(filters, 0);
  };

  const handleReset = () => {
    const nextFilters = createInitialFilters();
    setFilters(nextFilters);
    fetchRooms(nextFilters, 0);
  };

  const handlePageChange = (page) => {
    if (loading || page < 0 || page >= totalPages || page === currentPage) {
      return;
    }
    fetchRooms(filters, page);
  };

  const openRoomDetail = (roomId) => {
    const params = new URLSearchParams();
    if (filters.checkIn) params.set("checkIn", filters.checkIn);
    if (filters.checkOut) params.set("checkOut", filters.checkOut);

    const queryString = params.toString();
    navigate(`/rooms/${roomId}${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <CustomerPageShell active="Rooms">
      <section className={styles.roomSearchHero}>
        <h1>Find the perfect room for your vacation.</h1>
        <div className={styles.roomSearchWrap}>
          <StaySearchForm
            values={filters}
            onChange={handleChange}
            onSubmit={handleSubmit}
            guestLabel="Guests"
          />
        </div>
      </section>

      <div className={styles.layout}>
        <RoomFilterSidebar
          values={filters}
          onChange={handleChange}
          onReset={handleReset}
          onSubmit={handleSubmit}
        />

        <section>
          <div className={styles.contentTitle}>
            <div>
              <h1>{pageInfo.totalElements || rooms.length} rooms Available</h1>
            </div>
            <div className={styles.buttonRow}>
              <button className={styles.secondaryButton}>
                AI recommendations
              </button>
            </div>
          </div>

          <div className={`${styles.grid} ${styles.roomsGrid}`}>
            {rooms.map((room) => (
              <RoomCard
                key={room.roomId}
                image={getRoomImageUrl(room)}
                name={`ROOM${room.roomNumber}`}
                description={room.description}
                formattedPrice={formatCurrency(room.price)}
                priceUnit="/ night"
                rating={room.averageRating?.toFixed?.(1) || "0"}
                reviewCount={0}
                actionLabel="View details"
                onAction={() => openRoomDetail(room.roomId)}
              />
            ))}
          </div>

          {totalPages > 0 && (
            <nav className={styles.pagination} aria-label="Room pages">
              <button
                type="button"
                className={styles.paginationButton}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={loading || currentPage <= 0}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${styles.paginationButton} ${
                    index === currentPage ? styles.paginationButtonActive : ""
                  }`}
                  onClick={() => handlePageChange(index)}
                  disabled={loading}
                  aria-current={index === currentPage ? "page" : undefined}
                >
                  {index + 1}
                </button>
              ))}
              <button
                type="button"
                className={styles.paginationButton}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={loading || currentPage >= totalPages - 1}
              >
                Next
              </button>
            </nav>
          )}

          {!loading && rooms.length === 0 && (
            <section className={styles.panel} style={{ marginTop: 18 }}>
              <h2>No rooms are currently available</h2>
              <p>
                {error ||
                  "Try changing the dates, room type, price range, guest count, or rating."}
              </p>
            </section>
          )}
        </section>
      </div>
    </CustomerPageShell>
  );
};

export default RoomsPage;
