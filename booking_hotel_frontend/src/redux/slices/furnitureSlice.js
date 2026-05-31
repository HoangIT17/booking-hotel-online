import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import furnitureService from "../../services/furnitureService";

// ==========================================
// 1. ASYNC THUNKS
// ==========================================

export const fetchFurnitures = createAsyncThunk(
    "furniture/fetchAll",
    async (params, { rejectWithValue }) => {
        try {
            return await furnitureService.getAll(params);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Không thể tải danh sách nội thất!");
        }
    }
);

export const fetchFurnitureTypes = createAsyncThunk(
    "furniture/fetchTypes",
    async (_, { rejectWithValue }) => {
        try {
            return await furnitureService.getTypes();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Không thể tải danh sách loại nội thất!");
        }
    }
);

export const createFurniture = createAsyncThunk(
    "furniture/create",
    async (data, { rejectWithValue }) => {
        try {
            return await furnitureService.create(data);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Tạo nội thất thất bại!");
        }
    }
);

export const updateFurniture = createAsyncThunk(
    "furniture/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await furnitureService.update(id, data);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Cập nhật nội thất thất bại!");
        }
    }
);

export const deleteFurniture = createAsyncThunk(
    "furniture/delete",
    async (id, { rejectWithValue }) => {
        try {
            await furnitureService.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Xóa nội thất thất bại!");
        }
    }
);

// ==========================================
// 2. SLICE
// ==========================================

const furnitureSlice = createSlice({
    name: "furniture",
    initialState: {
        items: [],
        types: [],
        loading: false,
        submitting: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ------------------------------------------
            // FETCH ALL
            // ------------------------------------------
            .addCase(fetchFurnitures.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFurnitures.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload || [];
            })
            .addCase(fetchFurnitures.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ------------------------------------------
            // FETCH TYPES
            // ------------------------------------------
            .addCase(fetchFurnitureTypes.fulfilled, (state, action) => {
                state.types = action.payload || [];
            })

            // ------------------------------------------
            // CREATE
            // ------------------------------------------
            .addCase(createFurniture.pending, (state) => {
                state.submitting = true;
            })
            .addCase(createFurniture.fulfilled, (state, action) => {
                state.submitting = false;
                state.items = [action.payload, ...state.items];
            })
            .addCase(createFurniture.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })

            // ------------------------------------------
            // UPDATE
            // ------------------------------------------
            .addCase(updateFurniture.pending, (state) => {
                state.submitting = true;
            })
            .addCase(updateFurniture.fulfilled, (state, action) => {
                state.submitting = false;
                const idx = state.items.findIndex((i) => i.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(updateFurniture.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })

            // ------------------------------------------
            // DELETE
            // ------------------------------------------
            .addCase(deleteFurniture.pending, (state) => {
                state.submitting = true;
            })
            .addCase(deleteFurniture.fulfilled, (state, action) => {
                state.submitting = false;
                state.items = state.items.filter((i) => i.id !== action.payload);
            })
            .addCase(deleteFurniture.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = furnitureSlice.actions;
export default furnitureSlice.reducer;