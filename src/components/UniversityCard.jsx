import React, { useEffect, useState } from "react";
import { MapPin, GraduationCap } from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import { API_URL } from "../config";

const RelatedUniversities = () => {
  const navigate = useNavigate();
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const { name, slug, nameWithLevel } = useParams();
  const location = useLocation();

  let actualSlug = slug || name;
  if (nameWithLevel) {
    const parts = nameWithLevel.split("-");
    const validLevels = [
      "diploma",
      "undergraduate",
      "postgraduate",
      "phd",
      "certificate",
    ];
    const lastPart = parts[parts.length - 1];

    actualSlug = validLevels.includes(lastPart)
      ? parts.slice(0, -1).join("-")
      : nameWithLevel;
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!actualSlug) return;

      try {
        setLoading(true);

        let endpoint = "";

        if (location.pathname.includes("/specialization/")) {
          endpoint = `/specialization-detail-by-slug/${actualSlug}`;
        } else if (location.pathname.includes("/course")) {
          endpoint = `/course-category/${actualSlug}`;
        }

        if (!endpoint) return;

        const res = await api.get(endpoint);
        const relatedUniversities =
          res.data?.data?.related_universities ||
          res.data?.related_universities ||
          [];

        setRelated(relatedUniversities);
      } catch (err) {
        console.error("❌ Failed to fetch related universities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [actualSlug, location.pathname]);

  return (
    <div className="space-y-5 px-4 py-6 bg-gray-50 rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        🎓 Related Universities
      </h2>

      {/* Loading UI */}
      {loading && (
        <p className="text-gray-600 text-center py-6 animate-pulse">
          Loading universities...
        </p>
      )}

      {/* No data */}
      {!loading && related.length === 0 && (
        <p className="text-gray-500 text-center">No universities found.</p>
      )}

      {/* University List */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-5">
        {!loading &&
          related.map((uni) => {
            console.log("🔍 University data:", uni);
            console.log("🔍 Available fields:", Object.keys(uni));

            // Try different possible slug field names
            const universitySlug =
              uni.slug ||
              uni.university_slug ||
              uni.institution_slug ||
              uni.name
                ?.toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");

            console.log("🎯 Using slug:", universitySlug);

            return (
              <div
                key={uni.id}
                className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-5"
              >
                {/* Left section */}
                <div className="flex items-start gap-4 w-full">
                  <img
                    src={`${API_URL}${uni.logo_path}`}
                    alt={uni.name}
                    className="w-20 h-20 object-contain rounded-lg border bg-gray-50"
                    loading="lazy"
                    width="80"
                    height="80"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-semibold text-blue-700">
                      {uni.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin size={16} />
                        {uni.city || "Malaysia"}
                      </span>

                      <span className="flex items-center gap-1">
                        <GraduationCap size={16} />
                        {uni.inst_type || "Institution"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Courses:</span>
                        <span>{uni.allspcprograms || "N/A"}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="font-semibold">QS Rank:</span>
                        <span>{uni.qs_rank || "N/A"}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Scholarship:</span>
                        <span>Yes</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => {
                    console.log(
                      "🚀 Navigating to:",
                      `/university/${universitySlug}/courses`,
                    );
                    window.scrollTo(0, 0); // Scroll to top before navigation
                    navigate(`/university/${universitySlug}/courses`);
                  }}
                  className="bg-blue-800 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 transition whitespace-nowrap w-full md:w-auto"
                >
                  {uni.allspcprograms} {actualSlug} Courses
                </button>
              </div>
            );
          })}
      </div>

      {/* Browse all */}
      <div className="flex justify-center pt-3">
        <button
          onClick={() => navigate("/universities")}
          className="bg-blue-800 text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-blue-900 transition"
        >
          Browse All Universities
        </button>
      </div>
    </div>
  );
};

export default RelatedUniversities;
