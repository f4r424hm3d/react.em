// import React, { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Home, Layers, ArrowRight, ExternalLink, Clock, Award } from "lucide-react";
// import api from "../api";
// import { Helmet } from "react-helmet";
// import { API_URL } from "../config";

// // ✅ LOADING SKELETON COMPONENT
// const LoadingSkeleton = () => {
//   return (
//     <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg animate-pulse">
//       {/* Image Skeleton */}
//       <div className="relative h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] ">
//         {/* Badge Skeletons */}
//         <div className="absolute top-4 left-4 w-16 h-6 bg-gray-300 rounded-full"></div>
//         <div className="absolute top-14 left-4 w-20 h-5 bg-gray-300 rounded-full"></div>
//       </div>
      
//       {/* Content Skeleton */}
//       <div className="p-6 space-y-4">
//         <div className="space-y-3">
//           <div className="h-5 bg-gray-300 rounded-lg w-4/5"></div>
//           <div className="h-4 bg-gray-200 rounded-lg w-3/5"></div>
//         </div>
//         <div className="h-10 bg-gray-300 rounded-full w-32"></div>
//       </div>
//     </div>
//   );
// };

// // ✅ ENHANCED CARD COMPONENT
// const ScholarshipCard = ({ thumbnail_path, type, active_status, title, slug, page_type, landing_page_link }) => {
//   const navigate = useNavigate();

//   // 🔹 Conditional Explore More Handler
//   const handleExplore = (e) => {
//     e.stopPropagation();
//     if (page_type === "landing_page") {
//       window.open(landing_page_link, "_blank");
//     } else {
//       navigate(`/scholarship/${slug}`);
//     }
//   };

//   const isExternal = page_type === "landing_page";

//   return (
//     <div
//       onClick={() => {
//         if (page_type === "landing_page") {
//           window.open(landing_page_link, "_blank");
//         } else {
//           navigate(`/scholarship/${slug}`);
//         }
//       }}
//       className="group cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-blue-200 hover:-translate-y-3 transition-all duration-500 ease-out"
//     >
//       {/* Enhanced Image Section */}
//       <div className="relative h-64 overflow-hidden">
//         <img
//           src={thumbnail_path || "https://via.placeholder.com/400x300"}
//           alt={title}
//           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//         />
        
//         {/* Gradient Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>

//         {/* Enhanced Status Badge */}
//         <div className="absolute top-4 left-4">
//           <span className={`
//             inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm
//             ${active_status?.toLowerCase() === 'live' ? 'bg-emerald-500/90 text-white' : 
//               active_status?.toLowerCase() === 'active' ? 'bg-blue-500/90 text-white' : 
//               'bg-orange-500/90 text-white'}
//           `}>
//             <Clock size={12} />
//             {active_status}
//           </span>
//         </div>

//         {/* Enhanced Type Badge */}
//         <div className="absolute top-16 left-4">
//           <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-gray-800 font-medium text-xs px-3 py-1.5 rounded-full border border-white/50 shadow-md">
//             <Award size={12} />
//             {type}
//           </span>
//         </div>

//         {/* External Link Indicator */}
//         {isExternal && (
//           <div className="absolute top-4 right-4">
//             <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
//               <ExternalLink size={14} className="text-gray-600" />
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Enhanced Content */}
//       <div className="p-6">
//         <h3 className="text-gray-900 font-bold text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 mb-4">
//           {title}
//         </h3>
        
//         <button
//           onClick={handleExplore}
//           className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 group/btn"
//         >
//           <span>Explore More</span>
//           <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
//         </button>
//       </div>
//     </div>
//   );
// };

// // ✅ ENHANCED WRAPPER COMPONENT
// const ScholarshipCards = () => {
//   const [scholarships, setScholarships] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [seo, setSeo] = useState({});

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });

