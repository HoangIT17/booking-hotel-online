import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
    const { isAuthenticated, role } = useAuth();

    // Nếu chưa đăng nhập -> Cho phép ở lại trang Login
    if (!isAuthenticated) return children;

    // Ép kiểu chữ IN HOA để đồng bộ với API (role: "CUSTOMER")
    const safeRole = role ? role.toUpperCase() : "";

    switch (safeRole) {
        case "ADMIN":        return <Navigate to="/admin/dashboard" replace />;
        case "MANAGER":      return <Navigate to="/manager/dashboard" replace />;
        case "RECEPTIONIST": return <Navigate to="/receptionist/dashboard" replace />;
        case "STAFF":        return <Navigate to="/staff/dashboard" replace />;
        
        // 🌟 NẾU LÀ KHÁCH HÀNG -> VỀ TRANG CHỦ /
        case "CUSTOMER":     return <Navigate to="/" replace />; 
        
        // NẾU LỖI -> ĐÁ RA TRANG CHỦ, TUYỆT ĐỐI KHÔNG ĐÁ VỀ /login NỮA
        default:             return <Navigate to="/" replace />;
    }
};

export default PublicRoute;