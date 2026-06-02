import axiosInstance from "./axiosInstance";

const managementService = {
  getReviews: (params) => axiosInstance.get("/reviews", { params }),
  updateReview: (reviewId, payload) =>
    axiosInstance.put(`/manager/reviews/${reviewId}`, payload),
  deleteReview: (reviewId) => axiosInstance.delete(`/manager/reviews/${reviewId}`),

  searchBookings: (params) =>
    axiosInstance.get("/manager/reservation-search", { params }),
  updateBooking: (payload) =>
    axiosInstance.put("/manager/reservation-update", payload),

  getVouchers: () => axiosInstance.get("/vouchers"),
  createVoucher: (payload) => axiosInstance.post("/vouchers", payload),
  updateVoucher: (id, payload) => axiosInstance.put(`/vouchers/${id}`, payload),
  deleteVoucher: (id) => axiosInstance.delete(`/vouchers/${id}`),
};

export default managementService;
