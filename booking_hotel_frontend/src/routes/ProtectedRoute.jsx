import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // DÃ¹ng hook táº­p trung cho sáº¡ch code

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, role } = useAuth();
    const location = useLocation();

    // 1. Náº¿u chÆ°a Ä‘Äƒng nháº­p -> ÄÃ¡ vÄƒng vá» trang Login ngay
    if (!isAuthenticated) {
        const redirectPath = `${location.pathname}${location.search}`;
        return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
    }

    // 2. Náº¿u Ä‘Ã£ Ä‘Äƒng nháº­p nhÆ°ng sai quyá»n háº¡n -> ÄÃ¡ sang trang cháº·n 403
    if (allowedRoles && !allowedRoles.includes(role)) {
        console.error("GRAND_HOTEL_AUTH: Báº¡n khÃ´ng cÃ³ quyá»n truy cáº­p vÃ o phÃ¢n há»‡ nÃ y!");
        return <Navigate to="/403" replace />;
    }

    // 3. Há»£p lá»‡ -> Cho vÃ o trang con (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;
