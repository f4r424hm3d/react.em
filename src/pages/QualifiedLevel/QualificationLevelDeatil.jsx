// // import React, { useState, useEffect } from "react";
// // import { useParams, useNavigate } from "react-router-dom"; // ✅ useNavigate added
// // import { CheckCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
// // import api from "../../api";
// // import { Helmet } from "react-helmet";

// // const formatHTML = (html) => {
// //   if (!html) return "";

// //   const textarea = document.createElement("textarea");
// //   textarea.innerHTML = html;
// //   let decoded = textarea.value;

// //   decoded = decoded.replace(/<span[^>]*>/gi, "");
// //   decoded = decoded.replace(/<\/span>/gi, "");
// //   decoded = decoded.replace(/style="[^"]*"/gi, "");
// //   decoded = decoded.replace(/&nbsp;/gi, " ");
// //   decoded = decoded.replace(/<h([1-6])[^>]*>([^<]*?)\s*:\s*<\/h\1>/gi, (_m, level, title) => {
// //     return `<h${level}>${title.trim()}</h${level}>`;
// //   });
// //   decoded = decoded.replace(/<p>\s*:\s*/gi, "<p>");
// //   decoded = decoded.replace(/<strong>(.*?)<\/strong>/gi, `<h4 class="text-lg font-semibold mb-2 mt-4">$1</h4>`);
// //   decoded = decoded.replace(/<b>(.*?)<\/b>/gi, `<h4 class="text-lg font-semibold mb-2 mt-4">$1</h4>`);
// //   decoded = decoded.replace(/(?:\r\n|\r|\n)/g, "</p><p>");
// //   decoded = `<p>${decoded}</p>`;
// //   decoded = decoded.replace(/<p><\/p>/g, "");

// //   decoded = decoded.replace(
// //     /<table(.*?)>/g,
// //     `<div class="overflow-auto rounded-xl shadow-sm border border-gray-200 my-6"><table class="w-full border-collapse" $1>`
// //   );
// //   decoded = decoded.replace(/<\/table>/g, "</table></div>");
// //   decoded = decoded.replace(
// //     /<thead>/g,
// //     '<thead class="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-left text-sm">'
// //   );
// //   decoded = decoded.replace(
// //     /<th>/g,
// //     '<th class="px-4 py-3 font-medium whitespace-nowrap border-b border-blue-200 text-white text-sm">'
// //   );
// //   decoded = decoded.replace(/<tr>/g, '<tr class="even:bg-blue-50">');
// //   decoded = decoded.replace(
// //     /<td>(.*?)<\/td>/g,
// //     '<td class="px-4 py-3 text-sm text-gray-800">$1</td>'
// //   );

// //   decoded = decoded.replace(
// //     /<input[^>]*type=["']checkbox["'][^>]*>/gi,
// //     `<span class="inline-block w-4 h-4 rounded border border-gray-400 mr-2 bg-white"></span>`
// //   );

// //   decoded = decoded.replace(
// //     /<ul>/g,
// //     '<ul class="list-disc pl-6 space-y-2 text-gray-800">'
// //   );
// //   decoded = decoded.replace(
// //     /<ol>/g,
// //     '<ol class="list-decimal pl-6 space-y-2 text-gray-800">'
// //   );
// //   decoded = decoded.replace(
// //     /<li>/g,
// //     '<li class="mb-1">'
// //   );

// //   return decoded;
// // };

// // export default function QualifiedLevelDetail() {
// //   const { slug } = useParams();
// //   const navigate = useNavigate(); // ✅ Added
// //   const [pageContent, setPageContent] = useState(null);
// //   const [categories, setCategories] = useState([]);
// //   const [isExpanded, setIsExpanded] = useState(false);
// //   const [loading, setLoading] = useState(true);
// //   const [seo, setSeo] = useState({});

// //   const toggleExpanded = () => {
// //     setIsExpanded((prev) => !prev);
// //   };

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const response = await api.get(`/courses/${slug}`);
// //         setPageContent(response.data?.pageContent || null);
// //         setCategories(response.data?.categories || []);
// //         setSeo(response.data?.seo || {});
// //         console.log(response.data);
// //       } catch (err) {
// //         console.error("Failed to fetch course data:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [slug]);

// //   const handleNavigate = (slug) => {
// //     navigate(`/course/${slug}`); // ✅ Navigate to detail page
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <>
// //    <Helmet>
// //       {/* 🔹 Basic SEO */}
// //       <title>{seo?.meta_title}</title>
// //       <meta name="title" content={seo?.meta_title} />
// //       <meta name="description" content={seo?.meta_description} />
// //       <meta name="keywords" content={seo?.meta_keyword} />

