

// // import React, { useState, useEffect, useRef } from "react";
// // import { useParams, Link, useNavigate } from "react-router-dom";
// // import { FaMapMarkerAlt, FaGraduationCap } from "react-icons/fa";
// // import api from "../../api";
// // import { API_URL } from "../../config";
// // import HelpUniversityCourses from "./HelpUniversityCourses";
// // import PopularCourses from "./PopularCourses";

// // /* ============================================================
// //     FINAL CLEAN HTML FORMATTER (NO BLANK SPACE + FIXED TABLES)
// //    ============================================================ */
// // const formatHTML = (html) => {
// //   if (!html) return "";

// //   const textarea = document.createElement("textarea");
// //   textarea.innerHTML = html;
// //   let decoded = textarea.value;

// //   decoded = decoded.replace(/^<p[^>]*>.*?About.*?<\/p>/i, "");
// //   decoded = decoded.replace(/<span[^>]*>/gi, "");
// //   decoded = decoded.replace(/<\/span>/gi, "");
// //   decoded = decoded.replace(/style="[^"]*"/gi, "");
// //   decoded = decoded.replace(/&nbsp;/gi, " ");

// //   decoded = decoded.replace(
// //     /<p>\s*<(strong|b)>([^<]{5,})<\/\1>\s*<\/p>/gi,
// //     '<h3 class="text-lg font-bold text-gray-900 mb-3 mt-6">$2</h3>'
// //   );

// //   decoded = decoded.replace(
// //     /<(strong|b)>/gi,
// //     '<span class="font-semibold text-gray-900">'
// //   );
// //   decoded = decoded.replace(/<\/(strong|b)>/gi, "</span>");

// //   decoded = decoded.replace(
// //     /<p>/gi,
// //     '<p class="text-sm text-gray-700 leading-relaxed mb-4">'
// //   );

// //   decoded = decoded.replace(/<p[^>]*>\s*<\/p>/gi, "");

// //   decoded = decoded.replace(
// //     /<table[^>]*>/gi,
// //     `<div class="overflow-auto rounded-xl shadow-md border border-gray-200 my-6">
// //       <table class="w-full border-collapse text-sm">`
// //   );
// //   decoded = decoded.replace(/<\/table>/gi, "</table></div>");

// //   decoded = decoded.replace(
// //     /<thead[^>]*>/gi,
// //     `<thead class="bg-blue-600 text-white">`
// //   );

// //   decoded = decoded.replace(
// //     /<tr[^>]*>(\s*<th[\s\S]*?<\/tr>)/i,
// //     `<tr class="bg-blue-600 text-white">$1`
// //   );

// //   decoded = decoded.replace(
// //     /<tbody[^>]*>/gi,
// //     `<tbody class="text-gray-800">`
// //   );

// //   decoded = decoded.replace(
// //     /<th[^>]*>/gi,
// //     `<th class="px-4 py-3 border-b border-gray-200 text-left font-semibold whitespace-nowrap">`
// //   );

// //   decoded = decoded.replace(
// //     /<tr[^>]*>/gi,
// //     `<tr class="even:bg-blue-50">`
// //   );

// //   decoded = decoded.replace(
// //     /<td[^>]*>/gi,
// //     `<td class="px-4 py-3 border-b border-gray-100">`
// //   );

// //   decoded = decoded.replace(
// //     /<input[^>]*type=["']checkbox["'][^>]*>/gi,
// //     `<span class="inline-block w-4 h-4 rounded border border-gray-400 mr-2 bg-white"></span>`
// //   );

// //   decoded = decoded.replace(
// //     /<ul>/gi,
// //     '<ul class="list-disc pl-6 space-y-2 text-gray-800 mb-4">'
// //   );
// //   decoded = decoded.replace(
// //     /<ol>/gi,
// //     '<ol class="list-decimal pl-6 space-y-2 text-gray-800 mb-4">'
// //   );
// //   decoded = decoded.replace(/<li>/gi, '<li class="mb-1 text-sm">');

// //   return decoded;
// // };

