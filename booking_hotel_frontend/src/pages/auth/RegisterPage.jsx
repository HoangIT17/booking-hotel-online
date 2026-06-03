import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { registerThunk } from "../../redux/slices/authSlice"; 
import useAuth from "../../hooks/useAuth";
import style from "./RegisterPage.module.css";
// Import components và ảnh
import Header from "../../components/customer/Header";
import ImageAuth from "../../assets/images/ImageAuth.png";

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useAuth();
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch("password", "");

    const onSubmit = (data) => {
        const registerData = { ...data };
        delete registerData.confirmPassword;
        registerData.role = "CUSTOMER"; 

        dispatch(registerThunk(registerData))
            .unwrap()
            .then(() => {
                toast.success("Đăng ký tài khoản thành công!");
                setTimeout(() => navigate("/login"), 1500);
            })
            // .catch((error) => {
            //     toast.error(error);
            // });
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
                                Sign up to continue booking premium stays, manage reservations, chat with Luxe AI, 
                                or access your hotel operations workspace.
                            </p>
                        </div>
                    </div>

                    {/* Cột phải: Form đăng ký 35% */}
                    <div className={style.rightForm}>
                        <div className={style.formHeader}>
                            <h2 className={style.formTitle}>Sign up</h2>
                            <p className={style.formSubtitle}>
                                Create your account to get started
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className={style.registerForm}>
                            {/* Hàng 1: Username & FullName */}
                            <div className={style.rowGroup}>
                                <div className={style.formGroup}>
                                    <label className={style.label}>Username</label>
                                    <div className={style.inputWrapper}>
                                        <i className={`fa-solid fa-user ${style.inputIcon}`}></i>
                                        <input
                                            type="text"
                                            placeholder="Enter username"
                                            className={`${style.authInput} ${errors.username ? style.inputError : ""}`}
                                            {...register("username", { required: "Username is required" })}
                                        />
                                    </div>
                                    {errors.username && <span className={style.errorMsg}>{errors.username.message}</span>}
                                </div>

                                <div className={style.formGroup}>
                                    <label className={style.label}>Full Name</label>
                                    <div className={style.inputWrapper}>
                                        <i className={`fa-solid fa-user-pen ${style.inputIcon}`}></i>
                                        <input
                                            type="text"
                                            placeholder="Enter full name"
                                            className={`${style.authInput} ${errors.fullName ? style.inputError : ""}`}
                                            {...register("fullName", { required: "Full name is required" })}
                                        />
                                    </div>
                                    {errors.fullName && <span className={style.errorMsg}>{errors.fullName.message}</span>}
                                </div>
                            </div>

                            {/* Hàng 2: Email & Phone */}
                            <div className={style.rowGroup}>
                                <div className={style.formGroup}>
                                    <label className={style.label}>Email</label>
                                    <div className={style.inputWrapper}>
                                        <i className={`fa-solid fa-envelope ${style.inputIcon}`}></i>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className={`${style.authInput} ${errors.email ? style.inputError : ""}`}
                                            {...register("email", { 
                                                required: "Email is required",
                                                pattern: { 
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                                                    message: "Invalid email address" 
                                                }
                                            })}
                                        />
                                    </div>
                                    {errors.email && <span className={style.errorMsg}>{errors.email.message}</span>}
                                </div>

                                <div className={style.formGroup}>
                                    <label className={style.label}>Phone Number</label>
                                    <div className={style.inputWrapper}>
                                        <i className={`fa-solid fa-phone ${style.inputIcon}`}></i>
                                        <input
                                            type="tel"
                                            placeholder="Enter phone number"
                                            className={`${style.authInput} ${errors.phone ? style.inputError : ""}`}
                                            {...register("phone", { 
                                                required: "Phone number is required",
                                                pattern: { 
                                                    value: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, 
                                                    message: "Invalid phone number (10 digits)" 
                                                }
                                            })}
                                        />
                                    </div>
                                    {errors.phone && <span className={style.errorMsg}>{errors.phone.message}</span>}
                                </div>
                            </div>

                            {/* Password */}
                            <div className={style.formGroup}>
                                <label className={style.label}>Password</label>
                                <div className={style.inputWrapper}>
                                    <i className={`fa-solid fa-lock ${style.inputIcon}`}></i>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password"
                                        className={`${style.authInput} ${errors.password ? style.inputError : ""}`}
                                        {...register("password", {
                                            required: "Password is required",
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/,
                                                message: "Password must have ≥8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char"
                                            }
                                        })}
                                    />
                                    <button type="button" className={style.eyeButton} onClick={() => setShowPassword(!showPassword)}>
                                        <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                    </button>
                                </div>
                                {errors.password && <span className={style.errorMsg}>{errors.password.message}</span>}
                            </div>

                            {/* Confirm Password */}
                            <div className={style.formGroup}>
                                <label className={style.label}>Confirm Password</label>
                                <div className={style.inputWrapper}>
                                    <i className={`fa-solid fa-shield-halved ${style.inputIcon}`}></i>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        className={`${style.authInput} ${errors.confirmPassword ? style.inputError : ""}`}
                                        {...register("confirmPassword", {
                                            required: "Please confirm your password",
                                            validate: (value) => value === password || "Passwords do not match!"
                                        })}
                                    />
                                    <button type="button" className={style.eyeButton} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        <i className={`fa-regular ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                    </button>
                                </div>
                                {errors.confirmPassword && <span className={style.errorMsg}>{errors.confirmPassword.message}</span>}
                            </div>

                            {/* Submit Button */}
                            <button type="submit" disabled={loading} className={style.submitBtn}>
                                {loading ? (
                                    <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "8px" }}></i> Processing...</>
                                ) : (
                                    "Sign up"
                                )}
                            </button>
                        </form>

                        {/* OR CONTINUE WITH */}
                        <div className={style.divider}>
                            <span>OR CONTINUE WITH</span>
                        </div>

                        {/* Google + Facebook cùng 1 dòng */}
                        <div className={style.socialRow}>
                            <button 
                                className={`${style.socialBtn} ${style.googleBtn}`} 
                                type="button" 
                                onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}>
                                <i className="fab fa-google"></i> Google
                            </button>
                            <button 
                                className={`${style.socialBtn} ${style.facebookBtn}`} 
                                type="button" 
                                onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/facebook"}>
                                <i className="fab fa-facebook-f"></i> Facebook
                            </button>
                        </div>

                        {/* Already have account? Login */}
                        <div className={style.switchAuth}>
                            Already have an account? <Link to="/login">Sign in</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;