//     api
//       .get("/scholarships")
//       .then((res) => {
//         setScholarships(
//           Array.isArray(res.data.scholarships) ? res.data.scholarships : [res.data]
//         );
//         setSeo(res.data.seo || {});
//       })
//       .catch((err) => console.error("Error fetching scholarships:", err))
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <>
//       <Helmet>
//         <title>{seo?.meta_title}</title>
//         <meta name="title" content={seo?.meta_title} />
//         <meta name="description" content={seo?.meta_description} />
//         <meta name="keywords" content={seo?.meta_keyword} />
//         <meta name="robots" content={seo?.robots || "index, follow"} />
//         {seo?.page_url && <link rel="canonical" href={seo?.page_url} />}
//         <meta property="og:title" content={seo?.meta_title} />
//         <meta property="og:description" content={seo?.meta_description} />
//         <meta property="og:image" content={seo?.og_image_path} />
//         <meta property="og:url" content={seo?.page_url} />
//         <meta property="og:site_name" content={seo?.site_name || "Study in Malaysia"} />
//         <meta property="og:type" content={seo?.og_type || "website"} />
//         <meta property="og:locale" content={seo?.og_locale || "en_US"} />
//         {seo?.seo_rating && <meta name="seo:rating" content={seo?.seo_rating} />}
//         {seo?.seo_rating_schema && (
//           <script type="application/ld+json">
//             {JSON.stringify(seo.seo_rating_schema)}
//           </script>
//         )}
//       </Helmet>

//       {/* Enhanced Breadcrumb */}
//       <div className="w-full bg-sky-50  border-gray-200">
//         <div className="max-w-screen-xl mx-auto px-4 py-4">
//           <div className="flex items-center space-x-3 text-sm text-gray-600">
//             <Link to="/" className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-200 group">
//               <Home size={18} className="group-hover:scale-110 transition-transform" />
//               <span className="font-medium">Home</span>
//             </Link>
//             <span className="text-gray-400">/</span>
//             <Link to="/scholarships" className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-200 group">
//               <Layers size={18} className="group-hover:scale-110 transition-transform" />
//               <span className="font-medium">Scholarships</span>
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Hero Section */}
//       <section className="relative px-4 md:px-10 py-20 bg-gray-100 min-h-screen overflow-hidden ">
        
        
//         <div className="relative z-10">
//           {/* Enhanced Title */}
//           <div className="text-center mb-10 -mt-10">
//             <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
//               Study <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Abroad Scholarships</span>
//             </h1>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
//               Discover amazing scholarship opportunities with <span className="font-semibold text-blue-600">Education Malaysia</span>
//             </p>
//             <div className="mt-8 flex justify-center">
//               <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
//             </div>
//           </div>

//           {/* Cards Grid */}
//           {loading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//               {[...Array(6)].map((_, i) => (
//                 <LoadingSkeleton key={i} />
//               ))}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//               {scholarships.map((scholar, index) => (
//                 <div
//                   key={scholar.id}
//                   className="animate-fade-in-up"
//                   style={{ 
//                     animationDelay: `${index * 100}ms`,
//                     animationFillMode: 'both'
//                   }}
//                 >
//                   <ScholarshipCard
//                     thumbnail_path={`${API_URL}${scholar.thumbnail_path}`}
//                     type={scholar.type}
//                     active_status={scholar.active_status}
//                     title={scholar.title}
//                     slug={scholar.slug}
//                     page_type={scholar.page_type}
//                     landing_page_link={scholar.landing_page_link}
//                   />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Custom CSS for animations */}
//       <style jsx>{`
//         @keyframes shimmer {
//           0% { background-position: -400% 0; }
//           100% { background-position: 400% 0; }
//         }
        
//         @keyframes fade-in-up {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-shimmer {
//           animation: shimmer 2s infinite;
//         }
        
//         .animate-fade-in-up {
//           animation: fade-in-up 0.6s ease-out;
//         }
        
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </>
//   );
// };

// export default ScholarshipCards;
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Home, Layers, ArrowRight, ExternalLink, Clock, Award } from "lucide-react";
import api from "../api";
import { Helmet } from "react-helmet";
import { API_URL } from "../config";

// ✅ LOADING SKELETON COMPONENT
const LoadingSkeleton = () => {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] ">
        {/* Badge Skeletons */}
        <div className="absolute top-4 left-4 w-20 h-5 bg-gray-300 rounded-full"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <div className="h-5 bg-gray-300 rounded-lg w-4/5"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-3/5"></div>
        </div>
        <div className="h-10 bg-gray-300 rounded-full w-32"></div>
      </div>
    </div>
  );
};

