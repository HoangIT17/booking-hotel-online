import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// Chatbot
import ChatbotManagement from "../pages/admin/chatbot-management/ChatbotManagement";
import ChatbotDetailsPage from "../pages/admin/chatbot-management/ChatbotDetailsPage";
import ChatbotEditPage from "../pages/admin/chatbot-management/ChatbotEditPage";

// Lịch sử Chat
import ChatHistoryList from "../pages/history-chatbot/ChatHistoryList";

//  Import tất cả các Khung giao diện (Layouts)
import AdminLayout from "../layouts/AdminLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import ReceptionistLayout from "../layouts/ReceptionistLayout";
import StaffLayout from "../layouts/StaffLayout";
import CustomerLayout from "../layouts/CustomerLayout";

//  Import các trang Dashboard tương ứng của từng phân hệ
import DashboardAdmin from "../pages/admin/dashboard/Dashboard";
import FurniturePage from "../pages/admin/furniture/FurniturePage";
import RoomPage from "../pages/admin/rooms/RoomPage";
import DashboardManager from "../pages/manager/Dashboard";
import ReceptionistDashboard from "../pages/receptionist/Dashboard";
import StaffHousekeepingDashboard from "../pages/staff/Dashboard";
import HomePage from "../pages/homepage/HomePage";

// User Management
import UserManagement from "../pages/admin/usermanagement/UserManagement";

// Change Password
import ChangePasswordPage from "../pages/auth/ChangepasswordPage";

//Profile
import ProfilePage from "../pages/profile/ProfilePage";
import ProfileEditPage from "../pages/profile/ProfileEditPage";

// Google OAuth Callback
import LoginSuccess from "../pages/auth/LoginSuccess";

