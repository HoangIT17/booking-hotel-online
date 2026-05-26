import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
import { loginThunk, clearError } from "../../redux/slices/authSlice";
import useAuth from "../../hooks/useAuth";
import style from "./LoginPage.module.css";
// Import components và ảnh
import Header from "../../components/customer/Header";
import ImageAuth from "../../assets/images/ImageAuth.png";

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
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
                    navigate("/home", { replace: true });
                    break;
                default:
                    console.warn("GRAND_HOTEL_AUTH: Role không hợp lệ:", userRole);
                    break;
            }
        }
    }, [isAuthenticated, role, navigate]);

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
                        <img src={ImageAuth} alt="Luxury Hotel" className={style.bannerImage} />
                        <div className={style.bannerOverlay}></div>
                        <div className={style.bannerText}>
                            <h1 className={style.bannerTitle}>
                                Welcome back to <br />
                                <span className={style.brandHighlight}>LuxeStay</span>
                            </h1>
                            <p className={style.bannerDesc}>
                                Sign in to continue booking premium stays, manage reservations, chat with Luxe AI, 
                                or access your hotel operations workspace.
                            </p>
                        </div>
                    </div>

                    {/* Cột phải: Form đăng nhập 35% - CHỈ Username + Password */}
                    <div className={style.rightForm}>
                        <div className={style.formHeader}>
                            <h2 className={style.formTitle}>Sign in</h2>
                            <p className={style.formSubtitle}>
                                Your role is detected after login and routes you to the right workspace.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className={style.loginForm}>
                            {/* Username - CHỈ GIỮ LẠI Username */}
                            <div className={style.formGroup}>
                                <label className={style.label}>Username</label>
                                <div className={style.inputWrapper}>
                                    <i className={`fa-solid fa-user ${style.inputIcon}`}></i>
                                    <input
                                        type="text"
                                        placeholder="Enter your username"
                                        className={`${style.authInput} ${errors.username ? style.inputError : ""}`}
                                        {...register("username", {
                                            required: "Username is required",
                                            minLength: {
                                                value: 3,
                                                message: "Username must be at least 3 characters",
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
                                <label className={style.label}>Password</label>
                                <div className={style.inputWrapper}>
                                    <i className={`fa-solid fa-lock ${style.inputIcon}`}></i>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className={`${style.authInput} ${errors.password ? style.inputError : ""}`}
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters",
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
                                    <span>Remember me</span>
                                </label>
                                <Link to="/forgot-password" className={style.forgotLink}>
                                    Forgot Password?
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
                                        Logging in...
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </button>
                        </form>

                        {/* OR CONTINUE WITH */}
                        <div className={style.divider}>
                            <span>OR CONTINUE WITH</span>
                        </div>

                        {/* Google + Facebook */}
                        <div className={style.socialRow}>
                            <button className={`${style.socialBtn} ${style.googleBtn}`} onClick={() => alert("Continue with Google")}>
                                <i className="fab fa-google"></i> Google
                            </button>
                            <button className={`${style.socialBtn} ${style.facebookBtn}`} onClick={() => alert("Continue with Facebook")}>
                                <i className="fab fa-facebook-f"></i> Facebook
                            </button>
                        </div>

                        {/* Register */}
                        <div className={style.switchAuth}>
                            Don't have account yet? <Link to="/register">Register</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;