// // const hasValidContent = (description) => {
// //   if (!description) return false;
// //   const stripped = description
// //     .replace(/<[^>]*>/g, "")
// //     .replace(/&nbsp;/g, " ")
// //     .trim();
// //   return stripped.length >= 15;
// // };

// // /* ============================================================
// //     MAIN OVERVIEW COMPONENT
// //    ============================================================ */
// // const Overview = () => {
// //   const { slug } = useParams();
// //   const navigate = useNavigate();
// //   const [overviewData, setOverviewData] = useState([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const sectionRefs = useRef([]);
// //   const formRef = useRef(null);

// //   useEffect(() => {
// //     const fetchUniversityOverview = async () => {
// //       try {
// //         const response = await api.get(`/university-overview/${slug}`);
// //         const overviews = response.data?.data?.overviews || [];
// //         setOverviewData(overviews);
// //       } catch (error) {
// //         console.error("Error fetching overview:", error);
// //         setOverviewData([]);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     if (slug) fetchUniversityOverview();
// //   }, [slug]);

// //   const validSections = overviewData.filter((section) => {
// //     const hasTitle = section.title?.trim() !== "";
// //     const hasDesc = hasValidContent(section.description);
// //     const hasImage = section.thumbnail_path?.trim() !== "";
// //     return hasTitle && (hasDesc || hasImage);
// //   });

// //   // Smooth scroll to section
// //   const scrollToSection = (index) => {
// //     const element = sectionRefs.current[index];
// //     if (element) {
// //       const yOffset = -100;
// //       const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
// //       window.scrollTo({ top: y, behavior: 'smooth' });
// //     }
// //   };

// //   // Scroll to Get In Touch form
// //   const scrollToForm = () => {
// //     if (formRef.current) {
// //       const yOffset = -100;
// //       const y = formRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
// //       window.scrollTo({ top: y, behavior: 'smooth' });
// //     }
// //   };

// //   // Navigate to signup
// //   const handleApplyHere = () => {
// //     navigate('/signup?program_id=3&redirect=courses');
// //   };

// //   if (isLoading) {
// //     return (
// //       <div className="flex items-center justify-center p-10">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
// //           <p className="text-gray-600">Loading overview...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-1 px-1 md:px-0 py-8 text-black bg-white">
// //       {/* First Section - Introduction (if exists) */}
// //       {validSections.length > 0 && validSections[0] && (
// //         <div 
// //           ref={(el) => (sectionRefs.current[0] = el)}
// //           className="space-y-6 scroll-mt-24 mb-8"
// //         >
// //           <div className="border-l-4 border-blue-600 pl-4">
// //             <h2 className="text-2xl font-bold text-blue-900">
// //               {validSections[0].title}
// //             </h2>
// //           </div>

// //           {validSections[0].thumbnail_path && (
// //             <div className="w-full overflow-hidden rounded-xl shadow-lg">
// //               <img
// //                 src={
// //                   "https://www.educationmalaysia.in/storage/" +
// //                   validSections[0].thumbnail_path
// //                     .replace(/^storage\//, "")
// //                     .replace(/^public\//, "")
// //                     .replace(/^\//, "")
// //                 }
// //                 alt={validSections[0].title}
// //                 className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-300"
// //                 onError={(e) => {
// //                   console.log("IMAGE FAILED:", validSections[0].thumbnail_path);
// //                   e.target.src = "https://www.educationmalaysia.in/storage/default-image.jpg";
// //                 }}
// //               />
// //             </div>
// //           )}

// //           {hasValidContent(validSections[0].description) && (
// //             <div
// //               className="space-y-6 text-base leading-relaxed"
// //               dangerouslySetInnerHTML={{
// //                 __html: formatHTML(validSections[0].description),
// //               }}
// //             />
// //           )}
// //         </div>
// //       )}

// //       {/* Table of Contents */}
// //       {validSections.length > 0 && (
// //         <div className="bg-gray-50 rounded-lg p-6 mb-8 shadow-sm">
// //           <h2 className="text-xl font-bold text-blue-900 mb-4 border-l-4 border-blue-600 pl-3">
// //             Table of Content
// //           </h2>
// //           <ol className="space-y-2 list-decimal list-inside">
// //             {validSections.map((section, index) => (
// //               <li 
// //                 key={index}
// //                 className="text-blue-700 hover:text-blue-900 cursor-pointer transition-colors duration-200 text-sm font-medium"
// //                 onClick={() => scrollToSection(index)}
// //               >
// //                 <span className="hover:underline text-black">
// //                   {section.title}
// //                 </span>
// //               </li>
// //             ))}
// //           </ol>
// //         </div>
// //       )}

