import api from "./axiosInstance";

const chatbotAdminService = {
    // 1. Lấy kiến thức + phân trang + tìm kiếm
    getAllKnowledge: (page = 1, size = 10, search = "") => {
        let url = `/chatbot/knowledge?page=${page}&size=${size}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        return api.get(url);
    },

    // 2. Nạp kiến thức
    trainBot: (data) => api.post("/chatbot/knowledge", data),

    // 3. Xóa kiến thức
    deleteKnowledge: (id) => api.delete(`/chatbot/knowledge/${id}`),

    // 4. Lấy chi tiết
    getDetails: (id) => api.get(`/chatbot/knowledge/${id}`),

    // 5. Cập nhật kiến thức
    updateKnowledge: (id, data) => api.put(`/chatbot/knowledge/${id}`, data),

    // 🌟 6. THÊM MỚI: API LẤY LỊCH SỬ CHAT CỦA KHÁCH HÀNG
    getChatHistory: (page = 0, size = 10, search = "", startDate = "", endDate = "") => {
        let url = `/chatbot/history?page=${page}&size=${size}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
        return api.get(url);
    }
};

export default chatbotAdminService;