// //       {/* 🔹 Robots */}
// //       <meta name="robots" content={seo?.robots || "index, follow"} />

// //       {/* 🔹 Canonical */}
// //       {seo?.page_url && <link rel="canonical" href={seo?.page_url} />}

// //       {/* 🔹 Open Graph (Facebook, LinkedIn, etc.) */}
// //       <meta property="og:title" content={seo?.meta_title} />
// //       <meta property="og:description" content={seo?.meta_description} />
// //       <meta property="og:image" content={seo?.og_image_path} />
// //       <meta property="og:url" content={seo?.page_url} />
// //       <meta property="og:site_name" content={seo?.site_name || "Study in Malaysia"} />
// //       <meta property="og:type" content={seo?.og_type || "website"} />
// //       <meta property="og:locale" content={seo?.og_locale || "en_US"} />
// //  {/* 🔹 SEO Rating (as meta) */}
// //       {seo?.seo_rating && <meta name="seo:rating" content={seo?.seo_rating} />}

// //       {/* 🔹 JSON-LD Schema (Structured Data) */}
// //       {seo?.seo_rating_schema && (
// //         <script type="application/ld+json">
// //           {JSON.stringify(seo.seo_rating_schema)}
// //         </script>
// //       )}

// //     </Helmet>
// //     <div className="bg-gray-100 min-h-screen py-10 px-4">
// //       <div className="max-w-6xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm mb-10">
// //         {/* Header */}
// //         <div className="flex items-start gap-4 mb-4">
// //           <div className="relative">
// //             <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
// //               <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
// //                 <div className="w-4 h-4 bg-white rounded-full"></div>
// //               </div>
// //             </div>
// //             <CheckCircle className="w-5 h-5 text-green-500 absolute -top-1 -right-1 bg-white rounded-full" />
// //           </div>
// //           <div className="flex-1">
// //             <h2 className="text-xl font-semibold text-gray-900 mb-1">
// //               {pageContent?.author?.name || "Team Education Malaysia"}
// //             </h2>
// //             <p className="text-sm text-gray-600">
// //               Updated on -{" "}
// //               {new Date(pageContent?.updated_at).toLocaleDateString("en-MY", {
// //                 year: "numeric",
// //                 month: "short",
// //                 day: "numeric",
// //               })}
// //             </p>
// //           </div>
// //         </div>

// //         <h1 className="text-2xl font-bold text-gray-900 mb-4">
// //           {pageContent?.heading}
// //         </h1>

// //         <div
// //           className={`transition-all duration-300 text-[15px] leading-relaxed ${
// //             isExpanded ? "max-h-full" : "max-h-[240px] overflow-hidden"
// //           }`}
// //         >
// //           <div
// //             className="custom-html space-y-4"
// //             dangerouslySetInnerHTML={{
// //               __html: formatHTML(pageContent?.description || ""),
// //             }}
// //           />
// //         </div>

// //         {pageContent?.description && (
// //           <button
// //             onClick={toggleExpanded}
// //             className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
// //           >
// //             <span>{isExpanded ? "Show Less" : "Show More"}</span>
// //             {isExpanded ? (
// //               <ChevronUp className="w-4 h-4" />
// //             ) : (
// //               <ChevronDown className="w-4 h-4" />
// //             )}
// //           </button>
// //         )}
// //       </div>

// //       {/* Categories List */}
// //       <div className="space-y-6 max-w-5xl mx-auto">
// //         {categories.length === 0 ? (
// //           <p className="text-center text-gray-500">No categories found.</p>
// //         ) : (
// //           categories.map((card) => (
// //             <div
// //               key={card.id}
// //               onClick={() => handleNavigate(card.slug)} // ✅ navigate on click
// //               className="bg-white w-full cursor-pointer transition-all rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-500"
// //             >
// //               <div className="md:flex">
// //                 <img
// //                   src={
// //                     card.thumbnail_path
// //                       ? `https://www.educationmalaysia.in/storage/${card.thumbnail_path}`
// //                       : "https://via.placeholder.com/300x200?text=Course"
// //                   }
// //                   alt={card.name}
// //                   className="w-full md:w-1/3 object-cover h-64 md:h-72"
// //                 />
// //                 <div className="p-6 flex flex-col justify-center flex-1">
// //                   <h3 className="text-xl font-semibold text-blue-700 mb-2">
// //                     {card.name}
// //                   </h3>
// //                   <p className="text-gray-700 mb-3 text-sm leading-relaxed break-words">
// //                     {card.shortnote || "No description available."}
// //                   </p>

