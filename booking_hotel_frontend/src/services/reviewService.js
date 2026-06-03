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
    getMyReviews: async (params) => {
        const response = await axiosInstance.get("/customer/reviews", { params });
        return response.data;
    },
    deleteReview: (reviewId) => axiosInstance.delete(`/reviews/${reviewId}`),
};

export default reviewService;
