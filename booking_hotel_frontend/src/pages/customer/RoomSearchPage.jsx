import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CustomerPageShell from "../../components/customer/CustomerPageShell/CustomerPageShell";
import RoomFilterSidebar from "../../components/customer/RoomFilterSidebar/RoomFilterSidebar";
import RoomSearchHeader from "../../components/customer/RoomSearchHeader/RoomSearchHeader";
import RoomCard from "../../components/customer/RoomCard/RoomCard";
import customerBookingService from "../../services/customerBookingService";
import {
  formatCurrency,
  getPageContent,
  toAbsoluteAssetUrl,
} from "../../utils/customerDataUtils";
import { getDefaultStayDates } from "../../utils/dateInputUtils";
import styles from "./CustomerPages.module.css";

const createInitialFilters = () => ({
  ...getDefaultStayDates(),
  numGuests: 1,
  roomType: "",
  minPrice: "",
  maxPrice: "",
  minRating: "",
});

const RoomSearchPage = () => {
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
  const [pageInfo, setPageInfo] = useState({ totalElements: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchRooms(filters);
  };

  const fetchRooms = async (params) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== "" && value !== null && value !== undefined,
      ),
    );

    try {
      setError("");
      setLoading(true);
      const response = await customerBookingService.searchRooms(cleanParams);
      setRooms(getPageContent(response));
      setPageInfo(response?.data || { totalElements: 0 });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể tải danh sách phòng còn trống.",
      );
      setRooms([]);
      setPageInfo({ totalElements: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(filtersFromUrl);
  }, []);

  return (
    <CustomerPageShell active="Rooms">
      <RoomSearchHeader
        values={filters}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <div className={styles.layout}>
        <RoomFilterSidebar
          values={filters}
          onChange={handleChange}
          onReset={() => setFilters(createInitialFilters())}
          onSubmit={handleSubmit}
        />

        <section>
          <div className={styles.pageHeader}>
            <div>
              <h1>{pageInfo.totalElements || rooms.length} phòng còn trống</h1>
            </div>
            <div className={styles.buttonRow}>
              <button className={styles.secondaryButton}>Sắp xếp</button>
              <button className={styles.secondaryButton}>Gợi ý AI</button>
            </div>
          </div>

          <div className={`${styles.grid} ${styles.roomsGrid}`}>
            {rooms.map((room) => (
              <RoomCard
                key={room.roomId}
                image={toAbsoluteAssetUrl(room.imageUrl)}
                name={`${room.roomType} phòng ${room.roomNumber}`}
                description={`Sức chứa ${room.capacity || 0} khách`}
                formattedPrice={formatCurrency(room.price)}
                priceUnit="/ đêm"
                rating={room.averageRating?.toFixed?.(1) || "0"}
                reviewCount={0}
                amenities={[
                  room.roomType,
                  room.status,
                  `${room.capacity || 0} khách`,
                ]}
                actionLabel="Xem chi tiết"
                onAction={() => {
                  window.location.href = `/rooms/${room.roomId}`;
                }}
              />
            ))}
          </div>
          {!loading && rooms.length === 0 && (
            <section className={styles.panel} style={{ marginTop: 18 }}>
              <h2>Không có phòng trống</h2>
              <p>
                {error ||
                  "Hãy thử đổi ngày, loại phòng, khoảng giá, số khách hoặc đánh giá."}
              </p>
            </section>
          )}
        </section>
      </div>
    </CustomerPageShell>
  );
};

export default RoomSearchPage;
