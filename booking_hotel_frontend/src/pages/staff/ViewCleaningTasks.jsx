import  { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import styles from "./ViewCleaningTasks.module.css";
import { useNavigate } from "react-router-dom";

const ViewCleaningTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Trạng thái khóa nút bấm tạm thời khi đang xử lý API nhận dọn phòng
  const [loadingAccept, setLoadingAccept] = useState(null);

  const userString = localStorage.getItem("user");
  let isStaff = false;

  if (userString) {
    try {
      const userObj = JSON.parse(userString);
      // Kiểm tra xem trường role nằm ở đâu trong object userObj của bạn.
      // Thông thường nó là userObj.role hoặc userObj.authorities
      const role = userObj.role || "";
      isStaff = role.toUpperCase() === "STAFF";
    } catch (e) {
      console.error("Lỗi khi parse JSON user:", e);
    }
  }
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const rolePath = user.role === "RECEPTIONIST" ? "/receptionist" : "/staff";

  // Các bộ lọc dữ liệu tại FE
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [floorFilter, setFloorFilter] = useState("ALL");

  // PHÂN TRANG STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/staff/cleaning-tasks")
      .then((response) => {
        const resData = response.data ? response.data : response;

        // Cơ chế bóc mảng thông minh hỗ trợ mọi cấu trúc dữ liệu từ Backend
        if (Array.isArray(resData)) {
          setTasks(resData);
        } else if (resData && Array.isArray(resData.data)) {
          setTasks(resData.data);
        } else if (resData && Array.isArray(resData.content)) {
          setTasks(resData.content);
        } else {
          setTasks([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi kết nối API lấy danh sách:", error);
        setTasks([]);
        setLoading(false);
      });
  }, []);

  // Mỗi khi người dùng thay đổi bộ lọc, tự động quay về trang 1 để tránh lỗi rỗng trang
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, floorFilter]);

  // LOGIC GỌI API NHẬN DỌN PHÒNG (ĐÃ SỬA THEO CHUẨN PATH VARIABLE)
  const handleAcceptCleaning = (roomNumber) => {
    setLoadingAccept(roomNumber);

    // Sử dụng URL khớp cấu trúc @PostMapping("/rooms/{roomNumber}/accept-cleaning")
    axiosInstance
      .post(`/staff/rooms/${roomNumber}/accept-cleaning`)
      .then((response) => {
        if (!response) {
          alert("Hệ thống không phản hồi dữ liệu.");
          return;
        }

        const resData = response.data ? response.data : response;

        if (resData && resData.success) {
          alert(
            `Phòng ${roomNumber}: ${resData.message || "Nhận dọn thành công!"}`,
          );

          // Cập nhật trạng thái trực tiếp trên mảng dữ liệu Client
          setTasks((prevTasks) =>
            prevTasks.map((task) => {
              if (String(task.roomNumber) === String(roomNumber)) {
                return {
                  ...task,
                  cleaningStatus: resData.cleaningStatus || "CLEANING",
                  status: resData.cleaningStatus || "CLEANING",
                };
              }
              return task;
            }),
          );

          // Tự động chuyển hướng ngay sang trang "Phòng cần dọn" để nhân viên thực hiện dọn dẹp
          navigate("/staff/my-tasks");
        } else {
          alert(
            (resData && resData.message) || "Không thể nhận dọn dẹp phòng này.",
          );
        }
      })
      .catch((error) => {
        console.error("Lỗi khi xử lý API nhận dọn phòng:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Có lỗi xảy ra trong quá trình kết nối hệ thống. Vui lòng thử lại!";
        alert(errorMsg);
      })
      .finally(() => {
        setLoadingAccept(null);
      });
  };

  // Áp dụng CSS Badge màu sắc cho các trạng thái chuẩn
  const getStatusClass = (status) => {
    if (!status) return styles.badgeDefault;
    const s = status.toUpperCase();
    if (s === "READY") return styles.badgeReady;
    if (s === "OCCUPIED") return styles.badgeOccupied;
    if (s === "CLEANING") return styles.badgeCleaning;
    if (s === "MAINTAIN" || s === "MAINTENANCE") return styles.badgeMaintain;
    if (s === "DIRTY") return styles.badgeDirty;
    return styles.badgeDefault;
  };

  // Dịch trạng thái sang tiếng Việt
  const getStatusText = (status) => {
    if (!status) return "Chưa rõ";
    switch (status.toUpperCase()) {
      case "READY":
        return "Sẵn sàng";
      case "OCCUPIED":
        return "Đang sử dụng";
      case "CLEANING":
        return "Đang dọn";
      case "MAINTAIN":
      case "MAINTENANCE":
        return "Bảo trì";
      case "DIRTY":
        return "Bẩn";
      default:
        return status;
    }
  };

  const floorOptions = [...new Set(tasks.map((t) => t.floor).filter((f) => f != null))].sort((a, b) => a - b);

  // Logic lọc dữ liệu tại FE
  const filteredTasks = tasks.filter((task) => {
    if (!task) return false;

    const roomNumStr = task.roomNumber ? String(task.roomNumber) : "";
    const matchesSearch = roomNumStr
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const rawStatus = task.cleaningStatus || task.status || "";
    const currentStatus = rawStatus.toUpperCase();
    const matchesStatus =
      statusFilter === "ALL" || currentStatus === statusFilter.toUpperCase();

    const matchesFloor =
      floorFilter === "ALL" || String(task.floor) === String(floorFilter);

    return matchesSearch && matchesStatus && matchesFloor;
  });

  // Logic Phân Trang dữ liệu sau khi lọc
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  if (loading) {
    return (
      <div className={styles.loadingText}>Đang tải danh sách phòng...</div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      {/* THANH ĐIỀU HƯỚNG BỘ LỌC */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Tìm số phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <select
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
          >
            <option value="ALL">Tầng</option>
            {floorOptions.map((f) => (
              <option key={f} value={f}>Tầng {f}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="READY">Sẵn sàng</option>
            <option value="OCCUPIED">Đang sử dụng</option>
            <option value="CLEANING">Đang dọn</option>
            <option value="MAINTAIN">Bảo trì</option>
            <option value="DIRTY">Bẩn</option>
          </select>

          <button
            className={styles.resetBtn}
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("ALL");
              setFloorFilter("ALL");
            }}
          >
            Đặt lại
          </button>
        </div>
      </div>

      <div className={styles.totalCount}>
        Tổng số: <span>{filteredTasks.length}</span> phòng hiển thị
      </div>

      {/* BẢNG DỮ LIỆU CHUẨN */}
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
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.emptyRow}>
                  Không có dữ liệu phòng nào được tìm thấy.
                </td>
              </tr>
            ) : (
              currentItems.map((room, index) => {
                const currentRawStatus =
                  room.cleaningStatus || room.status || "";

                return (
                  <tr key={room.roomNumber || index}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td className={styles.roomNumberCell}>
                      Phòng {room.roomNumber}
                    </td>
                    <td>Tầng {room.floor}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${getStatusClass(currentRawStatus)}`}
                      >
                        {getStatusText(currentRawStatus)}
                      </span>
                    </td>
                    <td className={styles.actionCell}>
                      {/* NÚT CHI TIẾT: Hiển thị cho MỌI role (không cần isStaff) */}
                      <button
                        onClick={() =>
                          navigate(`${rolePath}/room-detail/${room.roomNumber}`)
                        }
                        className={styles.detailBtn}
                      >
                        Chi tiết
                      </button>

                      {/* ĐIỀU KIỆN QUAN TRỌNG: Chỉ hiện nếu là STAFF và trạng thái là DIRTY */}
                      {isStaff &&
                        currentRawStatus.toUpperCase() === "DIRTY" && (
                          <button
                            onClick={() =>
                              handleAcceptCleaning(room.roomNumber)
                            }
                            disabled={loadingAccept === room.roomNumber}
                            className={styles.actionBtn}
                          >
                            {loadingAccept === room.roomNumber
                              ? "Đang nhận..."
                              : "Nhận dọn"}
                          </button>
                        )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* THANH ĐIỀU HƯỚNG PHÂN TRANG */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            «
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`${styles.pageBtn} ${currentPage === page ? styles.activePage : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className={styles.pageBtn}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewCleaningTasks;