// //       {/* Apply Here and Enquire Now Buttons - OUTSIDE TABLE */}
// //       {validSections.length > 0 && (
// //         <div className="flex flex-wrap gap-4 justify-center mb-8">
// //           <button 
// //             onClick={handleApplyHere}
// //             className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-200"
// //           >
// //             APPLY HERE
// //           </button>
// //           <button 
// //             onClick={scrollToForm}
// //             className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-200"
// //           >
// //             ENQUIRE NOW
// //           </button>
// //         </div>
// //       )}

// //       {/* Remaining Content Sections (starting from index 1) */}
// //       {validSections.length > 1 ? (
// //         validSections.slice(1).map((section, index) => (
// //           <div 
// //             key={index + 1} 
// //             ref={(el) => (sectionRefs.current[index + 1] = el)}
// //             className="space-y-6 scroll-mt-24"
// //           >
// //             <div className="border-l-4 border-blue-600 pl-4">
// //               <h2 className="text-2xl font-bold text-blue-900">
// //                 {section.title}
// //               </h2>
// //             </div>

// //             {section.thumbnail_path && (
// //               <div className="w-full overflow-hidden rounded-xl shadow-lg">
// //                 <img
// //                   src={
// //                     "https://www.educationmalaysia.in/storage/" +
// //                     section.thumbnail_path
// //                       .replace(/^storage\//, "")
// //                       .replace(/^public\//, "")
// //                       .replace(/^\//, "")
// //                   }
// //                   alt={section.title}
// //                   className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-300"
// //                   onError={(e) => {
// //                     console.log("IMAGE FAILED:", section.thumbnail_path);
// //                     e.target.src = "https://www.educationmalaysia.in/storage/default-image.jpg";
// //                   }}
// //                 />
// //               </div>
// //             )}

// //             {hasValidContent(section.description) && (
// //               <div
// //                 className="space-y-6 text-base leading-relaxed"
// //                 dangerouslySetInnerHTML={{
// //                   __html: formatHTML(section.description),
// //                 }}
// //               />
// //             )}
// //           </div>
// //         ))
// //       ) : (
// //         <div className="text-center py-10">
// //           <div className="p-6 bg-gray-50 rounded-lg inline-block">
// //             <p className="text-gray-500 text-lg mb-2">
// //               📄 No overview available
// //             </p>
// //             <p className="text-gray-400 text-sm">
// //               Content will be updated soon
// //             </p>
// //           </div>
// //         </div>
// //       )}

// //       {/* Get in Touch Form - with ref for scrolling */}
// //       <div ref={formRef}>
// //         <HelpUniversityCourses />
// //       </div>

// //       {/* Popular Courses */}
// //       <PopularCourses />
// //     </div>
// //   );
// // };

// // export default Overview;

// import React, { useState, useEffect, useRef } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { FaMapMarkerAlt, FaGraduationCap } from "react-icons/fa";
// import api from "../../api";
// import { API_URL } from "../../config";
// import HelpUniversityCourses from "./HelpUniversityCourses";
// import PopularCourses from "./PopularCourses";

// /* ============================================================
//     FINAL CLEAN HTML FORMATTER (NO BLANK SPACE + FIXED TABLES)
//    ============================================================ */
// const formatHTML = (html) => {
//   if (!html) return "";

//   const textarea = document.createElement("textarea");
//   textarea.innerHTML = html;
//   let decoded = textarea.value;

//   decoded = decoded.replace(/^<p[^>]*>.*?About.*?<\/p>/i, "");
//   decoded = decoded.replace(/<span[^>]*>/gi, "");
//   decoded = decoded.replace(/<\/span>/gi, "");
//   decoded = decoded.replace(/style="[^"]*"/gi, "");
//   decoded = decoded.replace(/&nbsp;/gi, " ");

