import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const getSafeRedirectPath = (search) => {
  const redirect = new URLSearchParams(search).get("redirect");

  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) {
    return null;
  }

  return redirect;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();
  const redirectPath = getSafeRedirectPath(location.search);
  const userRole = role?.toUpperCase();

  // Nếu chưa đăng nhập -> Cho phép ở lại trang Login
  if (!isAuthenticated) return children;

  // Nếu đã đăng nhập -> Cưỡng chế điều hướng về đúng Dashboard tương ứng để test
  switch (userRole) {
    case "ADMIN":
      return <Navigate to="/admin/dashboard" replace />;
    case "MANAGER":
      return <Navigate to="/manager/dashboard" replace />;
    case "RECEPTIONIST":
      return <Navigate to="/receptionist/dashboard" replace />;
    case "STAFF":
      return <Navigate to="/staff/dashboard" replace />;
    case "CUSTOMER":
      return <Navigate to={redirectPath || "/home"} replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default PublicRoute;
