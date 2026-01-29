import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaMobileAlt, FaBriefcase, FaPen, FaTimes } from "react-icons/fa";

const ReviewModal = ({ isOpen, onClose, universityData }) => {
  const [rating, setRating] = useState(0);

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      // Cleanup on unmount
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

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
              <strong>{universityData?.name || "University Name"}</strong>. Your honest feedback can help future students make the right decision about their choice of institution and course.
            </p>
          </div>

          {/* Form Section */}
          <div className="p-6 bg-white rounded-md shadow-md border">
            <h3 className="text-lg font-semibold mb-2">Rate the University -</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your email address will not be published. Required fields are marked <span className="text-red-500">*</span>
            </p>

            {/* Input Fields */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <FaUser className="absolute top-3 left-3 text-gray-500" />
                <input type="text" placeholder="Enter your name" className="w-full pl-10 p-2 border rounded" />
              </div>
              <div className="relative">
                <FaEnvelope className="absolute top-3 left-3 text-gray-500" />
                <input type="email" placeholder="Enter your email" className="w-full pl-10 p-2 border rounded" />
              </div>
              <div className="relative">
                <FaMobileAlt className="absolute top-3 left-3 text-gray-500" />
                <input type="tel" placeholder="Enter your mobile no." className="w-full pl-10 p-2 border rounded" />
              </div>
            </div>

            {/* Dropdowns */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <select className="w-full p-2 border rounded text-gray-600">
                <option>Select University</option>
                <option>{universityData?.name || "University"}</option>
              </select>
              <select className="w-full p-2 border rounded text-gray-600">
                <option>Select Program</option>
                <option>MCA</option>
                <option>BCA</option>
              </select>
              <select className="w-full p-2 border rounded text-gray-600">
                <option>Select Year</option>
                <option>2024</option>
                <option>2025</option>
              </select>
            </div>

            {/* Review Title */}
            <div className="relative mb-4">
              <FaBriefcase className="absolute top-3 left-3 text-gray-500" />
              <input
                type="text"
                placeholder="How would you sum up your experience studying at this institution in a sentence?"
                className="w-full pl-10 p-2 border rounded"
              />
              <p className="text-xs text-blue-600 mt-1 ml-1">(Title cannot be less than 20 and more than 100 characters.)</p>
            </div>

            {/* Write a Review */}
            <div className="relative mb-4">
              <FaPen className="absolute top-3 left-3 text-gray-500" />
              <textarea
                rows={4}
                placeholder="Share your experience at this institution from the time you first enrolled to its various course subjects, student lifestyle, teaching and facilities."
                className="w-full pl-10 p-2 border rounded"
              ></textarea>
              <p className="text-xs text-blue-600 mt-1 ml-1">(Description cannot be less than 150 characters.)</p>
            </div>

            {/* Star Rating */}
            <div className="flex items-center mb-6 space-x-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  onClick={() => handleStarClick(i)}
                  className={`text-2xl cursor-pointer ${
                    i < rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold">
                SUBMIT YOUR REVIEW
              </button>
              <button
                onClick={onClose}
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