//   decoded = decoded.replace(
//     /<p>\s*<(strong|b)>([^<]{5,})<\/\1>\s*<\/p>/gi,
//     '<h3 class="text-lg font-bold text-gray-900 mb-3 mt-6">$2</h3>'
//   );

//   decoded = decoded.replace(
//     /<(strong|b)>/gi,
//     '<span class="font-semibold text-gray-900">'
//   );
//   decoded = decoded.replace(/<\/(strong|b)>/gi, "</span>");

//   decoded = decoded.replace(
//     /<p>/gi,
//     '<p class="text-sm text-gray-700 leading-relaxed mb-4">'
//   );

//   decoded = decoded.replace(/<p[^>]*>\s*<\/p>/gi, "");

//   decoded = decoded.replace(
//     /<table[^>]*>/gi,
//     `<div class="overflow-auto rounded-xl shadow-md border border-gray-200 my-6">
//       <table class="w-full border-collapse text-sm">`
//   );
//   decoded = decoded.replace(/<\/table>/gi, "</table></div>");

//   decoded = decoded.replace(
//     /<thead[^>]*>/gi,
//     `<thead class="bg-blue-600 text-white">`
//   );

//   decoded = decoded.replace(
//     /<tr[^>]*>(\s*<th[\s\S]*?<\/tr>)/i,
//     `<tr class="bg-blue-600 text-white">$1`
//   );

//   decoded = decoded.replace(
//     /<tbody[^>]*>/gi,
//     `<tbody class="text-gray-800">`
//   );

//   decoded = decoded.replace(
//     /<th[^>]*>/gi,
//     `<th class="px-4 py-3 border-b border-gray-200 text-left font-semibold whitespace-nowrap">`
//   );

//   decoded = decoded.replace(
//     /<tr[^>]*>/gi,
//     `<tr class="even:bg-blue-50">`
//   );

//   decoded = decoded.replace(
//     /<td[^>]*>/gi,
//     `<td class="px-4 py-3 border-b border-gray-100">`
//   );

//   decoded = decoded.replace(
//     /<input[^>]*type=["']checkbox["'][^>]*>/gi,
//     `<span class="inline-block w-4 h-4 rounded border border-gray-400 mr-2 bg-white"></span>`
//   );

//   decoded = decoded.replace(
//     /<ul>/gi,
//     '<ul class="list-disc pl-6 space-y-2 text-gray-800 mb-4">'
//   );
//   decoded = decoded.replace(
//     /<ol>/gi,
//     '<ol class="list-decimal pl-6 space-y-2 text-gray-800 mb-4">'
//   );
//   decoded = decoded.replace(/<li>/gi, '<li class="mb-1 text-sm">');

//   return decoded;
// };

// const hasValidContent = (description) => {
//   if (!description) return false;
//   const stripped = description
//     .replace(/<[^>]*>/g, "")
//     .replace(/&nbsp;/g, " ")
//     .trim();
//   return stripped.length >= 15;
// };

// // Helper function to create URL-friendly slug from title
// const createSlug = (title) => {
//   return title
//     .toLowerCase()
//     .trim()
//     .replace(/[^\w\s-]/g, '') // Remove special characters
//     .replace(/\s+/g, '-')      // Replace spaces with hyphens
//     .replace(/-+/g, '-');      // Replace multiple hyphens with single
// };

// /* ============================================================
//     MAIN OVERVIEW COMPONENT
//    ============================================================ */
// const Overview = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const [overviewData, setOverviewData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const sectionRefs = useRef([]);
//   const formRef = useRef(null);

//   useEffect(() => {
//     const fetchUniversityOverview = async () => {
//       try {
//         const response = await api.get(`/university-overview/${slug}`);
//         const overviews = response.data?.data?.overviews || [];
//         setOverviewData(overviews);
//       } catch (error) {
//         console.error("Error fetching overview:", error);
//         setOverviewData([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (slug) fetchUniversityOverview();
//   }, [slug]);

//   const validSections = overviewData.filter((section) => {
//     const hasTitle = section.title?.trim() !== "";
//     const hasDesc = hasValidContent(section.description);

