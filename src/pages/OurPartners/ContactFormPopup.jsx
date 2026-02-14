import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../api";

const ContactFormPopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    city: "",
    mobile: "",
    country: "",
    qualification: "",
    program: "",
    captcha: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({}); // ✅ Validation errors
  const [qualifications, setQualifications] = useState([]); // ✅ Dynamic qualifications
  const [programs, setPrograms] = useState([]); // ✅ Dynamic programs
  const [captchaQuestion, setCaptchaQuestion] = useState({
    num1: 0,
    num2: 0,
    answer: 0,
  });

  // Fetch dynamic qualifications and programs
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await api.get("/courses-in-malaysia");

        // Extract qualifications (levels)
        if (response.data?.filters?.levels) {
          const levelOptions = response.data.filters.levels.map((level) => ({
            value: level.level || level.name || level.slug,
            label: level.name || level.level || level.slug,
          }));
          setQualifications(levelOptions);
        }

        // Extract programs (categories)
        if (response.data?.filters?.categories) {
          const categoryOptions = response.data.filters.categories.map(
            (cat) => ({
              value: cat.slug || cat.name,
              label: cat.name || cat.slug,
            }),
          );
          setPrograms(categoryOptions);
        }
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
        // Fallback data if API fails
        setQualifications([
          { value: "High School", label: "High School" },
          { value: "12th Pass", label: "12th Pass" },
          { value: "Diploma", label: "Diploma" },
          { value: "Bachelor", label: "Bachelor" },
          { value: "Master", label: "Master" },
          { value: "PhD", label: "PhD" },
        ]);
        setPrograms([
          { value: "Engineering", label: "Engineering" },
          { value: "Business", label: "Business" },
          { value: "Medicine", label: "Medicine" },
          { value: "IT", label: "IT" },
          { value: "Arts", label: "Arts" },
          { value: "Science", label: "Science" },
        ]);
      }
    };

    fetchDropdownData();
  }, []);

  // Generate captcha when popup opens
  useEffect(() => {
    if (isOpen) {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      setCaptchaQuestion({ num1, num2, answer: num1 + num2 });
      setFormData((prev) => ({ ...prev, captcha: "" }));
      setErrors({}); // Clear errors when popup opens
    }
  }, [isOpen]);

  // Sync Country Name and Code
  const countryMapping = {
    India: "+91",
    Malaysia: "+60",
    Bangladesh: "+880",
    Pakistan: "+92",
    Nepal: "+977",
    "Sri Lanka": "+94",
    Other: "",
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.country) {
      newErrors.country = "Please select your country";
    }

    if (!formData.countryCode) {
      newErrors.countryCode = "Country code is required";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{7,15}$/.test(formData.mobile.replace(/\s/g, ""))) {
      newErrors.mobile = "Please enter a valid mobile number (7-15 digits)";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.qualification) {
      newErrors.qualification = "Please select your highest qualification";
    }

    if (!formData.program) {
      newErrors.program = "Please select a program level";
    }

    if (!formData.captcha.trim()) {
      newErrors.captcha = "Please answer the security question";
    } else if (parseInt(formData.captcha) !== captchaQuestion.answer) {
      newErrors.captcha = `Incorrect! ${captchaQuestion.num1} + ${captchaQuestion.num2} = ?`;
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData((prev) => {
      let updates = { [name]: value };

      // Sync logic
      if (name === "country") {
        if (countryMapping[value]) {
          updates.countryCode = countryMapping[value];
        } else if (value === "Other") {
          updates.countryCode = "";
        }
      } else if (name === "countryCode") {
        // Find country by code
        const matchingCountry = Object.keys(countryMapping).find(
          (key) => countryMapping[key] === value,
        );
        if (matchingCountry) {
          updates.country = matchingCountry;
        }
      }

      return {
        ...prev,
        ...updates,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const detailedMessage = `
        Scholarship Inquiry from Popup:
        Nationality: ${formData.country}
        City: ${formData.city}
        Qualification: ${formData.qualification}
        Program: ${formData.program}
      `;

      const payload = {
        name: formData.name,
        email: formData.email,
        country_code: formData.countryCode.replace("+", ""),
        mobile: formData.mobile,
        nationality: formData.country,
        highest_qualification: formData.qualification,
        interested_course_category: formData.program,
        source_path: window.location.href,
        // Optional fields if needed by backend, otherwise removed from older payload
        // message: detailedMessage,
      };

      const response = await api.post("/inquiry/modal-form", payload);

      if (response.data && response.data.status) {
        setIsSubmitted(true);
        localStorage.setItem("scholarshipFormSubmitted", "true");
        toast.success("Application Received! We will contact you soon.");

        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        toast.error(response.data?.message || "Submission failed.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error.response?.data?.message || "Submission failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent background scrolling when popup is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative mt-8">
          {/* Logo Badge */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-white px-6 py-2 rounded-xl shadow-lg border-2 border-blue-900">
              <img
                src="/logo (2).png"
                alt="Education Malaysia"
                className="h-10 w-auto"
              />
            </div>
          </div>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-blue-100 hover:text-white cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="bg-blue-900 text-white p-3 pt-8 text-center rounded-t-2xl">
            <p className="text-xl font-bold leading-tight uppercase tracking-wide">
              Malaysia Calling – Up to 100% Scholarships!
            </p>
            <p className="text-sm mt-1 text-blue-100">( Limited Time Only! )</p>
          </div>

          {/* Form */}
          <div className="p-4 sm:p-5">
            {" "}
            {isSubmitted ? (
              <div className="text-center py-8">
                <h4 className="text-2xl font-bold text-green-600 mb-2">
                  ✓ Application Received!
                </h4>
                <p className="text-gray-600">
                  Our team will contact you within 24 hours.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  ( SUBMIT ONCE – NO MORE POPUPS AFTER THAT! )
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Full Name & Email Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none text-gray-700 text-sm ${
                        errors.name
                          ? "border-red-500 focus:border-red-600"
                          : "border-gray-300 focus:border-blue-600"
                      }`}
                      placeholder="Full Name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none text-gray-700 text-sm ${
                        errors.email
                          ? "border-red-500 focus:border-red-600"
                          : "border-gray-300 focus:border-blue-600"
                      }`}
                      placeholder="Email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Country Code + Mobile */}
                <div>
                  <div className="flex gap-2">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className={`w-24 px-3 py-2 border rounded-lg focus:outline-none text-gray-700 text-sm ${
                        errors.countryCode
                          ? "border-red-500 focus:border-red-600"
                          : "border-gray-300 focus:border-blue-600"
                      }`}
                    >
                      <option value="">Code</option>
                      {[...new Set(Object.values(countryMapping))]
                        .filter(Boolean)
                        .map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      {["+1", "+44", "+971", "+65", "+86", "+81"].map(
                        (code) =>
                          !Object.values(countryMapping).includes(code) && (
                            <option key={code} value={code}>
                              {code}
                            </option>
                          ),
                      )}
                    </select>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none text-gray-700 text-sm ${
                        errors.mobile
                          ? "border-red-500 focus:border-red-600"
                          : "border-gray-300 focus:border-blue-600"
                      }`}
                      placeholder="Mobile Number"
                    />
                  </div>
                  {(errors.countryCode || errors.mobile) && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.countryCode || errors.mobile}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none text-gray-700 text-sm ${
                      errors.city
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-blue-600"
                    }`}
                    placeholder="City"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none text-gray-700 text-sm ${
                      errors.country
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-blue-600"
                    }`}
                  >
                    <option value="">Select Country</option>
                    {Object.keys(countryMapping).map((countryName) => (
                      <option key={countryName} value={countryName}>
                        {countryName}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.country}
                    </p>
                  )}
                </div>

                {/* Qualification */}
                <div>
                  <select
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none text-gray-700 text-sm ${
                      errors.qualification
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-blue-600"
                    }`}
                  >
                    <option value="">Select your qualification</option>
                    {qualifications.map((qual) => (
                      <option key={qual.value} value={qual.value}>
                        {qual.label}
                      </option>
                    ))}
                  </select>
                  {errors.qualification && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.qualification}
                    </p>
                  )}
                </div>

                {/* Program */}
                <div>
                  <select
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none text-gray-700 text-sm ${
                      errors.program
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-blue-600"
                    }`}
                  >
                    <option value="">Select a program level</option>
                    {programs.map((prog) => (
                      <option key={prog.value} value={prog.value}>
                        {prog.label}
                      </option>
                    ))}
                  </select>
                  {errors.program && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.program}
                    </p>
                  )}
                </div>

                {/* Captcha */}
                <div>
                  <label className="block text-blue-600 font-medium mb-2 text-sm">
                    What is {captchaQuestion.num1} + {captchaQuestion.num2}?
                  </label>
                  <input
                    type="number"
                    name="captcha"
                    value={formData.captcha}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none text-gray-700 text-sm ${
                      errors.captcha
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-blue-600"
                    }`}
                    placeholder="Your answer"
                  />
                  {errors.captcha && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.captcha}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-900 text-white py-3 rounded-full font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 text-sm"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>

                {/* Note */}
                <p className="text-center text-[12px] text-gray-600">
                  ( SUBMIT ONCE – NO MORE POPUPS AFTER THAT! )
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactFormPopup;
