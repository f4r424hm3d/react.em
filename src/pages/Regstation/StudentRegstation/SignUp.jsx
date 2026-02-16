import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhoneAlt,
  FaGraduationCap,
  FaGlobe,
  FaBookOpen,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { LuRefreshCw } from "react-icons/lu";
import { MdError, MdCheckCircle } from "react-icons/md";
import api from "../../../api";
import { toast } from "react-toastify";
import { handleErrors } from "../../../utils/handleErrors";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRequired,
  getPasswordStrength,
} from "../../../utils/validation";
import SeoHead from "../../../components/SeoHead";
import useStaticPageSeo from "../../../hooks/useStaticPageSeo";

const SignUp = () => {
  const { seo: apiSeo } = useStaticPageSeo("signup");
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countriesData, setCountriesData] = useState([]);
  const [phonecode, setPhonecode] = useState([]);
  const [levels, setLevels] = useState([]);
  const [courseCategories, setCourseCategories] = useState([]);
  const [phoneError, setPhoneError] = useState("");
  const [phoneValid, setPhoneValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    level: 0,
    color: "gray",
    text: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country_code: "",
    mobile: "",
    password: "",
    confirm_password: "",
    highest_qualification: "",
    interested_course_category: "",
    nationality: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/phonecodes");
        const phonecode = Array.isArray(response.data)
          ? response.data
          : response.data.data;
        setPhonecode(phonecode);

        const res = await api.get("/countries");
        const countries = Array.isArray(res.data) ? res.data : res.data.data;
        setCountriesData(countries);

        const levelsResponse = await api.get("/levels");
        const levels = levelsResponse.data.data;
        setLevels(levels);

        const categoriesResponse = await api.get("/course-categories");
        const categories = Array.isArray(categoriesResponse.data)
          ? categoriesResponse.data
          : categoriesResponse.data.data;
        setCourseCategories(categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    generateCaptcha();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const generateCaptcha = () => {
    const operators = ["+", "-", "×"];
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operator = operators[Math.floor(Math.random() * operators.length)];
    setCaptcha(`${num1} ${operator} ${num2}`);
  };

  // ✅ Real-time validation on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Update password strength
    if (name === "password") {
      setPasswordStrength(getPasswordStrength(value));
    }

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

    if (name === "name") {
      error = validateRequired(value, "Full name");
    } else if (name === "email") {
      error = validateEmail(value);
    } else if (name === "password") {
      error = validatePassword(value);
    } else if (name === "confirm_password") {
      error = validateConfirmPassword(formData.password, value);
    } else if (name === "highest_qualification") {
      error = validateRequired(value, "Qualification level");
    } else if (name === "interested_course_category") {
      error = validateRequired(value, "Interested course");
    } else if (name === "nationality") {
      error = validateRequired(value, "Nationality");
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  // ✅ Smart phone number validation with auto country code detection
  const handlePhoneChange = (e) => {
    const phoneNumber = e.target.value.replace(/\D/g, "");
    let newFormData = { ...formData, mobile: phoneNumber };
    let newPhoneError = "";
    let newPhoneValid = false;

    if (phoneNumber.length >= 6) {
      try {
        let detectedCountryCode = null;
        let detectedIso = null;
        for (const code of phonecode) {
          const fullNumber = `+${code.phonecode}${phoneNumber}`;
          try {
            if (isValidPhoneNumber(fullNumber)) {
              const parsed = parsePhoneNumber(fullNumber);
              if (parsed && parsed.country) {
                detectedCountryCode = code.phonecode;
                detectedIso = parsed.country;
                newPhoneValid = true;
                break;
              }
            }
          } catch (err) {}
        }

        if (detectedCountryCode) {
          // If we detected a country code, prioritize it.
          // Optional: We can also sync Nationality here if we have ISO.
          if (
            !formData.country_code ||
            formData.country_code !== detectedCountryCode
          ) {
            newFormData.country_code = detectedCountryCode;
          }
        } else if (formData.country_code) {
          const fullNumber = `+${formData.country_code}${phoneNumber}`;
          if (isValidPhoneNumber(fullNumber)) {
            newPhoneValid = true;
          } else {
            newPhoneError = "Invalid phone number for selected country";
          }
        } else {
          newPhoneError = "Please select a country code";
        }
      } catch (error) {
        console.error(error);
      }
    }
    setPhoneError(newPhoneError);
    setPhoneValid(newPhoneValid);
    setFormData(newFormData);
  };

  // ✅ Validate and Sync Nationality when country code changes (Code -> Nationality)
  const handleCountryCodeChange = (e) => {
    const code = e.target.value;
    console.log("Selected Code:", code); // DEBUG
    let newFormData = { ...formData, country_code: code };

    // Auto-select Nationality
    if (code) {
      // Find the phone code object
      // Note: phonecode array might have string or number for 'phonecode'
      const matchedPhoneObj = phonecode.find((p) => p.phonecode == code);
      console.log("Matched Phone Object:", matchedPhoneObj); // DEBUG

      if (matchedPhoneObj) {
        let matchedCountry = null;
        // 1. Try ISO Match
        const pIso = (
          matchedPhoneObj.iso ||
          matchedPhoneObj.country_code ||
          matchedPhoneObj.sortname ||
          ""
        ).toUpperCase();
        console.log("Phone Object ISO:", pIso); // DEBUG

        if (pIso && countriesData.length > 0) {
          matchedCountry = countriesData.find((c) => {
            const cIso = (c.iso || c.sortname || c.code || "").toUpperCase();
            return cIso === pIso;
          });
        }

        // 2. Fallback: Name Match
        if (!matchedCountry && matchedPhoneObj.name) {
          const pName = matchedPhoneObj.name.toLowerCase();
          console.log("Trying Name Match with:", pName); // DEBUG
          matchedCountry = countriesData.find(
            (c) => c.name.toLowerCase() === pName,
          );
        }

        console.log("Matched Country (from Code):", matchedCountry?.name); // DEBUG

        if (matchedCountry) {
          newFormData.nationality = matchedCountry.name;
        }
      }
    }

    let newPhoneError = "";
    let newPhoneValid = false;
    if (newFormData.mobile && code) {
      const fullNumber = `+${code}${newFormData.mobile}`;
      try {
        if (isValidPhoneNumber(fullNumber)) newPhoneValid = true;
        else newPhoneError = "Phone number doesn't match this country code";
      } catch (err) {
        newPhoneError = "Invalid phone number";
      }
    }
    setFormData(newFormData);
    setPhoneError(newPhoneError);
    setPhoneValid(newPhoneValid);
  };

  // ✅ Sync Code when Nationality Changes (Nationality -> Code)
  const handleNationalityChange = (e) => {
    const selectedName = e.target.value;
    console.log("Selected Nationality:", selectedName); // DEBUG
    let newCountryCode = formData.country_code;

    const matchedCountry = countriesData.find((c) => c.name === selectedName);
    console.log("Matched Country Object:", matchedCountry); // DEBUG

    if (matchedCountry) {
      let matchingPhone = null;

      // 1. Try ISO Match
      const cIso = (
        matchedCountry.iso ||
        matchedCountry.sortname ||
        matchedCountry.code ||
        ""
      ).toUpperCase();
      console.log("Country ISO:", cIso); // DEBUG

      if (cIso) {
        matchingPhone = phonecode.find((p) => {
          const pIso = (
            p.iso ||
            p.country_code ||
            p.sortname ||
            ""
          ).toUpperCase();
          return pIso === cIso;
        });
      }

      // 2. Fallback: Name Match
      if (!matchingPhone) {
        const cName = selectedName.toLowerCase();
        matchingPhone = phonecode.find(
          (p) => p.name && p.name.toLowerCase() === cName,
        );
      }

      console.log("Matched Phone Object (from Nationality):", matchingPhone); // DEBUG

      if (matchingPhone) {
        newCountryCode = matchingPhone.phonecode;
      }
    }

    setFormData({
      ...formData,
      nationality: selectedName,
      country_code: newCountryCode,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate all fields
    const newErrors = {};
    newErrors.name = validateRequired(formData.name, "Full name");
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    newErrors.confirm_password = validateConfirmPassword(
      formData.password,
      formData.confirm_password,
    );
    newErrors.highest_qualification = validateRequired(
      formData.highest_qualification,
      "Qualification level",
    );
    newErrors.interested_course_category = validateRequired(
      formData.interested_course_category,
      "Interested course",
    );
    newErrors.nationality = validateRequired(
      formData.nationality,
      "Nationality",
    );

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirm_password: true,
      highest_qualification: true,
      interested_course_category: true,
      nationality: true,
    });

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      toast.error("Please fix all errors before submitting");
      setLoading(false);
      return;
    }

    setLoading(true);

    if (phoneError) {
      toast.error(phoneError);
      setLoading(false);
      return;
    }
    if (!phoneValid && formData.mobile) {
      toast.error("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    const [num1, operator, num2] = captcha.split(" ");
    let expectedAnswer;
    if (operator === "+") expectedAnswer = parseInt(num1) + parseInt(num2);
    else if (operator === "-") expectedAnswer = parseInt(num1) - parseInt(num2);
    else if (operator === "×") expectedAnswer = parseInt(num1) * parseInt(num2);

    if (parseInt(userCaptcha) !== expectedAnswer) {
      toast.error("Incorrect captcha value.");
      generateCaptcha();
      setUserCaptcha("");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/student/register", null, {
        params: formData,
      });
      const studentId =
        response.data?.id ||
        response.data?.data?.id ||
        response.data?.student_id;

      if (studentId) {
        localStorage.setItem("student_id", studentId);
        const token = response.data?.token || response.data?.data?.token;
        if (token) localStorage.setItem("token", token);

        const params = new URLSearchParams(location.search);
        const programId = params.get("program_id");
        const redirect = params.get("redirect");

        toast.success("Registration successful!");
        if (programId && redirect === "courses") {
          navigate(
            `/courses-in-malaysia?program_id=${programId}&redirect=courses`,
          );
        } else {
          navigate("/confirmed-email");
        }
      } else {
        toast.error("Registration failed. Please check your details.");
      }
    } catch (error) {
      if (error.response?.data?.errors)
        handleErrors(error.response.data.errors);
      else if (error.response?.data?.message)
        toast.error(error.response.data.message);
      else toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get country flag emoji
  const getCountryFlag = (countryCode) => {
    if (!countryCode || countryCode === "US") return "🏳️";
    try {
      const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt());
      return String.fromCodePoint(...codePoints);
    } catch (e) {
      return "🏳️";
    }
  };

  const findCountryForPhoneCode = (phoneCodeValue) => {
    const phoneCodeData = phonecode.find((p) => p.phonecode == phoneCodeValue);
    let iso =
      phoneCodeData?.iso ||
      phoneCodeData?.country_code ||
      phoneCodeData?.sortname;
    if (!iso && phoneCodeData?.name) {
      const matchedCountry = countriesData.find(
        (c) => c.name === phoneCodeData.name,
      );
      iso =
        matchedCountry?.iso || matchedCountry?.sortname || matchedCountry?.code;
    }
    return iso || "US";
  };

  return (
    <>
      <SeoHead
        pageType="service-detail"
        data={{
          ...apiSeo,
          name: apiSeo?.meta_title || "Sign Up - Education Malaysia",
          description:
            apiSeo?.meta_description ||
            "Create your Education Malaysia account to access personalized university recommendations and application support.",
        }}
      />
      <div className="min-h-screen w-full flex bg-white font-sans">
        {/* Left Side - Brand Visual Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-600 sticky top-0 min-h-screen h-fit flex-col justify-between px-8 pb-8 pt-24 text-white text-left">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 opacity-60"></div>

          <div className="relative z-10 animate-fade-in-right">
            <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className="text-xl">🎓</span>
              <span className="text-xs font-semibold tracking-wide uppercase">
                Study in Malaysia
              </span>
            </div>
            <h1 className="text-5xl font-extrabold leading-tight mb-4 tracking-tight">
              Start Your <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                Study in Malaysia
              </span>{" "}
              <br /> Journey Today!
            </h1>
            <p className="text-lg text-blue-100 max-w-lg leading-relaxed font-light">
              Sign up to get university options, fees, scholarships & visa
              guidance.
            </p>
          </div>

          <div className="relative z-10 mt-auto pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
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

        {/* Right Side - Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative bg-white">
          <div className="w-full max-w-lg space-y-8 animate-fade-in-up my-auto">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Create Account
              </h2>
              <p className="mt-2 text-gray-500">
                Enter your details to register as a student.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <ModernInput
                label="Full Name"
                icon={<FaUser />}
                placeholder="Enter your full name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={errors.name}
              />

              <ModernInput
                label="Email Address"
                icon={<FaEnvelope />}
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={errors.email}
              />

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Phone Number
                </label>
                <div className="flex gap-3">
                  <div className="relative w-1/3">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none z-10">
                      {formData.country_code &&
                        getCountryFlag(
                          findCountryForPhoneCode(formData.country_code),
                        )}
                    </div>
                    <select
                      name="country_code"
                      value={formData.country_code}
                      onChange={handleCountryCodeChange}
                      className="appearance-none w-full pl-10 pr-8 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm outline-none cursor-pointer"
                      required
                    >
                      <option value="">Code</option>
                      {phonecode.map((code, idx) => (
                        <option key={idx} value={code.phonecode}>
                          {code.iso || code.country_code} (+{code.phonecode})
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1 group">
                    <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handlePhoneChange}
                      className={`w-full pl-11 pr-10 py-3.5 bg-gray-50 border rounded-xl text-gray-900 font-medium focus:bg-white focus:ring-4 transition-all text-sm outline-none ${phoneError ? "border-red-300 focus:border-red-500 focus:ring-red-100" : phoneValid ? "border-green-300 focus:border-green-500 focus:ring-green-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/10"}`}
                      required
                    />
                    {phoneValid && (
                      <MdCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                    )}
                    {phoneError && (
                      <MdError className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />
                    )}
                  </div>
                </div>
                {phoneError && (
                  <p className="text-red-500 text-xs ml-1 font-medium">
                    {phoneError}
                  </p>
                )}
              </div>

              <ModernSelect
                label="Qualification Level"
                icon={<FaGraduationCap />}
                name="highest_qualification"
                value={formData.highest_qualification}
                onChange={handleChange}
                onBlur={handleBlur}
                options={levels.map((level) => level.level)}
                required
                error={errors.highest_qualification}
              />

              <ModernSelect
                label="Interested Course"
                icon={<FaBookOpen />}
                name="interested_course_category"
                value={formData.interested_course_category}
                onChange={handleChange}
                onBlur={handleBlur}
                options={courseCategories.map((cat) => cat.name)}
                required
                error={errors.interested_course_category}
              />

              <ModernSelect
                label="Nationality"
                icon={<FaGlobe />}
                name="nationality"
                value={formData.nationality}
                onChange={handleNationalityChange}
                onBlur={handleBlur}
                options={countriesData.map((country) => country.name)}
                required
                error={errors.nationality}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PasswordInput
                  label="Password"
                  icon={<FaLock />}
                  placeholder="Create password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  required
                  error={errors.password}
                  showStrength={true}
                  strength={passwordStrength}
                />
                <PasswordInput
                  label="Confirm Password"
                  icon={<FaLock />}
                  placeholder="Confirm password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  showPassword={showConfirmPassword}
                  setShowPassword={setShowConfirmPassword}
                  required
                  error={errors.confirm_password}
                />
              </div>

              {/* Captcha */}
              <div className="space-y-1.5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <label className="text-sm font-semibold text-gray-700">
                  Verify Security
                </label>
                <div className="flex items-center gap-3">
                  <div className="bg-white px-4 py-2.5 rounded-lg border border-gray-200 font-bold text-gray-800 tracking-wider shadow-sm select-none min-w-[80px] text-center">
                    {captcha}
                  </div>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200 hover:shadow-sm"
                  >
                    <LuRefreshCw />
                  </button>
                  <input
                    type="text"
                    placeholder="Result?"
                    value={userCaptcha}
                    onChange={(e) => setUserCaptcha(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account <FaArrowRight />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?
                <Link
                  to="/login"
                  className="font-bold text-blue-600 hover:text-blue-700 hover:underline ml-1"
                >
                  Sign In
                </Link>
              </p>
            </form>
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

// Modern Select
const ModernSelect = ({
  label,
  icon,
  options,
  name,
  value,
  onChange,
  onBlur,
  required,
  error,
}) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 z-10 transition-colors">
        {icon}
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        className={`appearance-none w-full pl-11 pr-10 py-3.5 bg-gray-50 border rounded-xl text-gray-900 font-medium focus:bg-white focus:ring-4 transition-all outline-none text-sm cursor-pointer ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
            : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/10"
        }`}
      >
        <option value="" disabled hidden className="text-gray-500">
          Select {label}
        </option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
    {error && (
      <p className="text-red-600 text-xs mt-1 ml-1 font-medium flex items-center gap-1">
        <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
        {error}
      </p>
    )}
  </div>
);

// Modern Password Input with Strength Indicator
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
  required,
  error,
  showStrength,
  strength,
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
        required={required}
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
    {/* Password Strength Indicator */}
    {showStrength && value && strength && strength.level > 0 && (
      <div className="flex items-center gap-2 mt-1">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              strength.color === "red"
                ? "bg-red-500"
                : strength.color === "yellow"
                  ? "bg-yellow-500"
                  : "bg-green-500"
            }`}
            style={{ width: `${(strength.level / 3) * 100}%` }}
          ></div>
        </div>
        <span
          className={`text-xs font-medium ${
            strength.color === "red"
              ? "text-red-600"
              : strength.color === "yellow"
                ? "text-yellow-600"
                : "text-green-600"
          }`}
        >
          {strength.text}
        </span>
      </div>
    )}
    {error && (
      <p className="text-red-600 text-xs mt-1 ml-1 font-medium flex items-center gap-1">
        <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
        {error}
      </p>
    )}
  </div>
);

export default SignUp;