//     // Check if image path is valid (not default-image.jpg or empty)
//     const hasValidImage = section.thumbnail_path?.trim() !== "" && 
//                          !section.thumbnail_path.includes('default-image.jpg') &&
//                          !section.thumbnail_path.includes('default.jpg');

//     return hasTitle && (hasDesc || hasValidImage);
//   });

//   // Smooth scroll to section with URL hash update
//   const scrollToSection = (index, sectionSlug) => {
//     const element = sectionRefs.current[index];
//     if (element) {
//       // Update URL hash
//       window.history.pushState(null, '', `#${sectionSlug}`);

//       const yOffset = -100;
//       const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
//       window.scrollTo({ top: y, behavior: 'smooth' });
//     }
//   };

//   // Scroll to Get In Touch form
//   const scrollToForm = () => {
//     if (formRef.current) {
//       const yOffset = -100;
//       const y = formRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
//       window.scrollTo({ top: y, behavior: 'smooth' });
//     }
//   };

//   // Navigate to signup
//   const handleApplyHere = () => {
//     navigate('/signup?program_id=3&redirect=courses');
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center p-10">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
//           <p className="text-gray-600">Loading overview...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-1 px-1 md:px-0 py-8 text-black bg-white">
//       {/* First Section - Introduction (if exists) */}
//       {validSections.length > 0 && validSections[0] && (
//         <div 
//           id={createSlug(validSections[0].title)}
//           ref={(el) => (sectionRefs.current[0] = el)}
//           className="space-y-6 scroll-mt-24 mb-8"
//         >
//           <div className="border-l-4 border-blue-600 pl-4">
//             <h2 className="text-2xl font-bold text-blue-900">
//               {validSections[0].title}
//             </h2>
//           </div>

//           {validSections[0].thumbnail_path && 
//            !validSections[0].thumbnail_path.includes('default-image.jpg') &&
//            !validSections[0].thumbnail_path.includes('default.jpg') && (
//             <div className="w-full overflow-hidden rounded-xl shadow-lg">
//               <img
//                 src={
//                   "https://www.educationmalaysia.in/storage/" +
//                   validSections[0].thumbnail_path
//                     .replace(/^storage\//, "")
//                     .replace(/^public\//, "")
//                     .replace(/^\//, "")
//                 }
//                 alt={validSections[0].title}
//                 className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-300"
//                 onError={(e) => {
//                   console.log("IMAGE FAILED:", validSections[0].thumbnail_path);
//                   e.target.style.display = 'none';
//                   e.target.parentElement.style.display = 'none';
//                 }}
//               />
//             </div>
//           )}

//           {hasValidContent(validSections[0].description) && (
//             <div
//               className="space-y-6 text-base leading-relaxed"
//               dangerouslySetInnerHTML={{
//                 __html: formatHTML(validSections[0].description),
//               }}
//             />
//           )}
//         </div>
//       )}

//       {/* Table of Contents - Only show if more than 1 section */}
//       {validSections.length > 1 && (
//         <div className="bg-gray-50 rounded-lg p-6 mb-8 shadow-sm">
//           <h2 className="text-xl font-bold text-blue-900 mb-4 border-l-4 border-blue-600 pl-3">
//             Table of Content
//           </h2>
//           <ol className="space-y-2 list-decimal list-inside">
//             {validSections.map((section, index) => {
//               const sectionSlug = createSlug(section.title);
//               return (
//                 <li 
//                   key={index}
//                   className="text-blue-700 hover:text-blue-900 cursor-pointer transition-colors duration-200 text-sm font-medium"
//                   onClick={() => scrollToSection(index, sectionSlug)}
//                 >
//                   <span className="hover:underline text-black">
//                     {section.title}
//                   </span>
//                 </li>
//               );
//             })}
//           </ol>
//         </div>
//       )}

//       {/* Apply Here and Enquire Now Buttons */}
//       {validSections.length > 1 && (
//         <div className="flex flex-wrap gap-4 justify-center mb-8">
//           <button 
//             onClick={handleApplyHere}
//             className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-200"
//           >
//             APPLY HERE
//           </button>
//           <button 
//             onClick={scrollToForm}
//             className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-200"
//           >
//             ENQUIRE NOW
//           </button>
//         </div>
//       )}

