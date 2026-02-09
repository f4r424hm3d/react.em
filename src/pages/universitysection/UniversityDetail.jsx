import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";

import { useParams, useNavigate, Link, useLocation } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";

import GetinTouchUiversity from "../../components/GetinTouchUiversity";

import TabContentLoader from "./TabContentLoader";

import Overview from "./Overview";

import Courses from "./Courses2";

import Gallery from "./Gallery";

import Videos from "./Videos";

import Reviews, { checkReviewsExist } from "./Reviews";

import Ranking from "./Rankingdetails";

import api from "../../api";

import UniversityCoursesCard from "./UniversityCoursesCard";

import SEO from "../../components/SEO";
import SeoService from "../../utils/SeoService";

import { Home, Layers, Loader2 } from "lucide-react";

import { API_URL } from "../../config";

import PopupForm from "./PopupForm";

import ReviewModal from "./ReviewModal";

import { BsCalendar3 } from "react-icons/bs";

import FeaturedUniversities from "../../components/FeaturedUniversities";

// ==========================================

// FIX 1: Icons Import (Line 23 ke baad add karo)

// ==========================================

import {
  FaLocationArrow,
  FaMapMarkerAlt,
  FaEye,
  FaBookOpen,
  FaDownload,
  FaFileAlt,
  FaEdit,
  FaStar,
  FaGraduationCap,
  FaSchool,
  FaCheck,
  FaPhone,
  FaPhoneSquareAlt,
  FaPhoneAlt,
  FaFax,
  FaEnvelope,
  FaBuilding,
  FaBed,
  FaUsers,
} from "react-icons/fa";

// The static data for photos and offered courses as requested

const STATIC_PHOTOS = [
  "https://www.educationmalaysia.in/uploads/university/photos/IMG_20221209_181808.png",

  "https://www.educationmalaysia.in/assets/uploadFiles/study/IMG_20221209_181825.png",

  "https://images.unsplash.com/photo-1562774053-701939374585?w=300&h=200&fit=crop",

  "https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=300&h=200&fit=crop",

  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=300&h=200&fit=crop",
];

const STATIC_OFFERED_COURSES = [
  "Business Administration",

  "Computer Science",

  "Engineering",

  "Arts & Sciences",

  "Health Sciences",

  "Communications",

  "Communications",

  "Communications",

  "Communications",
];

// Default data used while API loads or fails, so UI never blocks on a loader

const DEFAULT_UNIVERSITY = {
  name: "",

  logo_path: "",

  city: "",

  inst_type: "Private Institution",

  photos: STATIC_PHOTOS,

  offeredCourses: STATIC_OFFERED_COURSES,

  rank: "",

  qs_rank: "",

  established: "",

  Scholarship: false,

  // views: "",

  clicks: "",

  courses: "",

  seo: null,
};

// Heuristic to pick the best 5 photo URLs from a larger list without extra metadata

const selectBestFivePhotos = (photoUrls) => {
  if (!Array.isArray(photoUrls)) return [];

  // De-duplicate while preserving order

  const uniqueUrls = Array.from(new Set(photoUrls.filter(Boolean)));

  const scored = uniqueUrls.map((url) => {
    const lower = String(url).toLowerCase();

    const ext = lower.split("?")[0].split(".").pop();

    let score = 0;

    // Prefer high-quality photo paths and common photo extensions

    if (["jpg", "jpeg"].includes(ext)) score += 3;

    if (["png", "webp"].includes(ext)) score += 2;

    if (lower.includes("/uploads/university/photos")) score += 2;

    // Penalize likely non-hero images

    const badHints = [
      "logo",

      "icon",

      "thumbnail",

      "thumb",

      "placeholder",

      "default",

      "sprite",
    ];

    if (badHints.some((h) => lower.includes(h))) score -= 4;

    // Mildly prefer filenames that look like real photos (contain long digit sequences)

    if (/(\d{4,})/.test(lower)) score += 1;

    return { url, score };
  });

  // Sort by score descending and take top 5

  const top = scored

    .sort((a, b) => b.score - a.score)

    .map((s) => s.url)

    .slice(0, 5);

  return top.length > 0 ? top : uniqueUrls.slice(0, 5);
};

// 🔥 Dynamic tabs based on reviews existence

