import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import styles from "./RoomDetail.module.css";
import MaintenanceForm from "./modal/MaintenanceForm";
import IncidentForm from "./modal/IncidentForm";
import useAuth from "../../hooks/useAuth"; // Giả định bạn dùng hook này

const IMAGE_BASE_URL = "http://localhost:8082";

const RoomDetail = () => {
  const { roomNumber } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();

  const isStaff = role === "STAFF";
  const isReceptionist = role === "RECEPTIONIST";

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIncidentOpen, setIsIncidentOpen] = useState(false);

  const fetchRoomDetail = () => {
    if (!roomNumber) return;
    axiosInstance
      .get(`/staff/rooms/${roomNumber}`)
      .then((response) => {
        const resData = response.data?.data || response.data || response;
        setRoom(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy chi tiết phòng:", err);
        setError("Không thể tải thông tin chi tiết của phòng này.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRoomDetail();
  }, [roomNumber]);

  // const handleCreateCleaningTask = async () => {
  //   try {
  //     await axiosInstance.post(`/staff/rooms/${roomNumber}/create-cleaning`);
  //     alert("Đã tạo yêu cầu dọn dẹp thành công!");
  //     fetchRoomDetail();
  //   } catch (err) {
  //     alert("Có lỗi xảy ra khi tạo yêu cầu.");
  //   }
  // };

  const handleCreateCleaningTask = async () => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn tạo yêu cầu dọn dẹp cho phòng ${roomNumber}?`,
      )
    ) {
      return;
    }

    try {
      // Gửi request tới server
      await axiosInstance.post(
        `/receptionist/rooms/${roomNumber}/create-cleaning`,
        {
          note: "Cần dọn dẹp sau khi check-out",
        },
      );

      alert("Tạo yêu cầu dọn dẹp thành công!");

      // BƯỚC QUAN TRỌNG: Gọi lại hàm này để lấy dữ liệu mới nhất (trạng thái DIRTY) từ DB
      fetchRoomDetail();
    } catch (error) {
      // Xử lý lỗi nếu có
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra!";
      alert(errorMsg);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "0 đ";
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

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

  const getFurnitureBadgeClass = (status) => {
    if (!status) return styles.furnDefault;
    switch (status.toUpperCase()) {
      case "FIXED":
        return styles.furnFixed;
      case "PENDING":
        return styles.furnPending;
      case "FIXING":
        return styles.furnFixing;
      case "DAMAGED":
        return styles.furnDamaged || styles.badgeDirty;
      case "MISSING":
        return styles.furnMissing || styles.badgeMaintain;
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
      case "DAMAGED":
        return "Bị hư hỏng";
      case "MISSING":
        return "Bị thất lạc/mất";
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
      <div className={styles.headerActions}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Quay lại danh sách
        </button>
        <h2>Chi Tiết Phòng {room.roomNumber}</h2>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.card}>
          <div className={styles.imageWrapper}>
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
              <span className={styles.label}>Sức chứa:</span>
              <span className={styles.value}>{room.maxPeople} người</span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h3>Danh Sách Thiết Bị & Tiện Nghi</h3>
          {room.furnitures?.length === 0 ? (
            <p className={styles.emptyText}>Chưa cập nhật thiết bị.</p>
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

              {isStaff && (
                <div
                  style={{ marginTop: "15px", display: "flex", gap: "12px" }}
                >
                  <button
                    className={styles.openModalBtn}
                    onClick={() => setIsModalOpen(true)}
                    style={{ margin: 0, flex: 1 }}
                  >
                    + Tạo yêu cầu sửa chữa
                  </button>
                  <button
                    onClick={() => setIsIncidentOpen(true)}
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      border: "1px solid #dc2626",
                      background: "#fef2f2",
                      color: "#dc2626",
                      fontWeight: "600",
                      cursor: "pointer",
                      borderRadius: "6px",
                    }}
                  >
                    ⚠ Báo cáo thiết bị mất, hỏng
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isStaff && (
        <div className={`${styles.card} ${styles.fullWidthCard}`}>
          <h3>Lịch Sử Báo Cáo Sự Cố & Bảo Trì</h3>
          {room.incidentHistory?.length === 0 ? (
            <p className={styles.emptyText}>Phòng hoạt động ổn định.</p>
          ) : (
            <div className={styles.tableResponsive}>
              <table className={styles.subTable}>
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Mô tả</th>
                    <th>Người báo cáo</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {room.incidentHistory?.map((inc) => (
                    <tr key={inc.id}>
                      <td>
                        <code>#INC-{inc.id}</code>
                      </td>
                      <td>{inc.description}</td>
                      <td>{inc.reportedBy}</td>
                      <td>{new Date(inc.createdAt).toLocaleString("vi-VN")}</td>
                      <td>
                        <span
                          className={`${styles.incidentBadge} ${inc.status === "PENDING" ? styles.incPending : styles.incFixed}`}
                        >
                          {inc.status === "PENDING"
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
      )}
      {/* Nút dành cho Lễ tân */}
      {isReceptionist && (
        <button
          onClick={handleCreateCleaningTask}
          className={styles.cleaningBtn}
          style={{
            flex: 1,
            padding: "10px",
            background: "#059669",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ✨ Tạo yêu cầu dọn dẹp
        </button>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeBtn}
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <MaintenanceForm
              roomNumber={room.roomNumber}
              furnitureList={room.furnitures}
              onRefresh={() => {
                setIsModalOpen(false);
                fetchRoomDetail();
              }}
            />
          </div>
        </div>
      )}

      {isIncidentOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeBtn}
              onClick={() => setIsIncidentOpen(false)}
            >
              ×
            </button>
            <IncidentForm
              roomNumber={room.roomNumber}
              furnitureList={room.furnitures}
              onRefresh={() => {
                setIsIncidentOpen(false);
                fetchRoomDetail();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetail;
