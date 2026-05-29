import { useState, useEffect } from "react";
import userService from "../../../services/userService";
import { toast } from "react-hot-toast";
import UserDetailModal from "./components/UserDetailModal";
import UserFormModal from "./components/UserFormModal";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, size: 10, totalPages: 1, totalElements: 0 });
    const [filters, setFilters] = useState({ keyword: "", role: "", isActive: "" });

    // Quản lý trạng thái đóng mở của các Modal tách biệt
    const [viewUser, setViewUser] = useState(null);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = async (targetPage = pagination.page) => {
        setLoading(true);
        try {
            const params = {
                page: targetPage - 1,
                size: pagination.size,
                keyword: filters.keyword,
                role: filters.role,
                isActive: filters.isActive !== "" ? filters.isActive === "true" : undefined,
            };
            const response = await userService.getAllUsers(params);
            let actualData = response?.data?.content ? response.data : response;

            if (actualData?.content) {
                setUsers(actualData.content);
                setPagination(prev => ({ ...prev, page: targetPage, totalPages: actualData.totalPages || 1, totalElements: actualData.totalElements || 0 }));
            } else {
                setUsers([]);
            }
        } catch {
            toast.error("Không thể tải danh sách người dùng!");
        } finally {
            setLoading(false);
        }
    };

    // Gọi API mỗi khi filters thay đổi (debounce cho keyword)
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [filters.keyword, filters.role, filters.isActive]);

    // Reset tất cả bộ lọc
    const handleResetFilters = () => {
        setFilters({ keyword: "", role: "", isActive: "" });
    };

    // XỬ LÝ API: Lưu dữ liệu (Hợp nhất cả Tạo mới và Cập nhật)
    const handleSaveUser = async (formData) => {
        try {
            if (editingUser) {
                await userService.updateUser(editingUser.id, formData);
                toast.success("Cập nhật thông tin người dùng thành công!");
            } else {
                await userService.createUser(formData);
                toast.success("Tạo tài khoản nội bộ mới thành công!");
            }
            setFormModalOpen(false);
            setEditingUser(null);
            fetchUsers(1);
        } catch {
            toast.error(editingUser ? "Cập nhật thất bại!" : "Thêm mới thất bại!");
        }
    };

    const handleDeleteUser = async (id, name) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa/vô hiệu hóa tài khoản của ${name}?`)) {
            try {
                await userService.deleteUser(id);
                toast.success("Xóa người dùng thành công!");
                fetchUsers(1);
            } catch {
                toast.error("Xóa người dùng thất bại!");
            }
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) fetchUsers(newPage);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="container" style={{ minHeight: "100vh", paddingTop: "8px" }}>

            {/* Bộ Lọc + Thêm người dùng chung 1 hàng */}
    <div className="card shadow-sm border-0 mb-3 bg-white rounded-3" style={{ padding: "12px 16px" }}>
            <div className="row g-2 align-items-end">
                <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-secondary small mb-1">Tìm theo tên, email, sđt...</label>
                    <input
                        type="text"
                        name="keyword"
                        placeholder="Nhập từ khóa..."
                        value={filters.keyword}
                        onChange={handleFilterChange}
                        className="form-control bg-light border-0"
                        style={{ borderRadius: "8px", padding: "8px 12px" }}
                    />
                </div>
                <div className="col-6 col-md-2">
                    <label className="form-label fw-semibold text-secondary small mb-1">Chức vụ</label>
                    <select
                        name="role"
                        value={filters.role}
                        onChange={handleFilterChange}
                        className="form-select bg-light border-0"
                        style={{ borderRadius: "8px", padding: "8px 12px" }}
                    >
                        <option value="">-- Tất cả chức vụ --</option>
                        <option value="ADMIN">Admin</option>
                        <option value="MANAGER">Quản lý</option>
                        <option value="RECEPTIONIST">Lễ tân</option>
                        <option value="STAFF">Nhân viên</option>
                        <option value="CUSTOMER">Khách hàng</option>
                    </select>
                </div>
                <div className="col-6 col-md-2">
                    <label className="form-label fw-semibold text-secondary small mb-1">Trạng thái</label>
                    <select
                        name="isActive"
                        value={filters.isActive}
                        onChange={handleFilterChange}
                        className="form-select bg-light border-0"
                        style={{ borderRadius: "8px", padding: "8px 12px" }}
                    >
                        <option value="">-- Tất cả --</option>
                        <option value="true">Đang hoạt động</option>
                        <option value="false">Đã khóa</option>
                    </select>
                </div>
                <div className="col-6 col-md-2">
                    <button
                        type="button"
                        onClick={handleResetFilters}
                        className="btn btn-outline-secondary w-100 fw-semibold"
                        style={{ borderRadius: "10px", padding: "8px 12px", fontSize: "14px" }}
                    >
                        Đặt lại
                    </button>
                </div>
                <div className="col-6 col-md-2">
                    <button
                        onClick={() => { setEditingUser(null); setFormModalOpen(true); }}
                        className="btn btn-primary fw-semibold w-100 shadow-sm"
                        style={{ borderRadius: "10px", fontSize: "14px", padding: "8px 12px" }}
                    >
                        + Thêm người dùng
                    </button>
                </div>
            </div>
        </div>

            {/* Bảng Danh Sách - Style giống bảng nội thất */}
            <div className="card shadow-sm border-0 rounded-3 overflow-hidden bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light" style={{ backgroundColor: "#f8f9fa" }}>
                            <tr className="text-secondary small fw-bold">
                                <th className="px-4 py-3" style={{ width: "70px" }}>STT</th>
                                <th className="py-3">Họ và Tên</th>
                                <th className="py-3">Email / SĐT</th>
                                <th className="py-3">Chức vụ</th>
                                <th className="py-3">Trạng thái</th>
                                <th className="py-3 text-center" style={{ width: "200px" }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">Đang tải dữ liệu...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">Không tìm thấy người dùng nào.</td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr key={user.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                        <td className="px-4 text-muted fw-semibold">{(pagination.page - 1) * pagination.size + index + 1}</td>
                                        <td>
                                            <div className="fw-semibold text-dark">{user.fullName || "Chưa cập nhật"}</div>
                                            <div className="text-muted small">@{user.username}</div>
                                        </td>
                                        <td>
                                            <div>{user.email}</div>
                                            <div className="text-muted small">{user.phone || "N/A"}</div>
                                        </td>
                                        <td>
                                            <span className="badge px-3 py-1" style={{
                                                backgroundColor: user.role === "ADMIN" ? "#dc3545" :
                                                    user.role === "MANAGER" ? "#fd7e14" :
                                                        user.role === "RECEPTIONIST" ? "#0dcaf0" :
                                                            user.role === "STAFF" ? "#6c757d" : "#198754",
                                                fontSize: "11px",
                                                fontWeight: "500",
                                                borderRadius: "20px"
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`fw-semibold ${user.isActive ? "text-success" : "text-danger"}`}>
                                                {user.isActive ? "● Hoạt động" : "● Bị khóa"}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                <button
                                                    onClick={() => setViewUser(user)}
                                                    className="btn btn-sm btn-outline-secondary px-3 py-1 rounded-2"
                                                    style={{ fontSize: "12px" }}
                                                >
                                                    Xem
                                                </button>
                                                <button
                                                    onClick={() => { setEditingUser(user); setFormModalOpen(true); }}
                                                    className="btn btn-sm btn-outline-primary px-3 py-1 rounded-2"
                                                    style={{ fontSize: "12px" }}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id, user.fullName)}
                                                    className="btn btn-sm btn-outline-danger px-3 py-1 rounded-2"
                                                    style={{ fontSize: "12px" }}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân Trang - Style giống nội thất */}
                {users.length > 0 && (
                    <div className="card-footer bg-white d-flex justify-content-between align-items-center p-3 text-muted small border-0 border-top">
                        <div>Hiển thị <b>{users.length}</b> / <b>{pagination.totalElements}</b> thành viên</div>
                        <ul className="pagination pagination-sm mb-0 gap-1">
                            <li className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}>
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    className="page-link rounded-3 text-dark border-0"
                                    style={{ backgroundColor: "#f0f0f0" }}
                                >
                                    Trước
                                </button>
                            </li>
                            <li className="page-item active">
                                <span className="page-link rounded-3 bg-primary border-primary">
                                    {pagination.page} / {pagination.totalPages}
                                </span>
                            </li>
                            <li className={`page-item ${pagination.page === pagination.totalPages ? "disabled" : ""}`}>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    className="page-link rounded-3 text-dark border-0"
                                    style={{ backgroundColor: "#f0f0f0" }}
                                >
                                    Kế tiếp
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Modals */}
            {viewUser && <UserDetailModal user={viewUser} onClose={() => setViewUser(null)} />}
            {formModalOpen && (
                <UserFormModal
                    user={editingUser}
                    onClose={() => { setFormModalOpen(false); setEditingUser(null); }}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    );
};

export default UserManagement;