import React, { useEffect, useState, memo } from "react";
import { FaMapMarkerAlt, FaGraduationCap } from "react-icons/fa";
import { Link, useParams, useLocation } from "react-router-dom";
import api from "../api";
import { API_URL } from "../config";

const FeaturedUniversities = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  const { name, slug, nameWithLevel } = useParams();
  const location = useLocation();

  /* --------------------------------------------------------
      SLUG FIXING LOGIC (Final and Stable)
  --------------------------------------------------------- */
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
    const last = parts[parts.length - 1];

    actualSlug = validLevels.includes(last)
      ? parts.slice(0, -1).join("-")
      : nameWithLevel;
  }

  /* --------------------------------------------------------
      DETECT API ENDPOINT BASED ON URL
  --------------------------------------------------------- */
  const detectEndpoint = () => {
    const path = location.pathname;

    // 🎯 UNIVERSITY PAGE - Try different endpoints
    if (path.includes("/university/")) {
      // Don't try API - use static data directly
      return null;
    }

    // 🎯 RESOURCE PAGES - Direct featured universities endpoint
    if (
      path.includes("/why-study") ||
      path.includes("/who-we-are") ||
      path.includes("/students-say")
    ) {
      return `/featured-universities`;
    }

    // Other pages use slug-based endpoints with featured_universities in response
    if (path.includes("/specialization/")) {
      return `/specialization-detail-by-slug/${actualSlug}`;
    }
    if (path.includes("/exam")) {
      return `/exam-details/${actualSlug}`;
    }
    if (path.includes("/service")) {
      return `/service-details/${actualSlug}`;
    }
    if (path.includes("/course")) {
      return `/course-category/${actualSlug}`;
    }

    return null;
  };

  /* --------------------------------------------------------
      API CALL
  --------------------------------------------------------- */
  useEffect(() => {
    const fetchUnis = async () => {
      const endpoint = detectEndpoint();

      // For university pages, always use static data
      if (location.pathname.includes("/university/")) {
        console.log(
          "🏫 University page detected - using static featured universities",
        );
        setUniversities([
          {
            id: 1,
            name: "Universiti Putra Malaysia (UPM)",
            uname: "universiti-putra-malaysia",
            city: "Serdang, Selangor",
            logo_path: null,
          },
          {
            id: 2,
            name: "Universiti Malaya (UM)",
            uname: "universiti-malaya",
            city: "Kuala Lumpur",
            logo_path: null,
          },
          {
            id: 3,
            name: "Universiti Teknologi Malaysia (UTM)",
            uname: "universiti-teknologi-malaysia",
            city: "Johor Bahru",
            logo_path: null,
          },
          {
            id: 4,
            name: "Universiti Sains Malaysia (USM)",
            uname: "universiti-sains-malaysia",
            city: "Penang",
            logo_path: null,
          },
          {
            id: 5,
            name: "Universiti Kebangsaan Malaysia (UKM)",
            uname: "universiti-kebangsaan-malaysia",
            city: "Bangi, Selangor",
            logo_path: null,
          },
        ]);
        setLoading(false);
        return;
      }

      if (!endpoint) {
        console.log("⚠️ No endpoint detected for path:", location.pathname);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("🔍 Fetching from endpoint:", endpoint);
        console.log("📍 Current path:", location.pathname);

        const res = await api.get(endpoint);
        console.log("📦 Raw API response:", res.data);

        // Different response structure based on endpoint
        let list = [];

        if (endpoint === "/featured-universities") {
          // Direct featured universities endpoint
          list = res.data?.data?.universities || res.data?.universities || [];
        } else {
          // Other endpoints return featured_universities in response
          list =
            res.data?.data?.featured_universities ||
            res.data?.featured_universities ||
            [];
        }

        console.log("✅ Universities loaded:", list.length);
        console.log("📋 Universities list:", list);

        setUniversities(list);
      } catch (error) {
        console.log(
          `Featured universities fetch failed for ${endpoint}:`,
          error.response?.status,
        );
        // Set static fallback universities
        setUniversities([
          {
            id: 1,
            name: "Universiti Putra Malaysia (UPM)",
            uname: "universiti-putra-malaysia",
            city: "Serdang, Selangor",
            logo_path: null,
          },
          {
            id: 2,
            name: "Universiti Malaya (UM)",
            uname: "universiti-malaya",
            city: "Kuala Lumpur",
            logo_path: null,
          },
          {
            id: 3,
            name: "Universiti Teknologi Malaysia (UTM)",
            uname: "universiti-teknologi-malaysia",
            city: "Johor Bahru",
            logo_path: null,
          },
        ]);
      } finally {
        console.log("🏁 Loading finished");
        setLoading(false);
      }
    };

    fetchUnis();
  }, [location.pathname]);

  /* --------------------------------------------------------
      IMAGE URL FIXER
  --------------------------------------------------------- */
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;

    const clean = path.replace(/^\/+|storage\/+|public\/+/g, "");
    return `${API_URL}/storage/${clean}`;
  };

  /* --------------------------------------------------------
      UI RENDER - COMPACT SIDEBAR VERSION
  --------------------------------------------------------- */
  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-xl px-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b">
          Featured Universities
        </h2>
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (universities.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-xl p-5 mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b">
          Featured Universities
        </h2>
        <p className="text-gray-500 text-sm text-center py-4">
          No featured universities available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-3 ">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b">
        Featured Universities
      </h2>

      <div className="space-y-3">
        {universities.map((uni) => {
          const img = getImageUrl(uni.logo_path || uni.logo);

          return (
            <div
              key={uni.id}
              className="flex items-start gap-3 p-3 hover:bg-gray-50 transition-all duration-200 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-md"
            >
              {/* University Logo - CLICKABLE */}
              <Link
                to={`/university/${uni.uname}`}
                className="w-14 h-14 flex-shrink-0 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden p-1"
              >
                {img ? (
                  <img
                    src={img}
                    alt={uni.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    width="56"
                    height="56"
                    onError={(e) => {
                      if (!e.target.dataset.fallback) {
                        e.target.dataset.fallback = "1";
                        e.target.src = `${API_URL}/${(uni.logo_path || "").replace(/^\/+/, "")}`;
                      } else {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML =
                          '<svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path></svg>';
                      }
                    }}
                  />
                ) : (
                  <FaGraduationCap className="text-gray-400 text-2xl" />
                )}
              </Link>

              {/* University Info */}
              <div className="flex-1 min-w-0">
                {/* University Name - CLICKABLE */}
                <Link to={`/university/${uni.uname}`}>
                  <h3 className="font-bold text-blue-900 text-sm mb-1.5 line-clamp-2 hover:text-blue-700 transition-colors leading-tight">
                    {uni.name}
                  </h3>
                </Link>

                {uni.city && (
                  <p className="flex items-start text-xs text-gray-600 mb-2 line-clamp-1">
                    <FaMapMarkerAlt className="mr-1.5 mt-0.5 text-red-500 flex-shrink-0 text-xs" />
                    <span>{uni.city}</span>
                  </p>
                )}

                {/* ✅ Programme Button - SCROLL TO COURSES SECTION */}
                <Link
                  to={`/university/${uni.uname}/courses`}
                  state={{ preventScroll: true }} // ✅ YE LINE ADD KARO
                  onClick={() => {
                    setTimeout(() => {
                      // Try multiple possible selectors for courses section
                      const coursesSection =
                        document.querySelector(".courses-section") ||
                        document.querySelector('[class*="course"]') ||
                        document.querySelector('h2:contains("Courses")') ||
                        document.querySelector(".course-list") ||
                        document.querySelector("#courses") ||
                        document.getElementById("courses-tab") ||
                        document.querySelector('[data-tab="courses"]');

                      if (coursesSection) {
                        coursesSection.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      } else {
                        const filterSection =
                          document.querySelector(".filters") ||
                          document.querySelector('[class*="filter"]') ||
                          document.querySelector("main");

                        if (filterSection) {
                          filterSection.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        } else {
                          window.scrollTo({
                            top: 400,
                            behavior: "smooth",
                          });
                        }
                      }
                    }, 500);
                  }}
                  className="inline-flex items-center text-xs text-blue-600 font-medium hover:underline"
                >
                  <FaGraduationCap className="mr-1 text-xs" />
                  Programme
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(FeaturedUniversities);
