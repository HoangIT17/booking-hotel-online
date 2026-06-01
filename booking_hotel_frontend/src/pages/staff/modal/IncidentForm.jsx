import React, { useState } from "react";
import axiosInstance from "../../../services/axiosInstance";

const IncidentForm = ({ roomNumber, furnitureList, onRefresh }) => {
  const [selectedFurnitureId, setSelectedFurnitureId] = useState("");
  const [incidentType, setIncidentType] = useState("DAMAGED");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFurnitureId) {
      setErrorMsg("Vui lòng chọn một thiết bị cụ thể!");
      return;
    }
    if (!description.trim()) {
      setErrorMsg("Vui lòng nhập mô tả chi tiết sự cố!");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // Đúng chuẩn API endpoint /api/v1/staff/incidents/report-furniture dạng JSON nhận CreateIncidentRequest
      const response = await axiosInstance.post(
        "staff/incidents/report-furniture",
        {
          roomNumber: roomNumber,
          furnitureItemId: parseInt(selectedFurnitureId),
          incidentType: incidentType, // "DAMAGED" hoặc "MISSING"
          description: description.trim(),
        },
      );

      alert("Gửi báo cáo sự cố thiết bị thành công!");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Lỗi báo cáo thiết bị:", error);
      setErrorMsg(
        error.response?.data?.message ||
          "Hệ thống đang gặp sự cố, vui lòng thử lại sau!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "10px 5px" }}>
      <h3
        style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "#1e293b",
          fontSize: "20px",
          fontWeight: "700",
        }}
      >
        Tạo Yêu Cầu Báo Cáo Sự Cố & Mất Mát
      </h3>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              color: "#475569",
            }}
          >
            Chọn thiết bị sự cố:
          </label>
          <select
            value={selectedFurnitureId}
            onChange={(e) => setSelectedFurnitureId(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
            }}
          >
            <option value="">-- Click để chọn thiết bị trong phòng --</option>
            {furnitureList?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.furnitureName} ({item.furnitureType})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              color: "#475569",
            }}
          >
            Hình thức sự cố:
          </label>
          <div style={{ display: "flex", gap: "25px", padding: "4px 0" }}>
            <label
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <input
                type="radio"
                name="incidentType"
                value="DAMAGED"
                checked={incidentType === "DAMAGED"}
                onChange={() => setIncidentType("DAMAGED")}
              />
              Thiết bị bị hỏng
            </label>
            <label
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#ea580c",
              }}
            >
              <input
                type="radio"
                name="incidentType"
                value="MISSING"
                checked={incidentType === "MISSING"}
                onChange={() => setIncidentType("MISSING")}
              />
              Thiết bị bị thất lạc / mất
            </label>
          </div>
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              color: "#475569",
            }}
          >
            Mô tả tình trạng:
          </label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập chi tiết về lỗi hỏng hóc hoặc lý do mất đồ để tiện theo dõi..."
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
              resize: "none",
            }}
          />
        </div>

        {errorMsg && (
          <div
            style={{
              padding: "10px",
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px",
            backgroundColor: incidentType === "MISSING" ? "#ea580c" : "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "8px",
            fontSize: "15px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {loading ? "Đang gửi dữ liệu..." : "Xác nhận gửi báo cáo"}
        </button>
      </form>
    </div>
  );
};

export default IncidentForm;
