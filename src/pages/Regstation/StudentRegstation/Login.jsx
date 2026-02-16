import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaSignInAlt,
  FaArrowRight,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api";
import { validateEmail, validateRequired } from "../../../utils/validation";
import SeoHead from "../../../components/SeoHead";
import useStaticPageSeo from "../../../hooks/useStaticPageSeo";

const Login = () => {
  const { seo: apiSeo } = useStaticPageSeo("login");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ✅ Real-time validation on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Validate on change if field was touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  // ✅ Validate field on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  // ✅ Field validation logic
  const validateField = (name, value) => {
    let error = "";

    if (name === "email") {
      error = validateEmail(value);
    } else if (name === "password") {
      error = validateRequired(value, "Password");
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  // ✅ Validate all fields before submit
  const validateForm = () => {
    const newErrors = {};

    newErrors.email = validateEmail(formData.email);
    newErrors.password = validateRequired(formData.password, "Password");

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate form before submission
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/student/login", formData);
      const responseData = response.data.data || response.data;

      if (
        response.data?.message ===
        "Account not verified. Please verify your email. OTP sent to your email."
      ) {
        if (responseData?.id) {
          localStorage.setItem("student_id", responseData.id);
        }
        toast.info("Please verify your email. OTP sent to your email.");
        navigate("/confirmed-email");
      } else if (responseData && responseData.token) {
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("student_id", responseData.id);
        localStorage.setItem("student_email", responseData.email);

        toast.success("Login successful!");

        const params = new URLSearchParams(window.location.search);
        const programId = params.get("program_id");
        const redirect = params.get("redirect");

        if (programId && redirect === "courses") {
          navigate(
            `/courses-in-malaysia?program_id=${programId}&redirect=courses`,
          );
        } else {
          navigate("/student/profile");
        }
      } else {
        toast.error(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SeoHead
        pageType="service-detail"
        data={{
          ...apiSeo,
          name: apiSeo?.meta_title || "Login - Education Malaysia",
          description:
            apiSeo?.meta_description ||
            "Login to your Education Malaysia account to access personalized services and resources.",
        }}
      />
      <div className="min-h-screen w-full flex bg-white font-sans">
        {/* Left Side - Brand/Visual Section (Full Height) */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-600 sticky top-0 min-h-screen h-fit flex-col justify-between px-8 pb-8 pt-24 text-white text-left">
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 opacity-60"></div>

          {/* Content */}
          <div className="relative z-10 animate-fade-in-right">
            <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-xs font-semibold tracking-wide uppercase">
                Education Malaysia
              </span>
            </div>
            <h1 className="text-5xl font-extrabold leading-tight mb-4 tracking-tight">
              Unlock Your <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                Global Future.
              </span>
            </h1>
            <p className="text-lg text-blue-100 max-w-lg leading-relaxed font-light">
              Access world-class universities, manage applications, and get
              expert guidance—all in one place.
            </p>
          </div>

          {/* Footer/Testimonial */}
          <div className="relative z-10 mt-auto pt-8 border-t border-white/10 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-3xl font-bold">12+</h3>
              <p className="text-sm text-blue-200">Years of Experience</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">5000+</h3>
              <p className="text-sm text-blue-200">Students Guided</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">97%</h3>
              <p className="text-sm text-blue-200">Visa Success Rate</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">Tie-ups</h3>
              <p className="text-sm text-blue-200">
                With Malaysian Universities
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form (Clean White) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative bg-white">
          <div className="w-full max-w-md space-y-8 animate-fade-in-up">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="mt-2 text-gray-500">
                Please enter your details to sign in.
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <ModernInput
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  icon={<FaEnvelope />}
                  error={errors.email}
                />

                <div>
                  <PasswordInput
                    label="Password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    icon={<FaLock />}
                    error={errors.password}
                  />
                  <div className="flex items-center justify-between mt-3 font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="remember"
                        className="text-gray-500 cursor-pointer select-none"
                      >
                        Remember for 30 days
                      </label>
                    </div>
                    <Link
                      to="/account/password/reset"
                      className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-base"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In <FaArrowRight />
                  </>
                )}
              </button>

              <button
                type="button"
                className="w-full bg-white border border-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Sign in with Google
              </button>
            </form>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?
              <Link
                to="/signup"
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline ml-1"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Modern Clean Input
const ModernInput = ({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  icon,
  required,
  error,
}) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-4 transition-all outline-none text-sm font-medium ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
            : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/10"
        }`}
      />
    </div>
    {error && (
      <p className="text-red-600 text-xs mt-1 ml-1 font-medium flex items-center gap-1">
        <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
        {error}
      </p>
    )}
  </div>
);

// Modern Password Input
const PasswordInput = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  showPassword,
  setShowPassword,
  icon,
  error,
}) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
        {icon}
      </div>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required
        className={`w-full pl-11 pr-12 py-3.5 bg-gray-50 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-4 transition-all outline-none text-sm font-medium ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
            : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/10"
        }`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
    {error && (
      <p className="text-red-600 text-xs mt-1 ml-1 font-medium flex items-center gap-1">
        <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
        {error}
      </p>
    )}
  </div>
);

export default Login;
