import axiosInstance from "./axiosInstance";

const customerBookingService = {
  searchRooms: (params) => axiosInstance.get("/customer/rooms/search", { params }),
  getRoomDetail: (roomId) => axiosInstance.get(`/customer/rooms/search/${roomId}`),
  createBooking: (payload) => axiosInstance.post("/reservation-create", payload),
  createVnPayPayment: (payload) => axiosInstance.post("/payments/vnpay/create", payload),
  handleVnPayReturn: (params) => axiosInstance.get("/payments/vnpay/return", { params }),
  searchReservations: (params) => axiosInstance.get("/customer/reservation-search", { params }),
  updateReservation: (payload) => axiosInstance.put("/customer/reservation-update", payload),
  getReviews: (params) => axiosInstance.get("/reviews", { params }),
  createReview: (payload) => axiosInstance.post("/customer/reviews", payload),
  getAvailableVouchers: () => axiosInstance.get("/customer/vouchers/available"),
};

export default customerBookingService;
