import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatService from '../../services/chatService';

// Gọi API Gemini
export const askGeminiThunk = createAsyncThunk(
    'chat/askGemini',
    async (message, thunkAPI) => {
        try {
            const reply = await chatService.askGemini(message);
            return reply; 
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        isOpen: false, // Trạng thái đóng/mở khung chat
        isTyping: false, // Hiệu ứng bot đang gõ chữ
        messages: [
            { 
                sender: 'bot', 
                text: "Xin chào! Tôi là trợ lý ảo của Khách sạn LuxeStay. Tôi có thể giúp gì cho bạn?",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ],
    },
    reducers: {
        toggleChatWindow: (state) => {
            state.isOpen = !state.isOpen;
        },
        addUserMessage: (state, action) => {
            state.messages.push({
                sender: 'user',
                text: action.payload,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        },
        clearChat: (state) => {
            state.messages = [state.messages[0]]; // Giữ lại câu chào mặc định
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(askGeminiThunk.pending, (state) => {
                state.isTyping = true;
            })
            .addCase(askGeminiThunk.fulfilled, (state, action) => {
                state.isTyping = false;
                state.messages.push({
                    sender: 'bot',
                    text: action.payload,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
            })
            .addCase(askGeminiThunk.rejected, (state) => {
                state.isTyping = false;
                state.messages.push({
                    sender: 'bot',
                    text: "Sorry, I'm having trouble connecting to the server. Please try again later! \n\n (Rất tiếc, tôi đang gặp sự cố kết nối với máy chủ. Vui lòng thử lại sau!)",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
            });
    },
});

export const { toggleChatWindow, addUserMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;