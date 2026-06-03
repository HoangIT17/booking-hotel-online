import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from '../../redux/slices/authSlice'; 

const LoginSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        // 1. Nhặt token từ URL
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        if (token) {
            try {
                // 2. Giải mã Token để lấy thông tin
                const decoded = jwtDecode(token);
                
                // 3. Đẩy vào Redux (Redux sẽ lưu vào localStorage theo logic trong authSlice)
                dispatch(loginSuccess({
                    token: token,
                    user: {
                        username: decoded.sub, 
                        fullName: decoded.fullName, 
                        avatar: decoded.avatar, 
                        role: decoded.role 
                    }
                })); 

                // 4. Ép tải lại toàn bộ trang để đồng bộ Axios & LocalStorage
                // Việc này dập tắt hoàn toàn các lỗi CORS "oan" do Axios giữ cache Token cũ
                window.location.href = '/'; 
            } catch (error) {
                console.error("Lỗi giải mã token:", error);
                navigate('/login');
            }
        } else {
            // Không có token thì trả về trang đăng nhập
            navigate('/login');
        }
    }, [location, navigate, dispatch]);

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="mt-4 fw-bold">Đang đồng bộ dữ liệu...</h5>
            <p className="text-muted">Hệ thống đang đăng nhập, vui lòng đợi trong giây lát.</p>
        </div>
    );
};

export default LoginSuccess;