// //                   {card.specializations?.length > 0 && (
// //                     <div className="mt-3">
// //                       <h4 className="text-sm font-semibold text-gray-800 mb-2">
// //                         Specializations:
// //                       </h4>
// //                       <div className="flex flex-wrap gap-2">
// //                         {card.specializations.map((spec) => (
// //                           <span
// //                             key={spec.id}
// //                             className="text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition"
// //                           >
// //                             {spec.name}
// //                           </span>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>
// //     </div>
// //     </>
// //   );
// // }

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { CheckCircle, ChevronDown, ChevronUp, Loader2, Home, ChevronRight } from "lucide-react";
// import api from "../../api";
// import { Helmet } from "react-helmet";

// const formatHTML = (html) => {
//   if (!html) return "";

//   const textarea = document.createElement("textarea");
//   textarea.innerHTML = html;
//   let decoded = textarea.value;

//   decoded = decoded.replace(/<span[^>]*>/gi, "");
//   decoded = decoded.replace(/<\/span>/gi, "");
//   decoded = decoded.replace(/style="[^"]*"/gi, "");
//   decoded = decoded.replace(/&nbsp;/gi, " ");

//   // Fix headings with colons
//   decoded = decoded.replace(/<h([1-6])[^>]*>([^<]*?)\s*:\s*<\/h\1>/gi, (_m, level, title) => {
//     return `<h${level} class="text-xl font-bold mb-3 mt-6 text-gray-900">${title.trim()}</h${level}>`;
//   });

//   decoded = decoded.replace(/<p>\s*:\s*/gi, "<p>");

//   // Convert strong/b to proper h4 headings
//   decoded = decoded.replace(/<strong>(.*?)<\/strong>/gi, `<h4 class="text-lg font-semibold mb-2 mt-4 text-gray-800">$1</h4>`);
//   decoded = decoded.replace(/<b>(.*?)<\/b>/gi, `<h4 class="text-lg font-semibold mb-2 mt-4 text-gray-800">$1</h4>`);

//   // Style h2 headings
//   decoded = decoded.replace(/<h2>/gi, '<h2 class="text-xl font-bold mb-3 mt-6 text-gray-900">');
//   decoded = decoded.replace(/<h3>/gi, '<h3 class="text-lg font-semibold mb-2 mt-4 text-gray-800">');

//   // Style hyperlinks properly
//   decoded = decoded.replace(/<a\s+href="([^"]*)"/gi, '<a href="$1" class="text-blue-600 hover:text-blue-800 underline font-medium"');

//   decoded = decoded.replace(/(?:\r\n|\r|\n)/g, "</p><p>");
//   decoded = `<p>${decoded}</p>`;
//   decoded = decoded.replace(/<p><\/p>/g, "");

//   // Table styling
//   decoded = decoded.replace(
//     /<table(.*?)>/g,
//     `<div class="overflow-auto rounded-xl shadow-sm border border-gray-200 my-6"><table class="w-full border-collapse" $1>`
//   );
//   decoded = decoded.replace(/<\/table>/g, "</table></div>");
//   decoded = decoded.replace(
//     /<thead>/g,
//     '<thead class="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-left text-sm">'
//   );
//   decoded = decoded.replace(
//     /<th>/g,
//     '<th class="px-4 py-3 font-medium whitespace-nowrap border-b border-blue-200 text-white text-sm">'
//   );
//   decoded = decoded.replace(/<tr>/g, '<tr class="even:bg-blue-50">');
//   decoded = decoded.replace(
//     /<td>(.*?)<\/td>/g,
//     '<td class="px-4 py-3 text-sm text-gray-800">$1</td>'
//   );

//   decoded = decoded.replace(
//     /<input[^>]*type=["']checkbox["'][^>]*>/gi,
//     `<span class="inline-block w-4 h-4 rounded border border-gray-400 mr-2 bg-white"></span>`
//   );

//   decoded = decoded.replace(
//     /<ul>/g,
//     '<ul class="list-disc pl-6 space-y-2 text-gray-800">'
//   );
//   decoded = decoded.replace(
//     /<ol>/g,
//     '<ol class="list-decimal pl-6 space-y-2 text-gray-800">'
//   );
//   decoded = decoded.replace(
//     /<li>/g,
//     '<li class="mb-1">'
//   );