import ReviewPage from "../pages/admin/reviews/ReviewPage";
import BookingManagementPage from "../pages/admin/bookingmanagement/BookingManagementPage";
import VoucherManagementPage from "../pages/admin/bookingmanagement/VoucherManagementPage";
import RoomsPage from "../pages/customer/RoomsPage";
import RoomDetailPage from "../pages/customer/RoomDetailPage";
import RoomUnavailablePage from "../pages/customer/RoomUnavailablePage";
import OffersPage from "../pages/customer/OffersPage";
import ReservationsPage from "../pages/customer/ReservationsPage";
import ReservationDetailPage from "../pages/customer/ReservationDetailPage";
import BookingPage from "../pages/customer/BookingPage";
import PaymentRedirectPage from "../pages/customer/PaymentRedirectPage";
import PaymentResultPage from "../pages/customer/PaymentResultPage";
import PaymentStatusPage from "../pages/customer/PaymentStatusPage";
import MyReviewsPage from "../pages/customer/MyReviewsPage";
import IncidentManager from "../pages/manager/IncidentManager";
import IncidentReport from "../pages/manager/IncidentReport";
import ViewCleaningTasks from "../pages/staff/ViewCleaningTasks";
import ViewMyCleaningTasks from "../pages/staff/ViewMyCleaningTasks";
import RoomDetail from "../pages/staff/RoomDetail";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      {/* Bọc trong PublicRoute để chặn quay lại khi đã đăng nhập */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route path="/login-success" element={<LoginSuccess />} />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Trang chủ xem phòng của khách hàng sau khi login */}
      <Route element={<CustomerLayout />}>
        {/* 🟢 NHÓM PUBLIC: Không cần đăng nhập */}
        <Route path="/" element={<HomePage />} />

        {/* Nếu khách có thói quen gõ /home, tự động bẻ lái về / cho chuẩn SEO */}
        <Route path="/home" element={<Navigate to="/" replace />} />

        {/* Các trang khách hàng */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
        <Route path="/rooms/unavailable" element={<RoomUnavailablePage />} />
        <Route path="/payment/result" element={<PaymentResultPage />} />
        <Route path="/payment/status" element={<PaymentStatusPage />} />

        {/* 🔴 NHÓM PROTECTED: Bắt buộc phải đăng nhập (Có role CUSTOMER) */}
        <Route
          element={<ProtectedRoute allowedRoles={["CUSTOMER", "ADMIN"]} />}
        >
          {/* Các trang chỉ dành cho khách đã đăng nhập */}
          <Route
            path="/customer/change-password"
            element={<ChangePasswordPage />}
          />
          <Route path="/customer/profile" element={<ProfilePage />} />
          <Route path="/customer/profile/edit" element={<ProfileEditPage />} />
          <Route path="/customer/booking" element={<BookingPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route
            path="/customer/reservations/:bookingId"
            element={<ReservationDetailPage />}
          />
          <Route
            path="/customer/payment/redirect"
            element={<PaymentRedirectPage />}
          />
        </Route>
      </Route>

      {/* ================= ROLE ADMIN ================= */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        {/* Lớp 2: Khung giao diện - Bọc Header, Sidebar cho toàn bộ các trang con */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Lớp 3: Nội dung (Sẽ chui vào cái <Outlet /> của AdminLayout) */}
          {/* Lưu ý: path ở đây chỉ cần viết "dashboard" (không có dấu / ở đầu) vì nó nối tiếp từ /admin */}
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="chatbot" element={<ChatbotManagement />} />
          <Route path="chatbot/:id" element={<ChatbotDetailsPage />} />
          <Route path="chatbot/edit/:id" element={<ChatbotEditPage />} />
          <Route path="chat-history" element={<ChatHistoryList />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="furnitures" element={<FurniturePage />} />
          <Route path="rooms" element={<RoomPage />} />
          <Route path="reviews" element={<ReviewPage />} />
          <Route path="bookings" element={<BookingManagementPage />} />
          <Route path="vouchers" element={<VoucherManagementPage />} />
          <Route path="incidents" element={<IncidentManager />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<ProfileEditPage />} />
        </Route>
      </Route>

      {/* ================= 📊 ROLE: MANAGER ================= */}
      <Route element={<ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]} />}>
        {/* Đã sửa từ AdminLayout sang ManagerLayout ✅ */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route path="change-password" element={<ChangePasswordPage />} />

          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardManager />} />
          <Route path="furnitures" element={<FurniturePage />} />
          <Route path="rooms" element={<RoomPage />} />
          <Route path="reviews" element={<ReviewPage />} />
          <Route path="bookings" element={<BookingManagementPage />} />
          <Route path="vouchers" element={<VoucherManagementPage />} />
          <Route path="incidents" element={<IncidentManager />} />
          <Route path="incident-reports" element={<IncidentReport />} />
          <Route path="chat-history" element={<ChatHistoryList />} />
          <Route path="chatbot" element={<ChatbotManagement />} />
          <Route path="chatbot/:id" element={<ChatbotDetailsPage />} />
          <Route path="chatbot/edit/:id" element={<ChatbotEditPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<ProfileEditPage />} />
        </Route>
      </Route>

      {/* ================= 🛎️ ROLE: RECEPTIONIST ================= */}
      <Route
        element={<ProtectedRoute allowedRoles={["RECEPTIONIST", "ADMIN"]} />}
      >
        {/* Đã bọc cấu trúc Layout lồng nhau chuẩn chỉ ✅ */}
        <Route path="/receptionist" element={<ReceptionistLayout />}>
          <Route path="change-password" element={<ChangePasswordPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<ProfileEditPage />} />
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ReceptionistDashboard />} />
          {/* Thêm chức năng lễ tân: bookings, checkin-checkout... tại đây */}
          <Route path="bookings" element={<BookingManagementPage />} />
          <Route path="cleaning-tasks" element={<ViewCleaningTasks />} />
          <Route
            path="/receptionist/room-detail/:roomNumber"
            element={<RoomDetail />}
          />
        </Route>
      </Route>

      {/* ================= 🧹 ROLE: STAFF ================= */}
      <Route element={<ProtectedRoute allowedRoles={["STAFF", "ADMIN"]} />}>
        {/* Đã bọc cấu trúc Layout lồng nhau chuẩn chỉ ✅ */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route path="change-password" element={<ChangePasswordPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<ProfileEditPage />} />
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StaffHousekeepingDashboard />} />
          {/* Thêm chức năng nhân viên: tasks, room-status... tại đây */}
          <Route path="view-tasks" element={<ViewCleaningTasks />} />
          <Route
            path="/staff/room-detail/:roomNumber"
            element={<RoomDetail />}
          />
          <Route path="my-tasks" element={<ViewMyCleaningTasks />} />
        </Route>
      </Route>

      {/* ================= ERROR 403 ================= */}
      <Route
        path="/403"
        element={
          <div className="text-center mt-20 text-xl font-bold text-red-600">
            403 Forbidden - Bạn không có quyền truy cập vào khu vực làm việc
            này!
          </div>
        }
      />

      {/* Hướng đi mặc định nếu gõ sai URL */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
