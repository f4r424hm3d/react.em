import React, { use, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api"; // your axios instance
import { Home, Layers } from "lucide-react";
import { Helmet } from "react-helmet";


const LoadingSkeleton = () => {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] ">
      </div>
      
      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <div className="h-5 bg-gray-300 rounded-lg w-4/5"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-3/5"></div>
        </div>
        <div className="h-10 bg-gray-300 rounded-full w-full"></div>
      </div>
    </div>
  );
};


const Exam = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seo,setSeo] = useState({})
const API_BASE_URL = "	https://www.educationmalaysia.in/storage/"; 

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/exams");
        // console.log("API response:", res.data);
      
        const examsList = res.data?.data?.exams || [];
        setExams(examsList);
        setSeo(res.data.seo || {});
        // console.log("SEO Data:", res.data.seo);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch exams:", err);
        setError("Failed to load exams.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>

 <Helmet>
      {/* 🔹 Basic SEO */}
      <title>{seo?.meta_title}</title>
      <meta name="title" content={seo?.meta_title} />
      <meta name="description" content={seo?.meta_description} />
      <meta name="keywords" content={seo?.meta_keyword} />

      {/* 🔹 Robots */}
      <meta name="robots" content={seo?.robots || "index, follow"} />

      {/* 🔹 Canonical */}
      {seo?.page_url && <link rel="canonical" href={seo?.page_url} />}

      {/* 🔹 Open Graph (Facebook, LinkedIn, etc.) */}
      <meta property="og:title" content={seo?.meta_title} />
      <meta property="og:description" content={seo?.meta_description} />
      <meta property="og:image" content={seo?.og_image_path} />
      <meta property="og:url" content={seo?.page_url} />
      <meta property="og:site_name" content={seo?.site_name || "Study in Malaysia"} />
      <meta property="og:type" content={seo?.og_type || "website"} />
      <meta property="og:locale" content={seo?.og_locale || "en_US"} />
 {/* 🔹 SEO Rating (as meta) */}
      {seo?.seo_rating && <meta name="seo:rating" content={seo?.seo_rating} />}

      {/* 🔹 JSON-LD Schema (Structured Data) */}
      {seo?.seo_rating_schema && (
        <script type="application/ld+json">
          {JSON.stringify(seo.seo_rating_schema)}
        </script>
      )}
     
    </Helmet>







    {/* BreadcrumbBar */}
<div className="w-full bg-blue-50 shadow-sm">
  <div className="max-w-screen-xl mx-auto px-4 py-3">
    <div className="flex items-center space-x-3 text-sm text-gray-600">
      <Link to="/" className="flex items-center gap-1 hover:underline hover:text-blue-500">
        <Home size={18} /> Home
      </Link>
      <span>/</span>
      <Link to="/exams" className="flex items-center gap-1 hover:underline hover:text-blue-500">
        <Layers size={18} />Exams
      </Link>
    </div>
  </div>
</div>

    
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 px-6 py-14">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Explore Top <span className="text-blue-600">Study Abroad Exams</span>
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {[...Array(8)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-500 text-lg">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {exams.map((exam, index) => (
            <div
              key={index}
              className="bg-white/40 backdrop-blur-md shadow-lg rounded-xl overflow-hidden transform hover:-translate-y-1 hover:scale-105 transition duration-300 ease-in-out border border-gray-200"
            >
              <img
                 src={`${API_BASE_URL}${exam.imgpath}`} 
                alt={exam.page_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {exam.page_name}
                </h2>
                <p className="text-sm text-gray-600 mb-4 h-16 overflow-hidden">
                  {exam.headline}
                </p>
                <Link
                  to={`/resources/exams/${exam.uri}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 w-full text-center block"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default Exam;