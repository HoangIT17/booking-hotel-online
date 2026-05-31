import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// Các trang Dashboard theo Role dùng để test

//  Import tất cả các Khung giao diện (Layouts)
import AdminLayout from "../layouts/AdminLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import ReceptionistLayout from "../layouts/ReceptionistLayout";
import StaffLayout from "../layouts/StaffLayout";

//  Import các trang Dashboard tương ứng của từng phân hệ
import DashboardAdmin from "../pages/admin/dashboard/Dashboard";
import FurniturePage from "../pages/admin/furniture/FurniturePage";
import RoomPage from "../pages/admin/rooms/RoomPage";
import DashboardManager from "../pages/manager/dashboard/Dashboard";
import ReceptionistDashboard from "../pages/receptionist/Dashboard";
import StaffHousekeepingDashboard from "../pages/staff/Dashboard";
import HomePage from "../pages/customer/HomePage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Gốc rễ: Tự động đẩy sang login khi mở web */}
      <Route path="/" element={<Navigate to="/login" replace />} />

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
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Trang chủ xem phòng của khách hàng sau khi login */}
      <Route element={<ProtectedRoute allowedRoles={["CUSTOMER"]} />}>
        <Route path="/home" element={<HomePage />} />
      </Route>

      {/* ================= ROLE ADMIN ================= */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        {/* Lớp 2: Khung giao diện - Bọc Header, Sidebar cho toàn bộ các trang con */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Lớp 3: Nội dung (Sẽ chui vào cái <Outlet /> của AdminLayout) */}
          {/* Lưu ý: path ở đây chỉ cần viết "dashboard" (không có dấu / ở đầu) vì nó nối tiếp từ /admin */}
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="furnitures" element={<FurniturePage />} />
          <Route path="rooms" element={<RoomPage />} />

          {/* Sau này làm thêm các trang khác thì cứ thả vào đây, tự động được bảo vệ và có sẵn Layout! */}
          {/* <Route path="room-categories" element={<RoomCategoryList />} /> */}
          {/* <Route path="users" element={<UserManagement />} /> */}
        </Route>
      </Route>

      {/* ================= 📊 ROLE: MANAGER ================= */}
      <Route element={<ProtectedRoute allowedRoles={["MANAGER"]} />}>
        {/* Đã sửa từ AdminLayout sang ManagerLayout ✅ */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardManager />} />
          <Route path="furnitures" element={<FurniturePage />} />
          <Route path="rooms" element={<RoomPage />} />
          {/* Thêm chức năng quản lý tại đây */}
        </Route>
      </Route>

      {/* ================= 🛎️ ROLE: RECEPTIONIST ================= */}
      <Route element={<ProtectedRoute allowedRoles={["RECEPTIONIST"]} />}>
        {/* Đã bọc cấu trúc Layout lồng nhau chuẩn chỉ ✅ */}
        <Route path="/receptionist" element={<ReceptionistLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ReceptionistDashboard />} />
          {/* Thêm chức năng lễ tân: bookings, checkin-checkout... tại đây */}
        </Route>
      </Route>

      {/* ================= 🧹 ROLE: STAFF ================= */}
      <Route element={<ProtectedRoute allowedRoles={["STAFF"]} />}>
        {/* Đã bọc cấu trúc Layout lồng nhau chuẩn chỉ ✅ */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StaffHousekeepingDashboard />} />
          {/* Thêm chức năng nhân viên: tasks, room-status... tại đây */}
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
