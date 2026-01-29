import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useParams } from "react-router-dom";
import api from "../../api"; // ✅ Make sure this is default export

const CatagoryTreandingCourse= () => {
  const [courses, setCourses] = useState([]);
  const { slug } = useParams();

useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchService = async () => {
      try {
        const res = await api.get(`/course-category/${slug}`);
        const tradingData = res?.data?.other_categories;
        console.log("featured_universities:", res);

        setCourses(tradingData);
      } catch (error) {
        console.error("Error fetching service details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);




  return (
    <div className="px-3">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h4 className="text-xl font-bold border-b pb-3 mb-5 text-gray-800">
          🔥 Trending Courses
        </h4>
        {courses.length === 0 ? (
          <p className="text-gray-500">No trending courses available.</p>
        ) : (
          <ul className="space-y-3">
            {courses.map((course) => (
              <li key={course.id}>
                <Link
                  to={`/course/${course.slug}`}
                  className="flex items-center justify-between px-4 py-2 rounded-md text-gray-700 hover:bg-orange-100/70 hover:text-orange-700 transition group"
                >
                  <span className="font-medium group-hover:translate-x-1 transition">
                    {course.name}
                  </span>
                  <FaArrowRight className="text-orange-500 group-hover:translate-x-1 transition" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CatagoryTreandingCourse;
