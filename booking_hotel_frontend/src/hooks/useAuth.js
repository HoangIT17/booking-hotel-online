import { useSelector } from "react-redux";

const useAuth = () => {
    const auth = useSelector((state) => state.auth);

    return {
        user: auth.user,
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        isAuthenticated: auth.isAuthenticated,
        loading: auth.loading,
        error: auth.error,
        role: auth.user?.role, // ADMIN, MANAGER, RECEPTIONIST, STAFF, CUSTOMER
        username: auth.user?.username,        
        email: auth.user?.email,
        fullName: auth.user?.fullName,
        userId: auth.user?.id,
        phone: auth.user?.phone
    };
};

export default useAuth;