import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
import { loginThunk, clearError } from "../../redux/slices/authSlice";
import useAuth from "../../hooks/useAuth";
import style from "./LoginPage.module.css";
// Import components và ảnh
import Header from "../../components/customer/Header";
import ImageAuth from "../../assets/images/ImageAuth.png";

const getSafeRedirectPath = (search) => {
    const redirect = new URLSearchParams(search).get("redirect");

    if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) {
        return null;
    }

    return redirect;
};

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectPath = getSafeRedirectPath(location.search);
    
    const { isAuthenticated, loading, error, role } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (isAuthenticated && role) {
            const userRole = role.toUpperCase(); 

            switch (userRole) {
                case "ADMIN":
                    navigate("/admin/dashboard", { replace: true });
                    break;
                case "MANAGER":
                    navigate("/manager/dashboard", { replace: true });
                    break;
                case "RECEPTIONIST":
                    navigate("/receptionist/dashboard", { replace: true });
                    break;
                case "STAFF":
                    navigate("/staff/dashboard", { replace: true });
                    break;
                case "CUSTOMER":
                    navigate(redirectPath || "/home", { replace: true });
                    break;
                default:
                    console.warn("GRAND_HOTEL_AUTH: Role không hợp lệ:", userRole);
                    break;
            }
        }
    }, [isAuthenticated, role, navigate, redirectPath]);

    useEffect(() => {
        if (error) {
            // toast.error(error);
            dispatch(clearError()); 
        }
    }, [error, dispatch]);

    const onSubmit = (data) => {
        dispatch(loginThunk(data));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={style.authContainer}>
            {/* Header tái sử dụng */}
            <Header />

            {/* Main content */}
            <div className={style.mainContent}>
                <div className={style.contentWrapper}>
                    {/* Cột trái: Banner 65% */}
                    <div className={style.leftBanner}>
                        <img src={ImageAuth} alt="Khách sạn sang trọng" className={style.bannerImage} />
                        <div className={style.bannerOverlay}></div>
                        <div className={style.bannerText}>
                            <h1 className={style.bannerTitle}>
                                Chào mừng trở lại <br />
                                <span className={style.brandHighlight}>LuxeStay</span>
                            </h1>
                            <p className={style.bannerDesc}>
                                Đăng nhập để tiếp tục đặt phòng, quản lý đặt phòng hoặc truy cập không gian làm việc của khách sạn.
                            </p>
                        </div>
                    </div>

                    {/* Cột phải: Form đăng nhập 35% - CHỈ Username + Password */}
                    <div className={style.rightForm}>
                        <div className={style.formHeader}>
                            <h2 className={style.formTitle}>Đăng nhập</h2>
                            <p className={style.formSubtitle}>
                                Hệ thống sẽ xác định vai trò và chuyển bạn đến đúng khu vực sau khi đăng nhập.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className={style.loginForm}>
                            {/* Username - CHỈ GIỮ LẠI Username */}
                            <div className={style.formGroup}>
                                <label className={style.label}>Tên đăng nhập</label>
                                <div className={style.inputWrapper}>
                                    <i className={`fa-solid fa-user ${style.inputIcon}`}></i>
                                    <input
                                        type="text"
                                        placeholder="Nhập tên đăng nhập"
                                        className={`${style.authInput} ${errors.username ? style.inputError : ""}`}
                                        {...register("username", {
                                            required: "Vui lòng nhập tên đăng nhập",
                                            minLength: {
                                                value: 3,
                                                message: "Tên đăng nhập phải có ít nhất 3 ký tự",
                                            },
                                        })}
                                    />
                                </div>
                                {errors.username && (
                                    <span className={style.errorMsg}>
                                        {errors.username.message}
                                    </span>
                                )}
                            </div>

                            {/* Password - CHỈ GIỮ LẠI Password */}
                            <div className={style.formGroup}>
                                <label className={style.label}>Mật khẩu</label>
                                <div className={style.inputWrapper}>
                                    <i className={`fa-solid fa-lock ${style.inputIcon}`}></i>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nhập mật khẩu"
                                        className={`${style.authInput} ${errors.password ? style.inputError : ""}`}
                                        {...register("password", {
                                            required: "Vui lòng nhập mật khẩu",
                                            minLength: {
                                                value: 6,
                                                message: "Mật khẩu phải có ít nhất 6 ký tự",
                                            },
                                        })}
                                    />
                                    <button
                                        type="button"
                                        className={style.eyeButton}
                                        onClick={togglePasswordVisibility}
                                    >
                                        <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className={style.errorMsg}>
                                        {errors.password.message}
                                    </span>
                                )}
                            </div>

                            {/* Remember me & Forgot Password */}
                            <div className={style.optionsRow}>
                                <label className={style.checkboxLabel}>
                                    <input type="checkbox" className={style.rememberCheckbox} />
                                    <span>Ghi nhớ đăng nhập</span>
                                </label>
                                <Link to="/forgot-password" className={style.forgotLink}>
                                    Quên mật khẩu?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={style.submitBtn}
                            >
                                {loading ? (
                                    <>
                                        <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "8px" }}></i>
                                        Đang đăng nhập...
                                    </>
                                ) : (
                                    "Đăng nhập"
                                )}
                            </button>
                        </form>

                        {/* OR CONTINUE WITH */}
                        <div className={style.divider}>
                            <span>HOẶC TIẾP TỤC VỚI</span>
                        </div>

                        {/* Google + Facebook */}
                        <div className={style.socialRow}>
                            <button className={`${style.socialBtn} ${style.googleBtn}`} onClick={() => alert("Tiếp tục với Google")}>
                                <i className="fab fa-google"></i> Google
                            </button>
                            <button className={`${style.socialBtn} ${style.facebookBtn}`} onClick={() => alert("Tiếp tục với Facebook")}>
                                <i className="fab fa-facebook-f"></i> Facebook
                            </button>
                        </div>

                        {/* Register */}
                        <div className={style.switchAuth}>
                            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
