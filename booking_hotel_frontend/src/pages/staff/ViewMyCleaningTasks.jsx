import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import styles from "./ViewCleaningTasks.module.css";
import { useNavigate } from "react-router-dom";

const ViewMyCleaningTasks = () => {
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(null);

  const navigate = useNavigate();

  // 1. Lấy danh sách phòng đang dọn dẹp (CLEANING) từ hệ thống
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/staff/cleaning-tasks")
      .then((response) => {
        const resData = response.data ? response.data : response;
        let allTasks = [];

        if (Array.isArray(resData)) allTasks = resData;
        else if (resData && Array.isArray(resData.data))
          allTasks = resData.data;
        else if (resData && Array.isArray(resData.content))
          allTasks = resData.content;

        // Lọc lấy các phòng có trạng thái CLEANING
        const activeTasks = allTasks.filter((task) => {
          const statusStr = (
            task.cleaningStatus ||
            task.status ||
            ""
          ).toUpperCase();
          return statusStr === "CLEANING";
        });

        setMyTasks(activeTasks);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi lấy danh sách phòng cần dọn:", error);
        setLoading(false);
      });
  }, []);

  // 2. Xử lý khi nhấn nút "Xong" - Chuyển sang POST để tránh hoàn toàn lỗi CORS Preflight
  const handleCompleteCleaning = (roomNumber) => {
    setLoadingComplete(roomNumber);

    // Sử dụng .post thay thế cho .patch để lách qua bộ lọc CORS cũ của Security
    axiosInstance
      .post(`/staff/rooms/${roomNumber}/status`, { status: "READY" })
      .then((response) => {
        if (!response) {
          alert("Hệ thống không phản hồi dữ liệu.");
          return;
        }

        const resData = response.data ? response.data : response;

        // Kiểm tra trường "success": true trả về từ API JSON của bạn
        if (resData && resData.success === true) {
          alert(
            `Phòng ${roomNumber}: Đã dọn dẹp xong. Trạng thái phòng chuyển sang Sẵn sàng!`,
          );

          // Xóa ngay phòng vừa dọn xong khỏi danh sách hiển thị hiện tại
          setMyTasks((prev) =>
            prev.filter(
              (task) => String(task.roomNumber) !== String(roomNumber),
            ),
          );
        } else {
          alert(
            (resData && resData.message) ||
              "Không thể cập nhật trạng thái hoàn thành.",
          );
        }
      })
      .catch((error) => {
        console.error("Lỗi cập nhật trạng thái phòng:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật trạng thái phòng. Vui lòng kiểm tra lại Backend!";
        alert(errorMsg);
      })
      .finally(() => {
        setLoadingComplete(null);
      });
  };

  if (loading) {
    return (
      <div className={styles.loadingText}>
        Đang tải danh sách phòng cần dọn...
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.totalCount} style={{ marginTop: "10px" }}>
        Danh sách phòng bạn đang phụ trách: <span>{myTasks.length}</span> phòng
      </div>

      <div className={styles.responsiveTable}>
        <table className={styles.mainTable}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Số phòng</th>
              <th>Tầng</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: "center" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {myTasks.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.emptyRow}>
                  Hiện tại bạn không phụ trách phòng cần dọn nào.
                </td>
              </tr>
            ) : (
              myTasks.map((room, index) => (
                <tr key={room.roomNumber || index}>
                  <td>{index + 1}</td>
                  <td className={styles.roomNumberCell}>
                    Phòng {room.roomNumber}
                  </td>
                  <td>Tầng {room.floor}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${styles.badgeCleaning}`}
                    >
                      Đang dọn
                    </span>
                  </td>
                  <td className={styles.actionCell}>
                    <button
                      onClick={() =>
                        navigate(`/staff/room-detail/${room.roomNumber}`)
                      }
                      className={styles.detailBtn}
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => handleCompleteCleaning(room.roomNumber)}
                      disabled={loadingComplete === room.roomNumber}
                      className={styles.actionBtn}
                      style={{
                        backgroundColor: "#22c55e",
                        borderColor: "#16a34a",
                        color: "#fff",
                      }}
                    >
                      {loadingComplete === room.roomNumber
                        ? "Đang xử lý..."
                        : "Xong"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewMyCleaningTasks;
