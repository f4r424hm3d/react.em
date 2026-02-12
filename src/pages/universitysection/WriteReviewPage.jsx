import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaMobileAlt,
  FaBriefcase,
  FaPen,
} from "react-icons/fa";
import SeoHead from "../../components/SeoHead";
import DynamicBreadcrumb from "../../components/DynamicBreadcrumb";

const UniversityReviewForm = () => {
  const [rating, setRating] = useState(0);

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-white ">
      {/* ✅ Dynamic SEO */}
      <SeoHead
        pageType="service-detail"
        data={{
          name: "Write a Review - Education Malaysia",
          description:
            "Share your experience about studying in Malaysia. Your review helps other students make informed decisions.",
          keywords:
            "write a review, university review, student feedback, education malaysia reviews",
        }}
      />

      {/* ✅ Dynamic Breadcrumb */}
      <DynamicBreadcrumb
        pageType="service-detail"
        data={{
          title: "Write a Review",
          slug: "write-a-review",
        }}
      />

      {/* ✅ Heading Section */}
      <div className="mb-8 bg-gray-100 p-6 rounded-md shadow-sm text-blue-500">
        <h1 className="text-2xl font-bold mb-2 text-blue-500">
          Your Review of Your Institution Experience Can Help Others
        </h1>
        <p className="text-sm text-gray-700">
          Thank you for writing a review of your experience at{" "}
          <strong>University Name</strong>. Your honest feedback can help future
          students make the right decision about their choice of institution and
          course.
        </p>
      </div>

      {/* ✅ Form Section */}
      <div className="p-6 bg-white rounded-md shadow-md border">
        <h2 className="text-xl font-semibold mb-2">Rate the University -</h2>
        <p className="text-sm text-gray-600 mb-4">
          Your email address will not be published. Required fields are marked{" "}
          <span className="text-red-500">*</span>
        </p>

        {/* Input Fields */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full pl-10 p-2 border rounded"
            />
          </div>
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-500" />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full pl-10 p-2 border rounded"
            />
          </div>
          <div className="relative">
            <FaMobileAlt className="absolute top-3 left-3 text-gray-500" />
            <input
              type="tel"
              placeholder="Enter your mobile no."
              className="w-full pl-10 p-2 border rounded"
            />
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <select className="w-full p-2 border rounded text-gray-600">
            <option>Select University</option>
            <option>ABESIT</option>
            <option>MMU</option>
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
          <p className="text-xs text-blue-600 mt-1 ml-1">
            (Title cannot be less than 20 and more than 100 characters.)
          </p>
        </div>

        {/* Write a Review */}
        <div className="relative mb-4">
          <FaPen className="absolute top-3 left-3 text-gray-500" />
          <textarea
            rows={4}
            placeholder="Share your experience at this institution from the time you first enrolled to its various course subjects, student lifestyle, teaching and facilities."
            className="w-full pl-10 p-2 border rounded"
          ></textarea>
          <p className="text-xs text-blue-600 mt-1 ml-1">
            (Description cannot be less than 150 characters.)
          </p>
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
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold">
          SUBMIT YOUR REVIEW
        </button>
      </div>
    </div>
  );
};

export default UniversityReviewForm;
