import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import furnitureReducer from "./slices/furnitureSlice";
import roomReducer from "./slices/roomSlice";
import profileReducer from "./slices/profileSlice";
import chatbotReducer from './slices/chatbotSlice';
import chatReducer from './slices/chatSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        furniture: furnitureReducer,
        room: roomReducer,
        profile: profileReducer,
        chatbot: chatbotReducer,
        chat: chatReducer,
    },
});

export default store;