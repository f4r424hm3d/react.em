// import React from "react";
// import {
//   FaUserEdit, FaFileAlt, FaUniversity, FaFileSignature, FaChalkboardTeacher,
//   FaMoneyCheckAlt, FaGlobeAsia, FaPlane, FaFileInvoice,
//   FaCertificate, FaGraduationCap, FaUserGraduate, FaGlasses
// } from "react-icons/fa";
// import { FaArrowRight } from "react-icons/fa";

// const leftServices = [
//   { title: "Register", sub: "Yourself", icon: <FaUserEdit />, link: "/register" },
//   { title: "Document", sub: "Counselling", icon: <FaFileAlt />, link: "/document-counselling" },
//   { title: "Entrance", sub: "Test", icon: <FaFileInvoice />, link: "/entrance-test" },
//   { title: "University", sub: "Shortlist", icon: <FaUniversity />, link: "/university-shortlist" },
//   { title: "Preparing", sub: "Docs", icon: <FaFileSignature />, link: "/preparing-documentation" },
//   { title: "Application", sub: "Guidance", icon: <FaChalkboardTeacher />, link: "/application-guidance" },
//   { title: "Financial", sub: "Docs", icon: <FaMoneyCheckAlt />, link: "/financial-documentation" },
//   { title: "VISA", sub: "Application", icon: <FaGlobeAsia />, link: "/visa-application" },
//   { title: "Post", sub: "Visa Help", icon: <FaPlane />, link: "/post-visa" },
// ];

// const rightCourses = [
//   { label: "Certificate", icon: <FaCertificate />, link: "/courses/certificate" },
//   { label: "Pre University", icon: <FaUserGraduate />, link: "/courses/pre-university" },
//   { label: "Diploma", icon: <FaGraduationCap />, link: "/courses/diploma" },
//   { label: "Under Graduate", icon: <FaGraduationCap />, link: "/courses/under-graduate" },
//   { label: "Post Graduate", icon: <FaUserGraduate />, link: "/courses/post-graduate" },
//   { label: "P.hd", icon: <FaGlasses />, link: "/courses/phd" },
// ];

// const CounsellorSupport = () => {
//   return (
//     <section className="bg-white px-4 py-12 md:px-10 lg:px-20">
//       <div className="flex flex-col lg:flex-row gap-10">
//         {/* Left Side */}
//         <div className="flex-[1.2]">
//           <h2 className="text-3xl font-bold mb-8 leading-tight">
//             How Our <span className="text-blue-600">Academic Counsellor</span> Can Help You Get Admission in Malaysia
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//             {leftServices.map((item, index) => (
//               <a
//                 key={index}
//                 href={item.link}
//                 className="group bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
//               >
//                 <div className="flex flex-col items-center text-center">
//                   <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl mb-2 shadow-md group-hover:scale-105 transition-all">
//                     {item.icon}
//                   </div>
//                   <p className="text-[15px] font-bold text-gray-800 group-hover:text-blue-700">{item.title}</p>
//                   <p className="text-sm text-gray-500 group-hover:text-blue-600">{item.sub}</p>
//                 </div>
//               </a>
//             ))}
//           </div>

//           {/* Button */}
//           <div className="mt-8">
//             <a
//               href="/talk-to-counsellor"
//               className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold transition hover:scale-105"
//             >
//               TALK TO COUNSELLOR
//             </a>
//           </div>
//         </div>

//         {/* Right Side */}
//         <div className="flex-1 bg-gray-50 p-6 rounded-2xl shadow-inner">
//           <h3 className="text-2xl font-semibold mb-6">
//             Study in <span className="text-blue-600">Malaysia Courses</span>
//           </h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             {rightCourses.map((item, idx) => (
//               <a
//                 key={idx}
//                 href={item.link}
//                 className="group bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
//               >
//                 <div className="flex flex-col items-center text-center">
//                   <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl mb-2 shadow-md group-hover:scale-105 transition-all">
//                     {item.icon}
//                   </div>
//                   <p className="text-base font-semibold text-gray-800 group-hover:text-blue-700">
//                     {item.label}
//                   </p>
//                 </div>
//               </a>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CounsellorSupport;

import React from "react";
import {
  FaUserEdit,
  FaFileAlt,
  FaUniversity,
  FaFileSignature,
  FaChalkboardTeacher,
  FaMoneyCheckAlt,
  FaGlobeAsia,
  FaPlane,
  FaFileInvoice,
  FaCertificate,
  FaGraduationCap,
  FaUserGraduate,
  FaGlasses,
} from "react-icons/fa";

const CounsellorSupport = ({ servicesData, coursesData }) => {
  // Fallback static data (in case API data not passed)
  const leftServices =
    servicesData ||
    [
      { title: "Register", sub: "Yourself", icon: <FaUserEdit />, link: "/register" },
      { title: "Document", sub: "Counselling", icon: <FaFileAlt />, link: "/document-counselling" },
      { title: "Entrance", sub: "Test", icon: <FaFileInvoice />, link: "/entrance-test" },
      { title: "University", sub: "Shortlist", icon: <FaUniversity />, link: "/university-shortlist" },
      { title: "Preparing", sub: "Docs", icon: <FaFileSignature />, link: "/preparing-documentation" },
      { title: "Application", sub: "Guidance", icon: <FaChalkboardTeacher />, link: "/application-guidance" },
      { title: "Financial", sub: "Docs", icon: <FaMoneyCheckAlt />, link: "/financial-documentation" },
      { title: "VISA", sub: "Application", icon: <FaGlobeAsia />, link: "/visa-application" },
      { title: "Post", sub: "Visa Help", icon: <FaPlane />, link: "/post-visa" },
    ];

  const rightCourses =
    coursesData ||
    [
      { label: "Certificate", icon: <FaCertificate />, color: "from-blue-500 to-cyan-500", link: "/courses/certificate" },
      { label: "Pre University", icon: <FaUserGraduate />, color: "from-pink-500 to-rose-500", link: "/courses/pre-university" },
      { label: "Diploma", icon: <FaGraduationCap />, color: "from-orange-500 to-amber-500", link: "/courses/diploma" },
      { label: "Under Graduate", icon: <FaGraduationCap />, color: "from-green-500 to-emerald-500", link: "/courses/under-graduate" },
      { label: "Post Graduate", icon: <FaUserGraduate />, color: "from-blue-600 to-indigo-600", link: "/courses/post-graduate" },
      { label: "P.hd", icon: <FaGlasses />, color: "from-teal-500 to-cyan-600", link: "/courses/phd" },
    ];

  return (
    <section className="bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-16 md:px-10 lg:px-20">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* LEFT SIDE */}
        <div className="flex-[1.2]">
          <h2 className="text-3xl font-bold mb-10 leading-tight text-slate-800">
            How Our <span className="text-blue-600">Academic Counsellor</span> Can Help You Get Admission in Malaysia
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {leftServices.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="group relative backdrop-blur-md bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-shadow text-white text-2xl">
                    {item.icon}
                  </div>
                  <p className="text-[15px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-sm text-slate-500 group-hover:text-blue-500 transition-colors">
                    {item.sub}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Button */}
          <div className="mt-10">
            <a
              href="/talk-to-counsellor"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold shadow-md hover:scale-105 transition"
            >
              TALK TO COUNSELLOR
            </a>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold mb-8 text-slate-800 text-center">
            Study in <span className="text-blue-600">Malaysia Courses</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {rightCourses.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                className="group relative backdrop-blur-md bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  <div className="text-white text-2xl">{item.icon}</div>
                </div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors text-center">
                  {item.label}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CounsellorSupport;

