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
    if (
      token &&
      token !== "null" &&
      token !== "undefined" &&
      token.trim() !== ""
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const statusCode = error.response?.status;
    const serverMessage = error.response?.data?.message;

    if (statusCode === 403) {
      toast.error("Bạn không có quyền truy cập vào chức năng này!");
      return Promise.reject(error);
    }

    if (statusCode === 401) {
      if (originalRequest.url?.includes("/auth/login")) {
        toast.error(
          serverMessage || "Tài khoản hoặc mật khẩu không chính xác!",
        );
        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = tokenUtils.getRefreshToken();

          // 🛡️ NẾU KHÔNG CÓ REFRESH TOKEN (Google Login), KHÔNG ĐƯỢC GỌI API REFRESH
          if (
            !refreshToken ||
            refreshToken === "null" ||
            refreshToken === "undefined"
          ) {
            throw new Error("GOOGLE_USER_NO_REFRESH");
          }

          const refreshResponse = await axios.post(
            `${axiosInstance.defaults.baseURL}/auth/refresh-token`,
            { refreshToken },
          );

          const responseData = refreshResponse.data;
          const newAccessToken = responseData?.data?.accessToken;
          const newRefreshToken = responseData?.data?.refreshToken;

          if (!newAccessToken) throw new Error("No token");

          tokenUtils.setTokens(newAccessToken, newRefreshToken || refreshToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // 🌟 XỬ LÝ NHẸ NHÀNG KHI HẾT HẠN
          if (refreshError.message !== "GOOGLE_USER_NO_REFRESH") {
            toast.error("Phiên đăng nhập đã hết hạn!");
          }

          tokenUtils.clearTokens();
          localStorage.removeItem("user");
          // Chuyển về login nếu thật sự hết hạn
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }

    if (originalRequest.url?.includes("/auth/change-password")) {
      return Promise.reject(error);
    }

    const finalMessage = serverMessage || "Đã xảy ra lỗi hệ thống!";
    toast.error(finalMessage);

    return Promise.reject(error);
  },
);

export default axiosInstance;
