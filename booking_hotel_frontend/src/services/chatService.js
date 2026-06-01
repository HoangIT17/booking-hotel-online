import api from "./axiosInstance";

const chatService = {
    askGemini: async (message) => {
        try {
            // axiosInstance đã có sẵn baseURL là /api/v1
            const response = await api.post('/chatbot/ask', { 
                message: message 
            });
            // Hứng thẳng response.data.reply từ BaseResponse của Spring Boot
            return response.data.reply; 
        } catch (error) {
            console.error("Error in chatService:", error);
            throw error;
        }
    }
};

export default chatService;