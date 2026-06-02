import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Dùng hook tập trung cho sạch code

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, role } = useAuth();
    const location = useLocation();

    // 1. Nếu chưa đăng nhập -> Đá văng về trang Login ngay
    if (!isAuthenticated) {
        const redirectPath = `${location.pathname}${location.search}`;
        return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
    }

    // 2. Nếu đã đăng nhập nhưng sai quyền hạn -> Đá sang trang chặn 403
    if (allowedRoles && !allowedRoles.includes(role)) {
        console.error("GRAND_HOTEL_AUTH: Bạn không có quyền truy cập vào phân hệ này!");
        return <Navigate to="/403" replace />;
    }

    // 3. Hợp lệ -> Cho vào trang con (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;
