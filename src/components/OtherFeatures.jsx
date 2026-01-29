import React from "react";
import { FaArrowRight, FaRegLightbulb } from "react-icons/fa";
import { Link } from "react-router-dom";

const otherServices = [
  "Pre Departure Support",
  "Visa Guidance",
  "MOHE Guide to Malaysia’s Higher Education",
  "Why Study In Malaysia?",
  "Plan Your Budget",
  "Jobs and Career",
  "Discover Malaysia",
  "Admission Guidance",
  "Application and Visa Guidance",
  "Research Proposal For PhD",
  "Top Reasons to study in Malaysia",
  "MUET Online Coaching",
];

const toSlug = (name) =>
  name.toLowerCase().replace(/\s+/g, "-").replace(/[?’]/g, "");

const OtherFeatures = () => {
  return (
    <div className="px-3">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h4 className="text-xl font-bold border-b pb-3 mb-5 text-gray-800">
          💡 Other Services
        </h4>

        <ul className="space-y-3">
          {otherServices.map((service, index) => (
            <li key={index}>
              <Link
                to={`/resources/services/${toSlug(service)}`}
                className="flex items-start justify-between px-4 py-3 rounded-md text-gray-700 hover:bg-orange-100/70 hover:text-orange-700 transition group"
              >
                <div className="flex items-start gap-3 w-full">
                  <FaRegLightbulb className="text-orange-500 mt-1 shrink-0" />
                  <span className="font-medium text-left leading-snug group-hover:translate-x-1 transition">
                    {service}
                  </span>
                </div>
                <FaArrowRight className="text-orange-500 mt-1 shrink-0 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="text-center pt-4 border-t mt-5">
          <Link
            to="/resources/services"
            className="text-sm font-semibold text-orange-600 hover:underline"
          >
            View All Services →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OtherFeatures;
