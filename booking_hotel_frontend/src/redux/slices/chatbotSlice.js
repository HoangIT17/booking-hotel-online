import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatbotAdminService from '../../services/chatbotAdminService';

// --- CÁC THUNK CŨ GIỮ NGUYÊN ---
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

// 🌟 THÊM MỚI: Thunk lấy lịch sử chat
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
        // State cho Knowledge
        knowledgeList: [],
        pageInfo: { page: 1, pageSize: 10, totalElements: 0 },
        currentDetails: null,
        
        // 🌟 THÊM MỚI: State cho Lịch sử Chat
        historyList: [],
        historyPageInfo: { page: 0, pageSize: 10, totalElements: 0 },
        
        // Trạng thái chung
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
                state.knowledgeList = action.payload.knowledgeBase;
                state.pageInfo = action.payload.pageInfo;
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
            
            // 🌟 THÊM MỚI: Xử lý Fetch History
            .addCase(fetchChatHistory.pending, (state) => { state.isLoading = true; })
            .addCase(fetchChatHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                // Thay đổi các key (historyList, pageInfo) cho khớp với JSON trả về từ backend của bạn
                state.historyList = action.payload.content || action.payload.historyList; 
                state.historyPageInfo = {
                    page: action.payload.number || 0,
                    pageSize: action.payload.size || 10,
                    totalElements: action.payload.totalElements || 0
                };
            })
            .addCase(fetchChatHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentDetails } = chatbotSlice.actions;
export default chatbotSlice.reducer;