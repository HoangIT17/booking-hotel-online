import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import furnitureReducer from "./slices/furnitureSlice";
import roomReducer from "./slices/roomSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        furniture: furnitureReducer,
        room: roomReducer,
    },
});

export default store;