import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reviewService from "../../services/reviewService";

export const fetchMyReviews = createAsyncThunk(
    "review/fetchMyReviews",
    async (params, { rejectWithValue }) => {
        try {
            return await reviewService.getMyReviews(params);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Lỗi tải đánh giá của bạn");
        }
    }
);

export const fetchReviews = createAsyncThunk(
    "review/fetchReviews",
    async (params, { rejectWithValue }) => {
        try {
            return await reviewService.getAll(params);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Lỗi tải danh sách đánh giá");
        }
    }
);

export const deleteReview = createAsyncThunk(
    "review/deleteReview",
    async (reviewId, { rejectWithValue }) => {
        try {
            await reviewService.deleteReview(reviewId);
            return reviewId;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Lỗi xóa đánh giá");
        }
    }
);

export const replyReview = createAsyncThunk(
    "review/replyReview",
    async ({ reviewId, data }, { rejectWithValue }) => {
        try {
            return await reviewService.reply(reviewId, data);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Lỗi gửi phản hồi");
        }
    }
);

const reviewSlice = createSlice({
    name: "review",
    initialState: {
        items: [],
        pagination: {
            currentPage: 0,
            pageSize: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
        },
        loading: false,
        submitting: false,
        error: null,
        myReviews: {
            items: [],
            pagination: { currentPage: 0, pageSize: 10, totalElements: 0, totalPages: 0, last: true },
            loading: false,
            error: null,
        },
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.content;
                state.pagination = {
                    currentPage: action.payload.currentPage,
                    pageSize: action.payload.pageSize,
                    totalElements: action.payload.totalElements,
                    totalPages: action.payload.totalPages,
                    last: action.payload.last,
                };
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteReview.fulfilled, (state, action) => {
                state.items = state.items.filter((r) => r.id !== action.payload);
                state.pagination.totalElements -= 1;
            })

            .addCase(replyReview.pending, (state) => { state.submitting = true; })
            .addCase(replyReview.fulfilled, (state, action) => {
                state.submitting = false;
                const idx = state.items.findIndex((r) => r.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(replyReview.rejected, (state) => { state.submitting = false; })

            .addCase(fetchMyReviews.pending, (state) => {
                state.myReviews.loading = true;
                state.myReviews.error = null;
            })
            .addCase(fetchMyReviews.fulfilled, (state, action) => {
                state.myReviews.loading = false;
                state.myReviews.items = action.payload.content;
                state.myReviews.pagination = {
                    currentPage: action.payload.currentPage,
                    pageSize: action.payload.pageSize,
                    totalElements: action.payload.totalElements,
                    totalPages: action.payload.totalPages,
                    last: action.payload.last,
                };
            })
            .addCase(fetchMyReviews.rejected, (state, action) => {
                state.myReviews.loading = false;
                state.myReviews.error = action.payload;
            });
    },
});

export default reviewSlice.reducer;
