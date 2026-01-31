import { useState, useEffect } from "react";
import api from "../api";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaFlag,
  FaBook,
  FaPaperPlane,
} from "react-icons/fa";
import qs from "qs";
import { toast } from "react-toastify";

const InputWithIcon = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
      {icon}
    </div>
    <input {...props} className={`${props.className} pl-10`} />
  </div>
);

const GetInTouchForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country_code: "+91", // default
    phone: "",
    nationality: "",
    exam: "",
    captchaInput: "",
    agree: false,
    source: "",
    source_path: "",
  });

  const [error, setError] = useState("");
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0 });
  const [countriesData, setCountriesData] = useState([]);

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50";

  useEffect(() => {
    const num1 = Math.floor(Math.random() * 10) + 5;
    const num2 = Math.floor(Math.random() * 5);
    setCaptcha({ num1, num2 });

    const fetchData = async () => {
      try {
        const res = await api.get("/countries");
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setCountriesData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching country data:", err);
        setCountriesData([]);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expectedAnswer = captcha.num1 - captcha.num2;
    if (parseInt(formData.captchaInput) !== expectedAnswer) {
      setError("Captcha is incorrect. Please try again.");
      return;
    }
    if (!formData.agree) {
      setError("You must agree to the Terms and Privacy Statement.");
      return;
    }
    setError("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        country_code: formData.country_code.replace("+", ""), // ✅ send only numbers
        mobile: formData.phone,
        source: "Education Malaysia - Exam Detail Page",
        source_path: window.location.href,
        nationality: formData.nationality.toUpperCase(), // ✅ API expects uppercase
        interested_program: formData.exam,
      };

      const res = await api.post(
        "/inquiry/exam-page",
        qs.stringify(payload),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
           
          },
        }
      );

      if (res.status === 200) {
        toast.success("Form submitted successfully!");
        setFormData({
          name: "",
          email: "",
          country_code: "+91",
          phone: "",
          nationality: "",
          exam: "",
          captchaInput: "",
          agree: false,
        });
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("API Error:", err.response?.data || err);
      setError(
        err.response?.data?.message ||
          "Failed to submit the form. Please try again later."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-1 lg:px-1 ">
      <div className="w-full max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full p-1 sm:p-6 rounded-2xl  border border-gray-200"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center gap-3">
            <FaPaperPlane className="text-blue-600" />
            <span>Get In Touch</span>
          </h2>

          <div className="grid gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <InputWithIcon
                icon={<FaUser />}
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClass}
              />

              {/* Email Address */}
              <InputWithIcon
                icon={<FaEnvelope />}
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClass}
              />
              <InputWithIcon
                type="hidden"
                name="source"
                placeholder=""
                value={formData.source="Education Malaysia -  Scholarship Page "}
                onChange={handleChange}
              />
              <InputWithIcon
                type="hidden"
                name="source_path"
                placeholder=""
                value={formData.source_path=window.location.href}
                onChange={handleChange}
              />
            </div>

            {/* Phone Code + Phone */}
            <div className="flex gap-1">
              <select
                name="country_code"
                value={formData.country_code}
                onChange={handleChange}
                className={`${inputClass} w-1/3 bg-white appearance-none`}
              >
                <option value="+91">+91</option>
                {countriesData.map((c) => (
                  <option key={c.id} value={`+${c.phonecode}`}>
                    +{c.phonecode}
                  </option>
                ))}
              </select>
              <InputWithIcon
                icon={<FaPhoneAlt />}
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className={`${inputClass} w-2/3`}
              />
            </div>

            {/* Nationality */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaFlag />
              </div>
              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
                className={`${inputClass} pl-10 bg-white appearance-none`}
              >
                <option value="">Select Nationality</option>
                {countriesData.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Exam */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaBook />
              </div>
              <select
                name="exam"
                value={formData.exam}
                onChange={handleChange}
                required
                className={`${inputClass} pl-10 bg-white appearance-none`}
              >
                <option value="">Select Interested Exam</option>
                <option value="PTE">PTE</option>
                <option value="IELTS">IELTS</option>
                <option value="TOEFL">TOEFL</option>
              </select>
            </div>

            {/* Captcha */}
            <div className="bg-gray-100 p-4 rounded-lg flex flex-col sm:flex-row items-center gap-4">
              <label className="text-sm font-medium text-gray-700 flex-shrink-0">
                <span className="font-semibold text-gray-700">
                  Captcha: {captcha.num1} - {captcha.num2} = ?
                </span>
              </label>
              <input
                type="text"
                name="captchaInput"
                placeholder="Your answer"
                value={formData.captchaInput}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <input
                type="checkbox"
                name="agree"
                id="agree-checkbox"
                checked={formData.agree}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="agree-checkbox">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Terms and Privacy Statement
                </a>
              </label>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 text-center bg-red-50 p-2 rounded-md border border-red-200">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 text-base"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GetInTouchForm;