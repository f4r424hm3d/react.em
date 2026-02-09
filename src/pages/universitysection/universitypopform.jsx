import React, { useState, useEffect, useRef } from "react";

import api from "../../api";

/* Modal Wrapper Component */

const ModalWrapper = ({ open, onClose, title, children, wide = false }) => {
  const modalContentRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const isScrollingRef = useRef(false);

  // ✅ Lock Body Scroll when Modal is Open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    if (open && modalContentRef.current) {
      const modalElement = modalContentRef.current;

      const handleScroll = () => {
        if (!isScrollingRef.current) {
          scrollPositionRef.current = modalElement.scrollTop;
        }
      };

      const preventAutoScroll = (e) => {
        isScrollingRef.current = true;

        const savedScrollTop = scrollPositionRef.current;

        setTimeout(() => {
          requestAnimationFrame(() => {
            if (modalElement && modalElement.scrollTop !== savedScrollTop) {
              modalElement.scrollTop = savedScrollTop;
            }

            isScrollingRef.current = false;
          });
        }, 0);
      };

      modalElement.addEventListener("scroll", handleScroll, { passive: true });

      const inputs = modalElement.querySelectorAll("input, select, textarea");

      inputs.forEach((input) => {
        input.addEventListener("focus", preventAutoScroll);

        input.addEventListener("click", preventAutoScroll);

        if (input.type === "number") {
          input.addEventListener("touchstart", preventAutoScroll, {
            passive: true,
          });

          input.addEventListener("mousedown", preventAutoScroll);
        }
      });

      return () => {
        modalElement.removeEventListener("scroll", handleScroll);

        inputs.forEach((input) => {
          input.removeEventListener("focus", preventAutoScroll);

          input.removeEventListener("click", preventAutoScroll);

          if (input.type === "number") {
            input.removeEventListener("touchstart", preventAutoScroll);

            input.removeEventListener("mousedown", preventAutoScroll);
          }
        });
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/70 ios-scroll-lock"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalContentRef}
          className={`relative z-10 bg-white rounded-2xl shadow-2xl ${wide ? "w-full max-w-2xl" : "w-full max-w-md"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="p-6 pt-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

/* FEE STRUCTURE FORM */

export const FeeStructureForm = ({
  universityName,
  universityLogo,
  isOpen,
  onClose,
  onSuccess,
  universityId,
}) => {
  const [captchaQuestion, setCaptchaQuestion] = useState({
    num1: 0,
    num2: 0,
    answer: 0,
  });

  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync Logic
  const [nationality, setNationality] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [countriesData, setCountriesData] = useState([]);
  const [phonecode, setPhonecode] = useState([]);
  const [levels, setLevels] = useState([]);
  const [courseCategories, setCourseCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await api.get("/phonecodes");
        setPhonecode(Array.isArray(pRes.data) ? pRes.data : pRes.data.data);

        const cRes = await api.get("/countries");
        setCountriesData(Array.isArray(cRes.data) ? cRes.data : cRes.data.data);

        const lRes = await api.get("/levels");
        setLevels(lRes.data.data || []);

        const catRes = await api.get("/course-categories");
        setCourseCategories(
          Array.isArray(catRes.data) ? catRes.data : catRes.data.data,
        );
      } catch (e) {
        console.error("Error fetching form data:", e);
      }
    };
    fetchData();
  }, []);

  const handleCountryCodeChange = (e) => {
    const code = e.target.value;
    setCountryCode(code);
    if (code && countriesData.length > 0) {
      const match = countriesData.find((c) => c.phonecode == code);
      if (match) setNationality(match.name);
    }
  };

  const handleNationalityChange = (e) => {
    const name = e.target.value;
    setNationality(name);
    if (name && countriesData.length > 0) {
      const match = countriesData.find((c) => c.name === name);
      if (match && match.phonecode) setCountryCode(match.phonecode);
    }
  };

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const answer = num1 + num2;
    setCaptchaQuestion({ num1, num2, answer });
    setCaptchaInput("");
    setCaptchaError(false);
  };

  useEffect(() => {
    if (isOpen) generateCaptcha();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseInt(captchaInput) !== captchaQuestion.answer) {
      setCaptchaError(true);

      alert("❌ Wrong answer! Please solve the math problem correctly.");

      return;
    }

    const formData = new FormData(e.target);

    const data = {
      name: formData.get("firstName"),
      email: formData.get("email"),
      country_code: formData.get("countryCode")?.replace("+", "") || "91",
      mobile: formData.get("phone"),
      nationality: formData.get("nationality"),
      highest_qualification: formData.get("level"),
      interested_course_category: formData.get("course"),
      university_id: universityId || universityName || "Unknown",
      requestfor: "fee_structure",
      source_path: window.location.href,
    };

    setLoading(true);

    try {
      // Use standard API POST request with JSON
      const response = await api.post("/inquiry/brochure-request", data);

      console.log("✅ Fee Structure request sent:", response.data);

      onClose();

      if (onSuccess) onSuccess("Fee Structure sent successfully!");

      e.target.reset();

      setCaptchaInput("");
    } catch (err) {
      console.error("❌ Error sending fee structure request:", err);

      // Still close and notify user if it's just a network/CORS logging issue but likely succeeded
      // OR better: show actual error. But for consistency with previous behavior:

      alert("Something went wrong. Please try again.");
      setLoading(false); // Stop loading if error
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper
      open={isOpen}
      onClose={onClose}
      title={`Fee Structure - ${universityName || ""}`}
      wide={true}
    >
      <div className="w-full px-2">
        <div className="mb-5 px-1 flex flex-row md:flex-col items-center justify-center gap-4 md:gap-3 text-left md:text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden p-2 flex-shrink-0">
            {universityLogo ? (
              <img
                src={universityLogo}
                alt={universityName}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-3xl">📄</span>
            )}
          </div>
          <h3 className="text-lg md:text-2xl font-bold text-gray-900 leading-snug">
            Download <span className="text-blue-700">{universityName}</span> Fee
            Structure
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="hidden" name="university" value={universityName || ""} />

          {/* Full Name & Email */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
                Full Name
              </label>
              <input
                type="text"
                name="firstName"
                required
                placeholder="Enter your full name"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Nationality & Course */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
                Nationality
              </label>
              <select
                name="nationality"
                required
                value={nationality}
                onChange={handleNationalityChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm text-gray-800 font-medium appearance-none"
              >
                <option value="">Select Nationality</option>
                {countriesData.map((country, idx) => (
                  <option key={idx} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
                Interested Course
              </label>
              <select
                name="course"
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm text-gray-800 font-medium appearance-none"
              >
                <option value="">Select a course</option>
                {courseCategories.map((category, idx) => (
                  <option key={idx} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone Number with Code */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
              Phone Number
            </label>
            <div className="flex gap-2">
              <select
                name="countryCode"
                required
                value={countryCode}
                onChange={handleCountryCodeChange}
                className="w-28 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm text-gray-800 font-medium appearance-none"
              >
                <option value="">Code</option>
                {phonecode.map((code, idx) => (
                  <option key={idx} value={code.phonecode}>
                    +{code.phonecode}
                  </option>
                ))}
              </select>
              <input
                name="phone"
                required
                type="tel"
                placeholder="Enter your mobile number"
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Qualification */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
              Highest Qualification
            </label>
            <select
              name="level"
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm text-gray-800 font-medium appearance-none"
            >
              <option value="">Select Qualification</option>
              {levels.map((level, idx) => (
                <option key={idx} value={level.level}>
                  {level.level}
                </option>
              ))}
            </select>
          </div>

          {/* CAPTCHA */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-blue-100 bg-blue-50/80 shadow-sm">
            <p className="text-sm font-bold text-blue-900 whitespace-nowrap">
              What is {captchaQuestion.num1} + {captchaQuestion.num2}?
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={captchaInput}
                onChange={(e) => {
                  if (!/^\d*$/.test(e.target.value)) return;
                  setCaptchaInput(e.target.value);
                  setCaptchaError(false);
                }}
                required
                placeholder="?"
                className={`w-24 md:w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-center text-sm md:text-base shadow-sm transition-all ${captchaError ? "border-red-500 bg-red-50" : "border-blue-200 bg-white text-blue-900"}`}
              />
              <button
                type="button"
                onClick={generateCaptcha}
                className="p-2 text-blue-500 hover:text-blue-700 transition-colors bg-white rounded-lg border border-blue-100 shadow-sm hover:shadow-md active:scale-95"
                title="Refresh Captcha"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          </div>
          {captchaError && (
            <p className="text-red-600 text-[10px] font-bold text-center -mt-1">
              ❌ Incorrect answer
            </p>
          )}

          {/* Buttons */}
          <div className="pt-1 flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2.5 rounded-xl shadow-md transform active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading ? "Applying..." : "Request Fee Structure"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

/* BROCHURE FORM - EXACT SAME PATTERN */

export const BrochureForm = ({
  universityName,
  universityLogo,
  isOpen,
  onClose,
  onSuccess,
  universityId,
}) => {
  const [captchaQuestion, setCaptchaQuestion] = useState({
    num1: 0,
    num2: 0,
    answer: 0,
  });

  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync Logic
  const [nationality, setNationality] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [countriesData, setCountriesData] = useState([]);
  const [phonecode, setPhonecode] = useState([]);
  const [levels, setLevels] = useState([]);
  const [courseCategories, setCourseCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await api.get("/phonecodes");
        setPhonecode(Array.isArray(pRes.data) ? pRes.data : pRes.data.data);

        const cRes = await api.get("/countries");
        setCountriesData(Array.isArray(cRes.data) ? cRes.data : cRes.data.data);

        const lRes = await api.get("/levels");
        setLevels(lRes.data.data || []);

        const catRes = await api.get("/course-categories");
        setCourseCategories(
          Array.isArray(catRes.data) ? catRes.data : catRes.data.data,
        );
      } catch (e) {
        console.error("Error fetching form data:", e);
      }
    };
    fetchData();
  }, []);

  const handleCountryCodeChange = (e) => {
    const code = e.target.value;
    setCountryCode(code);
    if (code && countriesData.length > 0) {
      const match = countriesData.find((c) => c.phonecode == code);
      if (match) setNationality(match.name);
    }
  };

  const handleNationalityChange = (e) => {
    const name = e.target.value;
    setNationality(name);
    if (name && countriesData.length > 0) {
      const match = countriesData.find((c) => c.name === name);
      if (match && match.phonecode) setCountryCode(match.phonecode);
    }
  };

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const answer = num1 + num2;
    setCaptchaQuestion({ num1, num2, answer });
    setCaptchaInput("");
    setCaptchaError(false);
  };

  useEffect(() => {
    if (isOpen) generateCaptcha();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseInt(captchaInput) !== captchaQuestion.answer) {
      setCaptchaError(true);
      alert("❌ Wrong answer! Please solve the math problem correctly.");
      return;
    }

    const formData = new FormData(e.target);

    const data = {
      name: formData.get("firstName"),
      email: formData.get("email"),
      country_code: formData.get("countryCode")?.replace("+", "") || "91",
      mobile: formData.get("phone"),
      nationality: formData.get("nationality"),
      highest_qualification: formData.get("level"), // Dropdown value
      interested_course_category: formData.get("course"), // Dropdown value
      university_id: universityId || universityName || "Unknown",
      requestfor: "brochure",
      source_path: window.location.href,
    };

    setLoading(true);

    try {
      // Use standard API POST request with JSON
      const response = await api.post("/inquiry/brochure-request", data);

      console.log("✅ Brochure request sent:", response.data);

      onClose();

      if (onSuccess) onSuccess("Brochure request sent successfully!");

      e.target.reset();

      setCaptchaInput("");
    } catch (err) {
      console.error("❌ Error sending brochure request:", err);
      // alert("Something went wrong. Please try again.");
      // Improve error message if possible
      alert(
        "Submission failed. Please check your connection or contact support.",
      );
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper
      open={isOpen}
      onClose={onClose}
      title={`Download Brochure - ${universityName || ""}`}
      wide={true}
    >
      <div className="w-full px-2">
        <div className="mb-5 px-1 flex flex-row md:flex-col items-center justify-center gap-4 md:gap-3 text-left md:text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden p-2 flex-shrink-0">
            {universityLogo ? (
              <img
                src={universityLogo}
                alt={universityName}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-3xl">📚</span>
            )}
          </div>
          <h3 className="text-lg md:text-2xl font-bold text-gray-900 leading-snug">
            Download <span className="text-green-700">{universityName}</span>{" "}
            Brochure
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="hidden" name="university" value={universityName || ""} />

          {/* Full Name & Email */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
                Full Name
              </label>
              <input
                type="text"
                name="firstName"
                required
                placeholder="Enter your full name"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Nationality & Course */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
                Nationality
              </label>
              <select
                name="nationality"
                required
                value={nationality}
                onChange={handleNationalityChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none text-sm text-gray-800 font-medium appearance-none"
              >
                <option value="">Select Nationality</option>
                {countriesData.map((country, idx) => (
                  <option key={idx} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
                Interested Course
              </label>
              <select
                name="course"
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none text-sm text-gray-800 font-medium appearance-none"
              >
                <option value="">Select a course</option>
                {courseCategories.map((category, idx) => (
                  <option key={idx} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone Number with Code */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
              Phone Number
            </label>
            <div className="flex gap-2">
              <select
                name="countryCode"
                required
                value={countryCode}
                onChange={handleCountryCodeChange}
                className="w-28 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none text-sm text-gray-800 font-medium appearance-none"
              >
                <option value="">Code</option>
                {phonecode.map((code, idx) => (
                  <option key={idx} value={code.phonecode}>
                    +{code.phonecode}
                  </option>
                ))}
              </select>
              <input
                name="phone"
                required
                type="tel"
                placeholder="Enter your mobile number"
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Highest Qualification */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
              Highest Qualification
            </label>
            <select
              name="level"
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none text-sm text-gray-800 font-medium appearance-none"
            >
              <option value="">Select Qualification</option>
              {levels.map((level, idx) => (
                <option key={idx} value={level.level}>
                  {level.level}
                </option>
              ))}
            </select>
          </div>

          {/* CAPTCHA */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-green-100 bg-green-50/80 shadow-sm">
            <p className="text-sm font-bold text-green-900 whitespace-nowrap">
              What is {captchaQuestion.num1} + {captchaQuestion.num2}?
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={captchaInput}
                onChange={(e) => {
                  if (!/^\d*$/.test(e.target.value)) return;
                  setCaptchaInput(e.target.value);
                  setCaptchaError(false);
                }}
                required
                placeholder="?"
                className={`w-24 md:w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-bold text-center text-sm md:text-base shadow-sm transition-all ${captchaError ? "border-red-500 bg-red-50" : "border-green-200 bg-white text-green-900"}`}
              />
              <button
                type="button"
                onClick={generateCaptcha}
                className="p-2 text-green-500 hover:text-green-700 transition-colors bg-white rounded-lg border border-green-100 shadow-sm hover:shadow-md active:scale-95"
                title="Refresh Captcha"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-bold shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 ${loading ? "opacity-75 cursor-wait" : ""}`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing Request...
              </>
            ) : (
              <>
                <span>Download Brochure Now</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </ModalWrapper>
  );
};

/* ---------------------------

  ✅ COMPARE UNIVERSITIES FORM

----------------------------*/

export const CompareUniversitiesForm = ({
  universities,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [captchaQuestion, setCaptchaQuestion] = useState({
    num1: 0,
    num2: 0,
    answer: 0,
  });

  const [captchaInput, setCaptchaInput] = useState("");

  const [captchaError, setCaptchaError] = useState(false);

  const [compareSelection, setCompareSelection] = useState({
    u1: "",
    u2: "",
    u3: "",
  });

  const [comparisonResult, setComparisonResult] = useState(null);

  // Sync Logic
  const [nationality, setNationality] = useState("");
  const [countryCode, setCountryCode] = useState("");

  const countryCodes = {
    Afghanistan: "+93",
    Bangladesh: "+880",
    China: "+86",
    India: "+91",
    Indonesia: "+62",
    Nepal: "+977",
    Pakistan: "+92",
    Philippines: "+63",
    "Sri Lanka": "+94",
    Thailand: "+66",
    Vietnam: "+84",
    Other: "",
  };

  const handleNationalityChange = (e) => {
    const val = e.target.value;
    setNationality(val);
    if (countryCodes[val]) setCountryCode(countryCodes[val]);
  };

  const handleCountryCodeChange = (e) => {
    const val = e.target.value;
    setCountryCode(val);
    const nation = Object.keys(countryCodes).find(
      (key) => countryCodes[key] === val,
    );
    if (nation) setNationality(nation);
  };

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;

    const num2 = Math.floor(Math.random() * 10) + 1;

    const answer = num1 + num2;

    setCaptchaQuestion({ num1, num2, answer });

    setCaptchaInput("");

    setCaptchaError(false);
  };

  useEffect(() => {
    if (isOpen) {
      generateCaptcha();

      setCompareSelection({ u1: "", u2: "", u3: "" });

      setComparisonResult(null);
      setNationality("");
      setCountryCode("");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (parseInt(captchaInput) !== captchaQuestion.answer) {
      setCaptchaError(true);

      alert("❌ Wrong answer! Please solve the math problem correctly.");

      return;
    }

    const selected = [
      compareSelection.u1,
      compareSelection.u2,
      compareSelection.u3,
    ].filter(Boolean);

    const comparisonData = selected.map((id) =>
      universities.find((u) => String(u.id || u._id || u.name) === String(id)),
    );

    setComparisonResult(comparisonData);
  };

  return (
    <ModalWrapper
      open={isOpen}
      onClose={onClose}
      title="Compare Universities"
      wide={true}
    >
      <div className="w-full px-2">
        <div className="text-center mb-5">
          <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
            Compare Universities
          </h3>
          <p className="text-gray-500 text-sm md:text-base">
            Select up to 3 universities to compare their features
          </p>
        </div>

        {!comparisonResult ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* University Selection */}
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
                  Select First University
                </label>
                <select
                  required
                  value={compareSelection.u1}
                  onChange={(e) =>
                    setCompareSelection({
                      ...compareSelection,
                      u1: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm text-gray-800 font-medium appearance-none"
                >
                  <option value="">Choose University</option>
                  {universities?.map((u, i) => (
                    <option key={i} value={u.id || u._id || u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
                  Select Second University
                </label>
                <select
                  required
                  value={compareSelection.u2}
                  onChange={(e) =>
                    setCompareSelection({
                      ...compareSelection,
                      u2: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm text-gray-800 font-medium appearance-none"
                >
                  <option value="">Choose University</option>
                  {universities?.map((u, i) => (
                    <option key={i} value={u.id || u._id || u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3rd University + Nationality */}
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
                  Select Third University (Optional)
                </label>
                <select
                  value={compareSelection.u3}
                  onChange={(e) =>
                    setCompareSelection({
                      ...compareSelection,
                      u3: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm text-gray-800 font-medium appearance-none"
                >
                  <option value="">Choose University</option>
                  {universities?.map((u, i) => (
                    <option key={i} value={u.id || u._id || u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
                  Nationality
                </label>
                <select
                  name="nationality"
                  required
                  value={nationality}
                  onChange={handleNationalityChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm text-gray-800 font-medium appearance-none"
                >
                  <option value="">Select Nationality</option>
                  {Object.keys(countryCodes).map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email & Full Name */}
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 font-medium"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
                Phone Number
              </label>
              <div className="flex gap-2">
                <select
                  name="countryCode"
                  required
                  value={countryCode}
                  onChange={handleCountryCodeChange}
                  className="px-2 py-2.5 md:px-3 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white w-24 md:w-32 text-sm md:text-base appearance-none"
                >
                  <option value="">Code</option>
                  {Object.entries(countryCodes).map(([country, code]) => (
                    <option key={country} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Enter your mobile number"
                  className="flex-1 px-3 py-2.5 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                />
              </div>
            </div>

            {/* Comparison Criteria (Optional) */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide ml-1">
                Comparison Criteria (Optional)
              </label>
              <textarea
                name="comparisonCriteria"
                rows="3"
                placeholder="What specific aspects would you like to compare? (e.g., fees, programs, facilities)"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm text-gray-800 placeholder:text-gray-400 font-medium resize-none"
              />
            </div>

            {/* CAPTCHA */}
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-blue-100 bg-blue-50/80 shadow-sm">
              <p className="text-sm font-bold text-blue-900 whitespace-nowrap">
                What is {captchaQuestion.num1} + {captchaQuestion.num2}?
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={captchaInput}
                  onChange={(e) => {
                    if (!/^\d*$/.test(e.target.value)) return;
                    setCaptchaInput(e.target.value);
                    setCaptchaError(false);
                  }}
                  required
                  placeholder="?"
                  className={`w-24 md:w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-center text-sm md:text-base shadow-sm transition-all ${captchaError ? "border-red-500 bg-red-50" : "border-blue-200 bg-white text-blue-900"}`}
                />
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="p-2 text-blue-500 hover:text-blue-700 transition-colors bg-white rounded-lg border border-blue-100 shadow-sm hover:shadow-md active:scale-95"
                  title="Refresh Captcha"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {captchaError && (
              <p className="text-red-600 text-[10px] font-bold text-center -mt-1">
                ❌ Incorrect answer
              </p>
            )}

            {/* Buttons */}
            <div className="pt-1 flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2.5 rounded-xl shadow-md transform active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-sm"
              >
                Compare Universities
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Comparison Result
            </h3>

            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
              <table className="w-full border-collapse min-w-[600px] md:min-w-0">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="border-r border-gray-200 px-4 py-4 text-left font-bold text-gray-700 sticky left-0 bg-gray-50 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      Criteria
                    </th>
                    {comparisonResult.map((uni, i) => (
                      <th
                        key={i}
                        className="border-l border-gray-200 px-4 py-4 text-center font-bold text-gray-900 min-w-[150px]"
                      >
                        {uni?.name || "N/A"}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="border-r border-gray-200 px-4 py-3 font-medium text-gray-600 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      Type
                    </td>
                    {comparisonResult.map((uni, i) => (
                      <td
                        key={i}
                        className="border-l border-gray-100 px-4 py-3 text-center text-gray-800"
                      >
                        {(() => {
                          let val = uni?.institute_type;
                          if (val && typeof val === "object") val = val.name;
                          if (!val) val = uni?.type;
                          if (!val) return "N/A";
                          return String(val)
                            .replace(/-/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase());
                        })()}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-gray-50 border-b border-gray-100">
                    <td className="border-r border-gray-200 px-4 py-3 font-medium text-gray-600 sticky left-0 bg-gray-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      Established
                    </td>
                    {comparisonResult.map((uni, i) => (
                      <td
                        key={i}
                        className="border-l border-gray-200 px-4 py-3 text-center text-gray-800"
                      >
                        {uni?.established_year || uni?.year || "N/A"}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="border-r border-gray-200 px-4 py-3 font-medium text-gray-600 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      Location
                    </td>
                    {comparisonResult.map((uni, i) => (
                      <td
                        key={i}
                        className="border-l border-gray-100 px-4 py-3 text-center text-gray-800"
                      >
                        {[uni?.city, uni?.state].filter(Boolean).join(", ") ||
                          uni?.location ||
                          "N/A"}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-gray-50 border-b border-gray-100">
                    <td className="border-r border-gray-200 px-4 py-3 font-medium text-gray-600 sticky left-0 bg-gray-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      Programs
                    </td>
                    {comparisonResult.map((uni, i) => (
                      <td
                        key={i}
                        className="border-l border-gray-200 px-4 py-3 text-center text-gray-800"
                      >
                        {uni?.active_programs_count ||
                          uni?.courses_count ||
                          uni?.course_count ||
                          "N/A"}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="border-r border-gray-200 px-4 py-3 font-medium text-gray-600 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      Ranking
                    </td>
                    {comparisonResult.map((uni, i) => (
                      <td
                        key={i}
                        className="border-l border-gray-100 px-4 py-3 text-center font-semibold text-blue-600"
                      >
                        {uni?.ranking
                          ? `#${uni.ranking}`
                          : uni?.qs_ranking
                            ? `#${uni.qs_ranking}`
                            : uni?.rating
                              ? `⭐ ${Number(uni.rating).toFixed(1)}`
                              : "N/A"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 mt-6 justify-center">
              <button
                onClick={() => {
                  setComparisonResult(null);
                  setCompareSelection({ u1: "", u2: "", u3: "" });
                  setNationality("");
                  setCountryCode("");
                }}
                className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-colors"
              >
                Compare Again
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-md transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};
