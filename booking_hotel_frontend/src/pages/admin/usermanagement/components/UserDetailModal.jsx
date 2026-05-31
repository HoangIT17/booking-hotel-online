const UserDetailModal = ({ user, onClose }) => {
    if (!user) return null;

    const formatDate = (dateString) => {
        if (!dateString) return "Chưa cập nhật";
        return new Date(dateString).toLocaleString("vi-VN");
    };

    const getRoleColor = (role) => {
        switch (role) {
            case "ADMIN": return "#dc3545";
            case "MANAGER": return "#fd7e14";
            case "RECEPTIONIST": return "#0dcaf0";
            case "STAFF": return "#6c757d";
            default: return "#198754";
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case "ADMIN": return "Admin";
            case "MANAGER": return "Quản lý";
            case "RECEPTIONIST": return "Lễ tân";
            case "STAFF": return "Nhân viên";
            default: return "Khách hàng";
        }
    };

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content border-0 shadow rounded-3 overflow-hidden bg-white" style={{ maxWidth: "520px", margin: "0 auto" }}>
                    {/* Header */}
                    <div className="modal-header py-2 px-3 border-0" style={{ backgroundColor: "#f8f9fa" }}>
                        <h6 className="modal-title fw-bold text-dark m-0">
                            Chi Tiết Tài Khoản
                        </h6>
                        <button type="button" className="btn-close btn-sm" onClick={onClose}></button>
                    </div>

                    <div className="modal-body p-4 text-start">
                        {/* Avatar + Tên + Role */}
                        <div className="text-center mb-4">
                            <div 
                                className="d-inline-flex align-items-center justify-content-center text-white rounded-circle fw-bold shadow-sm" 
                                style={{ 
                                    width: "70px", 
                                    height: "70px", 
                                    fontSize: "28px",
                                    backgroundColor: getRoleColor(user.role)
                                }}
                            >
                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="fw-bold text-dark mt-2" style={{ fontSize: "18px" }}>{user.fullName || "Chưa cập nhật"}</div>
                            <span 
                                className="badge mt-1 px-2 py-1" 
                                style={{
                                    backgroundColor: getRoleColor(user.role),
                                    fontSize: "11px",
                                    fontWeight: "500",
                                    borderRadius: "20px"
                                }}
                            >
                                {getRoleLabel(user.role)}
                            </span>
                        </div>

                        {/* Thông tin - dạng 2 cột */}
                        <div className="row g-3">
                            <div className="col-6">
                                <div className="p-1">
                                    <div className="text-muted mb-1" style={{ fontSize: "12px" }}>Tên tài khoản</div>
                                    <span className="fw-semibold text-dark" style={{ fontSize: "14px" }}>@{user.username}</span>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-1">
                                    <div className="text-muted mb-1" style={{ fontSize: "12px" }}>Trạng thái</div>
                                    <span className={`fw-semibold ${user.isActive ? "text-success" : "text-danger"}`} style={{ fontSize: "14px" }}>
                                        {user.isActive ? "● Hoạt động" : "● Khóa"}
                                    </span>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="p-1">
                                    <div className="text-muted mb-1" style={{ fontSize: "12px" }}>Email</div>
                                    <span className="text-dark" style={{ fontSize: "14px", wordBreak: "break-all" }}>{user.email}</span>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="p-1">
                                    <div className="text-muted mb-1" style={{ fontSize: "12px" }}>Số điện thoại</div>
                                    <span className="text-dark" style={{ fontSize: "14px" }}>{user.phone || "Chưa đăng ký"}</span>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="p-1">
                                    <div className="text-muted mb-1" style={{ fontSize: "12px" }}>Địa chỉ</div>
                                    <span className="text-dark" style={{ fontSize: "14px" }}>{user.address || "Chưa cập nhật"}</span>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-1">
                                    <div className="text-muted mb-1" style={{ fontSize: "12px" }}>Ngày tạo</div>
                                    <span className="text-dark" style={{ fontSize: "13px" }}>{formatDate(user.createdAt)}</span>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-1">
                                    <div className="text-muted mb-1" style={{ fontSize: "12px" }}>Cập nhật</div>
                                    <span className="text-dark" style={{ fontSize: "13px" }}>{formatDate(user.updatedAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer border-0 py-2 px-3 justify-content-center" style={{ backgroundColor: "#f8f9fa" }}>
                        <button 
                            type="button" 
                            className="btn btn-secondary btn-sm fw-semibold px-3 py-1 rounded-2" 
                            onClick={onClose}
                            style={{ fontSize: "13px" }}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;