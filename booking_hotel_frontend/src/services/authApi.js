import axiosInstance from "./axiosInstance";

const authApi = {
    // 🌟 Đăng ký tài khoản mới (Gửi kèm fullName, phone, email, username, password)
    register: (registerData) => {
        return axiosInstance.post("/auth/register", registerData);
    },

    // 🌟 Đăng nhập hệ thống (Lấy về user info + cặp bài trùng Token)
    login: (loginData) => {
        return axiosInstance.post("/auth/login", loginData);
    },

    changePassword: (changePasswordData) => {
        return axiosInstance.put("/auth/change-password", changePasswordData);
    },

    refreshToken: (data) => {
        return axiosInstance.post("/auth/refresh-token", data);
    },

    logout: (refreshToken) => {
        return axiosInstance.post("/auth/logout", { refreshToken });
    }
};

export default authApi;