//   return decoded;
// };

// export default function QualifiedLevelDetail() {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const [pageContent, setPageContent] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [seo, setSeo] = useState({});

//   const toggleExpanded = () => {
//     setIsExpanded((prev) => !prev);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await api.get(`/courses/${slug}`);
//         setPageContent(response.data?.pageContent || null);
//         setCategories(response.data?.categories || []);
//         setSeo(response.data?.seo || {});
//         console.log(response.data);
//       } catch (err) {
//         console.error("Failed to fetch course data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [slug]);

//   const handleNavigate = (slug) => {
//     navigate(`/course/${slug}`);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

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

//       <div className="bg-gray-100 min-h-screen py-10 px-4">
//         {/* Breadcrumb */}
//         <div className="max-w-6xl mx-auto mb-4">
//           <nav className="flex items-center space-x-2 text-sm text-gray-600">
//             <Link to="/" className="flex items-center hover:text-blue-600 transition">
//               <Home className="w-4 h-4" />
//             </Link>
//             <ChevronRight className="w-4 h-4 text-gray-400" />
//             <Link to="/courses" className="hover:text-blue-600 transition">
//               Courses
//             </Link>
//             <ChevronRight className="w-4 h-4 text-gray-400" />
//             <span className="text-gray-800 font-medium">
//               {pageContent?.heading || slug}
//             </span>
//           </nav>
//         </div>

//         <div className="max-w-6xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm mb-10">
//           {/* Header */}
//           <div className="flex items-start gap-4 mb-4">
//             <div className="relative">
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//                 <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                   <div className="w-4 h-4 bg-white rounded-full"></div>
//                 </div>
//               </div>
//               <CheckCircle className="w-5 h-5 text-green-500 absolute -top-1 -right-1 bg-white rounded-full" />
//             </div>
//             <div className="flex-1">
//               <h2 className="text-xl font-semibold text-gray-900 mb-1">
//                 {pageContent?.author?.name || "Team Education Malaysia"}
//               </h2>
//               <p className="text-sm text-gray-600">
//                 Updated on -{" "}
//                 {new Date(pageContent?.updated_at).toLocaleDateString("en-MY", {
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </p>
//             </div>
//           </div>

//           <h1 className="text-2xl font-bold text-gray-900 mb-4">
//             {pageContent?.heading}
//           </h1>

//           {/* Content with Show More/Less */}
//           <div
//             className={`transition-all duration-300 text-[15px] leading-relaxed relative ${
//               isExpanded ? "max-h-full" : "max-h-[300px] overflow-hidden"
//             }`}
//           >
//             <div
//               className="custom-html space-y-4"
//               dangerouslySetInnerHTML={{
//                 __html: formatHTML(pageContent?.description || ""),
//               }}
//             />
//             {/* Gradient overlay on mobile when collapsed */}
//             {!isExpanded && (
//               <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
//             )}
//           </div>

//           {pageContent?.description && (
//             <button
//               onClick={toggleExpanded}
//               className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
//             >
//               <span>{isExpanded ? "Show Less" : "Show More"}</span>
//               {isExpanded ? (
//                 <ChevronUp className="w-4 h-4" />
//               ) : (
//                 <ChevronDown className="w-4 h-4" />
//               )}
//             </button>
//           )}
//         </div>

//         {/* Categories List */}
//         <div className="space-y-6 max-w-5xl mx-auto">
//           {categories.length === 0 ? (
//             <p className="text-center text-gray-500">No categories found.</p>
//           ) : (
//             categories.map((card) => (
//               <div
//                 key={card.id}
//                 onClick={() => handleNavigate(card.slug)}
//                 className="bg-white w-full cursor-pointer transition-all rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-500"
//               >
//                 <div className="md:flex">
//                   <img
//                     src={
//                       card.thumbnail_path
//                         ? `https://www.educationmalaysia.in/storage/${card.thumbnail_path}`
//                         : "https://via.placeholder.com/300x200?text=Course"
//                     }
//                     alt={card.name}
//                     className="w-full md:w-1/3 object-cover h-64 md:h-72"
//                   />
//                   <div className="p-6 flex flex-col justify-center flex-1">
//                     <h3 className="text-xl font-semibold text-blue-700 mb-2">
//                       {card.name}
//                     </h3>
//                     <p className="text-gray-700 mb-3 text-sm leading-relaxed break-words">
//                       {card.shortnote || "No description available."}
//                     </p>

