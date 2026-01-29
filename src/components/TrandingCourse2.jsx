
import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import api from "../api";

const TrendingCourse2 = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { name, slug, nameWithLevel } = useParams();
  const location = useLocation();
  
  // Extract actual slug from new URL format
  let actualSlug = slug || name;
  
  if (nameWithLevel) {
    const parts = nameWithLevel.split('-');
    const validLevels = ['diploma', 'undergraduate', 'postgraduate', 'phd', 'certificate'];
    const lastPart = parts[parts.length - 1];
    
    if (validLevels.includes(lastPart)) {
      actualSlug = parts.slice(0, -1).join('-');
    } else {
      actualSlug = nameWithLevel;
    }
  }

  useEffect(() => {
    const fetchCourses = async () => {
      if (!actualSlug) return;
      
      try {
        setLoading(true);
        
        let endpoint = '';
        let dataPath = '';
        
        // Determine endpoint based on current route
        if (location.pathname.includes('/specialization/')) {
          endpoint = `/specialization-detail-by-slug/${actualSlug}`;
          dataPath = 'other_specializations';
        } else if (location.pathname.includes('/exam')) {
          endpoint = `/exam-details/${actualSlug}`;
          dataPath = 'specializations';
        } else if (location.pathname.includes('/service')) {
          endpoint = `/service-details/${actualSlug}`;
          dataPath = 'specializations';
        } else if (location.pathname.includes('/course')) {
          endpoint = `/course-category/${actualSlug}`;
          dataPath = 'other_categories';
        }
        
        if (!endpoint) return;
        
        const res = await api.get(endpoint);
        console.log("Full API response:", res.data);
        
        // Extract courses based on data path
        const courseList = 
          res.data?.data?.[dataPath] || 
          res.data?.[dataPath] || 
          [];
          
        console.log(`${dataPath} List:`, courseList);
        setCourses(courseList);
      } catch (error) {
        console.error("Failed to fetch trending courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [actualSlug, location.pathname]);

  if (loading) {
    return (
      <div className="px-3">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h4 className="text-xl font-bold border-b pb-3 mb-5 text-gray-800">
            🔥 Trending Courses
          </h4>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

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
                  to={`/specialization/${course.slug}`}
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

export default TrendingCourse2;