const UniversityDetailPage = () => {
  // Helper function to construct proper image URLs

  const getImageUrl = (path) => {
    if (!path) return "";

    // If it's already a full URL, return as-is

    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // Otherwise, prepend API_URL

    return `${API_URL}${path}`;
  };

  const { slug, section, courseSlug } = useParams(); // ✅ courseSlug add karo

  const navigate = useNavigate();
  const location = useLocation(); // Add this

  // Determine active tab from URL if 'section' param is missing
  const getTabFromPath = () => {
    if (courseSlug) return "courses";
    if (
      section &&
      [
        "overview",
        "courses",
        "gallery",
        "videos",
        "reviews",
        "ranking",
      ].includes(section)
    )
      return section;

    // Fallback: check last segment of path
    const path = location.pathname.replace(/\/$/, ""); // Remove trailing slash
    const pathSegments = path.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];

    const validTabs = [
      "overview",
      "courses",
      "gallery",
      "videos",
      "reviews",
      "ranking",
    ];
    if (validTabs.includes(lastSegment)) {
      return lastSegment;
    }

    return "overview";
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());

  // ✅ SYNC TAB WITH URL
  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname, section, courseSlug]);

  const [isTabLoading, setIsTabLoading] = useState(false);

  const [universityData, setUniversityData] = useState(DEFAULT_UNIVERSITY);

  const [isDataLoading, setIsDataLoading] = useState(true);

  const [seo, setSeo] = useState({});

  const [faculties, setFaculties] = useState([]);

  const [featuredPhotos, setFeaturedPhotos] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  const [isCounsellingOpen, setIsCounsellingOpen] = useState(false);

  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isFeeOpen, setIsFeeOpen] = useState(false);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [hasReviews, setHasReviews] = useState(true);

  const getFilteredTabs = () => {
    const allTabs = [
      { id: "overview", label: "Overview" },

      { id: "courses", label: "Courses" },

      { id: "gallery", label: "Gallery" },

      { id: "videos", label: "Videos" },

      { id: "reviews", label: "Reviews" },

      { id: "ranking", label: "Ranking" },
    ];

    return hasReviews ? allTabs : allTabs.filter((tab) => tab.id !== "reviews");
  };

  // ✅ Force scroll to top when page flows

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);

    // Double check with a timeout to override any race conditions

    requestAnimationFrame(() => {
      window.scrollTo(0, 0);

      const timer = setTimeout(() => {
        window.scrollTo({
          top: 0,

          left: 0,

          behavior: "instant",
        });
      }, 50);

      return () => clearTimeout(timer);
    });
  }, [slug]);

  // Effect to fetch university details from the API

  useEffect(() => {
    const fetchUniversityData = async () => {
      if (!slug) return;

      setIsDataLoading(true);

      try {
        // Try multiple endpoints to find university data

        let response;

        let fetchedData;

        try {
          // First try university-details endpoint

          console.log(`Trying: /university-details/${slug}`);

          response = await api.get(`/university-details/${slug}`);

          console.log("Response:", response);

          fetchedData =
            response.data?.university || response.data?.data?.university;
        } catch (detailsError) {
          console.log(
            "university-details failed:",

            detailsError.response?.status,

            detailsError.response?.data,
          );

          try {
            // Fallback to university-overview endpoint

            console.log(`Trying: /university-overview/${slug}`);

            response = await api.get(`/university-overview/${slug}`);

            console.log("Overview Response:", response);

            fetchedData =
              response.data?.data?.university || response.data?.university;
          } catch (overviewError) {
            console.log(
              "university-overview failed:",

              overviewError.response?.status,

              overviewError.response?.data,
            );

            try {
              // Try different slug variations for UPM

              const possibleSlugs = [
                "universiti-putra-malaysia",

                "upm",

                "putra-malaysia",

                "universiti-putra-malaysia-upm",
              ];

              let found = null;

              for (const testSlug of possibleSlugs) {
                try {
                  console.log(`Testing slug: ${testSlug}`);

                  const testResponse = await api.get(
                    `/university-details/${testSlug}`,
                  );

                  if (testResponse.data?.university) {
                    found = testResponse.data.university;

                    console.log("Found with slug:", testSlug, found);

                    break;
                  }
                } catch (testError) {
                  console.log(
                    `Slug ${testSlug} failed:`,

                    testError.response?.status,
                  );
                }
              }

              if (found) {
                fetchedData = found;

                response = { data: { university: found } }; // Create mock response for consistency

                console.log("Found university data:", found);

                // Update the URL to the correct slug

                window.history.replaceState(
                  {},

                  "",

                  `/university/${found.uname || found.slug || slug}`,
                );
              } else {
                throw new Error(
                  `University "${slug}" not found with any slug variation`,
                );
              }
            } catch (slugTestError) {
              console.log(
                "All slug variations failed, showing static fallback...",
              );

              // Show static fallback instead of error

              setUniversityData({
                name: "University Not Found",

                slug: slug,

                city: "Unknown",

                inst_type: "Unknown",

                rating: 0,

                logo_path: null,

                latitude_longitude: null,

                active_programs_count: 0,

                local_students: "Not available",

                international_students: "Not available",

                hostel_facility: ["Not available"],

                approved_by: "Unknown",

                accredited_by: ["Unknown"],

                times_rank: "N/A",

                qs_asia_rank: "N/A",

                description: `The university "${slug}" was not found in our database. This might be because:`,

                availableUniversities: [
                  {
                    name: "Universiti Putra Malaysia (UPM)",

                    slug: "universiti-putra-malaysia",

                    city: "Serdang, Selangor",

                    institute_type: { type: "Public Institution" },

                    active_programs_count: "150+",
                  },

                  {
                    name: "Universiti Malaya (UM)",

                    slug: "universiti-malaya",

                    city: "Kuala Lumpur",

                    institute_type: { type: "Public Institution" },

                    active_programs_count: "200+",
                  },

                  {
                    name: "Universiti Teknologi Malaysia (UTM)",

                    slug: "universiti-teknologi-malaysia",

                    city: "Johor Bahru",

                    institute_type: { type: "Public Institution" },

                    active_programs_count: "180+",
                  },

                  {
                    name: "Universiti Sains Malaysia (USM)",

                    slug: "universiti-sains-malaysia",

                    city: "Penang",

                    institute_type: { type: "Public Institution" },

                    active_programs_count: "160+",
                  },

                  {
                    name: "Universiti Kebangsaan Malaysia (UKM)",

                    slug: "universiti-kebangsaan-malaysia",

                    city: "Bangi, Selangor",

                    institute_type: { type: "Public Institution" },

                    active_programs_count: "140+",
                  },
                ],
              });
            }
          }
        }

        console.log("Fetched University Data:", response);

        // Check if data exists

        if (!fetchedData) {
          throw new Error("University data not found");
        }

        setSeo(response.data.university || {});

        setFaculties(response.data.faculties || []);

        // Get featured photos with better fallback handling

        const fetchedFeaturedPhotos = response.data.featured_photos || [];

        console.log("=== FEATURED PHOTOS DEBUG ===");

        console.log(
          "API Response featured_photos:",

          response.data.featured_photos,
        );

        console.log("Fetched Featured Photos:", fetchedFeaturedPhotos);

        console.log("Length:", fetchedFeaturedPhotos.length);

        // If no featured photos OR empty array, use static photos as fallback

        if (!fetchedFeaturedPhotos || fetchedFeaturedPhotos.length === 0) {
          console.warn(
            "❌ No featured photos from API - using static photos fallback",
          );

          const staticPhotoObjects = STATIC_PHOTOS.map((url, index) => ({
            id: index,

            photo_path: url,

            photo_name: `Photo ${index + 1}`,

            title: index === 0 ? "Main" : "",
          }));

          console.log("✅ Setting static photos:", staticPhotoObjects);

          setFeaturedPhotos(staticPhotoObjects);
        } else {
          console.log("✅ Using API featured photos:", fetchedFeaturedPhotos);

          setFeaturedPhotos(fetchedFeaturedPhotos);
        }

        console.log("=== END DEBUG ===");

        // console.log(response.data.faculties || []);

        // Fetch gallery photos for the header image strip

        let fetchedPhotos = [];

        try {
          const galleryRes = await api.get(`/university-gallery/${slug}`);

          const photosArray =
            galleryRes?.data?.universityPhotos ??
            galleryRes?.data?.data?.universityPhotos ??
            [];

          const toAbsoluteUrl = (path) => {
            if (!path) return null;

            if (/^https?:\/\//i.test(path)) return path;

            const cleaned = String(path).replace(/^\/+/, "");

            return `https://www.educationmalaysia.in/storage/${cleaned}`;
          };

          if (Array.isArray(photosArray)) {
            fetchedPhotos = photosArray

              .map((p) => toAbsoluteUrl(p?.photo_path))

              .filter(Boolean);
          }
        } catch (galleryErr) {
          console.warn(
            "Failed to fetch gallery photos, falling back to static photos",

            galleryErr,
          );
        }

        // Choose the best five from fetched photos; fallback to static if none

        const bestFive =
          fetchedPhotos.length > 0 ? selectBestFivePhotos(fetchedPhotos) : [];

        const mergedData = {
          ...fetchedData,

          photos: bestFive.length > 0 ? bestFive : STATIC_PHOTOS,

          offeredCourses: STATIC_OFFERED_COURSES,

          clicks:
            fetchedData.click ||
            fetchedData.clicks ||
            fetchedData.views ||
            "N/A",

          // 🔍 YE ADD KARO - API se raw data dekhne ke liye

          city: fetchedData.city
            ? fetchedData.state
              ? `${fetchedData.city}, ${fetchedData.state}`
              : fetchedData.city
            : "Kuala Lumpur, Malaysia",

          established: fetchedData.established_year || "1970",

          courses: fetchedData.active_programs_count || "N/A",

          Scholarship: true,

          inst_type: fetchedData.institute_type?.type || "Private Institution",

          local_students: fetchedData.local_students || "0",

          international_students: fetchedData.international_students || "0",

          // ✅✅✅ HOSTEL FACILITY - UPDATED FIX ✅✅✅

          hostel_facility: (() => {
            const facility = fetchedData.hostel_facility;

            // Agar array hai

            if (Array.isArray(facility)) {
              return facility.filter(Boolean);
            }

            // Agar string hai (INCLUDING ["NO HOSTEL"] format)

            if (typeof facility === "string") {
              // Remove ALL brackets, quotes, backslashes

              let cleaned = facility

                .replace(/^\["|"\]$/g, "") // Remove starting [" and ending "]

                .replace(/[\[\]"'\\]/g, "") // Remove all brackets, quotes, backslashes

                .trim();

              // Agar comma-separated hai

              if (cleaned.includes(",")) {
                return cleaned

                  .split(",")

                  .map((s) => s.trim())

                  .filter(Boolean);
              }

              return cleaned
                ? [cleaned]
                : ["On-campus accommodation available"];
            }

            // Default fallback

            return [
              "On-campus accommodation available",

              "Separate facilities for male and female students",

              "Fully furnished rooms with amenities",
            ];
          })(),

          approved_by: fetchedData.approved_by || "MQA",

          // ✅✅✅ ACCREDITED BY - UPDATED FIX ✅✅✅

          accredited_by: (() => {
            const accreditation = fetchedData.accredited_by;

            // Agar already array hai

            if (Array.isArray(accreditation)) {
              return accreditation.filter(Boolean);
            }

            // Agar string hai (INCLUDING ["NO ACCRIDATION"] format)

            if (typeof accreditation === "string" && accreditation.trim()) {
              // Remove ALL brackets, quotes, backslashes

              let cleaned = accreditation

                .replace(/^\["|"\]$/g, "")

                .replace(/[\[\]"'\\]/g, "")

                .trim();

              if (cleaned.includes(",")) {
                return cleaned

                  .split(",")

                  .map((s) => s.trim())

                  .filter(Boolean);
              }

              return cleaned ? [cleaned] : ["MQA"];
            }

            // Default fallback

            return [
              "Malaysian Qualifications Agency (MQA)",

              "Ministry of Higher Education Malaysia",

              "International Accreditation Bodies",
            ];
          })(),

          times_rank: fetchedData.times_rank || "N/A",

          qs_asia_rank: fetchedData.qs_asia_rank || "N/A",

          rating: fetchedData.rating || 4.2,
        };

        setUniversityData(mergedData);

        // 🔥 Check if reviews exist

        const reviewsExist = await checkReviewsExist(slug);

        setHasReviews(reviewsExist);
      } catch (error) {
        console.error("Error fetching university details:", error);

        setUniversityData(null);

        setHasReviews(false); // 🔥 Error mein bhi reviews hide karo
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchUniversityData();
  }, [slug]);

  // Effect to handle tab changes and scroll to top

  useEffect(() => {
    // ✅ Agar courseSlug hai toh courses tab, warna section

    setActiveTab(courseSlug ? "courses" : section || "overview");

    setIsTabLoading(true);

    const timer = setTimeout(() => setIsTabLoading(false), 500);

    return () => clearTimeout(timer);
  }, [section, courseSlug]); //

  // ✅ Scroll to courses section when courseSlug is present

  useEffect(() => {
    if (courseSlug && activeTab === "courses") {
      const timer = setTimeout(() => {
        const coursesSection = document.getElementById("courses-section");

        if (coursesSection) {
          coursesSection.scrollIntoView({
            behavior: "smooth",

            block: "start",
          });
        }
      }, 1000); // Wait for content to load

      return () => clearTimeout(timer);
    }
  }, [courseSlug, activeTab]);

  const handleTabChange = useCallback(
    (tab) => {
      setActiveTab(tab);

      navigate(
        tab === "overview"
          ? `/university/${slug}`
          : `/university/${slug}/${tab}`,

        { preventScrollReset: true }, // ✅ YE ADD KARO
      );
    },

    [navigate, slug],
  );

  const renderTabContent = () => {
    if (isTabLoading) return <TabContentLoader />;

    switch (activeTab) {
      case "courses":
        return <Courses courseSlug={courseSlug} />;

      case "gallery":
        return <Gallery />;

      case "videos":
        return <Videos />;

      case "ranking":
        return <Ranking />;

      case "reviews":
        return <Reviews />;

      default:
        return <Overview universityData={universityData} />;
    }
  };

  const handleClick = () => {
    if (universityData?.latitude_longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${universityData.latitude_longitude}`;

      window.open(url, "_blank"); // Google Maps nayi tab me open hoga
    } else {
      console.warn("University coordinates not available");
    }
  };

  // Use the fetched data to render the component

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />

          <p className="text-gray-600">Loading university details...</p>
        </div>
      </div>
    );
  }

  if (!universityData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏫</span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            University Not Found
          </h2>

          <p className="text-gray-600 mb-4">
            The university "{slug}" could not be found or the data is not
            available.
          </p>

          <Link
            to="/universities"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Layers size={16} />
            Browse All Universities
          </Link>
        </div>
      </div>
    );
  }

  // Special handling for "University Not Found" case with suggestions

  if (universityData.name === "University Not Found") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏫</span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                University Not Found
              </h1>

              <p className="text-gray-600 mb-6">
                The university "{slug}" was not found in our database. This
                might be because: • The university name is spelled incorrectly •
                The university is not in our database yet • The URL slug is
                different from the university name Try searching for "Universiti
                Putra Malaysia" with the correct slug:{" "}
                <code>universiti-putra-malaysia</code>
              </p>

              <Link
                to="/universities"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Layers size={16} />
                Browse All Universities
              </Link>
            </div>
          </div>

          {/* Available Universities Suggestions */}

          {universityData.availableUniversities &&
            universityData.availableUniversities.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Available Universities
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {universityData.availableUniversities.map(
                    (university, index) => (
                      <Link
                        key={index}
                        to={`/university/${university.slug}`}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">🎓</span>
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {university.name}
                            </h3>

                            <p className="text-sm text-gray-600 mb-2">
                              {university.city}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                {university.institute_type?.type ||
                                  "University"}
                              </span>

                              {university.active_programs_count && (
                                <span>
                                  {university.active_programs_count} Programs
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ),
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ✅ Enhanced SEO Component with SeoService */}
      <SEO {...SeoService.generateUniversityDetailMeta(universityData)} />

      <div className="w-full bg-blue-50 shadow-sm pt-2">
        <div className="max-w-screen-xl mx-auto px-2 sm:px-3 py-3">
          <div className="flex items-center space-x-2 sm:space-x-3 text-sm text-gray-600">
            <Link
              to="/"
              className="flex items-center gap-1 hover:underline hover:text-blue-500"
            >
              <Home size={18} /> Home
            </Link>

            <span>/</span>

            <Link
              to="/universities"
              className="flex items-center gap-1 hover:underline hover:text-blue-500"
            >
              <Layers size={18} /> Universities
            </Link>

            <span>/</span>

            <Link
              to={`/university/${slug}`}
              className="flex items-center gap-1 hover:underline hover:text-blue-500"
            >
              <Layers size={18} /> {universityData?.name || "University"}
            </Link>
          </div>
        </div>
      </div>

      {/* <div className="min-h-screen bg-gray-50"> */}

      {/* Mobile Layout  */}

      <div className="sm:hidden bg-gray-50">
        <div className="bg-white p-3">
          {/* Logo, Title, and Details */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-20 h-20 flex-shrink-0 border border-gray-200 rounded-xl p-1">
              <img
                src={
                  universityData?.logo_path
                    ? `${API_URL}${universityData.logo_path}`
                    : "/placeholder-logo.png"
                }
                alt="University Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = "/placeholder-logo.png";
                }}
              />
            </div>

            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-900">
                {universityData?.name || "University"}
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <FaMapMarkerAlt className="text-blue-500 text-xs flex-shrink-0" />
                <span
                  className="text-blue-600 font-medium text-sm "
                  title={`Location: ${universityData?.city}`}
                >
                  Location: {universityData?.city || "Not available"}
                </span>
              </div>
              {/* SETARA Stars */}
              <div className="flex items-center gap-1 text-gray-600 text-sm">
                <span className="font-medium">SETARA:</span>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.round(universityData?.rating || 3)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>{" "}
            </div>
          </div>

          {/* Main Image */}
          <div
            className="relative mb-4"
            style={{
              border: featuredPhotos?.length > 0 ? "none" : "none", // Removed debug border
              minHeight: "200px",
            }}
          >
            {featuredPhotos?.length > 0 && featuredPhotos[0]?.photo_path && (
              <img
                src={getImageUrl(featuredPhotos[0].photo_path)}
                alt={featuredPhotos[0].photo_name || "University main image"}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  // console.error("Image failed to load:", e.target.src);
                  e.target.src = "/placeholder-university.jpg";
                }}
              />
            )}

            {(!featuredPhotos || featuredPhotos.length === 0) && (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No featured photos available</p>
              </div>
            )}
          </div>

          {/* Info Boxes Grid (Established, Accredited, Hostel, Contact) */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            {/* Established Year Card (style matched from desktop but full width or grid) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm py-2 px-3 flex flex-col items-center text-center">
                <BsCalendar3 className="text-xl text-blue-600" />
                <h3 className="text-base font-bold leading-tight">
                  {universityData.established || "1970"}
                </h3>
                <p className="text-gray-600 text-xs">Established Year</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-100 shadow-sm py-2 px-3 flex flex-col items-center text-center">
                <FaGraduationCap className="text-xl text-green-600" />
                <h3 className="text-base font-bold leading-tight">
                  {universityData.Scholarship ? "Yes" : "No"}
                </h3>
                <p className="text-gray-600 text-xs">Scholarship</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-100 shadow-sm py-2 px-3 flex flex-col items-center text-center">
                <FaEye className="text-xl text-purple-600" />
                <h3 className="text-base font-bold leading-tight">
                  {universityData.clicks}
                </h3>
                <p className="text-gray-600 text-xs">Clicks</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-100 shadow-sm py-2 px-3 flex flex-col items-center text-center">
                <FaSchool className="text-xl text-orange-600" />
                <h3 className="text-base font-bold leading-tight">
                  {universityData.courses || "N/A"}
                </h3>
                <p className="text-gray-600 text-xs">Courses</p>
              </div>
            </div>

            {/* Accredited By */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
              <div className="flex items-center gap-2 mb-2">
                <FaBuilding className="text-blue-600 text-lg" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Accredited By
                </h3>
              </div>
              <ul className="space-y-1 text-sm text-gray-700">
                {Array.isArray(universityData.accredited_by) ? (
                  universityData.accredited_by
                    .slice(0, 3)
                    .map((accreditation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5 text-xs">•</span>
                        <span className="text-xs">{accreditation}</span>
                      </li>
                    ))
                ) : (
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5 text-xs">•</span>
                    <span className="text-xs">
                      {universityData.accredited_by || "MQA"}
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* Hostel Facility */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
              <div className="flex items-center gap-2 mb-2">
                <FaBed className="text-green-600 text-lg" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Hostel Facility
                </h3>
              </div>
              <ul className="space-y-1 text-sm text-gray-700">
                {Array.isArray(universityData.hostel_facility) ? (
                  universityData.hostel_facility
                    .slice(0, 3)
                    .map((facility, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5 text-xs">•</span>
                        <span className="text-xs">{facility}</span>
                      </li>
                    ))
                ) : (
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5 text-xs">•</span>
                    <span className="text-xs">
                      {universityData.hostel_facility || "Available"}
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
              <div className="flex items-center gap-2 mb-2">
                <FaPhoneAlt className="text-orange-600 text-lg" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Contact Info
                </h3>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <FaPhoneAlt className="text-orange-500 text-xs" />
                  <span className="text-xs">+60 1121376171</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaFax className="text-gray-500 text-xs" />
                  <span className="text-xs">+91 9818560331</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-blue-500 text-xs" />
                  <span className="text-xs">info@educationmalaysia.in</span>
                </div>
              </div>
            </div>
          </div>

          {/* Global Rankings Section */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Global Rankings
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg p-3 text-white shadow text-center">
                <p className="text-xl font-bold">
                  #{universityData.rank || "397"}
                </p>
                <p className="text-xs opacity-90">World Rank</p>
              </div>
              <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-lg p-3 text-white shadow text-center">
                <p className="text-xl font-bold">
                  {universityData.qs_rank || "1001-1400"}
                </p>
                <p className="text-xs opacity-90">QS Rank</p>
              </div>
              <div className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg p-3 text-white shadow text-center">
                <p className="text-xl font-bold">
                  {universityData.times_rank || "1501+"}
                </p>
                <p className="text-xs opacity-90">Times Rank</p>
              </div>
              {universityData.qs_asia_rank && (
                <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg p-3 text-white shadow text-center">
                  <p className="text-xl font-bold">
                    {universityData.qs_asia_rank}
                  </p>
                  <p className="text-xs opacity-90">QS Asia Rank</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-md p-4 space-y-3">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Downloads & Services
            </h3>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
              >
                <FaDownload />
                Download Brochure
              </button>

              <button
                onClick={() => setIsFeeOpen(true)}
                className="w-full bg-white border-2 border-blue-600 text-blue-600 px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
              >
                <FaFileAlt /> Download Fee Structure
              </button>

              <button
                onClick={() => setIsCounsellingOpen(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md transition-all flex items-center justify-center gap-2 text-sm font-bold"
              >
                <FaBookOpen />
                Book Direct University
              </button>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="w-full bg-gray-100 border border-gray-300 text-gray-800 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <FaEdit /> Write a Review
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Hidden on mobile */}

      <div className="hidden sm:block">
        {/* Header Section */}

        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4">
            {/* Desktop Layout - Logo and Title Section */}

            <div className="flex flex-row items-center justify-between gap-4 mb-4">
              {/* Logo + Info */}

              <div className="flex items-center gap-4 flex-row text-left">
                <div className="w-20 h-20 flex-shrink-0 border border-slate-200 rounded-xl ">
                  <img
                    src={`${API_URL}${universityData.logo_path}`}
                    alt="University Logo"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* <div className="flex-1"> */}

                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold text-gray-900 mb-1">
                    {universityData.name}
                  </h1>

                  {/* <div className="flex flex-row items-center justify-start gap-2 text-sm text-gray-600"> */}

                  <div className="flex flex-row items-center justify-start gap-2 text-sm text-gray-600 flex-wrap">
                    {/* <div className="flex items-center gap-1">

                 <span className="text-blue-600 font-medium">       

                         Location: {universityData.city}

                       </span>

                     </div> */}

                    <div className="flex items-center gap-1 min-w-0 flex-1">
                      <FaMapMarkerAlt className="text-blue-500 flex-shrink-0" />

                      <span
                        className="text-blue-600 font-medium truncate"
                        title={`Location: ${universityData.city}`}
                      >
                        Location: {universityData.city}
                      </span>
                    </div>

                    <div className="mt-0">
                      <button
                        onClick={handleClick}
                        className="flex items-center gap-2 border border-blue-700 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-50 transition whitespace-nowrap"
                      >
                        <FaLocationArrow className="text-sm" />
                        Get Direction
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Detail Block - RIGHT ALIGNED */}

              <div className="flex items-start justify-end gap-4 text-sm mr-50">
                {/* Type + SETARA Ranking */}

                <div className="flex flex-col gap-2">
                  {/* TYPE */}

                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm">Type:</span>

                    <span className="bg-blue-700 text-white px-2.5 py-1 rounded-full font-medium text-sm">
                      {universityData.inst_type}
                    </span>
                  </div>

                  {/* SETARA */}

                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <span className="font-medium">SETARA:</span>

                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < Math.round(universityData.rating || 3)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Featured + Approved By (Stacked) */}

                <div className="flex flex-col gap-1.5 ml-20">
                  <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />

                    <span>Featured</span>
                  </div>

                  <div className="text-gray-600 text-sm">
                    <span className="font-medium">Approved By:</span> MQA
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
              {/* Main large image */}

              <div className="md:col-span-6 relative">
                {featuredPhotos?.length > 0 && (
                  <img
                    src={getImageUrl(
                      featuredPhotos.find((photo) => photo.title === "Main")
                        ?.photo_path ||
                        featuredPhotos.find((photo) => photo.title === "Campus")
                          ?.photo_path ||
                        featuredPhotos[0]?.photo_path ||
                        "",
                    )}
                    alt="Main"
                    className="w-full h-[300px] md:h-[350px] object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}

                <button className="absolute bottom-4 left-4 bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
                  View All Photos
                </button>
              </div>

              {/* Grid of 4 smaller images */}

              <div className="md:col-span-6 grid grid-cols-2 gap-3">
                {featuredPhotos

                  ?.filter((photo) => photo.title !== "Main")

                  .slice(0, 4)

                  .map((photo, index) => (
                    <div
                      key={photo.id}
                      className="relative h-[140px] md:h-[168px]"
                    >
                      <img
                        src={getImageUrl(photo.photo_path)}
                        alt={photo.photo_name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* University Details Section */}

        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-5 md:px-6 py-4 -mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Content (Cards + Study Options) */}

              <div className="col-span-2 space-y-4">
                {/* Cards */}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {/* Established Year */}

                  <div className="bg-white rounded-lg shadow-sm py-2 px-3 flex flex-col items-center text-center">
                    <BsCalendar3 className="text-xl text-blue-600" />

                    <h3 className="text-base font-bold leading-tight">
                      {universityData.established || "1970"}
                    </h3>

                    <p className="text-gray-600 text-xs">Established Year</p>
                  </div>

                  {/* Scholarship */}

                  <div className="bg-white rounded-lg shadow-sm py-2 px-3 flex flex-col items-center text-center">
                    <FaGraduationCap className="text-xl text-green-600" />

                    <h3 className="text-base font-bold leading-tight">
                      {universityData.Scholarship ? "Yes" : "No"}
                    </h3>

                    <p className="text-gray-600 text-xs">Scholarship</p>
                  </div>

                  {/* Clicks */}

                  <div className="bg-white rounded-lg shadow-sm py-2 px-3 flex flex-col items-center text-center">
                    <FaEye className="text-xl text-purple-600" />

                    <h3 className="text-base font-bold leading-tight">
                      {universityData.clicks}
                    </h3>

                    <p className="text-gray-600 text-xs">Clicks</p>
                  </div>

                  {/* Courses */}

                  <div className="bg-white rounded-lg shadow-sm py-2 px-3 flex flex-col items-center text-center">
                    <FaSchool className="text-xl text-orange-600" />

                    <h3 className="text-base font-bold leading-tight">
                      {universityData.courses || "N/A"}
                    </h3>

                    <p className="text-gray-600 text-xs">Courses</p>
                  </div>
                </div>

                {/* Study Options */}

                <div className="flex flex-wrap gap-4">
                  {[].map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${option.bg} ${option.border} cursor-pointer transition`}
                    >
                      <div
                        className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${option.icon} border-current`}
                      >
                        <FaCheck className="text-xs" />
                      </div>

                      <span className={`text-sm font-medium ${option.text}`}>
                        {option.label}
                      </span>
                    </div>
                  ))}

                  {/* </div> */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 -mt-2">
                  {/* TOP LEFT: Accredited By - DYNAMIC */}

                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FaBuilding className="text-blue-600 text-lg" />

                      <h3 className="text-base font-semibold text-gray-900">
                        Accredited By
                      </h3>
                    </div>

                    <ul className="space-y-2 text-sm text-gray-700">
                      {Array.isArray(universityData.accredited_by) ? (
                        universityData.accredited_by.map(
                          (accreditation, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-600 mt-0.5">•</span>

                              <span>{accreditation}</span>
                            </li>
                          ),
                        )
                      ) : (
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>

                          <span>{universityData.accredited_by || "MQA"}</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Hostel Facility */}

                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FaBed className="text-green-600 text-lg" />

                      <h3 className="text-base font-semibold text-gray-900">
                        Hostel Facility
                      </h3>
                    </div>

                    <ul className="space-y-2 text-sm text-gray-700">
                      {Array.isArray(universityData.hostel_facility) ? (
                        universityData.hostel_facility.map(
                          (facility, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-600 mt-0.5">•</span>

                              <span>{facility}</span>
                            </li>
                          ),
                        )
                      ) : (
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">•</span>

                          <span>
                            {universityData.hostel_facility || "Available"}
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Total Students */}

                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FaUsers className="text-purple-600 text-lg" />

                      <h3 className="text-base font-semibold text-gray-900">
                        Total Students
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Local Students */}

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Local Students
                          </span>

                          <span className="text-sm font-bold text-purple-700">
                            {universityData.local_students || "0"}
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{
                              width:
                                universityData.local_students &&
                                universityData.local_students !== "0"
                                  ? "75%"
                                  : "0%",
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* International Students */}

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            International Students
                          </span>

                          <span className="text-sm font-bold text-blue-700">
                            {universityData.international_students || "0"}
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width:
                                universityData.international_students &&
                                universityData.international_students !== "0"
                                  ? "45%"
                                  : "0%",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info - Desktop */}

                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FaPhoneAlt className="text-orange-600 text-lg" />

                      <h3 className="text-base font-semibold text-gray-900">
                        Contact Info
                      </h3>
                    </div>

                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-center gap-3">
                        <FaPhoneAlt className="text-orange-500" />

                        <span>+60 1121376171</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <FaFax className="text-gray-500" />

                        <span>+91 9818560331</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <FaEnvelope className="text-blue-500" />

                        <span>info@educationmalaysia.in</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Added Facilities section */}

                <div className="mt-6 bg-white rounded-2xl shadow-md border border-gray-100 p-4 w-full">
                  <h3 className="text-md font-bold text-gray-900 mb-4">
                    Faculties:
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {universityData.offeredCourses.map((course, index) => (
                      <div
                        key={index}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-xl text-sm font-medium transition"
                      >
                        {course}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Content (Global Rankings & Actions) */}

              <div className="col-span-1 space-y-3">
                {/* Action Buttons */}

                <div className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="w-full bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                  >
                    <FaDownload className="text-base" />
                    Download Brochure
                  </button>

                  <button
                    onClick={() => setIsFeeOpen(true)}
                    className="w-full bg-gray-100 border border-gray-300 text-gray-800 px-5 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <FaFileAlt className="text-base" />
                    Download Fees Structure
                  </button>

                  <button
                    onClick={() => setIsCounsellingOpen(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm font-bold animate-pulse"
                  >
                    <FaBookOpen className="text-base" />
                    Book Direct University Counciling
                  </button>

                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="w-full bg-gray-100 border border-gray-300 text-gray-800 px-5 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <FaEdit className="text-base" />
                    Write a review
                  </button>
                </div>

                <div className="bg-white rounded-xl shadow-md p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Global Rankings
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg p-5 text-white shadow">
                      <p className="text-2xl font-bold">
                        #{universityData.rank || "397"}
                      </p>

                      <p className="text-sm opacity-90">World Rank</p>
                    </div>

                    <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-lg p-5 text-white shadow">
                      <p className="text-2xl font-bold">
                        {universityData.qs_rank || "1001-1400"}
                      </p>

                      <p className="text-sm opacity-90">QS Rank</p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg p-5 text-white shadow">
                      <p className="text-2xl font-bold">
                        {universityData.times_rank || "1501+"}
                      </p>

                      <p className="text-sm opacity-90">Times Rank</p>
                    </div>

                    {universityData.qs_asia_rank && (
                      <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg p-5 text-white shadow">
                        <p className="text-2xl font-bold">
                          {universityData.qs_asia_rank}
                        </p>

                        <p className="text-sm opacity-90">QS Asia Rank</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Study Options */}

                  <div className="bg-white rounded-xl shadow-sm p-4 w-full">
                    <h2 className="text-lg font-semibold mb-4">
                      Study Options
                    </h2>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {
                          label: "Study Online",

                          bgColor: "bg-green-50",

                          border: "border-green-300",

                          text: "text-green-700",

                          icon: "text-green-500",
                        },

                        {
                          label: "Part Time",

                          bgColor: "bg-blue-50",

                          border: "border-blue-300",

                          text: "text-blue-700",

                          icon: "text-blue-500",
                        },

                        {
                          label: "Full Time",

                          bgColor: "bg-purple-50",

                          border: "border-purple-300",

                          text: "text-purple-700",

                          icon: "text-purple-500",
                        },
                      ].map((option, index) => (
                        <div
                          key={index}
                          className={`flex flex-row items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 ${option.bgColor} ${option.border}`}
                        >
                          <div
                            className={`w-4 h-4 flex items-center justify-center ${option.icon}`}
                          >
                            <FaCheck className="text-xs" />
                          </div>

                          <span
                            className={`text-sm font-medium whitespace-nowrap ${option.text}`}
                          >
                            {option.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* </div> */}

      {/* Tabs */}

      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-14 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto hide-scrollbar">
          {getFilteredTabs().map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`py-4 text-sm font-medium transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                index === 0 ? "pl-0 pr-6" : "px-6"
              } ${
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

      {/* Tab Content */}

      {/* Conditional rendering for different layouts */}

      {activeTab === "courses" ? (
        <div id="courses-section" className="py-4">
          <Courses courseSlug={courseSlug} key={location.search} />{" "}
          {/* ✅ courseSlug pass karo */}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-xl p-4 shadow-md min-h-[400px]"
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {activeTab !== "courses" && (
            <div className="col-span-2 md:col-span-1">
              {/* Get In Touch Form */}

              <div className="mb-2 ">
                {" "}
                <GetinTouchUiversity />
              </div>

              {/* 🎯 Featured Universities - Get In Touch ke neeche */}

              <div className="mt-10 ">
                <FeaturedUniversities />
              </div>

              {/* University Courses Card */}

              <div className="mt-10">
                <UniversityCoursesCard />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Brochure Popup (Download Brochure) */}
      <PopupForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        universityData={universityData}
        formType="brochure"
      />

      {/* Fee Structure Popup */}
      <PopupForm
        isOpen={isFeeOpen}
        onClose={() => setIsFeeOpen(false)}
        universityData={universityData}
        formType="fee"
      />

      {/* Apply Popup */}
      <PopupForm
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        universityData={universityData}
        formType="apply"
      />

      {/* Counselling Popup (Enquire Now) */}
      <PopupForm
        isOpen={isCounsellingOpen}
        onClose={() => setIsCounsellingOpen(false)}
        universityData={universityData}
        formType="counselling"
      />

      {/* Review Modal */}

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        universityData={universityData}
      />
    </>
  );
};

export default UniversityDetailPage;
