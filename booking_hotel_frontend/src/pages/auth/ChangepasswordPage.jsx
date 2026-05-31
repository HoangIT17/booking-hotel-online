import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePasswordThunk, clearError } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ChangePasswordPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const passwordCriteria = useMemo(() => {
        const password = formData.newPassword || "";
        return {
            isMinLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[@#$%^&+=!]/.test(password),
        };
    }, [formData.newPassword]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
            toast.error("Vui lòng điền đầy đủ tất cả các trường dữ liệu!");
            return;
        }

        const { isMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar } = passwordCriteria;
        if (!isMinLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
            toast.error("Mật khẩu mới chưa đáp ứng đủ điều kiện bảo mật của hệ thống!");
            return;
        }

        if (formData.newPassword === formData.oldPassword) {
            toast.error("Mật khẩu mới không được trùng với mật khẩu cũ!");
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Mật khẩu xác nhận không trùng khớp!");
            return;
        }

        const changePasswordData = {
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword
        };

        const resultAction = await dispatch(changePasswordThunk(changePasswordData));

        if (changePasswordThunk.fulfilled.match(resultAction)) {
            toast.success("Thay đổi mật khẩu thành công!");
            setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });

            const savedUser = localStorage.getItem("user");
            let userRole = "CUSTOMER"; 

            if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
                const userObj = JSON.parse(savedUser);
                userRole = userObj?.role?.toUpperCase() || "CUSTOMER";
            }

            setTimeout(() => {
                switch (userRole) {
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
                        navigate('/customer/home');
                        break;
                }
            }, 500);

        } else if (changePasswordThunk.rejected.match(resultAction)) {
            const errorMessage = resultAction.payload || "Đổi mật khẩu thất bại!";
            toast.error(errorMessage);
        }
    };

    const renderCriteriaItem = (isValid, text) => (
        <div className={`d-flex align-items-center gap-2 small mb-1 ${isValid ? "text-success" : "text-muted"}`}>
            <i className={`fa-solid ${isValid ? "fa-circle-check" : "fa-circle-xmark"}`} style={{ fontSize: '11px' }}></i>
            <span style={{ fontSize: '12px' }}>{text}</span>
        </div>
    );

    return (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center p-2">
            <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
                    <div className="card shadow-sm rounded-3 overflow-hidden" style={{ border: '1.5px solid #dee2e6' }}>
                    <div className="card-header bg-primary text-white text-center py-2">
                        <h5 className="mb-0 fw-bold">Đổi Mật Khẩu</h5>
                    </div>
                    
                    <div className="card-body p-3 bg-white">
                        <form onSubmit={handleSubmit}>
                            {/* MẬT KHẨU CŨ */}
                            <div className="mb-2">
                                <label className="form-label fw-semibold text-dark small mb-1">Mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    className="form-control bg-light border-0"
                                    name="oldPassword"
                                    placeholder="Nhập mật khẩu cũ"
                                    value={formData.oldPassword}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    style={{ fontSize: '14px', padding: '8px 12px', borderRadius: '8px' }}
                                />
                            </div>

                            {/* MẬT KHẨU MỚI */}
                            <div className="mb-1">
                                <label className="form-label fw-semibold text-dark small mb-1">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    className="form-control bg-light border-0"
                                    name="newPassword"
                                    placeholder="Tối thiểu 8 ký tự"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    style={{ fontSize: '14px', padding: '8px 12px', borderRadius: '8px' }}
                                />
                            </div>

                            {/* BẢNG HIỂN THỊ VALIDATION */}
                            {formData.newPassword && (
                                <div className="p-2 mb-2 bg-light rounded border" style={{ borderRadius: '8px' }}>
                                    <p className="fw-semibold text-dark mb-1" style={{ fontSize: '11px' }}>Yêu cầu mật khẩu:</p>
                                    {renderCriteriaItem(passwordCriteria.isMinLength, "Ít nhất 8 ký tự")}
                                    {renderCriteriaItem(passwordCriteria.hasUpperCase, "1 chữ hoa (A-Z)")}
                                    {renderCriteriaItem(passwordCriteria.hasLowerCase, "1 chữ thường (a-z)")}
                                    {renderCriteriaItem(passwordCriteria.hasNumber, "1 chữ số (0-9)")}
                                    {renderCriteriaItem(passwordCriteria.hasSpecialChar, "1 ký tự đặc biệt (@, #, $, %, !)")}
                                </div>
                            )}

                            {/* XÁC NHẬN MẬT KHẨU */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-dark small mb-1">Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    className="form-control bg-light border-0"
                                    name="confirmPassword"
                                    placeholder="Nhập lại mật khẩu mới"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    style={{ fontSize: '14px', padding: '8px 12px', borderRadius: '8px' }}
                                />
                                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                                    <div className="text-danger small mt-1" style={{ fontSize: '11px' }}>
                                        <i className="fa-solid fa-circle-exclamation me-1"></i> Mật khẩu xác nhận không trùng khớp.
                                    </div>
                                )}
                            </div>

                            {/* NÚT SUBMIT */}
                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2 fw-bold shadow-sm"
                                disabled={loading}
                                style={{ fontSize: '13px', borderRadius: '8px', letterSpacing: '0.5px' }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    "Xác nhận đổi mật khẩu"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;