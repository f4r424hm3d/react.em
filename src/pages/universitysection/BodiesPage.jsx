import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaLocationArrow,
  FaStar,
  FaEye,
  FaDownload,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const UniversityDetailStatic = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "courses", label: "Courses" },
    { id: "gallery", label: "Gallery" },
    { id: "videos", label: "Videos" },
    { id: "reviews", label: "Reviews" },
    { id: "ranking", label: "Ranking" },
  ];

  const handleTabChange = (id) => {
    setActiveTab(id);
  };

  return (
    <div className="">
      {/* Header Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Logo + Title */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
            {/* Left - Logo + Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-100">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/1/1b/RMIT_University_Logo.svg"
                  alt="University Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  University of Malaysia
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <span className="text-blue-600 font-medium">
                      Location: Kuala Lumpur
                    </span>
                  </div>
                  <button className="flex items-center gap-2 border border-blue-700 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-50 transition whitespace-nowrap">
                    <FaLocationArrow className="text-sm" />
                    Get Direction
                  </button>
                </div>
              </div>
            </div>

            {/* Right Info */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 sm:gap-6 text-sm w-full lg:w-auto">
              <div className="flex flex-col gap-1 items-start text-left">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm">Type</span>
                  <span className="bg-blue-700 text-white px-2 py-1 rounded-full font-medium text-sm">
                    Public
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <span className="font-lg">SETARA Ranking:</span>
                  {[1, 2, 3].map((i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                  {[4, 5].map((i) => (
                    <FaStar key={i} className="text-black text-sm" />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1 items-start text-left">
                <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium gap-2 text-sm">
                  <div className="w-1 h-1 bg-blue-950 rounded-full " />
                  <div className="animate-pulse">Featured</div>
                </div>
                <div className="text-gray-600 text-sm">
                  Approved By : <span className="font-medium">MQA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
            <div className="md:col-span-6 relative">
              <img
                src="https://www.educationmalaysia.in/uploads/university/photos/IMG_20221209_181808.png"
                alt="Main"
                className="w-full h-[220px] sm:h-[300px] md:h-[350px] object-cover rounded-lg"
              />
              <button className="absolute bottom-4 left-4 bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-800 transition-colors">
                View All Photos
              </button>
            </div>

            <div className="md:col-span-6 grid grid-cols-2 gap-3">
              {[
                "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop",
                "https://images.unsplash.com/photo-1562774053-701939374585?w=300&h=200&fit=crop",
                "https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=300&h=200&fit=crop",
                "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=300&h=200&fit=crop",
              ].map((photo, index) => (
                <div
                  key={index}
                  className="relative h-[120px] sm:h-[140px] md:h-[168px]"
                >
                  <img
                    src={photo}
                    alt={`Campus ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* University Details Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 -mt-6 sm:-mt-10">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8">
            {/* Left Info */}
            <div className="w-full">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="bg-gray-200 px-3 py-1.5 rounded-md text-sm text-gray-700">
                  Established year: 1970
                </div>

                <div className="bg-gray-200 px-3 py-1.5 rounded-md text-sm text-gray-700 gap-2 flex items-center">
                  <FaEye className="text-sm" />
                  Views: 416
                </div>
              </div>

              {/* Ranking */}
              <div className="mt-4 bg-gray-200 px-4 py-2 rounded-md text-sm text-gray-700 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-800">
                      #457
                    </span>
                    <span className="text-gray-600 text-base">in World</span>
                  </div>
                  <span className="hidden sm:block text-gray-400">•</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-800">#4</span>
                    <span className="text-gray-600 text-base">in Malaysia</span>
                  </div>
                  <button className="sm:ml-auto text-blue-600 font-medium hover:underline text-sm sm:text-base">
                    View ranking details →
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 w-full lg:w-[350px]">
              <button className="w-full bg-white border border-blue-300 text-blue-700 px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
                <FaDownload className="text-sm" />
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto hide-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base font-medium transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-blue-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniversityDetailStatic;