//       {/* Remaining Content Sections (starting from index 1) */}
//       {validSections.length > 1 ? (
//         validSections.slice(1).map((section, index) => {
//           const sectionSlug = createSlug(section.title);
//           return (
//             <div 
//               key={index + 1}
//               id={sectionSlug}
//               ref={(el) => (sectionRefs.current[index + 1] = el)}
//               className="space-y-6 scroll-mt-24"
//             >
//               <div className="border-l-4 border-blue-600 pl-4">
//                 <h2 className="text-2xl font-bold text-blue-900">
//                   {section.title}
//                 </h2>
//               </div>

//               {section.thumbnail_path && 
//                !section.thumbnail_path.includes('default-image.jpg') &&
//                !section.thumbnail_path.includes('default.jpg') && (
//                 <div className="w-full overflow-hidden rounded-xl shadow-lg">
//                   <img
//                     src={
//                       "https://www.educationmalaysia.in/storage/" +
//                       section.thumbnail_path
//                         .replace(/^storage\//, "")
//                         .replace(/^public\//, "")
//                         .replace(/^\//, "")
//                     }
//                     alt={section.title}
//                     className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-300"
//                     onError={(e) => {
//                       console.log("IMAGE FAILED:", section.thumbnail_path);
//                       e.target.style.display = 'none';
//                       e.target.parentElement.style.display = 'none';
//                     }}
//                   />
//                 </div>
//               )}

//               {hasValidContent(section.description) && (
//                 <div
//                   className="space-y-6 text-base leading-relaxed"
//                   dangerouslySetInnerHTML={{
//                     __html: formatHTML(section.description),
//                   }}
//                 />
//               )}
//             </div>
//           );
//         })
//       ) : (
//         <div className="text-center py-10">
//           <div className="p-6 bg-gray-50 rounded-lg inline-block">
//             <p className="text-gray-500 text-lg mb-2">
//               📄 No overview available
//             </p>
//             <p className="text-gray-400 text-sm">
//               Content will be updated soon
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Get in Touch Form - with ref for scrolling */}
//       <div ref={formRef}>
//         <HelpUniversityCourses />
//       </div>

//       {/* Popular Courses */}
//       <PopularCourses />
//     </div>
//   );
// };

// export default Overview;
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaGraduationCap } from "react-icons/fa";
import api from "../../api";
import { API_URL } from "../../config";
import HelpUniversityCourses from "./HelpUniversityCourses";
import PopularCourses from "./PopularCourses";

/* ============================================================
    FINAL CLEAN HTML FORMATTER (NO BLANK SPACE + FIXED TABLES)
   ============================================================ */
