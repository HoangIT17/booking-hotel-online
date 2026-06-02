import React from "react";
const IncidentDetailModal = ({
  isOpen,
  onClose,
  incidentData,
  loading,
  onDecision,
}) => {
  if (!isOpen) return null;

  return (
    <div className="incident-modal-overlay">
      <div className="incident-modal-container">
        {/* Header của Modal */}
        <div className="incident-modal-header">
          <h3>
            {loading
              ? "Đang tải dữ liệu..."
              : `Chi Tiết Sự Cố #${incidentData?.id || "---"}`}
          </h3>
          <button className="incident-modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Nội dung bên trong Modal */}
        <div className="incident-modal-body">
          {loading ? (
            <div className="incident-modal-loading">
              <span className="spinner"></span> Thang tải thông tin chi tiết từ
              máy chủ...
            </div>
          ) : !incidentData ? (
            <p className="text-center text-gray-500">
              Không có dữ liệu hiển thị.
            </p>
          ) : (
            <div className="incident-detail-grid">
              <div className="detail-group">
                <label>Phòng xảy ra:</label>
                <div className="detail-value font-semibold">
                  P.
                  {incidentData.room?.roomNumber ||
                    incidentData.room?.room_number ||
                    "---"}{" "}
                  (Tầng {incidentData.room?.floor || "1"})
                </div>
              </div>

              <div className="detail-group">
                <label>Nhân viên báo cáo:</label>
                <div className="detail-value">
                  {incidentData.staff?.fullName ||
                    incidentData.staff?.full_name ||
                    "Nhân Viên"}{" "}
                  <span className="text-gray-400">
                    (@{incidentData.staff?.username || "staff"})
                  </span>
                </div>
              </div>

              <div className="detail-row-flex">
                <div className="detail-group flex-1">
                  <label>Phân loại loại hình:</label>
                  <div className="detail-value badge-type">
                    {incidentData.type || "OTHER"}
                  </div>
                </div>
                <div className="detail-group flex-1">
                  <label>Trạng thái hiện tại:</label>
                  <div
                    className={`detail-value badge-status ${incidentData.status}`}
                  >
                    {incidentData.status || "PENDING"}
                  </div>
                </div>
              </div>

              {(incidentData.furnitureName || incidentData.furniture_name) && (
                <div className="detail-group">
                  <label>Tên trang thiết bị / vật tư hư hại:</label>
                  <div className="detail-value underline-dotted">
                    {incidentData.furnitureName || incidentData.furniture_name}
                  </div>
                </div>
              )}

              <div className="detail-group">
                <label>Nội dung chi tiết sự cố:</label>
                <div className="detail-value content-box">
                  {incidentData.description ||
                    "Không có nội dung mô tả chi tiết."}
                </div>
              </div>

              <div className="detail-timestamps">
                <div>
                  <strong>Ngày tạo:</strong>{" "}
                  {incidentData.createdAt || incidentData.created_at
                    ? new Date(
                        incidentData.createdAt || incidentData.created_at,
                      ).toLocaleString("vi-VN")
                    : "---"}
                </div>
                <div>
                  <strong>Cập nhật mới nhất:</strong>{" "}
                  {incidentData.updatedAt || incidentData.updated_at
                    ? new Date(
                        incidentData.updatedAt || incidentData.updated_at,
                      ).toLocaleString("vi-VN")
                    : "---"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer của Modal */}
        <div
          className="incident-modal-footer"
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          {incidentData?.status === "PENDING" && (
            <>
              <button
                className="btn-approve"
                onClick={() => onDecision("APPROVE")} // Truyền action APPROVE
                style={{
                  backgroundColor: "#16a34a",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "4px",
                }}
              >
                Duyệt (Approve)
              </button>
              <button
                className="btn-reject"
                onClick={() => onDecision("REJECT")} // Truyền action REJECT
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "4px",
                }}
              >
                Từ chối (Reject)
              </button>
            </>
          )}
          {/* MỚI: Logic xử lý cho trạng thái FIXING */}
          {incidentData?.status === "APPROVED" && (
            <button
              className="btn-resolve"
              onClick={() => onDecision("RESOLVE")}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "8px 16px",
                borderRadius: "4px",
              }}
            >
              Hoàn tất sửa chữa
            </button>
          )}

          <button className="incident-btn-close-footer" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailModal;
