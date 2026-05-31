import axiosInstance from "./axiosInstance";

const reviewService = {
    getAll: async (params) => {
        const response = await axiosInstance.get("/reviews", { params });
        return response.data;
    },
    reply: async (reviewId, data) => {
        const response = await axiosInstance.put(`/reviews/${reviewId}/reply`, data);
        return response.data;
    },
};

export default reviewService;
