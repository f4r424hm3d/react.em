import React from "react";
import { FaGraduationCap, FaUserGraduate } from "react-icons/fa";
import { PiCertificateBold, PiStudentBold } from "react-icons/pi";
import { LuSchool } from "react-icons/lu";
import { GiDiploma } from "react-icons/gi";
import { useParams } from "react-router-dom";

const courseOptions = [
  { label: "CERTIFICATE", icon: <PiCertificateBold className="text-white text-3xl" /> },
  { label: "PRE UNIVERSITY", icon: <PiStudentBold className="text-white text-3xl" /> },
  { label: "DIPLOMA", icon: <GiDiploma className="text-white text-3xl" /> },
  { label: "UNDER GRADUATE", icon: <FaGraduationCap className="text-white text-3xl" /> },
  { label: "POST GRADUATE", icon: <LuSchool className="text-white text-3xl" /> },
  { label: "PHD", icon: <FaUserGraduate className="text-white text-3xl" /> },
];
 
const HelpUniversityCourses = () => {
   const { slug } = useParams();
   const formatSlug = (slug) => {
    if (!slug) return '';
    
  
    const formattedString = slug.replace(/-/g, ' ');
   
    return formattedString.split(' ').map(word => {
      if (word.length === 0) return '';
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  };

  const universityName = formatSlug(slug);

  return (
    <div className="p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold  text-blue-900 mb-8">
        Find <span className="text-blue-900">{universityName}</span>  Courses
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {courseOptions.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center bg-[#f9fafe] p-6 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition duration-300 cursor-pointer"
          >
            <div className="bg-gradient-to-br from-teal-500 to-teal-700 p-4 rounded-full shadow-lg mb-4">
              {item.icon}
            </div>
            <p className="text-sm font-semibold text-gray-800 tracking-wide">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpUniversityCourses;
