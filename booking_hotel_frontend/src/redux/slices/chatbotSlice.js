import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatbotAdminService from '../../services/chatbotAdminService';

// --- CÁC THUNK GIỮ NGUYÊN ---
export const fetchKnowledge = createAsyncThunk('chatbot/fetchKnowledge', async ({ page = 1, size = 10, search = '' }, thunkAPI) => {
    try {
        const response = await chatbotAdminService.getAllKnowledge(page, size, search);
        return response.data; 
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const trainChatbot = createAsyncThunk('chatbot/train', async (payload, thunkAPI) => {
    try {
        const response = await chatbotAdminService.trainBot(payload);
        return response.data; 
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const deleteKnowledge = createAsyncThunk('chatbot/delete', async (id, thunkAPI) => {
    try {
        await chatbotAdminService.deleteKnowledge(id);
        return id; 
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchKnowledgeDetails = createAsyncThunk('chatbot/fetchDetails', async (id, thunkAPI) => {
    try {
        const response = await chatbotAdminService.getDetails(id);
        return response.data; 
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const updateKnowledge = createAsyncThunk('chatbot/update', async ({ id, data }, thunkAPI) => {
    try {
        const response = await chatbotAdminService.updateKnowledge(id, data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

// Thunk lấy lịch sử chat
export const fetchChatHistory = createAsyncThunk(
    'chatbot/fetchHistory',
    async ({ page = 0, size = 10, search = "", startDate = "", endDate = "" }, thunkAPI) => {
        try {
            const response = await chatbotAdminService.getChatHistory(page, size, search, startDate, endDate);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const chatbotSlice = createSlice({
    name: 'chatbot',
    initialState: {
        knowledgeList: [],
        pageInfo: { page: 1, pageSize: 10, totalElements: 0 },
        currentDetails: null,
        
        // State cho Lịch sử Chat
        historyList: [],
        historyPageInfo: { page: 0, pageSize: 10, totalElements: 0 },
        
        isLoading: false,
        error: null,
    },
    reducers: {
        clearCurrentDetails: (state) => {
            state.currentDetails = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- Fetch Knowledge ---
            .addCase(fetchKnowledge.pending, (state) => { state.isLoading = true; })
            .addCase(fetchKnowledge.fulfilled, (state, action) => {
                state.isLoading = false;
                state.knowledgeList = action.payload?.knowledgeBase || [];
                state.pageInfo = action.payload?.pageInfo || { page: 1, pageSize: 10, totalElements: 0 };
            })
            .addCase(fetchKnowledge.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            
            // --- Train Chatbot ---
            .addCase(trainChatbot.fulfilled, (state, action) => {
                state.knowledgeList.unshift(action.payload);
                state.pageInfo.totalElements += 1;
            })
            
            // --- Delete Knowledge ---
            .addCase(deleteKnowledge.fulfilled, (state, action) => {
                state.knowledgeList = state.knowledgeList.filter(item => item.id !== action.payload);
                state.pageInfo.totalElements -= 1;
            })
            
            // --- Fetch Details ---
            .addCase(fetchKnowledgeDetails.fulfilled, (state, action) => {
                state.currentDetails = action.payload;
            })
            
            // --- Update Knowledge ---
            .addCase(updateKnowledge.fulfilled, (state, action) => {
                const index = state.knowledgeList.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.knowledgeList[index] = action.payload;
                }
            })
            
            // 🌟 ĐÃ SỬA: Xử lý bóc tách dữ liệu an toàn cho Lịch sử chat
            // 🌟 ĐÃ SỬA: Xử lý bóc tách khớp 100% với JSON Backend của bạn
            .addCase(fetchChatHistory.pending, (state) => { 
                state.isLoading = true; 
                state.error = null;
            })
            .addCase(fetchChatHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                
                // Phá kén lớp bọc ngoài cùng (BaseResponse)
                const serverData = action.payload?.data ? action.payload.data : action.payload;
                
                // 1. Trỏ đúng vào key "history" của Spring Boot
                state.historyList = serverData?.history || []; 
                
                // 2. Trỏ đúng vào object "paginationInfo"
                state.historyPageInfo = {
                    page: serverData?.paginationInfo?.page || 0,
                    pageSize: serverData?.paginationInfo?.pageSize || 10,
                    totalElements: serverData?.paginationInfo?.totalElements || 0
                };
            })
            .addCase(fetchChatHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.historyList = []; 
            });
    },
});

export const { clearCurrentDetails } = chatbotSlice.actions;
export default chatbotSlice.reducer;