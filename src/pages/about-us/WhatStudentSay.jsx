import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaQuoteRight,
  FaUser,
  FaGlobeAmericas,
  FaBriefcase,
  FaPaperPlane,
  FaStar,
} from "react-icons/fa";
import api from "../../api";
import { toast } from "react-toastify";
import SeoHead from "../../components/SeoHead";
import DynamicBreadcrumb from "../../components/DynamicBreadcrumb";
import useStaticPageSeo from "../../hooks/useStaticPageSeo";

// Pre-filled testimonials
const initialTestimonials = [
  {
    name: "HASEEB",
    role: "Student",
    country: "PAKISTAN",
    rating: 5,
    text: "As a student I am really thankful that I got contacted with them. Their co-operation with students is really impressive and my overall experience is excellent with them.",
    date: "2 months ago",
  },
  {
    name: "Rohit",
    role: "Student",
    country: "INDIA",
    rating: 5,
    text: "I am studying accountancy in Malaysia and got a very good help from their Gurgaon office regarding choosing the right course.",
    date: "1 month ago",
  },
  {
    name: "Aman",
    role: "Student",
    country: "NEPAL",
    rating: 4,
    text: "They guided me at every step from selecting the university to the visa process. The team is really helpful.",
    date: "3 weeks ago",
  },
  {
    name: "Siti",
    role: "Student",
    country: "MALAYSIA",
    rating: 5,
    text: "Very professional and responsive. Their assistance helped me a lot in getting into the course I dreamed of.",
    date: "1 week ago",
  },
];

const WhatStudentsSay = () => {
  const [reviews, setReviews] = useState(initialTestimonials);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Student",
    country: "",
    review: "",
    rating: 5,
  });
  const [loading, setLoading] = useState(false);
  const { seo: apiSeo } = useStaticPageSeo("students-say");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRating = (r) => {
    setFormData({ ...formData, rating: r });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.country ||
      !formData.review
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setLoading(true);

    // Create new review object
    const newReview = {
      name: formData.name,
      role: formData.role,
      country: formData.country,
      rating: formData.rating,
      text: formData.review,
      date: "Just now", // Dynamic display
    };

    // Update UI immediately (Optimistic UI)
    setReviews([newReview, ...reviews]);
    toast.success("Review submitted successfully!");

    // Reset form
    const currentData = { ...formData }; // Keep for API call
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "Student",
      country: "",
      review: "",
      rating: 5,
    });
    setLoading(false);

    // Fire API call
    try {
      const params = new URLSearchParams();
      params.append("name", currentData.name);
      params.append("email", currentData.email);
      params.append("mobile", currentData.phone);
      params.append("country_code", "91"); // Defaulting, or could be dynamic
      params.append("nationality", currentData.country);
      params.append(
        "source",
        `Testimonial - Role: ${currentData.role} | Rating: ${currentData.rating}/5 | Review: ${currentData.review}`,
      );
      params.append("source_path", window.location.href);

      await api.post("/inquiry/simple-form", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      // Success is silent for API since we already showed it
    } catch (error) {
      console.error("Sync failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans">
      {/* ✅ Dynamic SEO */}
      <SeoHead
        pageType="service-detail"
        data={{
          name: apiSeo?.meta_title,
          description: apiSeo?.meta_description,
          keywords: apiSeo?.meta_keyword,
          image: apiSeo?.og_image_path,
        }}
      />

      {/* ✅ Dynamic Breadcrumb */}
      <DynamicBreadcrumb
        pageType="service-detail"
        data={{
          title: "What Students Say",
          slug: "students-say",
        }}
      />

      {/* Hero Header */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              What People Are Saying About Us
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Hear directly from our global community of students and parents
              about their journey with Education Malaysia.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          <AnimatePresence>
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-8 flex flex-col justify-between border border-gray-100"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {review.name}
                        </h3>
                        <p className="text-xs text-blue-600 font-semibold uppercase">
                          {review.role}
                        </p>
                      </div>
                    </div>
                    <FaQuoteRight className="text-gray-200 text-4xl" />
                  </div>

                  <div className="flex text-yellow-400 mb-4 text-sm max-w-full overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < (review.rating || 5)
                            ? "fill-current"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  <p className="text-gray-600 leading-relaxed italic mb-6">
                    "{review.text}"
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <FaGlobeAmericas className="text-blue-400" />
                    <span className="font-medium">{review.country}</span>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {review.date}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Submission Form Section */}
        <section className="bg-white rounded-3xl shadow-2xl overflow-hidden md:flex">
          {/* Left Side: Context */}
          <div className="hidden md:flex md:w-1/3 bg-blue-900 text-white p-12 flex-col justify-center relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">Share Your Story</h2>
              <p className="text-blue-100 mb-8 leading-relaxed">
                Your feedback helps us improve and inspires others to pursue
                their dreams in Malaysia. Let the world know about your
                experience!
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center">
                    <FaBriefcase className="text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Professional Support</h4>
                    <p className="text-sm text-blue-200">
                      Guidance at every step
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center">
                    <FaGlobeAmericas className="text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Global Community</h4>
                    <p className="text-sm text-blue-200">
                      Join students from everywhere
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-8 md:p-12 md:w-2/3">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
              Write a Review{" "}
              <span className="text-blue-600 text-sm font-normal bg-blue-50 px-3 py-1 rounded-full">
                It only takes a minute
              </span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Your Role
                  </label>
                  <div className="relative">
                    <FaBriefcase className="absolute left-4 top-3.5 text-gray-400" />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white appearance-none"
                    >
                      <option value="Student">Student</option>
                      <option value="Parent">Parent</option>
                      <option value="Counselor">Counselor</option>
                      <option value="Alumni">Alumni</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Country
                  </label>
                  <div className="relative">
                    <FaGlobeAmericas className="absolute left-4 top-3.5 text-gray-400" />
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white appearance-none"
                    >
                      <option value="">Select Country</option>
                      <option value="India">India</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="Nepal">Nepal</option>
                      <option value="Sri Lanka">Sri Lanka</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Middle East">Middle East</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Rating
                  </label>
                  <div className="flex gap-2 pt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRating(star)}
                        className={`text-2xl transition-transform hover:scale-110 ${
                          formData.rating >= star
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Your Review
                </label>
                <textarea
                  name="review"
                  rows="4"
                  value={formData.review}
                  onChange={handleChange}
                  placeholder="Share your experience..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  "Submitting..."
                ) : (
                  <>
                    Submit Review <FaPaperPlane />
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WhatStudentsSay;
