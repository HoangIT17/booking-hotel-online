import { useEffect, useState } from "react";
import { Calendar, MapPin, UsersRound } from "lucide-react";
import { useDispatch } from "react-redux";
import PublicNavbar from "../../components/common/PublicNavbar/PublicNavbar";
import SectionHeader from "../../components/common/SectionHeader/SectionHeader";
import HeroBanner from "../../components/customer/HeroBanner/HeroBanner";
import ReviewForm from "../../components/customer/ReviewForm/ReviewForm";
import RoomCard from "../../components/customer/RoomCard/RoomCard";
import SearchPanel, {
  SearchPanelField,
} from "../../components/customer/SearchPanel/SearchPanel";
import useAuth from "../../hooks/useAuth";
import { logoutThunk } from "../../redux/slices/authSlice";
import customerBookingService from "../../services/customerBookingService";
import {
  formatCurrency,
  getPageContent,
  toAbsoluteAssetUrl,
} from "../../utils/customerDataUtils";
import { getDefaultStayDates } from "../../utils/dateInputUtils";
import styles from "./HomePage.module.css";

const heroImage =
  "https://images.unsplash.com/photo-1771293549382-62829fad8f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1800";

const HomePage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, role } = useAuth();
  const isCustomer = isAuthenticated && role === "CUSTOMER";
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [search, setSearch] = useState(() => ({
    location: "",
    ...getDefaultStayDates(),
    numGuests: 1,
  }));

  useEffect(() => {
    const fetchFeaturedRooms = async () => {
      try {
        const response = await customerBookingService.searchRooms({ size: 3 });
        setFeaturedRooms(getPageContent(response));
      } catch {
        setFeaturedRooms([]);
      }
    };

    fetchFeaturedRooms();
  }, []);

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

  return (
    <div className={styles.page}>
      <PublicNavbar
        links={[
          { label: "Home", href: "/home", active: true },
          { label: "Rooms", href: "/rooms" },
          { label: "Offers", href: "/offers" },
          ...(isCustomer
            ? [{ label: "My Reservations", href: "/reservations" }]
            : []),
        ]}
        action={
          isCustomer
            ? { label: "Account", href: "/profile" }
            : { label: "Sign In", href: "/login" }
        }
        secondaryAction={
          isCustomer
            ? {
                label: "Logout",
                onClick: async () => {
                  await dispatch(logoutThunk());
                  window.location.href = "/home";
                },
              }
            : null
        }
      />

      <main className={styles.main}>
        <HeroBanner
          image={heroImage}
          alt="Khách sạn sang trọng hiện đại"
          title="Tìm kỳ nghỉ hoàn hảo với trải nghiệm sang trọng"
          description="Tận hưởng dịch vụ lưu trú đẳng cấp ngay giữa trung tâm thành phố. Đặt kỳ nghỉ mơ ước của bạn hôm nay."
        >
          <SearchPanel onSubmit={handleSubmit}>
            <SearchPanelField
              icon={Calendar}
              label="Nhận phòng"
              type="date"
              name="checkIn"
              value={search.checkIn}
              onChange={handleSearchChange}
            />
            <SearchPanelField
              icon={Calendar}
              label="Trả phòng"
              type="date"
              name="checkOut"
              value={search.checkOut}
              onChange={handleSearchChange}
            />
            <SearchPanelField
              icon={UsersRound}
              label="Số khách"
              name="numGuests"
              value={search.numGuests}
              onChange={handleSearchChange}
              options={[
                { value: 1, label: "1 khách" },
                { value: 2, label: "2 khách" },
                { value: 3, label: "3 khách" },
                { value: 4, label: "4 khách" },
              ]}
            />
          </SearchPanel>
        </HeroBanner>

        <section className={styles.section} id="rooms">
          <SectionHeader
            title="Phòng nổi bật"
            description="Những lựa chọn được đề xuất cho kỳ nghỉ thoải mái của bạn."
            actionLabel="Xem tất cả phòng"
            actionHref="#rooms"
          />

          <div className={styles.roomGrid}>
            {featuredRooms.map((room) => (
              <RoomCard
                key={room.roomId}
                image={toAbsoluteAssetUrl(room.imageUrl)}
                name={`${room.roomType} phòng ${room.roomNumber}`}
                formattedPrice={formatCurrency(room.price)}
                priceUnit="/ đêm"
                rating={room.averageRating?.toFixed?.(1) || "0"}
                amenities={[
                  room.roomType,
                  room.status,
                  `${room.capacity || 0} khách`,
                ]}
                onAction={() => {
                  window.location.href = `/rooms/${room.roomId}`;
                }}
              />
            ))}
          </div>
          {featuredRooms.length === 0 && (
            <section className={styles.publicReviews}>
              <h2>Chưa có phòng nổi bật</h2>
              <p>
                Phòng sẽ hiển thị tại đây khi backend trả về dữ liệu phòng còn
                trống.
              </p>
            </section>
          )}
        </section>

        <section className={styles.reviews}>
          <ReviewForm
            note="Hệ thống lưu thời gian đánh giá và hiển thị bình luận công khai."
            onSubmit={handleSubmit}
          />

          <div className={styles.publicReviews}>
            <h2>Đánh giá công khai</h2>
            <p>Danh sách đánh giá sẽ hiển thị khi có API đánh giá công khai.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
