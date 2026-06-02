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
                        <img src={ImageAuth} alt="Khách sạn sang trọng" className={style.bannerImage} />
                        <div className={style.bannerOverlay}></div>
                        <div className={style.bannerText}>
                            <h1 className={style.bannerTitle}>
                                Bắt đầu với <br />
                                <span className={style.brandHighlight}>LuxeStay</span>
                            </h1>
                            <p className={style.bannerDesc}>
                                Đăng ký để đặt phòng, quản lý đặt phòng và sử dụng các dịch vụ của khách sạn.
                            </p>
                        </div>
                    </div>

                    {/* Cột phải: Form đăng ký 35% */}
                    <div className={style.rightForm}>
                        <div className={style.formHeader}>
                            <h2 className={style.formTitle}>Đăng ký</h2>
                            <p className={style.formSubtitle}>
                                Tạo tài khoản để bắt đầu
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className={style.registerForm}>
                            {/* Hàng 1: Username & FullName */}
                            <div className={style.rowGroup}>
                                <div className={style.formGroup}>
                                    <label className={style.label}>Tên đăng nhập</label>
                                    <div className={style.inputWrapper}>
                                        <i className={`fa-solid fa-user ${style.inputIcon}`}></i>
                                        <input
                                            type="text"
                                            placeholder="Nhập tên đăng nhập"
                                            className={`${style.authInput} ${errors.username ? style.inputError : ""}`}
                                            {...register("username", { required: "Vui lòng nhập tên đăng nhập" })}
                                        />
                                    </div>
                                    {errors.username && <span className={style.errorMsg}>{errors.username.message}</span>}
                                </div>

                                <div className={style.formGroup}>
                                    <label className={style.label}>Họ và tên</label>
                                    <div className={style.inputWrapper}>
                                        <i className={`fa-solid fa-user-pen ${style.inputIcon}`}></i>
                                        <input
                                            type="text"
                                            placeholder="Nhập họ và tên"
                                            className={`${style.authInput} ${errors.fullName ? style.inputError : ""}`}
                                            {...register("fullName", { required: "Vui lòng nhập họ và tên" })}
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
                                            placeholder="Nhập email"
                                            className={`${style.authInput} ${errors.email ? style.inputError : ""}`}
                                            {...register("email", { 
                                                required: "Vui lòng nhập email",
                                                pattern: { 
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                                                    message: "Email không hợp lệ" 
                                                }
                                            })}
                                        />
                                    </div>
                                    {errors.email && <span className={style.errorMsg}>{errors.email.message}</span>}
                                </div>

                                <div className={style.formGroup}>
                                    <label className={style.label}>Số điện thoại</label>
                                    <div className={style.inputWrapper}>
                                        <i className={`fa-solid fa-phone ${style.inputIcon}`}></i>
                                        <input
                                            type="tel"
                                            placeholder="Nhập số điện thoại"
                                            className={`${style.authInput} ${errors.phone ? style.inputError : ""}`}
                                            {...register("phone", { 
                                                required: "Vui lòng nhập số điện thoại",
                                                pattern: { 
                                                    value: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, 
                                                    message: "Số điện thoại không hợp lệ (10 chữ số)" 
                                                }
                                            })}
                                        />
                                    </div>
                                    {errors.phone && <span className={style.errorMsg}>{errors.phone.message}</span>}
                                </div>
                            </div>

                            {/* Password */}
                            <div className={style.formGroup}>
                                <label className={style.label}>Mật khẩu</label>
                                <div className={style.inputWrapper}>
                                    <i className={`fa-solid fa-lock ${style.inputIcon}`}></i>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Tạo mật khẩu"
                                        className={`${style.authInput} ${errors.password ? style.inputError : ""}`}
                                        {...register("password", {
                                            required: "Vui lòng nhập mật khẩu",
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/,
                                                message: "Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
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
                                <label className={style.label}>Xác nhận mật khẩu</label>
                                <div className={style.inputWrapper}>
                                    <i className={`fa-solid fa-shield-halved ${style.inputIcon}`}></i>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Nhập lại mật khẩu"
                                        className={`${style.authInput} ${errors.confirmPassword ? style.inputError : ""}`}
                                        {...register("confirmPassword", {
                                            required: "Vui lòng xác nhận mật khẩu",
                                            validate: (value) => value === password || "Mật khẩu xác nhận không khớp!"
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
                                    <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "8px" }}></i> Đang xử lý...</>
                                ) : (
                                    "Đăng ký"
                                )}
                            </button>
                        </form>

                        {/* OR CONTINUE WITH */}
                        <div className={style.divider}>
                            <span>HOẶC TIẾP TỤC VỚI</span>
                        </div>

                        {/* Google + Facebook cùng 1 dòng */}
                        <div className={style.socialRow}>
<<<<<<< HEAD
                            <button className={`${style.socialBtn} ${style.googleBtn}`} onClick={() => alert("Tiếp tục với Google")}>
                                <i className="fab fa-google"></i> Google
                            </button>
                            <button className={`${style.socialBtn} ${style.facebookBtn}`} onClick={() => alert("Tiếp tục với Facebook")}>
=======
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
>>>>>>> feature/auth
                                <i className="fab fa-facebook-f"></i> Facebook
                            </button>
                        </div>

                        {/* Already have account? Login */}
                        <div className={style.switchAuth}>
                            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
