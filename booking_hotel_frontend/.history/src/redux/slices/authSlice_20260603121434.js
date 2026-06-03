import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../../services/authApi";
import tokenUtils from "../../utils/tokenUtils";

// Phục hồi thông tin User khi nhấn F5 tránh mất dữ liệu trạng thái UI
const getInitialUser = () => {
    const savedUser = localStorage.getItem("user");
    try {
        // 🌟 Chặn đứng ngay chuỗi rác "undefined" hoặc "null"
        if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
            return JSON.parse(savedUser);
        }
        return null; // Nếu là rác thì trả về null
    } catch  {
        console.error("GRAND_HOTEL_AUTH: Phát hiện rác trong Storage, đang dọn dẹp...");
        localStorage.removeItem("user"); // Tự động dọn rác nếu parse xịt
        return null;
    }
};

// ==========================================
// 🌟 1. CÁC ASYNC THUNK (XỬ LÝ BẤT ĐỒNG BỘ)
// ==========================================

// THUNK ĐĂNG NHẬP
export const loginThunk = createAsyncThunk(
    "auth/login",
    async (loginData, { rejectWithValue }) => {
        try {
            const response = await authApi.login(loginData);
            // Khớp cấu trúc BaseResponse: bóc tách lấy trường data chứa { accessToken, refreshToken, user }
            return response.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!");
        }
    }
);

// 🌟 THUNK ĐĂNG KÝ (Bổ sung đầy đủ theo đúng phong cách kiến trúc cũ của bạn)
export const registerThunk = createAsyncThunk(
    "auth/register",
    async (registerData, { rejectWithValue }) => {
        try {
            const response = await authApi.register(registerData);
            // Trả về dữ liệu thành công từ Backend ({ status, message, data })
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Đăng ký tài khoản thất bại!");
        }
    }
);

// 🌟 THUNK LÀM MỚI TOKEN (Bổ sung phục vụ cơ chế tự động gia hạn phiên của Interceptor)
export const refreshTokenThunk = createAsyncThunk(
    "auth/refreshToken",
    async (_, { rejectWithValue }) => {
        try {
            const refreshToken = tokenUtils.getRefreshToken();
            if (!refreshToken || refreshToken === "null" || refreshToken === "undefined") {
                throw new Error("Không tìm thấy Refresh Token hợp lệ");
            }
            
            const response = await authApi.refreshToken({ refreshToken });
            // Cấu trúc mong đợi nhận về từ API: { data: { accessToken, refreshToken } } hoặc bọc trong 'result'
            return response.data?.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Phiên đăng nhập đã hết hạn toàn cục!");
        }
    }
);

// THUNK ĐỔI MẬT KHẨU
export const changePasswordThunk = createAsyncThunk(
    "auth/changePassword",
    async (passwordData, { rejectWithValue }) => {
        try {
            const response = await authApi.changePassword(passwordData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Đổi mật khẩu thất bại!");
        }
    }
);

// THUNK ĐĂNG XUẤT
// 🌟 LOGOUT THUNK (Đã dọn dẹp tham số thừa để xóa sạch lỗi ts(6133))
export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async () => {
        try {
            const refreshToken = tokenUtils.getRefreshToken();
            if (refreshToken && refreshToken !== "null" && refreshToken !== "undefined") {
                await authApi.logout(refreshToken);
            }
        } catch  {
            console.error("GRAND_HOTEL_AUTH: Không thể hủy session trên server (Có thể đã hết hạn từ trước).");
        } finally {
            // Dọn dẹp tuyệt đối túi quần client bất luận server phản hồi ra sao
            tokenUtils.clearTokens();
            localStorage.removeItem("user");
        }
    }
);

// ==========================================
// ⚙️ 2. SLICE ENGINE CONFIGURATION
// ==========================================
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: getInitialUser(),
        accessToken: tokenUtils.getAccessToken(),
        refreshToken: tokenUtils.getRefreshToken(),
        isAuthenticated: !!tokenUtils.getAccessToken(),
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetAuth: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            tokenUtils.clearTokens();
            localStorage.removeItem("user");
        },
        loginSuccess: (state, action) => {
            const { token, user } = action.payload;
            state.accessToken = token;
            state.user = user;
            state.isAuthenticated = true;
            
            tokenUtils.setTokens(token, null); 
            localStorage.setItem("user", JSON.stringify(user));
        }
    },
    extraReducers: (builder) => {
        builder
            // ------------------------------------------
            // 🔐 LUỒNG XỬ LÝ: LOGIN
            // ------------------------------------------
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                
                // 🌟 Bóc tách an toàn hơn
                const accessToken = action.payload.accessToken;
                const refreshToken = action.payload.refreshToken;
                
                // 🌟 BẮT BỆNH Ở ĐÂY: Nếu API không có object 'user', ta lấy luôn toàn bộ payload làm user
                const user = action.payload.user || action.payload; 

                state.accessToken = accessToken;
                state.refreshToken = refreshToken;
                state.user = user;

                tokenUtils.setTokens(accessToken, refreshToken);
                localStorage.setItem("user", JSON.stringify(user));
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ------------------------------------------
            // 📝 LUỒNG XỬ LÝ: REGISTER (Quản lý trạng thái loading/lỗi cho nút đăng ký)
            // ------------------------------------------
            .addCase(registerThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerThunk.fulfilled, (state) => {
                state.loading = false;
                // Đăng ký thành công không làm thay đổi trạng thái đăng nhập trực tiếp, 
                // người dùng sẽ được chuyển hướng sang trang /login tự động bằng hiệu ứng tại Page.
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ------------------------------------------
            // 🔄 LUỒNG XỬ LÝ: REFRESH TOKEN (Tự động cập nhật khóa bảo mật)
            // ------------------------------------------
            .addCase(refreshTokenThunk.fulfilled, (state, action) => {
                const { accessToken, refreshToken } = action.payload;
                state.accessToken = accessToken;
                
                if (refreshToken) {
                    state.refreshToken = refreshToken;
                }
                
                // Lưu token mới đè lên storage cũ
                tokenUtils.setTokens(accessToken, refreshToken || state.refreshToken);
            })
            .addCase(refreshTokenThunk.rejected, (state, action) => {
                // Nếu refresh thất bại tức là cả hai token đều tèo -> Ép giải phóng bộ nhớ
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                state.error = action.payload;
                tokenUtils.clearTokens();
                localStorage.removeItem("user");
            })

            // ------------------------------------------
            // 🔑 LUỒNG XỬ LÝ: CHANGE PASSWORD
            // ------------------------------------------
            .addCase(changePasswordThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePasswordThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(changePasswordThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ------------------------------------------
            // 🚪 LUỒNG XỬ LÝ: LOGOUT
            // ------------------------------------------
            .addCase(logoutThunk.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null;
            });
    },
});

export const { clearError, resetAuth, loginSuccess } = authSlice.actions;
export default authSlice.reducer;