//                     {card.specializations?.length > 0 && (
//                       <div className="mt-3">
//                         <h4 className="text-sm font-semibold text-gray-800 mb-2">
//                           Specializations:
//                         </h4>
//                         <div className="flex flex-wrap gap-2">
//                           {card.specializations.map((spec) => (
//                             <span
//                               key={spec.id}
//                               className="text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition"
//                             >
//                               {spec.name}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Home,
  ChevronRight,
} from "lucide-react";
import api from "../../api";
import SEO from "../../components/SEO";
import SeoService from "../../utils/SeoService";

const formatHTML = (html) => {
  if (!html) return "";

  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  let decoded = textarea.value;

  decoded = decoded.replace(/<span[^>]*>/gi, "");
  decoded = decoded.replace(/<\/span>/gi, "");
  decoded = decoded.replace(/style="[^"]*"/gi, "");
  decoded = decoded.replace(/&nbsp;/gi, " ");

  // Fix headings with colons
  decoded = decoded.replace(
    /<h([1-6])[^>]*>([^<]*?)\s*:\s*<\/h\1>/gi,
    (_m, level, title) => {
      return `<h${level} class="text-xl font-bold mb-3 mt-6 text-gray-900">${title.trim()}</h${level}>`;
    },
  );

  decoded = decoded.replace(/<p>\s*:\s*/gi, "<p>");

  // Convert strong/b to proper h4 headings
  decoded = decoded.replace(
    /<strong>(.*?)<\/strong>/gi,
    `<h4 class="text-lg font-semibold mb-2 mt-4 text-gray-800">$1</h4>`,
  );
  decoded = decoded.replace(
    /<b>(.*?)<\/b>/gi,
    `<h4 class="text-lg font-semibold mb-2 mt-4 text-gray-800">$1</h4>`,
  );

  // Style h2 headings
  decoded = decoded.replace(
    /<h2>/gi,
    '<h2 class="text-xl font-bold mb-3 mt-6 text-gray-900">',
  );
  decoded = decoded.replace(
    /<h3>/gi,
    '<h3 class="text-lg font-semibold mb-2 mt-4 text-gray-800">',
  );

  // Style hyperlinks properly
  decoded = decoded.replace(
    /<a\s+href="([^"]*)"/gi,
    '<a href="$1" class="text-blue-600 hover:text-blue-800 underline font-medium"',
  );

  decoded = decoded.replace(/(?:\r\n|\r|\n)/g, "</p><p>");
  decoded = `<p>${decoded}</p>`;
  decoded = decoded.replace(/<p><\/p>/g, "");

  // ✅ FIXED: Table styling with INLINE CSS for guaranteed visibility
  decoded = decoded.replace(
    /<table(.*?)>/g,
    `<div class="overflow-auto rounded-xl shadow-sm border border-gray-200 my-6"><table class="w-full border-collapse" style="width: 100%;" $1>`,
  );
  decoded = decoded.replace(/<\/table>/g, "</table></div>");

  // ✅ FIXED: Dark blue background with inline styles - ALWAYS VISIBLE!
  decoded = decoded.replace(
    /<thead>/g,
    '<thead style="background: linear-gradient(to right, #1e40af, #1e3a8a); color: white;">',
  );

  // ✅ FIXED: White text on dark blue - crystal clear visibility!
  decoded = decoded.replace(
    /<th>/g,
    '<th style="padding: 12px 16px; font-weight: 600; color: white; text-align: left; border-bottom: 2px solid rgba(255,255,255,0.3); white-space: nowrap;">',
  );

  decoded = decoded.replace(
    /<tr>/g,
    '<tr style="transition: background-color 0.2s;">',
  );

  decoded = decoded.replace(
    /<td>(.*?)<\/td>/g,
    '<td style="padding: 12px 16px; font-size: 14px; color: #1f2937; border-bottom: 1px solid #e5e7eb;">$1</td>',
  );

  // Add hover effect to table rows via style tag
  const tableStyleTag = `<style>
    table tbody tr:hover {
      background-color: #eff6ff !important;
    }
    table tbody tr:nth-child(even) {
      background-color: #f9fafb;
    }
  </style>`;

  decoded = decoded.replace(
    /<input[^>]*type=["']checkbox["'][^>]*>/gi,
    `<span class="inline-block w-4 h-4 rounded border border-gray-400 mr-2 bg-white"></span>`,
  );

  decoded = decoded.replace(
    /<ul>/g,
    '<ul class="list-disc pl-6 space-y-2 text-gray-800">',
  );
  decoded = decoded.replace(
    /<ol>/g,
    '<ol class="list-decimal pl-6 space-y-2 text-gray-800">',
  );
  decoded = decoded.replace(/<li>/g, '<li class="mb-1">');

  return tableStyleTag + decoded;
};

