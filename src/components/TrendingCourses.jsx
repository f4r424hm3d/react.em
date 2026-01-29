

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBookOpen, FaArrowRight } from "react-icons/fa";
import api from "../api";

const TrendingCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await api.get("/home");

        if (res.data && res.data.data && Array.isArray(res.data.data.specializationsWithContent)) {
          // ✅ Only take first 12 courses (3 rows × 4 columns)
          setCourses(res.data.data.specializationsWithContent.slice(0, 12));
        } else {
          console.warn("specializations not found in response");
        }
      } catch (error) {
        console.error("Failed to load specializations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecializations();
  }, []);

  const LoadingSkeleton = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="bg-gray-50 rounded-2xl shadow-md p-5 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-4 bg-gray-300 rounded w-16"></div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-teal-400"></div>
            </div>
            <div className="w-6 h-6 rounded-full bg-orange-300"></div>
          </div>
          <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-blue-200 rounded-full w-24"></div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="bg-white px-4  md:px-10 lg:px-24">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
        List of Top Trending <span className="text-blue-600">Courses in Malaysia</span>
      </h2>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course, index) => (
            <Link
              key={course.id || index}
              to={`/specialization/${course.slug}`}
              className="group bg-gray-50 rounded-2xl shadow-md hover:shadow-xl p-5 transition-all duration-300 border border-gray-100 hover:border-blue-200 relative overflow-hidden"
            >
              {/* Hover Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Card Content */}
              <div className="relative z-10">
                {/* Top Section: Icon + Study Label + Arrow */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-medium text-sm">Study</span>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md">
                      <FaBookOpen className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Orange Arrow */}
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1">
                    <FaArrowRight className="text-white text-sm" />
                  </div>
                </div>

                {/* Title - REDUCED GAP HERE */}
                <h3 className="text-gray-800 font-semibold text-base mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 min-h-[3rem]">
                  {course.name}
                </h3>

                {/* Blue Badge */}
                <div className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-full">
                  In Malaysia
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <Link
          to="/specialization"
          className="inline-flex items-center border-2 border-blue-800 text-blue-800 font-semibold px-6 py-2 rounded-full transition hover:bg-blue-800 hover:text-white"
        >
          Browse All Courses
        </Link>
      </div>
    </section>
  );
};

export default TrendingCourses;