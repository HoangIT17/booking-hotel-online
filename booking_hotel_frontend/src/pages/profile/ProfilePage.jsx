import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfileThunk, clearProfileError } from "../../redux/slices/profileSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { profileData, loading, error } = useSelector((state) => state.profile);

    const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const currentRole = useMemo(() => storedUser?.role?.toUpperCase() || "CUSTOMER", [storedUser]);

    useEffect(() => {
        dispatch(getMyProfileThunk());
        return () => {
            dispatch(clearProfileError());
        };
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearProfileError());
        }
    }, [error, dispatch]);

    // Hàm chuyển đổi tên Role sang chức vụ tiếng Việt
    const getRoleTitle = (roleName) => {
        switch (roleName?.toUpperCase()) {
            case 'ADMIN': return 'Quản trị hệ thống';
            case 'MANAGER': return 'Quản lý khách sạn';
            case 'RECEPTIONIST': return 'Nhân viên Lễ tân';
            case 'STAFF': return 'Nhân viên vận hành';
            case 'CUSTOMER': 
            default: return 'Khách hàng thân thiết';
        }
    };

    if (loading && !profileData) {
        return (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    return (
        <div className="w-100 h-100 p-3" style={{ overflowY: "auto" }}>
            <div className="row g-4">
                {/* CARD TRÁI: AVATAR & CHỨC VỤ TỔNG QUAN */}
                <div className="col-12 col-lg-4">
                    <div className="card shadow border-0 rounded-3 text-center p-4 bg-white h-100 d-flex flex-column align-items-center justify-content-center">
                        <div className="rounded-circle border border-4 border-light shadow-sm overflow-hidden mb-3" style={{ width: "150px", height: "150px" }}>
                            {profileData?.avatar ? (
                                <img src={profileData.avatar} alt="Avatar" className="w-100 h-100 object-fit-cover" />
                            ) : (
                                <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center text-muted">
                                    <i className="fa-solid fa-user-astronaut fa-4x"></i>
                                </div>
                            )}
                        </div>
                        <h5 className="fw-bold text-dark mb-1">{profileData?.fullName || "Chưa cập nhật"}</h5>
                        {/* 🌟 ĐÃ SỬA: Hiển thị Chức vụ tiếng Việt chuẩn chỉ */}
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1.5 fw-bold text-uppercase">
                            {getRoleTitle(profileData?.role || currentRole)}
                        </span>
                    </div>
                </div>

                {/* CARD PHẢI: CHI TIẾT ĐỌC DỮ LIỆU */}
                <div className="col-12 col-lg-8">
                    <div className="card shadow border-0 rounded-3 bg-white h-100">
                        <div className="card-header bg-light border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
                            <h5 className="mb-0 fw-bold text-dark">
                                <i className="fa-solid fa-id-card me-2 text-primary"></i>
                                Hồ Sơ Cá Nhân
                            </h5>
                            <button 
                                className="btn btn-outline-primary btn-sm fw-bold d-flex align-items-center gap-2 px-3"
                                onClick={() =>
                                    navigate(currentRole === "CUSTOMER" ? "/customer/profile/edit" : `/${currentRole.toLowerCase()}/profile/edit`)
                                }
                            >
                                <i className="fa-solid fa-user-pen"></i>
                                Chỉnh sửa hồ sơ
                            </button>
                        </div>

                        <div className="card-body p-4">
                            <h6 className="fw-bold text-primary mb-3 border-start border-3 border-primary ps-2">Thông tin cơ bản</h6>
                            <div className="row g-3 mb-4">
                                <div className="col-12 col-md-6">
                                    <label className="form-label text-muted small fw-semibold mb-1">Họ và Tên</label>
                                    <div className="p-2.5 bg-light rounded border text-dark fw-medium">{profileData?.fullName || "---"}</div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label text-muted small fw-semibold mb-1">Số điện thoại</label>
                                    <div className="p-2.5 bg-light rounded border text-dark fw-medium">{profileData?.phone || "---"}</div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label text-muted small fw-semibold mb-1">Giới tính</label>
                                    <div className="p-2.5 bg-light rounded border text-dark fw-medium">
                                        {profileData?.gender === "MALE" ? "Nam" : profileData?.gender === "FEMALE" ? "Nữ" : profileData?.gender === "OTHER" ? "Khác" : "---"}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label text-muted small fw-semibold mb-1">Ngày sinh</label>
                                    <div className="p-2.5 bg-light rounded border text-dark fw-medium">{profileData?.birthday || "---"}</div>
                                </div>
                                <div className="col-12">
                                    <label className="form-label text-muted small fw-semibold mb-1">Địa chỉ thường trú</label>
                                    <div className="p-2.5 bg-light rounded border text-dark fw-medium">{profileData?.address || "---"}</div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label text-muted small fw-semibold mb-1">Địa chỉ Email</label>
                                    <div className="p-2.5 bg-light rounded border text-secondary">{profileData?.email || "---"}</div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label text-muted small fw-semibold mb-1">Chức vụ công tác</label>
                                    <div className="p-2.5 bg-light rounded border text-primary fw-bold">{getRoleTitle(profileData?.role || currentRole)}</div>
                                </div>
                            </div>

                            {/* KHU VỰC NHÂN SỰ CHUYÊN BIỆT */}
                            {currentRole !== "CUSTOMER" && currentRole !== "ADMIN" && (
                                <>
                                    <h6 className="fw-bold text-warning mb-3 border-start border-3 border-warning ps-2">Thông tin năng lực & vị trí</h6>
                                    <div className="row g-3 bg-light p-3 rounded border">
                                        <div className="col-12 col-md-4">
                                            <label className="form-label text-muted small mb-1">Kinh nghiệm thực tế</label>
                                            <div className="p-2 bg-white rounded border fw-bold small text-dark">{profileData?.experienceYears ?? 0} năm kinh nghiệm</div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <label className="form-label text-muted small mb-1">Ngày chính thức gia nhập</label>
                                            <div className="p-2 bg-white rounded border fw-bold small text-dark">
                                                {profileData?.hireDate ? (
                                                    // Nếu Backend trả về dạng mảng [yyyy, mm, dd] thì tự lắp ráp, nếu là chuỗi String thì in ra luôn
                                                    Array.isArray(profileData.hireDate) 
                                                        ? `${profileData.hireDate[2]}/${profileData.hireDate[1]}/${profileData.hireDate[0]}`
                                                        : profileData.hireDate
                                                ) : "Ghi nhận từ ngày tạo tài khoản"}
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <label className="form-label text-muted small mb-1">Kỹ năng sở hữu</label>
                                            <div className="p-2 bg-white rounded border fw-bold small text-success text-truncate" title={profileData?.skills}>
                                                {profileData?.skills || "Chưa thiết lập kỹ năng"}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
