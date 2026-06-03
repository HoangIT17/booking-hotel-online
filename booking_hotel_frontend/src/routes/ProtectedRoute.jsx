import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // DÃ¹ng hook táº­p trung cho sáº¡ch code

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  // 1. Nếu chưa đăng nhập -> Chuyển hướng đến trang Login
  if (!isAuthenticated) {
    const redirectPath = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
        replace
      />
    );
  }

  // 2. Nếu đã đăng nhập nhưng sai quyền hạn -> Chuyển sang trang chặn 403
  const userRole = role?.toUpperCase();

  if (
    allowedRoles &&
    userRole !== "ADMIN" &&
    !allowedRoles.includes(userRole)
  ) {
    console.error(
      "GRAND_HOTEL_AUTH: Bạn không có quyền truy cập vào trang này!",
    );
    return <Navigate to="/403" replace />;
  }

  // 3. Hợp lệ -> Cho vào trang con (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
