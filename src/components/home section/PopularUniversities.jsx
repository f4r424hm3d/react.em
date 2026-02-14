import React, { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import api from "../../api"; // adjust path based on your project
import { API_URL } from "../../config";
// import SEO from "../SEO"

const PopularUniversities = () => {
  const [universities, setUniversities] = useState([]);
  // const [seo , setSeo] = useState({});

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await api.get("/home");
        const data = res.data?.data?.universities;
        // setSeo(res.data.data.seo);
        // console.log(seo)

        if (Array.isArray(data)) {
          setUniversities(data);
        } else {
          console.error("Universities data is not an array");
        }
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    fetchUniversities();
  }, []);

  return (
    <>
      {/* <SEO
        title={seo?.meta_title}
        description={seo?.meta_description}
        keywords={seo?.meta_keyword}
        ogImage={seo?.og_image_path}
        pageContent={seo?.page_content}
        pageurl={seo?.page_url}
        seorating={seo?.seo_rating}
      /> */}

      <section className="bg-white px-4 py-12 sm:px-6 md:px-10 lg:px-24">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10 leading-tight">
          <span className="text-blue-600">Popular Malaysian Universities</span>{" "}
          This Week
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {universities.map((uni, index) => (
            <Link
              key={index}
              to={`/${uni.uname}`}
              className="bg-gray-50 rounded-2xl shadow-md p-5 group hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full border-1 border-gray-300  flex items-center justify-center">
                  <img
                    src={`${API_URL}${uni.logo_path}` || "/default-logo.png"}
                    alt={uni.name}
                    className="h-7 w-7 "
                    loading="lazy"
                    width="64"
                    height="64"
                  />
                </div>
                <FaArrowRight className="text-orange-500 group-hover:text-white transition" />
              </div>
              <h3 className="text-gray-800 font-semibold text-base sm:text-lg leading-snug group-hover:text-blue-600 transition">
                {uni.name}
              </h3>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/universities"
            className="inline-flex items-center border-2 border-blue-800 text-blue-800 font-semibold px-6 py-2 rounded-full transition hover:bg-blue-800 hover:text-white"
          >
            Browse All Universities
          </Link>
        </div>
      </section>
    </>
  );
};

export default memo(PopularUniversities);
