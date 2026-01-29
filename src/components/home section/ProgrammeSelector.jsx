
// export default ProgrammeSelector;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBookOpen, FaArrowRight } from "react-icons/fa";
import api from "../../api";

const ProgrammeSelector = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await api.get("/home");

        if (res.data?.data?.specializationsWithContent) {
          // 🔥 Only 8 items → 2 rows × 4 cards
          setCourses(res.data.data.specializationsWithContent.slice(0, 8));
        } else {
          console.warn("specializationsWithContent missing from API response");
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
      {[...Array(8)].map((_, i) => (
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
    <section className="bg-white px-4 pt-6 pb-4 md:px-10 lg:px-24">

      {/* ⭐ HEADING ⭐ */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
        Choose Your <span className="text-[#003893]">Favourite Programme</span> in Malaysia
      </h2>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course, index) => (
            <Link
              key={course.id || index}
              to={`/specialization/${course.slug}`}
              className="group bg-gray-50 rounded-2xl shadow-md hover:shadow-xl p-4 transition-all duration-300 border border-gray-100 hover:border-blue-200 relative overflow-hidden"
            >
              {/* Hover Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">

                {/* Top Section */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-medium text-sm">Study</span>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md">
                      <FaBookOpen className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1">
                    <FaArrowRight className="text-white text-sm" />
                  </div>
                </div>

                {/* Course Name */}
                <h3 className="text-gray-800 font-semibold text-base mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 min-h-[3rem]">
                  {course.name}
                </h3>

                {/* Badge */}
                <div className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-full">
                  In Malaysia
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Browse All Button */}
      <div className="text-center mt-6">
        <Link
          to="/specialization"
          className="inline-flex items-center border-2 border-blue-800 text-blue-800 font-semibold px-6 py-2 rounded-full transition hover:bg-blue-800 hover:text-white"
        >
          Browse All Programmes
        </Link>
      </div>

    </section>
  );
};

export default ProgrammeSelector;