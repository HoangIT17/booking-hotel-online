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

// 1. REQUEST INTERCEPTOR: Tự động bơm Token vào đầu mỗi Request
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

// 2. RESPONSE INTERCEPTOR: Xử lý kết quả trả về toàn cục
axiosInstance.interceptors.response.use(
    (response) => {
        // Trả về cục { status, message, data } sạch cho Front-end dùng
        return response.data; 
    },
    async (error) => {
        const originalRequest = error.config;
        const statusCode = error.response?.status;
        const serverMessage = error.response?.data?.message;

        // --- A. XỬ LÝ LỖI 403 (Sai quyền hạn / Cấm truy cập) ---
        if (statusCode === 403) {
            toast.error("Bạn không có quyền truy cập vào chức năng này!"); 
            return Promise.reject(error);
        }

        // --- B. XỬ LÝ LỖI 401 (Hết hạn Token hoặc Lỗi Đăng Nhập) ---
        if (statusCode === 401) {
            
            // 🛡️ BẮT RIÊNG API LOGIN: Nếu lỗi 401 xảy ra tại API đăng nhập thực sự
            if (originalRequest.url?.includes("/auth/login")) {
                toast.error(serverMessage || "Tài khoản hoặc mật khẩu không chính xác!");
                return Promise.reject(error);
            }

            // Nếu lỗi 401 ở các API khác (như đổi mật khẩu, lấy data...) -> Tiến hành tự động Refresh Token
            if (!originalRequest._retry) {
                originalRequest._retry = true; 

                try {
                    const refreshToken = tokenUtils.getRefreshToken();
                    if (!refreshToken || refreshToken === "null" || refreshToken === "undefined") {
                        throw new Error("Không tìm thấy Refresh Token");
                    }

                    // Dùng axios thô để gọi API cấp lại Access Token mới
                    const refreshResponse = await axios.post(
                        `${axiosInstance.defaults.baseURL}/auth/refresh-token`,
                        { refreshToken }
                    );

                    const responseData = refreshResponse.data;
                    const newAccessToken = responseData?.data?.accessToken;
                    const newRefreshToken = responseData?.data?.refreshToken;

                    if (!newAccessToken) {
                        throw new Error("Backend không trả về Access Token mới");
                    }

                    // Lưu mã khóa mới vào túi
                    tokenUtils.setTokens(newAccessToken, newRefreshToken || refreshToken);
                    
                    // Gắn Token mới vào Request cũ và chạy tiếp tục
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);

                } catch (refreshError) {
                    toast.error("Phiên đăng nhập đã hết hạn toàn cục. Vui lòng đăng nhập lại!");
                    tokenUtils.clearTokens();
                    localStorage.removeItem("user"); 
                    window.location.href = "/login";
                    return Promise.reject(refreshError);
                }
            }
        }

        // --- C. BẪY LỖI 400 (VALIDATION / NGHIỆP VỤ) HOẶC CÁC LỖI KHÁC ---
        if (originalRequest.url?.includes("/auth/change-password")) {
            return Promise.reject(error); // Trả thẳng cục error về cho Page xử lý
        }

        // Đối với các API thông thường khác, tự động bắn toast lỗi lên màn hình
        const finalMessage = serverMessage || "Đã xảy ra lỗi hệ thống!";
        toast.error(finalMessage); 
        
        return Promise.reject(error);
    }
);

export default axiosInstance;