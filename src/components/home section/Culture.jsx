

import React from "react";
import {
  GraduationCap,
  Briefcase,
  Globe,
  MapPin,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";

function Malaysia() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
        <div className="max-w-7xl w-full">

          {/* ---------- Title Section ---------- */}
          <div className="text-center mb-2 sm:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-6 leading-tight px-4">
              Where Knowledge Grows and Opportunities Thrive in Malaysia

            </h1>
            <p className="text-slate-600 text-base max-w-6xl mx-auto leading-relaxed px-4 text-justify">
              Discover Malaysia - as a nation  that blends academic excellence with real-world career pathways, offering students an affordable, innovative, and globally connected study experience.
            </p>
          </div>

          {/* ---------- Stats Cards ---------- */}
          {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 px-2 sm:px-0">
            {[
              { color: "from-[#003893] to-[#003893]", value: "100+", label: "Accredited Universities and University College" },
              { color: "from-[#003893] to-[#003893]", value: "130K+", label: "International Students" },
              { color: "from-[#003893] to-[#003893]", value: "$400B+", label: "Strong GDP Economy" },
              { color: "from-[#003893] to-[#003893]", value: "97%", label: " Study Visa Success Rate" },
            ].map((item, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${item.color} p-4 sm:p-6 md:p-8 rounded-2xl text-white text-center shadow-xl hover:shadow-2xl transition-all hover:scale-105 duration-300`}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{item.value}</div>
                <div className="text-xs sm:text-sm md:text-base opacity-90 leading-snug">{item.label}</div>
              </div>
            ))}
          </div> */}

          {/* ---------- Info Cards (Icons beside Titles) ---------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-6 sm:mb-12 px-2 sm:px-0">
            {[
              {
                icon: <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />,
                bg: "bg-blue-100",
                title: "Safe & Peaceful Environment",
                desc: "Malaysia is known for its political stability, low crime rates, and student-friendly cities, ensuring a secure and comfortable place to study and live.",
              },
              {
                icon: <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />,
                bg: "bg-green-100",
                title: "Post-Study Opportunities",
                desc: "Graduates can take advantage of Malaysia’s post-study options, including stay-back pathways that support job searching, skill development, and professional employment.",
              },
              {
                icon: <Award className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600" />,
                bg: "bg-yellow-100",
                title: "Pathways to Global Universities",
                desc: "Malaysia provides flexible credit-transfer routes to top universities in the UK, Australia, and Europe, enabling students to earn internationally recognised degrees at a lower cost.",
              },
              {
                icon: <Users className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />,
                bg: "bg-purple-100",
                title: "Modern Infrastructure",
                desc: "Universities are equipped with state-of-the-art facilities, digital learning platforms, research labs, and innovative teaching environments designed for future-ready education.",
              },
              {
                icon: <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />,
                bg: "bg-orange-100",
                title: "Affordable Quality of Life",
                desc: "With reasonably priced accommodation, transportation, food, and healthcare, students enjoy a high standard of living without excessive costs",
              },
              {
                icon: <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-600" />,
                bg: "bg-cyan-100",
                title: "Supportive Student Services",
                desc: "Dedicated international student offices assist with visa processes, housing, orientation, and academic support, ensuring a smooth and successful education journey.",
              },

            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 sm:p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* ---------- About Malaysia ---------- */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mx-2 sm:mx-0">

            <div className="p-2 sm:p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

                {/* Left Column - About Malaysia */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-red-600" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">About Malaysia</h4>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Globe className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800 text-sm">Capital:</span>
                        <span className="text-gray-600 text-sm">Kuala Lumpur</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800 text-sm">Population:</span>
                        <span className="text-gray-600 text-sm">34 Million</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800 text-sm">Language:</span>
                        <span className="text-gray-600 text-sm">Malay, English</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800 text-sm">Climate:</span>
                        <span className="text-gray-600 text-sm">Tropical, warm</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Economy & Industries */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">Economy & Industries</h4>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800 text-sm">Growth:</span>
                        <span className="text-gray-600 text-sm">~5% annually</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800 text-sm">Unemployment:</span>
                        <span className="text-gray-600 text-sm">3.0%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm">
                      <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-4 h-4 text-cyan-600" />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800 text-sm">Top Sectors:</span>
                        <span className="text-gray-600 text-sm">Tech, Healthcare</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800 text-sm">States:</span>
                        <span className="text-gray-600 text-sm">13 States + 3 FT</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Malaysia;