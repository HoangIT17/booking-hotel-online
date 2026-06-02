// 1. Thay đổi việc import từ axios thuần sang axiosInstance của bạn
import axiosInstance from "./axiosInstance";

export const incidentApi = {
  // Hàm lấy danh sách sự cố kèm bộ lọc động
  getListIncidents: async (filters = {}) => {
    try {
      // Loại bỏ các trường bị bỏ trống không truyền để URL gọn sạch
      const cleanParams = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined,
        ),
      );

      // Sử dụng axiosInstance đã cấu hình sẵn baseURL và Interceptor tự động đính Authorization
      const response = await axiosInstance.get("/incidents", {
        params: cleanParams,
      });

      // Vì response interceptor đã return response.data, biến `response` chính là data sạch
      return response;
    } catch (error) {
      console.error("Lỗi khi gọi API danh sách sự cố:", error);
      throw error;
    }
  },

  // Hàm lấy chi tiết sự cố theo ID
  getIncidentDetail: async (id) => {
    try {
      // ĐÃ SỬA: Chuyển hoàn toàn sang axiosInstance để thừa hưởng baseURL và token tự động
      const response = await axiosInstance.get(`/incidents/${id}`);
      return response;
    } catch (error) {
      console.error(`Lỗi khi gọi API chi tiết sự cố #${id}:`, error);
      throw error;
    }
  },

  // Hàm xóa sự cố theo ID (Để hỗ trợ nút Xóa trên giao diện của bạn)
  deleteIncident: async (id) => {
    try {
      // Sử dụng phương thức DELETE chuẩn RESTful API, hoặc đổi thành path phù hợp với Backend của bạn
      const response = await axiosInstance.delete(`/incidents/${id}`);
      return response;
    } catch (error) {
      console.error(`Lỗi khi gọi API xóa sự cố #${id}:`, error);
      throw error;
    }
  },
  decideOnIncident: async (id, action, note) => {
    try {
      // Gửi request PUT tới endpoint: /api/v1/incidents/{id}/decision
      // Body bao gồm action (APPROVE/REJECT) và note (lý do)
      const response = await axiosInstance.put(`/incidents/${id}/decision`, {
        action: action,
        manager_note: note,
      });
      return response;
    } catch (error) {
      console.error(`Lỗi khi xử lý quyết định cho sự cố #${id}:`, error);
      throw error;
    }
  },
  resolveIncident: async (id, resolution_note) => {
    return await axiosInstance.patch(`/incidents/${id}/resolve`, {
      resolution_note: resolution_note,
    });
  },
  getDamagedLostReport: async () => {
    try {
      // Lưu ý: Controller của chúng ta đã tách ra ở /api/v1/reports
      // Nếu baseURL của bạn là /api/v1, thì path ở đây sẽ là /reports/incidents/damaged-lost
      const response = await axiosInstance.get(
        "/incidents/reports/damaged-lost",
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi gọi API báo cáo thiết bị mất/hỏng:", error);
      throw error;
    }
  },
};
