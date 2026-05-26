import axios from "axios";
import tokenUtils from "../utils/tokenUtils";
import { toast } from "react-hot-toast"; 

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// 1. REQUEST INTERCEPTOR: Xử lý trước khi gửi đi
axiosInstance.interceptors.request.use(
    (config) => {
        const token = tokenUtils.getAccessToken();
        if (token && token !== "null" && token !== "undefined" && token.trim() !== "") {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. RESPONSE INTERCEPTOR: Xử lý khi nhận Data
axiosInstance.interceptors.response.use(
    (response) => {
        return response.data; // Trả về cục { status, message, data } sạch
    },
    async (error) => {
        const originalRequest = error.config;

        // --- A. Xử lý 403 (Sai quyền) ---
        if (error.response?.status === 403) {
            toast.error("Bạn không có quyền truy cập vào chức năng này!"); 
            return Promise.reject(error);
        }

        // --- B. Xử lý 401 (Hết hạn Token / Sai thông tin Auth) ---
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // 🛡️ ĐÃ SỬA: Chặn đứng luồng nếu chính cụm API /auth/ bị lỗi 401 (Ví dụ: Sai mật khẩu)
            if (originalRequest.url?.includes("/auth/")) {
                const loginMessage = error.response?.data?.message || "Tài khoản hoặc mật khẩu không chính xác!";
                toast.error(loginMessage);
                return Promise.reject(error); // 👈 Bắt buộc phải ngắt luồng ở đây
            }

            originalRequest._retry = true; 

            try {
                const refreshToken = tokenUtils.getRefreshToken();
                if (!refreshToken || refreshToken === "null" || refreshToken === "undefined") {
                    throw new Error("Không tìm thấy Refresh Token");
                }

                // Dùng axios thô để tránh bị interceptor này bắt lại gây lặp vòng
                const refreshResponse = await axios.post(
                    `${axiosInstance.defaults.baseURL}/auth/refresh-token`,
                    { refreshToken }
                );

                const responseData = refreshResponse.data;
                // Khớp định dạng BaseResponse lấy trường data nhỏ bên trong
                const newAccessToken = responseData?.data?.accessToken;
                const newRefreshToken = responseData?.data?.refreshToken;

                if (!newAccessToken) {
                    throw new Error("Backend không trả về Access Token mới");
                }

                tokenUtils.setTokens(newAccessToken, newRefreshToken || refreshToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
                tokenUtils.clearTokens();
                localStorage.removeItem("user"); 
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        // --- C. Bẫy các lỗi validation / nghiệp vụ từ Backend nhả ra ---
        // Lưu ý: Nếu ở Page bạn đã bắt lỗi bằng Thunk rồi thì có thể cân nhắc tắt dòng toast ở đây 
        // để tránh hiện tượng báo lỗi 2 lần trùng lặp.
        const serverMessage = error.response?.data?.message || "Đã xảy ra lỗi hệ thống!";
        toast.error(serverMessage); 
        
        return Promise.reject(error);
    }
);

export default axiosInstance;