const formatHTML = (html) => {
  if (!html) return "";

  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  let decoded = textarea.value;

  decoded = decoded.replace(/^<p[^>]*>.*?About.*?<\/p>/i, "");
  decoded = decoded.replace(/<span[^>]*>/gi, "");
  decoded = decoded.replace(/<\/span>/gi, "");
  decoded = decoded.replace(/style="[^"]*"/gi, "");
  decoded = decoded.replace(/&nbsp;/gi, " ");

  decoded = decoded.replace(
    /<p>\s*<(strong|b)>([^<]{5,})<\/\1>\s*<\/p>/gi,
    '<h3 class="text-lg font-bold text-gray-900 mb-3 mt-6">$2</h3>'
  );

  decoded = decoded.replace(
    /<(strong|b)>/gi,
    '<span class="font-semibold text-gray-900">'
  );
  decoded = decoded.replace(/<\/(strong|b)>/gi, "</span>");

  decoded = decoded.replace(
    /<p>/gi,
    '<p class="text-sm text-gray-700 leading-relaxed mb-4">'
  );

  decoded = decoded.replace(/<p[^>]*>\s*<\/p>/gi, "");

  decoded = decoded.replace(
    /<table[^>]*>/gi,
    `<div class="overflow-auto rounded-xl shadow-md border border-gray-200 my-6">
      <table class="w-full border-collapse text-sm">`
  );
  decoded = decoded.replace(/<\/table>/gi, "</table></div>");

  decoded = decoded.replace(
    /<thead[^>]*>/gi,
    `<thead class="bg-blue-600 text-white">`
  );

  decoded = decoded.replace(
    /<tr[^>]*>(\s*<th[\s\S]*?<\/tr>)/i,
    `<tr class="bg-blue-600 text-white">$1`
  );

  decoded = decoded.replace(
    /<tbody[^>]*>/gi,
    `<tbody class="text-gray-800">`
  );

  decoded = decoded.replace(
    /<th[^>]*>/gi,
    `<th class="px-4 py-3 border-b border-gray-200 text-left font-semibold whitespace-nowrap">`
  );

  decoded = decoded.replace(
    /<tr[^>]*>/gi,
    `<tr class="even:bg-blue-50">`
  );

  decoded = decoded.replace(
    /<td[^>]*>/gi,
    `<td class="px-4 py-3 border-b border-gray-100">`
  );

  decoded = decoded.replace(
    /<input[^>]*type=["']checkbox["'][^>]*>/gi,
    `<span class="inline-block w-4 h-4 rounded border border-gray-400 mr-2 bg-white"></span>`
  );

  decoded = decoded.replace(
    /<ul>/gi,
    '<ul class="list-disc pl-6 space-y-2 text-gray-800 mb-4">'
  );
  decoded = decoded.replace(
    /<ol>/gi,
    '<ol class="list-decimal pl-6 space-y-2 text-gray-800 mb-4">'
  );
  decoded = decoded.replace(/<li>/gi, '<li class="mb-1 text-sm">');

  return decoded;
};

const hasValidContent = (description) => {
  if (!description) return false;
  const stripped = description
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return stripped.length >= 15;
};

// Helper function to create URL-friendly slug from title
const createSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-');      // Replace multiple hyphens with single
};

/* ============================================================
    MAIN OVERVIEW COMPONENT
   ============================================================ */
