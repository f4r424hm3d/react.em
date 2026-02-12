import React, { useState, useEffect } from "react";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import api from "../../api";

// ⭐ Reusable ReviewCard
const ReviewCard = ({
  name,
  date,
  rating,
  reviewTitle,
  reviewText,
  program,
  passingYear,
}) => {
  return (
    <div className="bg-white rounded-md border p-4 mb-4 relative shadow-sm">
      {/* Floating Score */}
      <div className="absolute top-4 right-4 bg-blue-900 text-white font-bold text-lg px-3 py-1 rounded">
        {rating}
      </div>

      <div className="flex items-center gap-3 mb-2">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-white text-xl font-bold">
          {name.charAt(0).toUpperCase()}
        </div>

        {/* Name + Verified + Stars */}
        <div>
          <div className="flex items-center gap-1 text-lg font-semibold">
            {name}
            <FaCheckCircle className="text-green-600" />
          </div>
          <div className="flex items-center text-green-600 text-sm mt-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < rating ? "text-green-600" : "text-gray-300"}
              />
            ))}
            <span className="ml-2 text-gray-600">✔ Verified Review</span>
          </div>
        </div>
      </div>

      {/* Date */}
      {date && (
        <p className="text-sm text-gray-500 mb-2">
          Post on -{" "}
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}{" "}
          <span className="font-semibold text-gray-800">by {name}</span>
        </p>
      )}

      {/* Program & Year */}
      {program && (
        <p className="text-sm text-blue-600 mb-2">
          {program} {passingYear && `(${passingYear})`}
        </p>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        {reviewTitle}
      </h3>

      {/* Body */}
      <p className="text-gray-700 leading-relaxed">{reviewText}</p>
    </div>
  );
};

// ⭐ Main Component
const Reviews = ({ universityUname }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [universityName, setUniversityName] = useState("");

  // 🔥 Agar prop nahi mila to URL se lo
  const getUniversityUname = () => {
    if (universityUname) return universityUname;

    // URL se extract karo: /university/aimst-university/reviews
    const pathParts = window.location.pathname.split("/");
    const universityIndex = pathParts.indexOf("university");
    if (universityIndex !== -1 && pathParts[universityIndex + 1]) {
      return pathParts[universityIndex + 1];
    }
    return null;
  };

  useEffect(() => {
    const uname = getUniversityUname();
    if (uname) {
      fetchReviews(uname);
    }
  }, [universityUname]);

  const fetchReviews = async (uname) => {
    try {
      setLoading(true);

      console.log("Fetching reviews for:", uname); // Debug log

      // API call using your api instance
      const response = await api.get(`/university-reviews/${uname}`);

      if (response.data.success && response.data.data) {
        setReviews(response.data.data.reviews.items || []);
        setStats(response.data.data.reviews.stats || null);
        setUniversityName(response.data.data.university.name || "");
      } else {
        setReviews([]);
        setStats(null);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LOADING STATE
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  // 🔥 AGAR REVIEWS NAHI HAI TO NULL RETURN (Tab bhi nahi dikhega)
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Calculate rating percentage
  const ratingPercentage = stats
    ? Math.round((parseFloat(stats.average_rating) / 5) * 100)
    : 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Section */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">
          Rating and Reviews
        </h2>
        <div className="flex justify-center items-center gap-2 mb-1">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={
                i < Math.round(parseFloat(stats?.average_rating || 5))
                  ? "text-yellow-400 text-xl"
                  : "text-gray-300 text-xl"
              }
            />
          ))}
          <span className="text-lg font-semibold">
            {stats?.average_rating || "5.0"} out of 5
          </span>
        </div>
        <p className="text-gray-600">
          Based on {stats?.total_reviews || reviews.length} Review
          {(stats?.total_reviews || reviews.length) > 1 ? "s" : ""}
        </p>
        <p className="font-semibold text-gray-700 mt-1">
          {ratingPercentage}% Reviewer
        </p>
        <p className="text-gray-500">Recommends this college</p>
      </div>

      {/* Reviews List */}
      <h3 className="text-lg font-semibold mb-2">
        Showing {reviews.length} Review{reviews.length > 1 ? "s" : ""}
      </h3>

      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          name={review.name}
          date={review.created_at}
          rating={review.rating}
          reviewTitle={review.review_title}
          reviewText={review.description}
          program={review.program}
          passingYear={review.passing_year}
        />
      ))}
    </div>
  );
};

// 🔥 YE FUNCTION ADD KARO (export default Reviews; se pehle)
export const checkReviewsExist = async (universityUname) => {
  // Always return false for now - no reviews API available
  console.log(
    `Reviews check skipped for ${universityUname} - API not available`,
  );
  return false;
};

export default Reviews;
