import React, { useState, useEffect } from "react";

import { FaArrowRight } from "react-icons/fa";

import { useNavigate, useParams, Link } from "react-router-dom";

import api from "../../api";



const PopularCourses = () => {

  const { slug } = useParams();

  const navigate = useNavigate();

  const [universityCourses, setUniversityCourses] = useState([]);

  const [malaysiaCourses, setMalaysiaCourses] = useState([]);

  const [topCourses, setTopCourses] = useState([]);

  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {

    const fetchCourses = async () => {

      try {

        const response = await api.get(`/university-overview/${slug}`);

        // Correctly assign the nested data object to a variable

        const { data } = response.data;

        //         console.log("Courses Data:", data);



        // Now use the 'data' variable to set your state

        setUniversityCourses(data.university_specializations_for_courses || []);

        setMalaysiaCourses(data.all_specializations_for_courses || []);

        setTopCourses(data.specializations_with_contents || []);

      } catch (error) {

        console.error("Error fetching courses:", error);

      } finally {

        setIsLoading(false);

      }

    };



    if (slug) {

      fetchCourses();

    }

  }, [slug]);



  // The rest of the component code remains the same...



  // Dynamically create the sections array using the state variables.

  const sections = [

    {

      title: "University Popular Courses",

      courses: universityCourses.slice(0, 15),

    },

    {

      title: "Malaysia Popular Courses",

      courses: malaysiaCourses.slice(0, 15),

    },

    {

      title: "Top Courses to Study in Malaysia",

      courses: topCourses.slice(0, 15),

    },

  ];



  if (isLoading) {

    return (

      <div className="max-w-6xl mx-auto px-4 py-10 text-center">

        Loading courses...

      </div>

    );

  }



  return (

    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-10">

      <div className="grid grid-cols-1 gap-4 sm:gap-8">

        {sections.map((section, index) => (

          <div

            key={index}

            className="bg-[#f6f9fb] rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition"

          >

            <h2 className="text-base sm:text-lg font-bold text-[#003366] mb-3 sm:mb-4">

              {section.title}

            </h2>

            <h3 className="text-sm sm:text-base font-semibold text-black mb-3 sm:mb-4">

              Top Streams:

            </h3>



            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-5">

              {section.courses.length > 0 ? (

                section.courses.map((course, idx) => {
                  let targetUrl = "#";
                  
                  // Check if it's the "University Popular Courses" section
                  if (section.title === "University Popular Courses") {
                     const queryParams = new URLSearchParams();
                     
                     // Try multiple property names for IDs
                     const specId = course.specialization_id || course.id;
                     const catId = course.course_category_id || course.category?.id || course.category_id;

                     if (specId) {
                        queryParams.set('specialization_id', specId);
                     }
                     
                     if (catId) {
                        queryParams.set('course_category_id', catId);
                     }
                     
                     targetUrl = `/university/${slug}/courses?${queryParams.toString()}`;
                  } else if (section.title === "Top Courses to Study in Malaysia") {
                      // ✅ New Logic for "Top Courses to Study in Malaysia"
                      const specializationSlug = course.name
                        ? course.name.toLowerCase().trim().replace(/\s+/g, "-")
                        : "";
                      targetUrl = `/specialization/${specializationSlug}`;
                  } else {
                     // Default behavior for other sections (global courses)
                     const specializationSlug = course.name
                        ? course.name.toLowerCase().trim().replace(/\s+/g, "-")
                        : "";
                     
                     const queryParams = new URLSearchParams();
                     if (specializationSlug) {
                        queryParams.set('specialization', specializationSlug);
                     }
                     
                     const categorySlug = course.category_slug || 
                                       (course.category ? course.category.toLowerCase().trim().replace(/\s+/g, "-") : "");
                     
                     if (categorySlug) {
                        queryParams.set('category', categorySlug);
                     }
                     targetUrl = `/courses-in-malaysia?${queryParams.toString()}`;
                  }

                  return (
                    <Link
                    key={idx}
                    to={targetUrl}
                    state={{ // ✅ Pass state for cleaner navigation handling if supported
                        activeTab: 'courses',
                        specialization_id: course.specialization_id || course.id,
                        course_category_id: course.course_category_id || course.category?.id || course.category_id
                    }}
                    target="_blank"
                    className="flex items-center gap-1.5 sm:gap-2 bg-white px-2.5 sm:px-3 py-1.5 border border-gray-300 rounded-full text-xs sm:text-sm text-gray-800 hover:bg-blue-50 transition cursor-pointer"
                  >
                    <FaArrowRight className="text-blue-600 text-[10px] sm:text-xs flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{course.name}</span>
                  </Link>
                  )
                })

              ) : (

                <p className="text-gray-500 text-sm">No courses available for this section.</p>

              )}

            </div>



            <div className="text-right">

              <button

                onClick={() => navigate("/courses")}

                className="bg-[#003366] text-white px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-full hover:bg-[#002244] transition font-medium"

              >

                View All

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};



export default PopularCourses;