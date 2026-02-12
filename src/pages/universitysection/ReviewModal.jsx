import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaMobileAlt,
  FaBriefcase,
  FaPen,
  FaTimes,
} from "react-icons/fa";
import api from "../../api";
import { toast } from "react-toastify";

const ReviewModal = ({ isOpen, onClose, universityData }) => {
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    university: universityData?.name || "",
    program: "",
    passing_year: "",
    review_title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  // Sync university name when data changes
  useEffect(() => {
    if (universityData?.name) {
      setFormData((prev) => ({ ...prev, university: universityData.name }));
    }
  }, [universityData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.mobile) {
      toast.error("Please fill in all required fields (Name, Email, Mobile).");
      return;
    }
    if (!formData.program || !formData.passing_year) {
      toast.error("Please select a Program and Passing Year.");
      return;
    }
    if (rating === 0) {
      toast.error("Please provide a star rating.");
      return;
    }
    if (
      formData.review_title.length < 20 ||
      formData.review_title.length > 100
    ) {
      toast.error("Review title must be between 20 and 100 characters.");
      return;
    }
    if (formData.description.length < 150) {
      toast.error("Review description must be at least 150 characters.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        rating: rating,
        university: universityData?.id, // Fix: Backend expects ID, not Name
        university_id: universityData?.id,
        university_name: universityData?.name,
        university_slug: universityData?.slug,
      };

      console.log("Submitting review payload:", payload);

      // Attempt to submit to the guessed endpoint
      const response = await api.post("/add-review", payload);

      if (
        response.data.status ||
        response.status === 200 ||
        response.status === 201
      ) {
        toast.success("Review submitted successfully! Pending approval.");
        onClose();
        // Reset form
        setFormData({
          name: "",
          email: "",
          mobile: "",
          university: universityData?.name || "",
          program: "",
          passing_year: "",
          review_title: "",
          description: "",
        });
        setRating(0);
      } else {
        toast.error(response.data.message || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-white/20"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-6">
          {/* Heading Section */}
          <div className="mb-6 bg-gray-100 p-6 rounded-md shadow-sm">
            <h3 className="text-xl font-bold mb-2 text-blue-500">
              Your Review of Your Institution Experience Can Help Others
            </h3>
            <p className="text-sm text-gray-700">
              Thank you for writing a review of your experience at{" "}
              <strong>{universityData?.name || "University Name"}</strong>. Your
              honest feedback can help future students make the right decision
              about their choice of institution and course.
            </p>
          </div>

          {/* Form Section */}
          <div className="p-6 bg-white rounded-md shadow-md border">
            <h3 className="text-lg font-semibold mb-2">
              Rate the University -
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your email address will not be published. Required fields are
              marked <span className="text-red-500">*</span>
            </p>

            {/* Input Fields */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <FaUser className="absolute top-3 left-3 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name *"
                  className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div className="relative">
                <FaEnvelope className="absolute top-3 left-3 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email *"
                  className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div className="relative">
                <FaMobileAlt className="absolute top-3 left-3 text-gray-500" />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter your mobile no. *"
                  className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* Dropdowns */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <select
                className="w-full p-2 border rounded text-gray-600 bg-gray-100 cursor-not-allowed"
                disabled
              >
                <option>{universityData?.name || "University"}</option>
              </select>

              <select
                name="program"
                value={formData.program}
                onChange={handleChange}
                className="w-full p-2 border rounded text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Program</option>
                <option value="MBA">MBA</option>
                <option value="BBA">BBA</option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
                <option value="MBBS">MBBS</option>
                <option value="Other">Other</option>
              </select>

              <select
                name="passing_year"
                value={formData.passing_year}
                onChange={handleChange}
                className="w-full p-2 border rounded text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Passing Year</option>
                {Array.from(
                  { length: 15 },
                  (_, i) => new Date().getFullYear() - i,
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Review Title */}
            <div className="relative mb-4">
              <FaBriefcase className="absolute top-3 left-3 text-gray-500" />
              <input
                type="text"
                name="review_title"
                value={formData.review_title}
                onChange={handleChange}
                placeholder="How would you sum up your experience? (Title)"
                className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="flex justify-between mt-1 ml-1">
                <p className="text-xs text-blue-600">
                  (Min 20, Max 100 characters)
                </p>
                <p
                  className={`text-xs ${formData.review_title.length > 100 || (formData.review_title.length > 0 && formData.review_title.length < 20) ? "text-red-500" : "text-gray-400"}`}
                >
                  {formData.review_title.length} / 100
                </p>
              </div>
            </div>

            {/* Write a Review */}
            <div className="relative mb-4">
              <FaPen className="absolute top-3 left-3 text-gray-500" />
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Share your experience at this institution..."
                className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
              <div className="flex justify-between mt-1 ml-1">
                <p className="text-xs text-blue-600">(Min 150 characters)</p>
                <p
                  className={`text-xs ${formData.description.length > 0 && formData.description.length < 150 ? "text-red-500" : "text-gray-400"}`}
                >
                  {formData.description.length} chars
                </p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex items-center mb-6 space-x-2">
              <span className="font-semibold mr-2">Your Rating:</span>
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  onClick={() => handleStarClick(i)}
                  className={`text-2xl cursor-pointer transition-transform hover:scale-110 ${
                    i < rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition-all flex items-center justify-center min-w-[180px]
                  ${loading ? "opacity-70 cursor-not-allowed" : ""}
                `}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    SUBMITTING...
                  </>
                ) : (
                  "SUBMIT YOUR REVIEW"
                )}
              </button>
              <button
                onClick={onClose}
                disabled={loading}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded font-semibold"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
