import { useDispatch } from "react-redux";
import { logoutThunk } from "../../redux/slices/authSlice";
import useAuth from "../../hooks/useAuth";

const DashboardReceptionist = () => {
    const dispatch = useDispatch();
    const { user } = useAuth(); // Lấy thông tin user ra test xem Redux có nhận không

    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
            <h2>Trang Chủ Receptionist</h2>
            <p>Xin chào: {user?.username}</p>
            
            <button 
                onClick={() => dispatch(logoutThunk())}
                style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
            >
                Đăng Xuất
            </button>
        </div>
    );
};

export default DashboardReceptionist;