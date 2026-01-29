import React from "react";
import { FaGraduationCap, FaBookOpen, FaUserGraduate, FaLaptopCode, FaFlask, FaUniversity } from "react-icons/fa";
import { useEffect } from "react";


const levels = [
  {
    title: "CERTIFICATE",
    icon: <FaBookOpen size={40} className="text-purple-700" />,
    description:
      "A certificate course is the shortest course of study, designed to provide proficiency in a single subject or area.",
  },
  {
    title: "PRE UNIVERSITY",
    icon: <FaGraduationCap size={40} className="text-red-600" />,
    description:
      "For candidates who have passed SPM or O-Level exams and wish to pursue pre-university preparation programs.",
  },
  {
    title: "DIPLOMA",
    icon: <FaUserGraduate size={40} className="text-yellow-600" />,
    description:
      "An equivalent of the first year of a degree. Considered higher than Pre-University in specific functional areas.",
  },
  {
    title: "UNDERGRADUATE",
    icon: <FaUniversity size={40} className="text-blue-600" />,
    description:
      "Full degree programs in various fields offered by universities. Entry typically after diploma or pre-university.",
  },
  {
    title: "POSTGRADUATE",
    icon: <FaFlask size={40} className="text-green-600" />,
    description:
      "For students pursuing master's or PhD after completing undergraduate studies, with focus on research or specialization.",
  },
  {
    title: "PhD DOCTORATE",
    icon: <FaLaptopCode size={40} className="text-teal-600" />,
    description:
      "Doctor of Philosophy is also called a PhD in short. Once a candidate completes this degree, they are then qualified to teach any subject they want to at the university level.",
  },
];

const StudyMalaysia = () => {

useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <section className="bg-white py-14 px-4 md:px-10 lg:px-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Select Your <span className="text-blue-700">Qualified Level</span>
        </h2>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {levels.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-blue-100 transition-all duration-300 p-6 flex flex-col items-center text-center"
          >
            <div className="mb-4 p-4 rounded-full bg-gray-100 shadow-inner">
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-5">
              {item.description}
            </p>
            <button className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition">
              SELECT
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StudyMalaysia;
