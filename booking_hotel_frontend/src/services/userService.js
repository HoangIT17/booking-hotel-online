import axiosInstance from "./axiosInstance";

const userService = {
    /**
     * 1. API: Lấy danh sách người dùng (Kèm phân trang, tìm kiếm, lọc)
     * GET /api/v1/users
     */
    getAllUsers: async (params) => {
        // params truyền vào là 1 object { page, size, keyword, role, isActive, sortBy, sortDir }
        const response = await axiosInstance.get("/users", { params });
        return response.data; // Trả về object BaseResponse của bạn
    },

    /**
     * 2. API: Lấy chi tiết một người dùng
     * GET /api/v1/users/{id}
     */
    getUserById: async (id) => {
        const response = await axiosInstance.get(`/users/${id}`);
        return response.data;
    },

    /**
     * 3. API: Tạo tài khoản nội bộ mới (Chỉ dành cho Admin)
     * POST /api/v1/users
     */
    createUser: async (userData) => {
        const response = await axiosInstance.post("/users", userData);
        return response.data;
    },

    /**
     * 4. API: Cập nhật thông tin người dùng
     * PUT /api/v1/users/{id}
     */
    updateUser: async (id, updateData) => {
        const response = await axiosInstance.put(`/users/${id}`, updateData);
        return response.data;
    },

    /**
     * 5. API: Xóa (hoặc vô hiệu hóa) người dùng
     * DELETE /api/v1/users/{id}
     */
    deleteUser: async (id) => {
        const response = await axiosInstance.delete(`/users/${id}`);
        return response.data;
    }
};

export default userService;