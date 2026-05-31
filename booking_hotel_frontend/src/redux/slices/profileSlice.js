import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import profileApi from "../../services/profileApi";

// THUNK LẤY THÔNG TIN PROFILE
export const getMyProfileThunk = createAsyncThunk(
    "profile/getMe",
    async (_, { rejectWithValue }) => {
        try {
            const response = await profileApi.getMyProfile();
            // Khớp cấu trúc BaseResponse, trả về object data chứa thông tin profile
            return response.data || response; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Không thể tải thông tin hồ sơ!");
        }
    }
);

// THUNK CẬP NHẬT PROFILE
export const updateMyProfileThunk = createAsyncThunk(
    "profile/updateMe",
    async ({ updateData, avatarFile }, { rejectWithValue }) => {
        try {
            const response = await profileApi.updateMyProfile(updateData, avatarFile);
            return response.data || response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Cập nhật hồ sơ thất bại!");
        }
    }
);

const profileSlice = createSlice({
    name: "profile",
    initialState: {
        profileData: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearProfileError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // LUỒNG LẤY PROFILE
            .addCase(getMyProfileThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyProfileThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.profileData = action.payload;
            })
            .addCase(getMyProfileThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // LUỒNG CẬP NHẬT PROFILE
            .addCase(updateMyProfileThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMyProfileThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.profileData = action.payload; // Ghi đè dữ liệu mới sau khi update thành công
            })
            .addCase(updateMyProfileThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;