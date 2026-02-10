import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaGraduationCap,
  FaBook,
  FaGlobe,
  FaLightbulb,
  FaMoneyBill,
  FaPhoneAlt,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import { LuRefreshCw } from "react-icons/lu";
import api from "../../api";
import { API_URL } from "../../config";

const PopupForm = ({
  isOpen,
  onClose,
  universityData,
  formType = "brochure",
}) => {
  const [captcha, setCaptcha] = useState("");
  const [userInput, setUserInput] = useState("");
  const [countriesData, setCountriesData] = useState([]);
  const [phonecode, setPhonecode] = useState([]);
  const [levels, setLevels] = useState([]);
  const [courseCategories, setCourseCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    c_code: "",
    mobile: "",
    nationality: "",
    highest_qualification: "",
    interested_course_category: "",
    // ✅ Counselling form ke liye extra fields
    preferred_date: "",
    time_zone: "",
    preferred_time: "",
    message: "",
    requestfor: "brochure",
  });

  useEffect(() => {
    const reqType =
      formType === "counselling"
        ? "counselling"
        : formType === "fee"
          ? "fees"
          : "brochure";
    setFormData((prev) => ({ ...prev, requestfor: reqType }));
  }, [formType, isOpen]);

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ Dynamic titles based on formType
  const formTitle =
    formType === "counselling"
      ? "Book Your Counselling Session"
      : formType === "apply"
        ? "Apply For This Course"
        : formType === "fee"
          ? "Download Fee Structure"
          : "Register Now To Download Brochure";

  const submitButtonText =
    formType === "counselling"
      ? "Book Session Now"
      : formType === "apply"
        ? "Submit Application"
        : formType === "fee"
          ? "Download Fee Structure"
          : "Download Brochure";

  // ✅ Captcha Generator
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ["+", "-", "*"];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    setCaptcha(`${num1} ${operator} ${num2}`);
  };

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
    if (isOpen) {
      generateCaptcha();
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Two-way Sync: Code -> Nationality
  const handleCountryCodeChange = (e) => {
    const code = e.target.value;
    let newFormData = { ...formData, c_code: code };

    if (code) {
      // Find country with this phone code
      const matchedCountry = countriesData.find((c) => c.phonecode == code);
      if (matchedCountry) {
        newFormData.nationality = matchedCountry.name;
      }
    }
    setFormData(newFormData);
  };

  // Two-way Sync: Nationality -> Code
  const handleNationalityChange = (e) => {
    const name = e.target.value;
    let newFormData = { ...formData, nationality: name };

    const matchedCountry = countriesData.find((c) => c.name === name);
    if (matchedCountry && matchedCountry.phonecode) {
      newFormData.c_code = matchedCountry.phonecode;
    }
    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formValues = new FormData(e.currentTarget);

    // Captcha Validation
    try {
      const correctAnswer = eval(captcha);
      if (parseInt(userInput) !== correctAnswer) {
        alert("Invalid captcha answer");
        generateCaptcha(); // Refresh Captcha
        setUserInput(""); // Clear Input
        return;
      }
    } catch {
      alert("Captcha error");
      generateCaptcha();
      setUserInput("");
      return;
    }

    setLoading(true);

    try {
      // Determine Endpoint
      const endpoint =
        formType === "counselling"
          ? "/inquiry/book-session"
          : "/inquiry/brochure-request";

      // Prepare Data Payload
      const submitData = {
        name: formValues.get("name")?.toString().trim(),
        email: formValues.get("email")?.toString().trim(),
        country_code: formValues
          .get("c_code")
          ?.toString()
          .replace("+", "")
          .trim(),
        mobile: formValues.get("mobile")?.toString().trim(),
        nationality: formValues.get("nationality")?.toString().trim(),
        highest_qualification: formValues
          .get("highest_qualification")
          ?.toString()
          .trim(),
        interested_course_category: formValues
          .get("interested_course_category")
          ?.toString()
          .trim(),
        university_id: universityData?.id || universityData?.university_id,
        requestfor:
          formType === "counselling"
            ? "counselling"
            : formType === "fee"
              ? "fees"
              : "brochure",
        source_path: window.location.href,
      };

      // Add Optional Fields for Counselling
      if (formType === "counselling") {
        submitData.preferred_date = formValues
          .get("preferred_date")
          ?.toString()
          .trim();
        submitData.time_zone = formValues.get("time_zone")?.toString().trim();
        submitData.preferred_time = formValues
          .get("preferred_time")
          ?.toString()
          .trim();
        submitData.message = formValues.get("message")?.toString().trim();
      }

      console.log("🚀 Sending Form Data:", submitData);

      // Await API Call
      const response = await api.post(endpoint, submitData);

      console.log("✅ Form Submitted Successfully:", response.data);
      setShowSuccess(true);

      // Reset Form State (Optional delay or wait for user to click OK)
      // We rely on user clicking "OK" to reset and close, as per original design.
    } catch (error) {
      console.error("❌ Submission Failed:", error);
      console.error("❌ Error Details:", error.response?.data);

      let errorMsg = "Something went wrong, please try again.";

      if (error.code === "ECONNABORTED") {
        errorMsg = "Request timeout (30s). Please try again.";
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorList = Object.values(errors).flat().join("\n");
        errorMsg = `Please fix the following:\n${errorList}`;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }

      alert(errorMsg);
      generateCaptcha();
      setUserInput("");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[9999] ">
      {/* Success Popup */}
      {showSuccess ? (
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center">
          <div className="flex flex-col items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-green-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800">Success!</h2>
            <p className="text-gray-600 mt-2 text-sm">
              {formType === "counselling"
                ? "Your counselling session has been booked successfully. We will contact you soon."
                : "Your inquiry has been submitted successfully. We will contact you soon."}
            </p>
          </div>
          <button
            onClick={() => {
              setShowSuccess(false);
              // Form completely reset karo
              setFormData({
                name: "",
                email: "",
                c_code: "",
                mobile: "",
                nationality: "",
                highest_qualification: "",
                interested_course_category: "",
                preferred_date: "",
                time_zone: "",
                preferred_time: "",
                message: "",
              });
              setUserInput("");
              generateCaptcha();
              onClose();
            }}
            className="bg-indigo-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            OK
          </button>
        </div>
      ) : (
        <div className="bg-white w-[90%] max-w-5xl h-[90vh] rounded-2xl shadow-2xl p-6 relative flex flex-col md:flex-row overflow-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition z-10"
          >
            <FaTimes size={28} />
          </button>

          {/* Left Section */}
          <div className="w-full md:w-1/3 p-4">
            <h2 className="text-md font-bold mb-6 text-blue-700 text-center md:text-left">
              {formType === "counselling"
                ? "Why Book a Counselling Session?"
                : formType === "apply"
                  ? "Why Study With Us?"
                  : "How Education Malaysia helps you in"}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {formType === "counselling"
                ? // ✅ Counselling specific benefits
                  [
                    [<FaCalendarAlt size={24} />, "Flexible Scheduling"],
                    [<FaPhoneAlt size={24} />, "One-on-One Guidance"],
                    [<FaGraduationCap size={24} />, "Course Selection Help"],
                    [<FaLightbulb size={24} />, "Expert Advice"],
                    [<FaMoneyBill size={24} />, "Scholarship Info"],
                    [<FaGlobe size={24} />, "Visa Assistance"],
                  ].map(([icon, text], idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center bg-gray-50 shadow-sm hover:shadow-md transition"
                    >
                      <span className="text-green-600 mb-2">{icon}</span>
                      <p className="text-gray-700 text-xs font-medium leading-snug">
                        {text}
                      </p>
                    </div>
                  ))
                : // ✅ Original brochure benefits
                  [
                    [
                      <FaGraduationCap size={24} />,
                      "Comprehensive Course Guidance",
                    ],
                    [<FaBook size={24} />, "Brochure Access"],
                    [<FaGlobe size={24} />, "International Student Support"],
                    [<FaLightbulb size={24} />, "Personalized Counseling"],
                    [<FaMoneyBill size={24} />, "Scholarship Assistance"],
                    [<FaPhoneAlt size={24} />, "24/7 Support"],
                  ].map(([icon, text], idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center bg-gray-50 shadow-sm hover:shadow-md transition"
                    >
                      <span className="text-blue-600 mb-2">{icon}</span>
                      <p className="text-gray-700 text-xs font-medium leading-snug">
                        {text}
                      </p>
                    </div>
                  ))}
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="w-full md:w-2/3 bg-gray-50 rounded-xl p-6 shadow-inner">
            <div className="flex flex-col items-center mb-0">
              {universityData?.logo_path ? (
                <img
                  src={
                    universityData.logo_path.startsWith("http")
                      ? universityData.logo_path
                      : universityData.logo_path.startsWith("/storage/")
                        ? `https://www.educationmalaysia.in${universityData.logo_path}`
                        : `${API_URL}${universityData.logo_path}`
                  }
                  alt={universityData.name}
                  className="w-20 h-20 object-contain mb-1"
                  onError={(e) => {
                    console.log("❌ Logo failed to load:", e.target.src);
                    console.log(
                      "📋 logo_path value:",
                      universityData.logo_path,
                    );
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-1 shadow-md"
                style={{ display: "none" }}
              >
                <span className="text-4xl">🎓</span>
              </div>
              <h2
                className={`text-xl font-bold text-center ${formType === "counselling" ? "text-green-700" : "text-blue-700"}`}
              >
                {formTitle}
              </h2>
              <p className="text-gray-600 text-sm mb-2">
                {universityData.name}
              </p>
            </div>

            <form className="grid grid-cols-2 gap-3" onSubmit={handleSubmit}>
              <input
                type="hidden"
                name="requestfor"
                value={formData.requestfor}
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name*"
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email*"
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />

              <div className="flex col-span-2">
                <select
                  name="c_code"
                  value={formData.c_code}
                  onChange={handleCountryCodeChange}
                  className="border border-gray-300 rounded-l-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Code</option>
                  {phonecode.map((code, idx) => (
                    <option key={idx} value={code.phonecode}>
                      +{code.phonecode}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Mobile/WhatsApp No*"
                  className="border border-gray-300 p-3 rounded-r-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleNationalityChange}
                className="border border-gray-300 p-3 rounded-lg col-span-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="">Nationality*</option>
                {countriesData.map((country, idx) => (
                  <option key={idx} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>

              <select
                name="highest_qualification"
                value={formData.highest_qualification}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-lg col-span-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="">Highest Qualification*</option>
                {levels.map((level, idx) => (
                  <option key={idx} value={level.level}>
                    {level.level}
                  </option>
                ))}
              </select>

              {/* ✅ COUNSELLING FORM: Course Category + Select Time side by side */}
              {/* ✅ COUNSELLING FORM: Course Category + Select Time side by side */}
              {formType === "counselling" ? (
                <>
                  <select
                    name="interested_course_category"
                    value={formData.interested_course_category}
                    onChange={handleChange}
                    className="border border-gray-300 p-3 rounded-lg col-span-1 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    required
                  >
                    <option value="">Interested Course Category*</option>
                    {courseCategories.map((category, idx) => (
                      <option key={idx} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {/* SELECT TIME FIELD */}
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Time*
                    </label>
                    <div className="relative">
                      <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        name="preferred_time"
                        value={formData.preferred_time}
                        onChange={handleChange}
                        className="border border-gray-300 p-3 pl-10 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
                        required
                      >
                        <option value="">Choose time slot</option>
                        <option value="09:00 AM - 10:00 AM">
                          09:00 AM - 10:00 AM
                        </option>
                        <option value="10:00 AM - 11:00 AM">
                          10:00 AM - 11:00 AM
                        </option>
                        <option value="11:00 AM - 12:00 PM">
                          11:00 AM - 12:00 PM
                        </option>
                        <option value="02:00 PM - 03:00 PM">
                          02:00 PM - 03:00 PM
                        </option>
                        <option value="03:00 PM - 04:00 PM">
                          03:00 PM - 04:00 PM
                        </option>
                        <option value="04:00 PM - 05:00 PM">
                          04:00 PM - 05:00 PM
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* DATE FIELD */}
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date*
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        name="preferred_date"
                        value={formData.preferred_date}
                        onChange={handleChange}
                        className="border border-gray-300 p-3 pl-10 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* TIME ZONE FIELD */}
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Zone*
                    </label>
                    <div className="relative">
                      <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        name="time_zone"
                        value={formData.time_zone}
                        onChange={handleChange}
                        className="border border-gray-300 p-3 pl-10 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
                        required
                      >
                        <option value="">Select your timezone</option>
                        <option value="GMT-12:00">
                          (GMT-12:00) International Date Line West
                        </option>
                        <option value="GMT-11:00">
                          (GMT-11:00) Midway Island, Samoa
                        </option>
                        <option value="GMT-10:00">(GMT-10:00) Hawaii</option>
                        <option value="GMT-09:00">(GMT-09:00) Alaska</option>
                        <option value="GMT-08:00">
                          (GMT-08:00) Pacific Time (US & Canada)
                        </option>
                        <option value="GMT-07:00">
                          (GMT-07:00) Mountain Time (US & Canada)
                        </option>
                        <option value="GMT-06:00">
                          (GMT-06:00) Central Time (US & Canada)
                        </option>
                        <option value="GMT-05:00">
                          (GMT-05:00) Eastern Time (US & Canada)
                        </option>
                        <option value="GMT-04:00">
                          (GMT-04:00) Atlantic Time (Canada)
                        </option>
                        <option value="GMT-03:30">
                          (GMT-03:30) Newfoundland
                        </option>
                        <option value="GMT-03:00">
                          (GMT-03:00) Brasilia, Buenos Aires
                        </option>
                        <option value="GMT-02:00">
                          (GMT-02:00) Mid-Atlantic
                        </option>
                        <option value="GMT-01:00">
                          (GMT-01:00) Azores, Cape Verde Islands
                        </option>
                        <option value="GMT+00:00">
                          (GMT+00:00) London, Dublin, Lisbon
                        </option>
                        <option value="GMT+01:00">
                          (GMT+01:00) Berlin, Paris, Rome
                        </option>
                        <option value="GMT+02:00">
                          (GMT+02:00) Cairo, Athens, Helsinki
                        </option>
                        <option value="GMT+03:00">
                          (GMT+03:00) Moscow, Kuwait, Riyadh
                        </option>
                        <option value="GMT+03:30">(GMT+03:30) Tehran</option>
                        <option value="GMT+04:00">
                          (GMT+04:00) Abu Dhabi, Muscat, Baku
                        </option>
                        <option value="GMT+04:30">(GMT+04:30) Kabul</option>
                        <option value="GMT+05:00">
                          (GMT+05:00) Islamabad, Karachi, Tashkent
                        </option>
                        <option value="GMT+05:30">
                          (GMT+05:30) Mumbai, Kolkata, New Delhi
                        </option>
                        <option value="GMT+05:45">(GMT+05:45) Kathmandu</option>
                        <option value="GMT+06:00">
                          (GMT+06:00) Dhaka, Almaty
                        </option>
                        <option value="GMT+06:30">
                          (GMT+06:30) Yangon (Rangoon)
                        </option>
                        <option value="GMT+07:00">
                          (GMT+07:00) Bangkok, Hanoi, Jakarta
                        </option>
                        <option value="GMT+08:00">
                          (GMT+08:00) Beijing, Hong Kong, Singapore, Kuala
                          Lumpur
                        </option>
                        <option value="GMT+09:00">
                          (GMT+09:00) Tokyo, Seoul, Osaka
                        </option>
                        <option value="GMT+09:30">
                          (GMT+09:30) Adelaide, Darwin
                        </option>
                        <option value="GMT+10:00">
                          (GMT+10:00) Sydney, Melbourne, Brisbane
                        </option>
                        <option value="GMT+11:00">
                          (GMT+11:00) Solomon Islands, New Caledonia
                        </option>
                        <option value="GMT+12:00">
                          (GMT+12:00) Auckland, Wellington, Fiji
                        </option>
                        <option value="GMT+13:00">
                          (GMT+13:00) Nuku'alofa
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* MESSAGE TEXTAREA */}
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Additional Message (Optional)"
                    rows="3"
                    className="border border-gray-300 p-3 rounded-lg col-span-2 focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                  />
                </>
              ) : (
                // ✅ BROCHURE FORM: Full width course category
                <select
                  name="interested_course_category"
                  value={formData.interested_course_category}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded-lg col-span-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Interested Course Category*</option>
                  {courseCategories.map((category, idx) => (
                    <option key={idx} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Captcha */}
              <div className="flex items-center gap-3 col-span-2">
                <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                  Captcha: {captcha} =
                </span>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter Answer"
                  className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <LuRefreshCw className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs col-span-2 text-gray-500 mt-1">
                By Submitting This Form, You Accept And Agree To Our{" "}
                <span className="text-blue-600 cursor-pointer hover:underline">
                  Terms Of Use.
                </span>
              </p>

              <button
                type="submit"
                disabled={loading}
                className={`${
                  formType === "counselling"
                    ? "bg-gradient-to-r from-green-600 to-green-800"
                    : "bg-gradient-to-r from-blue-600 to-blue-800"
                } text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition col-span-2 disabled:opacity-50`}
              >
                {loading ? "Submitting..." : submitButtonText}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupForm;
