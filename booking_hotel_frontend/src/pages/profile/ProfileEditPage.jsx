import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfileThunk, updateMyProfileThunk, clearProfileError } from "../../redux/slices/profileSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ─── COMPONENT CON: QUẢN LÝ FORM SỬA (SẠCH BÓNG LỖI ESLINT EFFECT) ───
const ProfileEditForm = ({ initialData, currentRole }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.profile);

    // Khởi tạo trực tiếp từ dữ liệu ban đầu
    const [formData, setFormData] = useState({
        fullName: initialData?.fullName || "",
        phone: initialData?.phone || "",
        gender: initialData?.gender || "MALE",
        birthday: initialData?.birthday || "",
        address: initialData?.address || "",
        // 🌟 ĐÃ ĐẨY LÊN: Cho phép khối nội bộ tự cập nhật 2 trường này
        experienceYears: initialData?.experienceYears || 0,
        skills: initialData?.skills || ""
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(initialData?.avatar || "");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Vui lòng chỉ chọn tệp tin hình ảnh!");
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Dung lượng ảnh không được vượt quá 2MB!");
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fullName.trim() || !formData.phone.trim()) {
            toast.error("Họ tên và Số điện thoại không được để trống!");
            return;
        }

        // Đóng gói payload gửi lên Backend
        const resultAction = await dispatch(updateMyProfileThunk({ 
            updateData: formData, 
            avatarFile: selectedFile 
        }));

        if (updateMyProfileThunk.fulfilled.match(resultAction)) {
            toast.success("Cập nhật thông tin hồ sơ thành công!");
            setTimeout(() => {
                switch (currentRole) {
                    case 'ADMIN':
                        navigate('/admin/dashboard');
                        break;
                    case 'MANAGER':
                        navigate('/manager/dashboard');
                        break;
                    case 'RECEPTIONIST':
                        navigate('/receptionist/dashboard');
                        break;
                    case 'STAFF':
                        navigate('/staff/dashboard');
                        break;
                    case 'CUSTOMER':
                    default:
                        navigate('/home');
                        break;
                }
            }, 500);
        }
    };

    // Hàm chuyển đổi tên Role sang chức vụ tiếng Việt cho thân thiện
    const getRoleTitle = (roleName) => {
        switch (roleName?.toUpperCase()) {
            case 'ADMIN': return 'Quản trị viên hệ thống';
            case 'MANAGER': return 'Quản lý khách sạn';
            case 'RECEPTIONIST': return 'Nhân viên Lễ tân';
            case 'STAFF': return 'Nhân viên vận hành';
            case 'CUSTOMER': 
            default: return 'Khách hàng thân thiết';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="row g-4">
            {/* CỘT BÀN TRÁI: AVATAR PREVIEW */}
            <div className="col-12 col-lg-4">
                <div className="card shadow border-0 rounded-3 text-center p-4 bg-white h-100 d-flex flex-column align-items-center justify-content-center">
                    <div className="position-relative mb-3">
                        <div className="rounded-circle border border-4 border-light shadow-sm overflow-hidden" style={{ width: "150px", height: "150px" }}>
                            {previewUrl ? (
                                <img src={previewUrl} alt="Avatar Preview" className="w-100 h-100 object-fit-cover" />
                            ) : (
                                <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center text-muted">
                                    <i className="fa-solid fa-camera fa-3x"></i>
                                </div>
                            )}
                        </div>
                        <label htmlFor="avatarEdit" className="position-absolute bottom-0 end-0 btn btn-primary rounded-circle d-flex align-items-center justify-content-center p-2 shadow" style={{ width: "36px", height: "36px", cursor: "pointer" }}>
                            <i className="fa-solid fa-camera" style={{ fontSize: "14px" }}></i>
                        </label>
                        <input type="file" id="avatarEdit" className="d-none" accept="image/*" onChange={handleFileChange} disabled={loading} />
                    </div>
                    <p className="small text-muted mb-0">Nhấp vào biểu tượng camera để thay ảnh đại diện</p>
                </div>
            </div>

            {/* CỘT BÊN PHẢI: FORM ĐIỀN DATA */}
            <div className="col-12 col-lg-8">
                <div className="card shadow border-0 rounded-3 bg-white h-100">
                    <div className="card-header bg-light border-bottom py-3 px-4">
                        <h5 className="mb-0 fw-bold text-dark">
                            <i className="fa-solid fa-user-gear me-2 text-primary"></i>
                            Chỉnh Sửa Hồ Sơ Cá Nhân
                        </h5>
                    </div>

                    <div className="card-body p-4">
                        <h6 className="fw-bold text-primary mb-3 border-start border-3 border-primary ps-2">Thông tin được phép chỉnh sửa</h6>
                        <div className="row g-3 mb-4">
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold text-secondary small">Họ và Tên</label>
                                <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleInputChange} disabled={loading} />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold text-secondary small">Số điện thoại</label>
                                <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleInputChange} disabled={loading} />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold text-secondary small">Giới tính</label>
                                <select className="form-select" name="gender" value={formData.gender} onChange={handleInputChange} disabled={loading}>
                                    <option value="MALE">Nam</option>
                                    <option value="FEMALE">Nữ</option>
                                    <option value="OTHER">Khác</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold text-secondary small">Ngày sinh</label>
                                <input type="date" className="form-control" name="birthday" value={formData.birthday} onChange={handleInputChange} disabled={loading} />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-semibold text-secondary small">Địa chỉ thường trú</label>
                                <input type="text" className="form-control" name="address" value={formData.address} onChange={handleInputChange} disabled={loading} />
                            </div>

                            {/* 🌟 VÙNG ĐẶC THÙ: Cho phép khối nhân sự nội bộ chỉnh sửa kỹ năng và kinh nghiệm */}
                            {currentRole !== "CUSTOMER" && currentRole !== "ADMIN" && (
                                <>
                                    <div className="col-12 col-md-4">
                                        <label className="form-label fw-semibold text-secondary small">Số năm kinh nghiệm</label>
                                        <input type="number" min="0" className="form-control" name="experienceYears" value={formData.experienceYears} onChange={handleInputChange} disabled={loading} />
                                    </div>
                                    <div className="col-12 col-md-8">
                                        <label className="form-label fw-semibold text-secondary small">Kỹ năng chuyên môn (Cách nhau bằng dấu phẩy)</label>
                                        <input type="text" className="form-control" name="skills" placeholder="Ví dụ: Giao tiếp tốt, Giải quyết tình huống, Tiếng Anh B2" value={formData.skills} onChange={handleInputChange} disabled={loading} />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* KHU VỰC KHÓA (CHỈ XEM - CÓ CHỨC VỤ CHO TẤT CẢ CÁC ROLE) */}
                        <h6 className="fw-bold text-danger mb-3 border-start border-3 border-danger ps-2">Thông tin cố định hệ thống</h6>
                        <div className="row g-3 bg-light p-3 rounded border opacity-75">
                            <div className="col-12 col-md-6">
                                    <label className="form-label text-muted small mb-1">Tài khoản cá nhân (Email)</label>
                                    <div className="p-2 bg-white rounded border fw-medium small text-secondary">{initialData?.email || "---"}</div>
                            </div>
                            <div className="col-12 col-md-6">
                                    <label className="form-label text-muted small mb-1">Chức vụ hiện tại</label>
                                    {/* 🌟 ĐỒNG BỘ: Hiện chức vụ phân hệ tiếng Việt rõ ràng cho toàn bộ 5 role */}
                                    <div className="p-2 bg-white rounded border fw-bold small text-primary text-uppercase">
                                        {getRoleTitle(initialData?.role || currentRole)}
                                    </div>
                            </div>

                            {/* Ngày gia nhập tự lấy từ ngày tạo acc, bị khóa */}
                            {currentRole !== "CUSTOMER" && currentRole !== "ADMIN" && (
                                <div className="col-12">
                                    <label className="form-label text-muted small mb-1">Ngày chính thức gia nhập khách sạn</label>
                                    <div className="p-2 bg-white rounded border small fw-semibold text-secondary">
                                        <i className="fa-solid fa-calendar-check me-2 text-success"></i>
                                        {initialData?.hireDate || "Ghi nhận từ ngày lập tài khoản"}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* FOOTER BUTTONS */}
                        <div className="text-end border-top pt-3 d-flex justify-content-end gap-2 mt-4">
                            <button
                                type="button"
                                className="btn btn-light px-4 fw-bold text-uppercase border"
                                onClick={() =>
                                    navigate(currentRole === "CUSTOMER" ? "/profile" : `/${currentRole.toLowerCase()}/profile`)
                                }
                                disabled={loading}
                            >
                                Hủy bỏ
                            </button>
                            <button type="submit" className="btn btn-primary px-4 fw-bold text-uppercase d-flex align-items-center gap-2" disabled={loading}>
                                {loading ? <span className="spinner-border spinner-border-sm" role="status"></span> : <i className="fa-solid fa-floppy-disk"></i>}
                                Cập nhật ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

// ─── COMPONENT MẸ (EXPORT CHÍNH) ───
const ProfileEditPage = () => {
    const dispatch = useDispatch();
    const { profileData, loading, error } = useSelector((state) => state.profile);

    const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const currentRole = useMemo(() => storedUser?.role?.toUpperCase() || "CUSTOMER", [storedUser]);

    useEffect(() => {
        if (!profileData) {
            dispatch(getMyProfileThunk());
        }
    }, [profileData, dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearProfileError());
        }
    }, [error, dispatch]);

    if (loading && !profileData) {
        return (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    return (
        <div className="w-100 h-100 p-3" style={{ overflowY: "auto" }}>
            {profileData && (
                <ProfileEditForm 
                    key={profileData.id} 
                    initialData={profileData} 
                    currentRole={currentRole} 
                />
            )}
        </div>
    );
};

export default ProfileEditPage;
