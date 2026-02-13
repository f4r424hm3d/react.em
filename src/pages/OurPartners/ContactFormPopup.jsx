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
  const [captchaQuestion, setCaptchaQuestion] = useState({
    num1: 0,
    num2: 0,
    answer: 0,
  });

  // Generate captcha when popup opens
  useEffect(() => {
    if (isOpen) {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      setCaptchaQuestion({ num1, num2, answer: num1 + num2 });
      setFormData((prev) => ({ ...prev, captcha: "" }));
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

  const qualifications = [
    "High School",
    "12th Pass",
    "Diploma",
    "Bachelor",
    "Master",
    "PhD",
  ];
  const programs = [
    "Engineering",
    "Business",
    "Medicine",
    "IT",
    "Arts",
    "Science",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

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

    if (parseInt(formData.captcha) !== captchaQuestion.answer) {
      toast.error(
        `Incorrect answer! ${captchaQuestion.num1} + ${captchaQuestion.num2} = ?`,
      );
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
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
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
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
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
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700 text-sm"
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700 text-sm"
                    placeholder="Email"
                  />
                </div>

                {/* Country Code + Mobile */}
                <div className="flex gap-2">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700 text-sm"
                    required
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
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700 text-sm"
                    placeholder="Mobile Number"
                  />
                </div>

                {/* City */}
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700 text-sm"
                  placeholder="City"
                />

                {/* Country */}
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700 text-sm"
                >
                  <option value="">Select Country</option>
                  {Object.keys(countryMapping).map((countryName) => (
                    <option key={countryName} value={countryName}>
                      {countryName}
                    </option>
                  ))}
                </select>

                {/* Qualification */}
                <select
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700 text-sm"
                >
                  <option value="">Select your qualification</option>
                  {qualifications.map((qual) => (
                    <option key={qual} value={qual}>
                      {qual}
                    </option>
                  ))}
                </select>

                {/* Program */}
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700 text-sm"
                >
                  <option value="">Select a program</option>
                  {programs.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>

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
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700 text-sm"
                    placeholder="Your answer"
                  />
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
                <p className="text-center text-sm text-gray-600">
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
