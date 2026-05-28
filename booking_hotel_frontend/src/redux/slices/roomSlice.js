import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import roomService from "../../services/roomService";

export const fetchRooms = createAsyncThunk(
    "room/fetchRooms",
    async (params, { rejectWithValue }) => {
        try {
            return await roomService.getAll(params);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Lỗi tải danh sách phòng");
        }
    }
);

export const fetchRoomStatuses = createAsyncThunk(
    "room/fetchRoomStatuses",
    async (_, { rejectWithValue }) => {
        try {
            return await roomService.getStatuses();
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Lỗi tải trạng thái phòng");
        }
    }
);

export const fetchRoomTypes = createAsyncThunk(
    "room/fetchRoomTypes",
    async (_, { rejectWithValue }) => {
        try {
            return await roomService.getRoomTypes();
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Lỗi tải loại phòng");
        }
    }
);

export const createRoom = createAsyncThunk(
    "room/createRoom",
    async (data, { rejectWithValue }) => {
        try {
            return await roomService.create(data);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Lỗi tạo phòng");
        }
    }
);

export const updateRoom = createAsyncThunk(
    "room/updateRoom",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await roomService.update(id, data);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Lỗi cập nhật phòng");
        }
    }
);

export const deleteRoom = createAsyncThunk(
    "room/deleteRoom",
    async (id, { rejectWithValue }) => {
        try {
            await roomService.delete(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Lỗi xóa phòng");
        }
    }
);

export const restoreRoom = createAsyncThunk(
    "room/restoreRoom",
    async (id, { rejectWithValue }) => {
        try {
            return await roomService.restore(id);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Lỗi khôi phục phòng");
        }
    }
);

const roomSlice = createSlice({
    name: "room",
    initialState: {
        items: [],
        statuses: [],
        roomTypes: [],
        pagination: {
            currentPage: 0,
            pageSize: 20,
            totalElements: 0,
            totalPages: 0,
            last: true,
        },
        loading: false,
        submitting: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRooms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRooms.fulfilled, (state, action) => {
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
            .addCase(fetchRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchRoomStatuses.fulfilled, (state, action) => {
                state.statuses = action.payload;
            })
            .addCase(fetchRoomTypes.fulfilled, (state, action) => {
                state.roomTypes = action.payload;
            })

            .addCase(createRoom.pending, (state) => { state.submitting = true; })
            .addCase(createRoom.fulfilled, (state, action) => {
                state.submitting = false;
                state.items.unshift(action.payload);
                state.pagination.totalElements += 1;
            })
            .addCase(createRoom.rejected, (state) => { state.submitting = false; })

            .addCase(updateRoom.pending, (state) => { state.submitting = true; })
            .addCase(updateRoom.fulfilled, (state, action) => {
                state.submitting = false;
                const idx = state.items.findIndex((r) => r.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(updateRoom.rejected, (state) => { state.submitting = false; })

            .addCase(deleteRoom.pending, (state) => { state.submitting = true; })
            .addCase(deleteRoom.fulfilled, (state, action) => {
                state.submitting = false;
                const idx = state.items.findIndex((r) => r.id === action.payload);
                if (idx !== -1) state.items[idx] = { ...state.items[idx], isDeleted: true };
            })
            .addCase(deleteRoom.rejected, (state) => { state.submitting = false; })

            .addCase(restoreRoom.pending, (state) => { state.submitting = true; })
            .addCase(restoreRoom.fulfilled, (state, action) => {
                state.submitting = false;
                const idx = state.items.findIndex((r) => r.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(restoreRoom.rejected, (state) => { state.submitting = false; });
    },
});

export default roomSlice.reducer;
