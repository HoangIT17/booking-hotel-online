import  { useState } from "react";
import { toast } from "react-hot-toast";

const UserFormModal = ({ user, onClose, onSave }) => {
    
    // 1. Ánh xạ từ Tên Chức Vụ sang Role ID tương ứng trong DB
    const getRoleIdFromRoleName = (roleName) => {
        switch (roleName) {
            case "ADMIN": return 1;
            case "MANAGER": return 2;
            case "RECEPTIONIST": return 3;
            case "STAFF": return 4;
            case "CUSTOMER": return 5;
            default: return 5;
        }
    };

    // 2. Khởi tạo State và xử lý triệt để lỗi ép kiểu của nút Switch isActive
    const [formData, setFormData] = useState({
        username: user?.username || "",
        email: user?.email || "",
        password: "", 
        confirmPassword: "", 
        fullName: user?.fullName || "",
        phone: user?.phone || "",
        role: user?.role ? user.role : "CUSTOMER", 
        // 🌟 Sửa lỗi: Ép kiểu Boolean chuẩn xác phòng trường hợp Backend trả về chuỗi "true"/"false" hoặc số 1/0
        isActive: user ? (user.isActive === true || user.isActive === "true" || user.isActive === 1) : true
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra validate Số điện thoại (Backend dính @NotBlank và @Pattern)
        const phoneRegex = /^[0-9]+$/;
        if (!formData.phone || formData.phone.trim().length < 10 || formData.phone.trim().length > 15 || !phoneRegex.test(formData.phone)) {
            toast.error("Số điện thoại bắt buộc từ 10-15 chữ số!");
            return;
        }

        // Validate mật khẩu theo đúng chuẩn @Size(min = 8) của Backend khi THÊM MỚI
        if (!user) {
            if (formData.password.length < 8) {
                toast.error("Mật khẩu khởi tạo phải từ 8 ký tự trở lên theo quy định hệ thống!");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error("Mật khẩu và Xác nhận mật khẩu không trùng khớp!");
                return;
            }
        }

        // 🌟 ĐÓNG CỤC DATA GỬI ĐI: Đầy đủ các trường khớp 100% với DTO Backend bao gồm cả isActive
        const payload = {
            username: formData.username.trim(),
            email: formData.email.trim(),
            fullName: formData.fullName.trim(),
            phone: formData.phone.trim(),
            roleId: getRoleIdFromRoleName(formData.role),
            isActive: formData.isActive // 🌟 Đã đính kèm trạng thái để cập nhật dứt điểm lỗi giữ nguyên Inactive
        };

        // Nếu là thêm mới thì mới đính kèm password
        if (!user) {
            payload.password = formData.password;
        }

        onSave(payload); // Bắn dữ liệu chuẩn lên trang cha xử lý API
    };

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
                <form onSubmit={handleSubmit} className="modal-content border-0 shadow rounded-3 text-start bg-white">
                    
                    {/* Header */}
                    <div className="modal-header bg-light border-bottom-0 py-3">
                        <h5 className="modal-title fw-bold text-dark">
                            {user ? "Cập Nhật Thông Tin Người Dùng" : "Thêm Thành Viên Nội Bộ"}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    {/* Body Form */}
                    <div className="modal-body p-4 row g-3 small">
                        {/* Họ và Tên */}
                        <div className="col-12">
                            <label className="form-label fw-semibold text-secondary">Họ và Tên <span className="text-danger">*</span></label>
                            <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="form-control form-control-sm border-2-focus" placeholder="Nhập họ và tên từ 5-100 ký tự" />
                        </div>

                        {/* Username */}
                        <div className="col-6">
                            <label className="form-label fw-semibold text-secondary">Username <span className="text-danger">*</span></label>
                            <input type="text" name="username" required disabled={!!user} value={formData.username} onChange={handleChange} className="form-control form-control-sm bg-light-subtle" placeholder="Không chứa ký tự đặc biệt" />
                        </div>

                        {/* Số điện thoại */}
                        <div className="col-6">
                            <label className="form-label fw-semibold text-secondary">Số điện thoại <span className="text-danger">*</span></label>
                            <input type="text" name="phone" required value={formData.phone} onChange={handleChange} className="form-control form-control-sm" placeholder="Chỉ chứa chữ số (10-15 số)" />
                        </div>

                        {/* Địa chỉ Email */}
                        <div className="col-12">
                            <label className="form-label fw-semibold text-secondary">Địa chỉ Email <span className="text-danger">*</span></label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="form-control form-control-sm" placeholder="Ví dụ: admin@hotel.com" />
                        </div>

                        {/* Mật khẩu & Xác nhận mật khẩu (Chỉ hiện khi thêm mới) */}
                        {!user && (
                            <>
                                <div className="col-6">
                                    <label className="form-label fw-semibold text-secondary">Mật khẩu khởi tạo <span className="text-danger">*</span></label>
                                    <input type="password" name="password" required value={formData.password} onChange={handleChange} className="form-control form-control-sm" placeholder="Tối thiểu 8 ký tự" />
                                </div>
                                <div className="col-6">
                                    <label className="form-label fw-semibold text-secondary">Xác nhận mật khẩu <span className="text-danger">*</span></label>
                                    <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="form-control form-control-sm" placeholder="Gõ lại mật khẩu" />
                                </div>
                            </>
                        )}

                        {/* Chức vụ */}
                        <div className="col-6">
                            <label className="form-label fw-semibold text-secondary">Phân quyền chức vụ</label>
                            <select name="role" value={formData.role} onChange={handleChange} className="form-select form-select-sm">
                                <option value="ADMIN">Admin</option>
                                <option value="MANAGER">Quản lý</option>
                                <option value="RECEPTIONIST">Lễ tân</option>
                                <option value="STAFF">Nhân viên</option>
                                <option value="CUSTOMER">Khách hàng</option>
                            </select>
                        </div>

                        {/* Trạng thái Kích hoạt */}
                        <div className="col-6 d-flex align-items-end pb-2 ps-4">
                            <div className="form-check form-switch card-input-switch" style={{ cursor: "pointer" }}>
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    name="isActive" 
                                    id="isActiveSwitch" 
                                    checked={formData.isActive} 
                                    onChange={handleChange} 
                                    style={{ cursor: "pointer" }}
                                />
                                <label className="form-check-label fw-semibold text-dark ms-1" htmlFor="isActiveSwitch" style={{ cursor: "pointer" }}>
                                    Kích hoạt tài khoản
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="modal-footer border-top-0 py-2.5">
                        <button type="button" className="btn btn-secondary btn-sm px-3 fw-semibold" onClick={onClose}>Hủy</button>
                        <button type="submit" className="btn btn-primary btn-sm px-4 fw-semibold shadow-sm">Lưu dữ liệu</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;