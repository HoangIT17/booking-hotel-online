import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import styles from "./ViewCleaningTasks.module.css";
import { useNavigate } from "react-router-dom";

const ViewCleaningTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const resData = response.data;

        // Cơ chế bóc mảng thông minh hỗ trợ mọi cấu trúc dữ liệu từ Backend
        if (Array.isArray(resData)) {
          setTasks(resData);
        } else if (resData && Array.isArray(resData.data)) {
          setTasks(resData.data);
        } else if (resData && Array.isArray(resData.content)) {
          setTasks(resData.content);
        } else if (response && Array.isArray(response)) {
          setTasks(response);
        } else if (response && Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          setTasks([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi kết nối API:", error);
        setTasks([]);
        setLoading(false);
      });
  }, []);

  // Mỗi khi người dùng thay đổi bộ lọc, tự động quay về trang 1 để tránh lỗi rỗng trang
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, floorFilter]);

  // Áp dụng CSS Badge màu sắc cho các trạng thái chuẩn
  const getStatusClass = (status) => {
    if (!status) return styles.badgeDefault;
    const s = status.toUpperCase();
    if (s === "READY") return styles.badgeReady;
    if (s === "OCCUPIED") return styles.badgeOccupied;
    if (s === "CLEANING") return styles.badgeCleaning;
    if (s === "MAINTAIN") return styles.badgeMaintain;
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
        return "Bảo trì";
      case "DIRTY":
        return "Bẩn";
      default:
        return status;
    }
  };

  // 1. Logic lọc dữ liệu tại FE
  const filteredTasks = tasks.filter((task) => {
    if (!task) return false;

    // Lọc theo số phòng
    const roomNumStr = task.roomNumber ? String(task.roomNumber) : "";
    const matchesSearch = roomNumStr
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Lọc theo trạng thái dọn dẹp
    const rawStatus = task.cleaningStatus || task.status || "";
    const currentStatus = rawStatus.toUpperCase();
    const matchesStatus =
      statusFilter === "ALL" || currentStatus === statusFilter.toUpperCase();

    // Lọc theo tầng
    const matchesFloor =
      floorFilter === "ALL" || String(task.floor) === String(floorFilter);

    return matchesSearch && matchesStatus && matchesFloor;
  });

  // 2. Logic Phân Trang dữ liệu sau khi lọc
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Cắt mảng để chỉ lấy đúng 10 phần tử của trang hiện tại hiển thị lên bảng
  const currentItems = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

  // Tính tổng số trang thực tế
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
            <option value="1">Tầng 1</option>
            <option value="2">Tầng 2</option>
            <option value="3">Tầng 3</option>
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

      {/* BẢNG DỮ LIỆU CHUẨN LUXESTAY */}
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
                    {/* Tính số thứ tự liên tục tăng tiến theo từng trang */}
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
                      <button
                        onClick={() =>
                          navigate(`/staff/room-detail/${room.roomNumber}`)
                        }
                        className={styles.detailBtn}
                      >
                        Chi tiết
                      </button>
                      {currentRawStatus.toUpperCase() === "DIRTY" && (
                        <button
                          onClick={() =>
                            alert(
                              `Tiến hành nhận dọn dẹp phòng ${room.roomNumber}`,
                            )
                          }
                          className={styles.actionBtn}
                        >
                          Nhận dọn
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

      {/* THANH ĐIỀU HƯỚNG PHÂN TRANG (PAGINATION BAR) */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            « Trước
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
            Sau »
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewCleaningTasks;
