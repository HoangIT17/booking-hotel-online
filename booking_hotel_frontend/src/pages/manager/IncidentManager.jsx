// src/pages/manager/IncidentManager.jsx
import React, { useState, useEffect } from "react";
import { incidentApi } from "../../services/incidentApi";
import { toast } from "react-hot-toast";
import IncidentDetailModal from "./IncidentDetailModal";
import "./IncidentManager.css";

const IncidentManager = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Quản lý Modal xem chi tiết
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Phân trang - Đã chỉnh size: 10
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total_items: 0,
    total_pages: 1,
  });

  // Bộ lọc tìm kiếm
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    fromDate: "",
    toDate: "",
    sort_by: "created_at",
    direction: "asc",
  });

  // Hàm lấy danh sách sự cố
  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const queryParams = {
        ...filters,
        page: pagination.page,
        size: pagination.size,
      };

      const res = await incidentApi.getListIncidents(queryParams);
      if (res && res.data) {
        const items = res.data.items || res.data || [];
        setIncidents(items);
        setPagination((prev) => ({
          ...prev,
          total_items: res.data.total_items || items.length,
          total_pages: res.data.total_pages || 1,
        }));
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách sự cố:", err);
      toast.error("Không thể kết nối đến máy chủ để tải danh sách!");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xem chi tiết sự cố
  const handleViewDetail = async (id) => {
    setIsModalOpen(true);
    setModalLoading(true);
    try {
      const apiMethod =
        incidentApi.getIncidentDetail || incidentApi.getIncidentById;

      if (!apiMethod) {
        throw new Error("Chưa định nghĩa hàm lấy chi tiết trong incidentApi!");
      }

      const response = await apiMethod(id);
      if (response && response.data) {
        const detailData = response.data.data || response.data;
        setSelectedIncident(detailData);
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết sự cố:", error);
      toast.error("Không thể tải thông tin chi tiết sự cố này!");
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  // Hàm xử lý xóa sự cố
  const handleDeleteIncident = async (id) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa báo cáo sự cố #${id} này không?`,
      )
    ) {
      try {
        if (incidentApi.deleteIncident) {
          await incidentApi.deleteIncident(id);
          toast.success("Xóa sự cố thành công!");
          fetchIncidents();
        } else {
          toast.error("Tính năng xóa chưa được cấu hình ở file API!");
        }
      } catch (error) {
        console.error("Lỗi khi xóa sự cố:", error);
        toast.error("Xóa thất bại! Vui lòng kiểm tra lại hệ thống.");
      }
    }
  };

  //   const handleResolve = async (id) => {
  //   const note = prompt("Nhập ghi chú kết quả sửa chữa:");
  //   if (note === null) return; // Người dùng nhấn Cancel

  //   if (note.trim() === "") {
  //     toast.error("Ghi chú là bắt buộc!");
  //     return;
  //   }

  //   try {
  //     // Gọi API resolveIncident đã khai báo trong incidentApi
  //     await incidentApi.resolveIncident(id, note);
  //     toast.success("Đã hoàn tất sửa chữa và chuyển trạng thái thành công!");
  //     fetchIncidents(); // Tải lại danh sách
  //   } catch (error) {
  //     console.error("Lỗi khi resolve:", error);
  //     toast.error(error.response?.data?.message || "Lỗi khi cập nhật trạng thái!");
  //   }
  // };

  useEffect(() => {
    fetchIncidents();
  }, [pagination.page, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
      FIXING: "bg-blue-50 text-blue-700 border-blue-200",
      FIXED: "bg-green-50 text-green-700 border-green-200",
    };
    return (
      <span
        className={`px-2 py-0.5 text-xs font-medium border rounded ${styles[status] || "bg-gray-50 text-gray-600"}`}
      >
        {status}
      </span>
    );
  };

  const handleDecision = async (id, action) => {
    let note = "";

    // Logic nhập ghi chú: Bắt buộc cho REJECT và RESOLVE
    if (action === "REJECT" || action === "RESOLVE") {
      const promptMessage =
        action === "REJECT"
          ? "Vui lòng nhập lý do từ chối:"
          : "Nhập ghi chú kết quả sửa chữa:";

      note = prompt(promptMessage);

      // Nếu người dùng nhấn Cancel, dừng hàm
      if (note === null) return;

      // Kiểm tra ghi chú không được để trống
      if (note.trim() === "") {
        toast.error("Ghi chú không được để trống!");
        return;
      }
    }

    try {
      if (action === "RESOLVE") {
        // Gọi API Resolve
        await incidentApi.resolveIncident(id, note);
        toast.success("Đã hoàn tất sửa chữa thành công!");
      } else {
        // Gọi API quyết định (APPROVE / REJECT)
        await incidentApi.decideOnIncident(id, action, note);
        toast.success(
          `Đã cập nhật sự cố sang trạng thái ${action} thành công!`,
        );
      }

      // Tải lại danh sách sau khi thao tác thành công
      fetchIncidents();
      setIsModalOpen(false);
    } catch (error) {
      console.error(`Lỗi khi thực hiện ${action}:`, error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
      );
    }
  };

  return (
    <div className="p-6 w-full">
      {" "}
      {/* Đảm bảo có w-full */}
      <h2 className="text-2xl font-bold mb-6">Quản Lý Danh Sách Sự Cố</h2>
      {/* THANH BỘ LỌC */}
      <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 flex flex-wrap items-end gap-4">
        <div className="flex-1" style={{ minWidth: 160 }}>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Trạng thái sự cố
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded p-1.5 text-sm bg-white"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">PENDING</option>
            <option value="FIXING">FIXING</option>
            <option value="FIXED">FIXED</option>
          </select>
        </div>
        <div className="flex-1" style={{ minWidth: 160 }}>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Loại sự cố
          </label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded p-1.5 text-sm bg-white"
          >
            <option value="">Tất cả phân loại</option>
            <option value="DAMAGED">DAMAGED</option>
            <option value="FURNITURE">FURNITURE</option>
          </select>
        </div>
        <div className="flex-1" style={{ minWidth: 150 }}>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Từ ngày
          </label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded p-1.5 text-sm bg-white"
          />
        </div>
        <div className="flex-1" style={{ minWidth: 150 }}>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Đến ngày
          </label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded p-1.5 text-sm bg-white"
          />
        </div>
      </div>
      {/* BẢNG DỮ LIỆU */}
      <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse bg-white">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-sm font-bold">
              <th className="p-3">Mã số</th>
              <th className="p-3">Phòng</th>
              <th className="p-3">Nhân viên báo cáo</th>
              <th className="p-3">Nội dung sự cố</th>
              <th className="p-3">Phân loại</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Thời gian tạo</th>
              <th className="p-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm text-gray-600">
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  className="p-6 text-center text-gray-400 animate-pulse"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : incidents.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-400">
                  Không tìm thấy sự cố nào.
                </td>
              </tr>
            ) : (
              incidents.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="p-3 font-medium">{item.id}</td>
                  <td className="p-3">
                    <div>
                      {item.room?.roomNumber || item.room?.room_number || "---"}
                    </div>
                    {/* <div className="text-xs text-gray-400">
                      Tầng {item.room?.floor || "1"}
                    </div> */}
                  </td>
                  <td className="p-3">
                    <div>
                      {item.staff?.fullName ||
                        item.staff?.full_name ||
                        "Nhân Viên"}
                    </div>
                    <div className="text-xs text-gray-400">
                      @{item.staff?.username || "staff"}
                    </div>
                  </td>
                  <td className="p-3 max-w-xs">
                    <div className="truncate font-medium">
                      {item.description}
                    </div>
                  </td>
                  <td className="p-3 font-medium text-xs text-gray-700">
                    {item.type || "---"}
                  </td>
                  <td className="p-3">{getStatusBadge(item.status)}</td>
                  <td className="p-3 text-xs">
                    {item.createdAt || item.created_at
                      ? new Date(
                          item.createdAt || item.created_at,
                        ).toLocaleString("vi-VN")
                      : "---"}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleViewDetail(item.id)}
                        className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-white border border-blue-400 rounded-md hover:bg-blue-50"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => handleDeleteIncident(item.id)}
                        className="px-2.5 py-1 text-xs font-medium text-red-500 bg-white border border-red-400 rounded-md hover:bg-red-50"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PHÂN TRANG MỚI */}
        {/* PHÂN TRANG */}
        <div className="pagination-container">
          {/* Nút lùi */}
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: Math.max(prev.page - 1, 1),
              }))
            }
            disabled={pagination.page === 1 || loading}
            className="pagination-button"
          >
            &lt;
          </button>

          {/* Danh sách các trang */}
          {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: pageNumber }))
                }
                className={`pagination-button ${pagination.page === pageNumber ? "active" : ""}`}
              >
                {pageNumber}
              </button>
            ),
          )}

          {/* Nút tới */}
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: Math.min(prev.page + 1, pagination.total_pages),
              }))
            }
            disabled={pagination.page === pagination.total_pages || loading}
            className="pagination-button"
          >
            &gt;
          </button>
        </div>
      </div>
      <IncidentDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedIncident(null);
        }}
        incidentData={selectedIncident}
        loading={modalLoading}
        onDecision={(action) => handleDecision(selectedIncident.id, action)}
      />
    </div>
  );
};
export default IncidentManager;