// ✅ ENHANCED CARD COMPONENT
const ScholarshipCard = ({ thumbnail_path, type, active_status, title, slug, page_type, landing_page_link }) => {
  const navigate = useNavigate();

  // 🔹 Conditional Explore More Handler
  const handleExplore = (e) => {
    e.stopPropagation();
    if (page_type === "landing_page") {
      window.open(landing_page_link, "_blank");
    } else {
      navigate(`/scholarships/${slug}`);
    }
  };

  const isExternal = page_type === "landing_page";

  return (
    <div
      onClick={() => {
        if (page_type === "landing_page") {
          window.open(landing_page_link, "_blank");
        } else {
          navigate(`/scholarships/${slug}`);
        }
      }}
      className="group cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-blue-200 hover:-translate-y-3 transition-all duration-500 ease-out"
    >
      {/* Enhanced Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={thumbnail_path || "https://via.placeholder.com/400x300"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>

        {/* Enhanced Type Badge - Position adjusted */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-gray-800 font-medium text-xs px-3 py-1.5 rounded-full border border-white/50 shadow-md">
            <Award size={12} />
            {type}
          </span>
        </div>

        {/* External Link Indicator */}
        {isExternal && (
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
              <ExternalLink size={14} className="text-gray-600" />
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Content */}
      <div className="p-6">
        <h3 className="text-gray-900 font-bold text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 mb-4">
          {title}
        </h3>
        
        <button
          onClick={handleExplore}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 group/btn"
        >
          <span>Explore More</span>
          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

// ✅ ENHANCED WRAPPER COMPONENT
const ScholarshipCards = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seo, setSeo] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    api
      .get("/scholarships")
      .then((res) => {
        setScholarships(
          Array.isArray(res.data.scholarships) ? res.data.scholarships : [res.data]
        );
        setSeo(res.data.seo || {});
      })
      .catch((err) => console.error("Error fetching scholarships:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>{seo?.meta_title}</title>
        <meta name="title" content={seo?.meta_title} />
        <meta name="description" content={seo?.meta_description} />
        <meta name="keywords" content={seo?.meta_keyword} />
        <meta name="robots" content={seo?.robots || "index, follow"} />
        {seo?.page_url && <link rel="canonical" href={seo?.page_url} />}
        <meta property="og:title" content={seo?.meta_title} />
        <meta property="og:description" content={seo?.meta_description} />
        <meta property="og:image" content={seo?.og_image_path} />
        <meta property="og:url" content={seo?.page_url} />
        <meta property="og:site_name" content={seo?.site_name || "Study in Malaysia"} />
        <meta property="og:type" content={seo?.og_type || "website"} />
        <meta property="og:locale" content={seo?.og_locale || "en_US"} />
        {seo?.seo_rating && <meta name="seo:rating" content={seo?.seo_rating} />}
        {seo?.seo_rating_schema && (
          <script type="application/ld+json">
            {JSON.stringify(seo.seo_rating_schema)}
          </script>
        )}
      </Helmet>

      {/* Enhanced Breadcrumb */}
      <div className="w-full bg-sky-50  border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Link to="/" className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-200 group">
              <Home size={18} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium">Home</span>
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/scholarships" className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-200 group">
              <Layers size={18} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium">Scholarships</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative px-4 md:px-10 py-20 bg-gray-100 min-h-screen overflow-hidden ">
        
        
        <div className="relative z-10">
          {/* Enhanced Title */}
          <div className="text-center mb-10 -mt-10">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Study <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Abroad Scholarships</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover amazing scholarship opportunities with <span className="font-semibold text-blue-600">Education Malaysia</span>
            </p>
            <div className="mt-8 flex justify-center">
              <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {scholarships.map((scholar, index) => (
                <div
                  key={scholar.id}
                  className="animate-fade-in-up"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <ScholarshipCard
                    thumbnail_path={`${API_URL}${scholar.thumbnail_path}`}
                    type={scholar.type}
                    active_status={scholar.active_status}
                    title={scholar.title}
                    slug={scholar.slug}
                    page_type={scholar.page_type}
                    landing_page_link={scholar.landing_page_link}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -400% 0; }
          100% { background-position: 400% 0; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default ScholarshipCards;