export default function QualifiedLevelDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pageContent, setPageContent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seo, setSeo] = useState({});
  const [error, setError] = useState(null);

  // ✅ NEW: Mobile "Show More" functionality
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  // ✅ Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const response = await api.get(`/courses/${slug}`);
        setPageContent(response.data?.pageContent || null);
        setCategories(response.data?.categories || []);
        setSeo(response.data?.seo || {});
        console.log(response.data);
      } catch (err) {
        // Only log non-404 errors to console to reduce noise
        if (err.response?.status !== 404) {
          console.error("Failed to fetch course data:", err);
        }
        setError(
          err.response?.status === 404
            ? "Course not found. This course may not exist or has been removed."
            : "Failed to load course data. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleNavigate = (slug) => {
    navigate(`/course/${slug}`);
  };

  // ✅ Get visible categories - mobile mein sirf 4
  const getVisibleCategories = () => {
    if (!isMobile || showAllCategories) {
      return categories;
    }
    return categories.slice(0, 4);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/courses"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const visibleCategories = getVisibleCategories();
  const hasMoreCategories = isMobile && categories.length > 4;

  // ✅ Generate SEO data for course overview
  const courseData = {
    name: pageContent?.heading || slug,
    slug: slug,
    description: seo?.meta_description,
    seo: seo,
  };

  return (
    <>
      {/* ✅ Enhanced SEO Component with SeoService */}
      <SEO {...SeoService.generateCourseOverviewMeta(courseData)} />

      <div className="bg-gray-100 min-h-screen py-10 px-4">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto mb-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link
              to="/"
              className="flex items-center hover:text-blue-600 transition"
            >
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/courses" className="hover:text-blue-600 transition">
              Courses
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-800 font-medium">
              {pageContent?.heading || slug}
            </span>
          </nav>
        </div>

        <div className="max-w-6xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm mb-10">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500 absolute -top-1 -right-1 bg-white rounded-full" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {pageContent?.author?.name || "Team Education Malaysia"}
              </h2>
              <p className="text-sm text-gray-600">
                Updated on -{" "}
                {new Date(pageContent?.updated_at).toLocaleDateString("en-MY", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {pageContent?.heading}
          </h1>

          {/* Content with Show More/Less */}
          <div
            className={`transition-all duration-300 text-[15px] leading-relaxed relative ${
              isExpanded ? "max-h-full" : "max-h-[300px] overflow-hidden"
            }`}
          >
            <div
              className="custom-html space-y-4"
              dangerouslySetInnerHTML={{
                __html: formatHTML(pageContent?.description || ""),
              }}
            />
            {/* Gradient overlay when collapsed */}
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            )}
          </div>

          {pageContent?.description && (
            <button
              onClick={toggleExpanded}
              className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              <span>{isExpanded ? "Show Less" : "Show More"}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Categories List */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {categories.length === 0 ? (
            <p className="text-center text-gray-500">No categories found.</p>
          ) : (
            <>
              {visibleCategories.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleNavigate(card.slug)}
                  className="bg-white w-full cursor-pointer transition-all rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-500"
                >
                  <div className="md:flex">
                    <img
                      src={
                        card.thumbnail_path
                          ? `https://www.educationmalaysia.in/storage/${card.thumbnail_path}`
                          : "https://via.placeholder.com/300x200?text=Course"
                      }
                      alt={card.name}
                      className="w-full md:w-1/3 object-cover h-64 md:h-72"
                    />
                    <div className="p-6 flex flex-col justify-center flex-1">
                      <h3 className="text-xl font-semibold text-blue-700 mb-2">
                        {card.name}
                      </h3>
                      <p className="text-gray-700 mb-3 text-sm leading-relaxed break-words">
                        {card.shortnote || "No description available."}
                      </p>

                      {card.specializations?.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">
                            Specializations:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {card.specializations.map((spec) => (
                              <span
                                key={spec.id}
                                className="text-sm px-3 py-1 rounded-full border border-gray-300 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition"
                              >
                                {spec.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* ✅ Show More/Less Button (Mobile only) */}
              {hasMoreCategories && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    <span>
                      {showAllCategories
                        ? "Show Less"
                        : `Show More (${categories.length - 4} more)`}
                    </span>
                    {showAllCategories ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
