import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Armchair, Bath, BedDouble, Lamp, Refrigerator, Sofa, Tv, Wifi } from "lucide-react";
import toast from "react-hot-toast";
import CustomerPageShell from "../../components/customer/CustomerPageShell/CustomerPageShell";
import Input from "../../components/common/Input/Input";
import RatingStars from "../../components/common/RatingStars/RatingStars";
import ReviewCard from "../../components/customer/ReviewCard/ReviewCard";
import StatusBadge from "../../components/common/StatusBadge/StatusBadge";
import useAuth from "../../hooks/useAuth";
import customerBookingService from "../../services/customerBookingService";
import { formatCurrency, getResponseData, toAbsoluteAssetUrl } from "../../utils/customerDataUtils";
import { getDefaultStayDateTimes } from "../../utils/dateInputUtils";
import styles from "./CustomerPages.module.css";

const getFurnitureIcon = (name = "") => {
  const value = name.toLowerCase();
  if (value.includes("bed") || value.includes("giuong")) return BedDouble;
  if (value.includes("sofa")) return Sofa;
  if (value.includes("tv") || value.includes("television")) return Tv;
  if (value.includes("bath") || value.includes("toilet")) return Bath;
  if (value.includes("fridge") || value.includes("refrigerator")) return Refrigerator;
  if (value.includes("wifi")) return Wifi;
  if (value.includes("lamp") || value.includes("light")) return Lamp;
  return Armchair;
};

const RoomDetailPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stayDates, setStayDates] = useState(() => getDefaultStayDateTimes());

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setError("");
        setLoading(true);
        const response = await customerBookingService.getRoomDetail(roomId);
        setRoom(getResponseData(response));
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải chi tiết phòng.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  if (loading) {
    return (
      <CustomerPageShell active="Rooms">
        <section className={styles.panel}><h2>Đang tải chi tiết phòng...</h2></section>
      </CustomerPageShell>
    );
  }

  if (error || !room) {
    return (
      <CustomerPageShell active="Rooms">
        <section className={styles.resultState}>
          <h1>Không tìm thấy phòng</h1>
          <p>{error || "Phòng đã chọn không tồn tại."}</p>
          <a className={styles.primaryButton} href="/rooms">Quay lại danh sách phòng</a>
        </section>
      </CustomerPageShell>
    );
  }

  const reviews = room.reviews || [];
  const features = room.features || [];
  const furniture = room.furniture || [];
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
      toast.error("Vui lòng đăng nhập để tiếp tục đặt phòng.");
      navigate(`/login?redirect=${encodeURIComponent(bookingPath)}`);
      return;
    }

    navigate(bookingPath);
  };

  return (
    <CustomerPageShell active="Rooms">
      <section className={styles.panel}>
        <h2>Chi tiết phòng</h2>
        <div className={styles.detailGrid}>
          <div>
            <img className={styles.heroImage} src={toAbsoluteAssetUrl(room.imagesUrl)} alt={`Phòng ${room.roomType}`} />
            <div className={styles.metaRow} style={{ marginTop: 16 }}>
              <StatusBadge status={room.status} />
              <RatingStars value={5} size={13} />
              <span>Sức chứa: {room.capacity} khách</span>
            </div>

            <h1>{room.roomType} phòng {room.roomNumber}</h1>
            <p>{room.description || "Chưa có mô tả."}</p>

            <div className={styles.metaRow}>
              {features.map((item) => (
                <StatusBadge key={item} status={item} />
              ))}
            </div>

            {furniture.length > 0 && (
              <section className={styles.panel} style={{ marginTop: 18 }}>
                <h2>Nội thất</h2>
                <ul className={styles.iconList}>
                  {furniture.map((item) => (
                    <li key={item.name}>
                      {(() => {
                        const Icon = getFurnitureIcon(item.name);
                        return <Icon size={18} />;
                      })()}
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className={styles.summaryCard}>
            <h2>Giá mỗi đêm</h2>
            <h1>{formatCurrency(room.price)}</h1>
            <ul className={styles.infoList}>
              <li><span>Số phòng</span><strong>{room.roomNumber}</strong></li>
              <li><span>Loại phòng</span><strong>{room.roomType}</strong></li>
              <li><span>Trạng thái</span><strong>{room.status}</strong></li>
            </ul>
            <div className={styles.bookingDateBox}>
              <Input
                label="Nhận phòng"
                name="checkIn"
                type="datetime-local"
                step="3600"
                value={stayDates.checkIn}
                onChange={handleStayDateChange}
                required
              />
              <Input
                label="Trả phòng"
                name="checkOut"
                type="datetime-local"
                step="3600"
                value={stayDates.checkOut}
                onChange={handleStayDateChange}
                required
              />
            </div>
            <button className={styles.primaryButton} type="button" onClick={handleBookRoom}>Đặt phòng</button>
          </aside>
        </div>
      </section>

      <section className={styles.panel} style={{ marginTop: 28 }}>
        <h2>Đánh giá công khai</h2>
        <div className={styles.reviewGrid}>
          {reviews.map((review, index) => (
            <ReviewCard
              key={`${review.comment}-${index}`}
              rating={review.rating}
              comment={review.comment}
              author="Khách hàng"
              date=""
            />
          ))}
        </div>
        {reviews.length === 0 && <p>Chưa có đánh giá.</p>}
      </section>
    </CustomerPageShell>
  );
};

export default RoomDetailPage;
