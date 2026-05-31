import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import styles from "./RoomDetail.module.css";

// 1. Cấu hình URL gốc của Backend (nơi lưu trữ thư mục ảnh của Spring Boot)
// Thay đổi cổng 8082 hoặc đường dẫn "/uploads/" nếu cấu hình thực tế của bạn có khác biệt
const IMAGE_BASE_URL = "http://localhost:8082";

const RoomDetail = () => {
  const { roomNumber } = useParams(); // Lấy số phòng từ URL (vd: /staff/room-detail/101)
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!roomNumber) return;

    // Gọi API Backend theo endpoint lấy chi tiết phòng
    axiosInstance
      .get(`/staff/rooms/${roomNumber}`)
      .then((response) => {
        // Hỗ trợ bóc tách nếu có bọc dữ liệu .data
        const resData = response.data?.data || response.data || response;
        setRoom(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy chi tiết phòng:", err);
        setError("Không thể tải thông tin chi tiết của phòng này.");
        setLoading(false);
      });
  }, [roomNumber]);

  // Định dạng hiển thị tiền tệ
  const formatPrice = (price) => {
    if (!price) return "0 đ";
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  // Áp dụng class CSS Badge trạng thái phòng
  const getRoomStatusClass = (status) => {
    if (!status) return styles.badgeDefault;
    switch (status.toUpperCase()) {
      case "READY":
        return styles.badgeReady;
      case "OCCUPIED":
        return styles.badgeOccupied;
      case "CLEANING":
        return styles.badgeCleaning;
      case "MAINTAIN":
        return styles.badgeMaintain;
      case "DIRTY":
        return styles.badgeDirty;
      default:
        return styles.badgeDefault;
    }
  };

  // Định dạng badge trạng thái thiết bị nội thất (FIXING, PENDING, FIXED)
  const getFurnitureBadgeClass = (status) => {
    if (!status) return styles.furnDefault;
    switch (status.toUpperCase()) {
      case "FIXED":
        return styles.furnFixed;
      case "PENDING":
        return styles.furnPending;
      case "FIXING":
        return styles.furnFixing;
      default:
        return styles.furnDefault;
    }
  };

  const getFurnitureStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case "FIXED":
        return "Hoạt động tốt";
      case "PENDING":
        return "Chờ xử lý";
      case "FIXING":
        return "Đang sửa chữa";
      default:
        return status || "Chưa rõ";
    }
  };

  if (loading)
    return (
      <div className={styles.centerText}>
        Đang tải thông tin chi tiết phòng...
      </div>
    );
  if (error)
    return (
      <div className={styles.errorText}>
        {error} <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  if (!room)
    return (
      <div className={styles.centerText}>Không tìm thấy dữ liệu phòng.</div>
    );

  return (
    <div className={styles.detailContainer}>
      {/* Nút quay lại */}
      <div className={styles.headerActions}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Quay lại danh sách
        </button>
        <h2>Chi Tiết Phòng {room.roomNumber}</h2>
      </div>

      <div className={styles.mainGrid}>
        {/* KHỐI 1: THÔNG TIN CHUNG & HÌNH ẢNH */}
        <div className={styles.card}>
          <div className={styles.imageWrapper}>
            {/* 2. Đã sửa đổi logic hiển thị ảnh và thêm onError */}
            <img
              src={
                room.imageUrl
                  ? room.imageUrl.startsWith("http")
                    ? room.imageUrl
                    : `${IMAGE_BASE_URL}${room.imageUrl}`
                  : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' font-family='sans-serif' font-size='18' fill='%23666' dominant-baseline='middle' text-anchor='middle'>Chua co anh</text></svg>"
              }
              alt={`Phòng ${room.roomNumber}`}
              className={styles.roomImage}
              onError={(e) => {
                // BƯỚC QUAN TRỌNG: Gỡ bỏ onError để chặn đứng vòng lặp vô hạn ngay lập tức
                e.target.onerror = null;

                // Thay thế bằng một SVG dạng chuỗi nội tại, không cần gọi ra Internet (tránh ERR_CONNECTION_CLOSED)
                e.target.src =
                  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect width='100%' height='100%' fill='%23ffebee'/><text x='50%' y='50%' font-family='sans-serif' font-size='18' fill='%23c62828' dominant-baseline='middle' text-anchor='middle'>Loi load anh phong</text></svg>";
              }}
            />
          </div>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Trạng thái phòng:</span>
              <span
                className={`${styles.statusBadge} ${getRoomStatusClass(room.status)}`}
              >
                {room.status === "READY"
                  ? "Sẵn sàng"
                  : room.status === "DIRTY"
                    ? "Bẩn (Cần dọn)"
                    : room.status}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Loại phòng:</span>
              <strong className={styles.value}>{room.roomType}</strong>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Vị trí:</span>
              <span className={styles.value}>Tầng {room.floor}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Giá phòng:</span>
              <span className={styles.priceValue}>
                {formatPrice(room.price)}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Diện tích:</span>
              <span className={styles.value}>{room.area} m²</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Sức chứa tối đa:</span>
              <span className={styles.value}>{room.maxPeople} người</span>
            </div>
            {room.description && (
              <div className={styles.descBox}>
                <span className={styles.label}>Mô tả chi tiết:</span>
                <p className={styles.descText}>{room.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* KHỐI 2: DANH SÁCH THIẾT BỊ NỘI THẤT */}
        <div className={styles.card}>
          <h3>🛋️ Danh Sách Thiết Bị & Tiện Nghi</h3>
          {room.furnitures && room.furnitures.length === 0 ? (
            <p className={styles.emptyText}>
              Chưa cập nhật thiết bị nào trong phòng này.
            </p>
          ) : (
            <div className={styles.tableResponsive}>
              <table className={styles.subTable}>
                <thead>
                  <tr>
                    <th>Tên thiết bị</th>
                    <th>Phân loại</th>
                    <th>Tình trạng</th>
                  </tr>
                </thead>
                <tbody>
                  {room.furnitures?.map((furn) => (
                    <tr key={furn.id}>
                      <td>
                        <strong>{furn.furnitureName}</strong>
                      </td>
                      <td>{furn.furnitureType}</td>
                      <td>
                        <span
                          className={`${styles.furnBadge} ${getFurnitureBadgeClass(furn.status)}`}
                        >
                          {getFurnitureStatusText(furn.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* KHỐI 3: LỊCH SỬ SỰ CỐ / BẢO TRÌ */}
      <div className={`${styles.card} ${styles.fullWidthCard}`}>
        <h3>🛠️ Lịch Sử Báo Cáo Sự Cố & Bảo Trì</h3>
        {room.incidentHistory && room.incidentHistory.length === 0 ? (
          <p className={styles.emptyText}>
            Phòng này hoạt động ổn định, chưa có lịch sử ghi nhận sự cố.
          </p>
        ) : (
          <div className={styles.tableResponsive}>
            <table className={styles.subTable}>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Mô tả sự cố</th>
                  <th>Người báo cáo</th>
                  <th>Thời gian</th>
                  <th>Trạng thái xử lý</th>
                </tr>
              </thead>
              <tbody>
                {room.incidentHistory?.map((incident) => (
                  <tr key={incident.id}>
                    <td>
                      <code>#INC-{incident.id}</code>
                    </td>
                    <td>{incident.description}</td>
                    <td>{incident.reportedBy}</td>
                    <td>
                      {new Date(incident.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td>
                      <span
                        className={`${styles.incidentBadge} ${incident.status === "PENDING" ? styles.incPending : styles.incFixed}`}
                      >
                        {incident.status === "PENDING"
                          ? "Chờ xử lý"
                          : "Đã khắc phục"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetail;
