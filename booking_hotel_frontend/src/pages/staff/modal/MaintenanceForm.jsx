import React, { useState } from "react";
import axiosInstance from "../../../services/axiosInstance";

const MaintenanceForm = ({ roomNumber, furnitureList, onRefresh }) => {
  const [selectedFurnitureId, setSelectedFurnitureId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFurnitureId) {
      setMessage({
        type: "error",
        text: "Vui lòng chọn thiết bị cần bảo trì!",
      });
      return;
    }
    if (!description.trim()) {
      setMessage({
        type: "error",
        text: "Vui lòng nhập mô tả tình trạng hư hỏng!",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // 1. Tạo đối tượng FormData để đóng gói Multipart giống cấu hình Backend mong muốn
      const formData = new FormData();
      formData.append("roomNumber", roomNumber);
      formData.append("furnitureItemId", parseInt(selectedFurnitureId));
      formData.append("incidentDescription", description);

      // Nếu sau này bạn có thêm input file chọn ảnh, bạn chỉ cần append:
      // formData.append("image", fileInputState);

      // 2. Gửi request dạng multipart/form-data
      const response = await axiosInstance.post(
        "/staff/maintenance-requests",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const resData = response.data?.data || response.data || response;

      // Hỗ trợ kiểm tra linh hoạt mã phiếu trả về từ cấu hình MaintenanceResponse của bạn
      if (resData && (resData.ticketId || resData.success)) {
        setMessage({
          type: "success",
          text: `Tạo phiếu thành công! Mã phiếu: ${resData.ticketId || "OK"}`,
        });

        setSelectedFurnitureId("");
        setDescription("");

        // Chờ 1.5 giây để nhân viên kịp nhìn thấy thông báo thành công xanh lá trước khi reload
        setTimeout(() => {
          if (onRefresh) onRefresh();
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text:
            resData.message ||
            "Không thể tạo phiếu bảo trì, vui lòng kiểm tra dữ liệu.",
        });
      }
    } catch (error) {
      console.error("Lỗi tạo yêu cầu bảo trì:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Có lỗi xảy ra từ máy chủ (500), vui lòng kiểm tra lại trạng thái Backend!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <h3
        style={{
          fontSize: "22px",
          marginBottom: "25px",
          color: "#333",
          textAlign: "center",
        }}
      >
        Tạo Yêu Cầu Sửa Chữa & Bảo Trì
      </h3>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <div>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}
          >
            Chọn thiết bị:
          </label>
          <select
            value={selectedFurnitureId}
            onChange={(e) => setSelectedFurnitureId(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <option value="">-- Chọn thiết bị --</option>
            {furnitureList?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.furnitureName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}
          >
            Mô tả lỗi:
          </label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ví dụ: Thiết bị bị hỏng, tiếng kêu lạ..."
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              minHeight: "100px",
            }}
          />
        </div>

        {message.text && (
          <div
            style={{
              padding: "10px",
              borderRadius: "8px",
              background: message.type === "success" ? "#e8f5e9" : "#ffebee",
              color: message.type === "success" ? "#2e7d32" : "#c62828",
            }}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "14px",
            backgroundColor: "#0288d1",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Đang gửi..." : "Xác nhận gửi yêu cầu"}
        </button>
      </form>
    </div>
  );
};

export default MaintenanceForm;
