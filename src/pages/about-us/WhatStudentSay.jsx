import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from "../../api";
import { toast } from "react-toastify";

const testimonials = [
  {
    name: "HASEEB",
    country: "PAKISTAN",
    text:
      "As a student I am really thankful that I got contacted with them. Their co-operation with students is really impressive and my overall experience is excellent with them.",
  },
  {
    name: "Neha",
    country: "INDIA",
    text:
      "I am studying accountancy in Malaysia and got a very good help from their Gurgaon office regarding choosing the right course.",
  },
  {
    name: "Aman",
    country: "NEPAL",
    text:
      "They guided me at every step from selecting the university to the visa process. The team is really helpful.",
  },
  {
    name: "Siti",
    country: "MALAYSIA",
    text:
      "Very professional and responsive. Their assistance helped me a lot in getting into the course I dreamed of.",
  },
];

const CustomPrev = (props) => (
  <button
    {...props}
    className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 text-gray-500 hover:text-orange-600"
  >
    <FaChevronLeft size={22} />
  </button>
);

const CustomNext = (props) => (
  <button
    {...props}
    className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 text-gray-500 hover:text-orange-600"
  >
    <FaChevronRight size={22} />
  </button>
);

const WhatStudentsSay = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <CustomNext />,
    prevArrow: <CustomPrev />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    country: "",
    review: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.role || !formData.country || !formData.review) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Optimistic Update: Immediately show success to the user
    // The backend might be slow (sending emails, etc.), so we don't wait for it.

    const newReview = {
      name: formData.name,
      country: formData.country,
      text: formData.review,
    };

    // 1. Update UI immediately
    toast.success("Review submitted successfully! Thank you for your feedback.");
    setSubmittedReviews(prev => [newReview, ...prev]);

    // 2. Reset form immediately
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      country: "",
      review: "",
    });

    // 3. Send to API in background (Fire and Forget)
    const params = new URLSearchParams();
    params.append('name', formData.name);
    params.append('email', formData.email);
    params.append('mobile', formData.phone);
    params.append('country_code', '91');
    params.append('nationality', formData.country);
    params.append('source', `Testimonial - Role: ${formData.role} | Review: ${formData.review}`);
    params.append('source_path', window.location.href);

    api.post("/inquiry/simple-form", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then(response => {
        console.log("Review synced to backend:", response.data);
      })
      .catch(error => {
        console.error("Background sync failed:", error);
        // Optional: We could show an error toast here, but since we already showed success,
        // it might be confusing. For a 'Contact/Review' form, optimistic success is usually preferred.
      });
  };

  const [submittedReviews, setSubmittedReviews] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);



  return (
    <section className="bg-gradient-to-b from-white via-blue-50 to-white py-16 px-4 md:px-10 lg:px-20">
      {/* Heading */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-2">What People Are Saying <span className="text-blue-600">About Us</span></h2>
        <p className="text-gray-600 text-lg">What Our Students Say?</p>
      </div>

      {/* Slider - showing both original testimonials + submitted reviews */}
      <Slider {...settings} className="relative mb-20 max-w-6xl mx-auto">
        {[...submittedReviews, ...testimonials].map((testimonial, index) => (
          <div key={index} className="px-4">
            <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-6 md:p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-white shadow flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                  alt="avatar"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <p className="text-gray-700 text-md leading-relaxed">
                <FaQuoteLeft className="inline-block text-blue-600 mr-2" />
                {testimonial.text}
              </p>
              <p className="font-semibold text-blue-600 text-sm">
                {testimonial.name} <span className="text-gray-500">({testimonial.country})</span>
              </p>
            </div>
          </div>
        ))}
      </Slider>

      {/* Review Form */}
      <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Write a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="px-4 py-3 w-full rounded-md border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
              required
              className="px-4 py-3 w-full rounded-md border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="px-4 py-3 w-full rounded-md border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="px-4 py-3 w-full rounded-md border border-gray-300 bg-white/80 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">What you are?</option>
              <option value="Student">Student</option>
              <option value="Parent">Parent</option>
              <option value="Counselor">Counselor</option>
            </select>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="px-4 py-3 w-full rounded-md border border-gray-300 bg-white/80 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose Country</option>
              <option value="India">India</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Nepal">Nepal</option>
            </select>
          </div>
          <textarea
            name="review"
            rows="5"
            placeholder="Enter your review"
            value={formData.review}
            onChange={handleChange}
            required
            className="px-4 py-3 w-full rounded-md border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center justify-center border-2 border-blue-800 font-semibold px-6 py-2 rounded-full transition min-w-[160px] ${loading
              ? "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
              : "text-blue-800 hover:bg-blue-800 hover:text-white"
              }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default WhatStudentsSay;
