import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
    const { isAuthenticated, role } = useAuth();

    // Nếu chưa đăng nhập -> Cho phép xem Form Login/Register bình thường
    if (!isAuthenticated) return children;

    // Nếu đã đăng nhập -> Cưỡng chế điều hướng về đúng Dashboard tương ứng để test
    switch (role) {
        case "ADMIN":        return <Navigate to="/admin/dashboard" replace />;
        case "MANAGER":      return <Navigate to="/manager/dashboard" replace />;
        case "RECEPTIONIST": return <Navigate to="/receptionist/dashboard" replace />;
        case "STAFF":        return <Navigate to="/staff/dashboard" replace />;
        case "CUSTOMER":     return <Navigate to="/home" replace />; 
        default:             return <Navigate to="/login" replace />;
    }
};

export default PublicRoute;