const Overview = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [overviewData, setOverviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRefs = useRef([]);
  const formRef = useRef(null);

  useEffect(() => {
    const fetchUniversityOverview = async () => {
      try {
        const response = await api.get(`/university-overview/${slug}`);
        const overviews = response.data?.data?.overviews || [];
        setOverviewData(overviews);
      } catch (error) {
        console.error("Error fetching overview:", error);
        setOverviewData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchUniversityOverview();
  }, [slug]);

  const validSections = overviewData.filter((section) => {
    const hasTitle = section?.title?.trim() !== "";
    const hasDesc = hasValidContent(section?.description);

    // ✅ FIX: NULL CHECK ADD KIYA
    const hasValidImage =
      section?.thumbnail_path &&
      section.thumbnail_path.trim() !== "" &&
      !section.thumbnail_path.includes('default-image.jpg') &&
      !section.thumbnail_path.includes('default.jpg');

    return hasTitle && (hasDesc || hasValidImage);
  });

  // Smooth scroll to section with URL hash update
  const scrollToSection = (index, sectionSlug) => {
    const element = sectionRefs.current[index];
    if (element) {
      // Update URL hash
      window.history.pushState(null, '', `#${sectionSlug}`);

      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Scroll to Get In Touch form
  const scrollToForm = () => {
    if (formRef.current) {
      const yOffset = -100;
      const y = formRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Navigate to signup
  const handleApplyHere = () => {
    navigate('/signup?program_id=3&redirect=courses');
  };

  // ✅ FIX: Image rendering helper function with null checks
  const renderSectionImage = (section) => {
    if (!section?.thumbnail_path) return null;

    // Check for default images
    if (section.thumbnail_path.includes('default-image.jpg') ||
      section.thumbnail_path.includes('default.jpg')) {
      return null;
    }

    const imagePath = "https://www.educationmalaysia.in/storage/" +
      section.thumbnail_path
        .replace(/^storage\//, "")
        .replace(/^public\//, "")
        .replace(/^\//, "");

    return (
      <div className="w-full overflow-hidden rounded-xl shadow-lg">
        <img
          src={imagePath}
          alt={section.title || 'University image'}
          className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            console.log("IMAGE FAILED:", section.thumbnail_path);
            e.target.style.display = 'none';
            e.target.parentElement.style.display = 'none';
          }}
        />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading overview...</p>
        </div>
      </div>
    );
  }

  // ✅ FIX: Agar koi valid section nahi hai
  if (validSections.length === 0) {
    return (
      <div className="space-y-1 px-1 md:px-0 py-4 text-black bg-white">
        <div className="text-center py-10">
          <div className="p-6 bg-gray-50 rounded-lg inline-block">
            <p className="text-gray-500 text-lg mb-2">
              📄 No overview available
            </p>
            <p className="text-gray-400 text-sm">
              Content will be updated soon
            </p>
          </div>
        </div>

        {/* Still show forms even if no overview */}
        <div ref={formRef}>
          <HelpUniversityCourses />
        </div>
        <PopularCourses />
      </div>
    );
  }

  return (
    <div className="space-y-1 px-1 md:px-0 py-4 text-black bg-white">
      {/* First Section - Introduction */}
      {validSections[0] && (
        <div
          id={createSlug(validSections[0].title)}
          ref={(el) => (sectionRefs.current[0] = el)}
          className="space-y-6 scroll-mt-24 mb-8"
        >
          <div className="border-l-4 border-blue-600 pl-4">
            <h2 className="text-2xl font-bold text-blue-900">
              {validSections[0].title}
            </h2>
          </div>

          {renderSectionImage(validSections[0])}

          {hasValidContent(validSections[0].description) && (
            <div
              className="space-y-2 text-base leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: formatHTML(validSections[0].description),
              }}
            />
          )}
        </div>
      )}

      {/* Table of Contents - Only show if more than 1 section */}
      {validSections.length > 1 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-4 my-3 sm:my-4 shadow-sm border border-blue-100">
          <h2 className="text-sm sm:text-base font-bold text-blue-900 mb-2 sm:mb-3 border-l-3 border-blue-600 pl-2">
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
            {validSections.map((section, index) => {
              const sectionSlug = createSlug(section.title);
              return (
                <div
                  key={index}
                  onClick={() => scrollToSection(index, sectionSlug)}
                  className="flex items-center gap-2 bg-white rounded-md p-2 sm:p-2.5 cursor-pointer hover:bg-blue-50 hover:shadow-sm transition-all duration-200 group border border-gray-100 hover:border-blue-200"
                >
                  <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold group-hover:bg-blue-700 transition-colors">
                    {index + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-700 font-medium group-hover:text-blue-700 transition-colors line-clamp-1">
                    {section.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Apply Here and Enquire Now Buttons */}
      {validSections.length > 1 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 px-4 sm:px-0 mb-8 max-w-md mx-auto">
          <button
            onClick={handleApplyHere}
            className="w-full px-4 sm:px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-200 text-sm sm:text-base"
          >
            APPLY HERE
          </button>
          <button
            onClick={scrollToForm}
            className="w-full px-4 sm:px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-200 text-sm sm:text-base"
          >
            ENQUIRE NOW
          </button>
        </div>
      )}

      {/* Remaining Content Sections (starting from index 1) */}
      {validSections.length > 1 && (
        validSections.slice(1).map((section, index) => {
          const sectionSlug = createSlug(section.title);
          return (
            <div
              key={index + 1}
              id={sectionSlug}
              ref={(el) => (sectionRefs.current[index + 1] = el)}
              className="space-y-6 scroll-mt-24"
            >
              <div className="border-l-4 border-blue-600 pl-4">
                <h2 className="text-2xl font-bold text-blue-900">
                  {section.title}
                </h2>
              </div>

              {renderSectionImage(section)}

              {hasValidContent(section.description) && (
                <div
                  className="space-y-6 text-base leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: formatHTML(section.description),
                  }}
                />
              )}
            </div>
          );
        })
      )}

      {/* Get in Touch Form - with ref for scrolling */}
      <div ref={formRef}>
        <HelpUniversityCourses />
      </div>

      {/* Popular Courses */}
      <PopularCourses />
    </div>
  );
};

export default Overview;