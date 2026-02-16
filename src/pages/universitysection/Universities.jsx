import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";
import TrendingCourses from "../../components/TrendingCourses";
import {
  FaUniversity,
  FaGraduationCap,
  FaGlobe,
  FaSchool,
  FaCheckCircle,
  FaBriefcase,
  FaArrowRight,
} from "react-icons/fa";
import {
  Home,
  Layers,
  Loader2,
  Shield,
  Award,
  CheckCircle2,
  BookOpen,
  Users,
  FileCheck,
} from "lucide-react";
import SeoHead from "../../components/SeoHead";
import DynamicBreadcrumb from "../../components/DynamicBreadcrumb";

// Format HTML helper function
//// Format HTML helper function - COMPLETELY FIXED VERSION
const formatHTML = (html) => {
  if (!html) return "";

  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  let decoded = textarea.value;

  // --- Start Cleaning & Formatting ---
  decoded = decoded.replace(/<span[^>]*>/gi, "");
  decoded = decoded.replace(/<\/span>/gi, "");
  decoded = decoded.replace(/style="[^"]*"/gi, "");
  decoded = decoded.replace(/&nbsp;/gi, " ");

  //

  // Headings formatting
  decoded = decoded.replace(
    /<h([1-3])(.*?)>([^<]*?)<\/h\1>/gi,
    (_m, level, attributes, content) => {
      if (level === "1") {
        return `<h1 class="text-2xl md:text-3xl font-bold text-gray-800 pb-2 mt-8 mb-3">${content.trim()}</h1>`;
      } else if (level === "2") {
        return `<h2 class="text-xl md:text-2xl font-bold text-gray-800 pb-2 mt-6 mb-3">${content.trim()}</h2>`;
      }
      return `<h3 class="text-lg md:text-xl font-bold text-gray-800 mt-5 mb-2">${content.trim()}</h3>`;
    },
  );

  decoded = decoded.replace(/<p>\s*:\s*/gi, "<p>");
  decoded = decoded.replace(
    /<strong>(.*?)<\/strong>/gi,
    `<h4 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 mt-3 sm:mt-6">$1</h4>`,
  );
  decoded = decoded.replace(
    /<b>(.*?)<\/b>/gi,
    `<h4 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 mt-3 sm:mt-6">$1</h4>`,
  );

  // Paragraph styling
  decoded = decoded.replace(
    /<p>/g,
    '<p class="text-gray-700 leading-relaxed mb-4">',
  );

  // Just keep backend table structure, only add wrapper styling
  decoded = decoded.replace(/<table([^>]*)>/gi, (match, attrs) => {
    console.log("📊 Using backend table headers as-is");
    return match; // Keep original table tag
  });

  // Convert first TR with header text to THEAD if needed

  // ============================================
  // TABLE WRAPPER & BEAUTIFUL STYLING
  // ============================================

  decoded = decoded.replace(
    /<table(.*?)>/gi,
    `<div style="margin: 2rem 0; border-radius: 1rem; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); padding: 0.25rem;">
      <div style="overflow-x: auto;">
        <div style="background: white; border-radius: 0rem; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;" $1>`,
  );

  decoded = decoded.replace(
    /<\/table>/gi,
    `</table>
        </div>
      </div>
    </div>`,
  );

  // Ensure thead styling
  // Ensure thead styling
  decoded = decoded.replace(
    /<thead(?![^>]*style=)/gi,
    '<thead style="background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);"',
  );

  // Ensure th styling
  decoded = decoded.replace(
    /<th(?![^>]*style=)/gi,
    '<th style="color: white; padding: 1rem 1.25rem; text-align: left; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; border: none; white-space: nowrap;"',
  );
  // Table body
  decoded = decoded.replace(/<tbody[^>]*>/gi, "<tbody>");

  // Alternating row colors
  let rowCounter = 0;
  decoded = decoded.replace(/<tbody[^>]*>[\s\S]*?<\/tbody>/gi, (tbody) => {
    rowCounter = 0;
    return tbody.replace(/<tr(?![^>]*style=)/gi, () => {
      const bgColor = rowCounter % 2 === 0 ? "#f9fafb" : "#ffffff";
      const hoverColor = "#eff6ff";
      rowCounter++;
      return `<tr style="background-color: ${bgColor}; border-bottom: 1px solid #e5e7eb; transition: all 0.2s ease;" onmouseover="this.style.backgroundColor='${hoverColor}'" onmouseout="this.style.backgroundColor='${bgColor}'"`;
    });
  });

  // Table cells base styling
  decoded = decoded.replace(
    /<td(?![^>]*style=)/gi,
    '<td style="padding: 1.25rem 1.5rem; color: #1f2937; font-size: 0.95rem; border: none; vertical-align: middle;"',
  );

  // Number badge (serial numbers)
  decoded = decoded.replace(
    /<td style="padding: 1\.25rem 1\.5rem; color: #1f2937; font-size: 0\.95rem; border: none; vertical-align: middle;">(\d+)<\/td>/gi,
    '<td style="padding: 1.25rem 1.5rem; border: none; vertical-align: middle;"><span style="display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); color: #1e40af; border-radius: 50%; font-weight: 700; font-size: 0.95rem;">$1</span></td>',
  );

  // Year styling (bold blue)
  decoded = decoded.replace(
    /<td style="padding: 1\.25rem 1\.5rem; color: #1f2937; font-size: 0\.95rem; border: none; vertical-align: middle;">(19\d{2}|20\d{2})<\/td>/gi,
    '<td style="padding: 1.25rem 1.5rem; border: none; vertical-align: middle;"><span style="color: #2563eb; font-weight: 700; font-size: 1rem;">$1</span></td>',
  );

  // Location with green pin icon - UPDATE REGEX
  decoded = decoded.replace(
    /<td style="padding: 1\.25rem 1\.5rem; color: #1f2937; font-size: 0\.95rem; border: none; vertical-align: middle;">([^<]*(?:\/[^<]*)*)<\/td>/gi,
    (match, location) => {
      // Check if it's a location (has / or contains city names)
      if (
        location.includes("/") ||
        /Kuala|Selangor|Johor|Penang|Melaka|Putrajaya|Cyberjaya|Pahang|Kedah|Perak|Sarawak|Sabah|Minden|Bangi|Beach Valley|Australia|Malaysia/i.test(
          location,
        )
      ) {
        return `<td style="padding: 1.25rem 1.5rem; border: none; vertical-align: middle;">
        <span style="display: inline-flex; align-items: center; gap: 0.5rem; color: #374151;">
          <svg style="width: 1.1rem; height: 1.1rem; color: #10b981; flex-shrink: 0;" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
          </svg>
          <span style="font-size: 0.95rem;">${location}</span>
        </span>
      </td>`;
      }
      return match;
    },
  );

  // University names (bold)
  decoded = decoded.replace(
    /<td style="padding: 1\.25rem 1\.5rem; color: #1f2937; font-size: 0\.95rem; border: none; vertical-align: middle;">([^<]+(?:<a[^>]*>.*?<\/a>)?[^<]*)<\/td>/gi,
    (match, content) => {
      if (
        content.includes("inline-flex") ||
        content.includes("linear-gradient") ||
        /^\d+$/.test(content.trim()) ||
        /^(19|20)\d{2}$/.test(content.trim())
      ) {
        return match;
      }
      return `<td style="padding: 1.25rem 1.5rem; color: #111827; font-weight: 600; font-size: 0.95rem; border: none; vertical-align: middle;">${content}</td>`;
    },
  );

  // Lists
  decoded = decoded.replace(
    /<ul>/g,
    '<ul class="list-disc pl-6 space-y-2 text-gray-800">',
  );
  decoded = decoded.replace(
    /<ol>/g,
    '<ol class="list-decimal pl-6 space-y-2 text-gray-800">',
  );
  decoded = decoded.replace(/<li>/g, '<li class="mb-1">');

  return decoded;
};

// Helper component to safely render HTML
const RenderHtml = ({ htmlString }) => {
  if (!htmlString) return null;
  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
};

const Universities = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("public");
  const [seo, setSeo] = useState({});
  const [showAll, setShowAll] = useState(false);

  const [universities, setUniversities] = useState({
    public: [],
    private: [],
    foreign: [],
  });

  const [pageContent, setPageContent] = useState({
    top: "",
    public: "",
    private: "",
    foreign: "",
  });

  const [pageTitle, setPageTitle] = useState("TOP UNIVERSITIES IN MALAYSIA");

  // Pagination states
  const [currentPage, setCurrentPage] = useState({
    public: 1,
    private: 1,
    foreign: 1,
  });
  const itemsPerPage = 10;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchUniversities = async () => {
      try {
        console.log("🔄 Fetching universities...");

        const [publicRes, privateRes, foreignRes] = await Promise.all([
          api.get("/universities-by-institute-type/public-institution"),
          api.get("/universities-by-institute-type/private-institution"),
          api.get("/universities-by-institute-type/foreign-university"),
        ]);

        console.log("✅ API Responses:", { publicRes, privateRes, foreignRes });

        setUniversities({
          public: publicRes.data.data.universities || [],
          private: privateRes.data.data.universities || [],
          foreign: foreignRes.data.data.universities || [],
        });

        console.log("📊 Universities loaded:", {
          public: publicRes.data.data.universities?.length || 0,
          private: privateRes.data.data.universities?.length || 0,
          foreign: foreignRes.data.data.universities?.length || 0,
        });
      } catch (error) {
        console.error("❌ Error fetching universities:", error);
        console.error(
          "❌ Error details:",
          error.response?.data || error.message,
        );
      }
    };

    const fetchContent = async () => {
      try {
        const response = await api.get("/universities");
        const data = response.data;
        setSeo(data.seo || {});

        setPageContent({
          top: formatHTML(data.pageContentTop?.description),
          public: formatHTML(data.pageContentPublic?.description),
          private: formatHTML(data.pageContentPrivate?.description),
          foreign: formatHTML(data.pageContentForeign?.description),
        });

        if (data.pageContentTop?.title) {
          setPageTitle(data.pageContentTop.title);
        }
      } catch (error) {
        console.error("Error fetching university content:", error);
        // Set default SEO and content if API fails
        setSeo({
          meta_description:
            "Explore top universities in Malaysia including public, private, and foreign institutions.",
          meta_keyword:
            "universities in malaysia, public universities, private universities, foreign universities",
        });
        setPageContent({
          top: "",
          public: "",
          private: "",
          foreign: "",
        });
        // Keep default page title
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
    fetchUniversities();
  }, []);

  const renderUniversityTable = (data, type) => {
    if (!data || data.length === 0) {
      return (
        <p className="text-center text-gray-500 py-8">No universities found.</p>
      );
    }

    // Pagination logic
    const currentPageNum = currentPage[type];
    const indexOfLastItem = currentPageNum * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
      setCurrentPage((prev) => ({
        ...prev,
        [type]: pageNumber,
      }));
      // Scroll to table top
      window.scrollTo({ top: 600, behavior: "smooth" });
    };

    return (
      <div className="relative">
        {/* Scroll Indicator for Mobile */}
        <div className="md:hidden text-center mb-2">
          <p className="text-xs text-gray-500 italic flex items-center justify-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
            Swipe to see more
          </p>
        </div>

        <div
          style={{
            margin: "1rem 0",
            borderRadius: "0.75rem",
            overflow: "hidden",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
            padding: "0.15rem",
          }}
        >
          <div
            className="overflow-x-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin",
              scrollbarColor: "#93c5fd #e0e7ff",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "0rem",
                overflow: "hidden",
                minWidth: "600px",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead
                  style={{
                    background:
                      "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                  }}
                >
                  <tr>
                    <th className="px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 text-white text-left font-bold text-[10px] sm:text-xs uppercase tracking-wide border-0 whitespace-nowrap">
                      NO.
                    </th>
                    <th className="px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 text-white text-left font-bold text-[10px] sm:text-xs uppercase tracking-wide border-0 whitespace-nowrap">
                      NAME OF UNIVERSITY
                    </th>
                    <th className="px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 text-white text-left font-bold text-[10px] sm:text-xs uppercase tracking-wide border-0 whitespace-nowrap">
                      YEAR
                    </th>
                    <th className="px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 text-white text-left font-bold text-[10px] sm:text-xs uppercase tracking-wide border-0 whitespace-nowrap">
                      LOCATION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((uni, index) => {
                    const bgColor = index % 2 === 0 ? "#f9fafb" : "#ffffff";
                    const actualIndex = indexOfFirstItem + index + 1;
                    return (
                      <tr
                        key={uni.id}
                        style={{
                          backgroundColor: bgColor,
                          borderBottom: "1px solid #e5e7eb",
                          transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#eff6ff")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = bgColor)
                        }
                      >
                        {/* Serial Number */}
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 border-0 align-middle">
                          <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 rounded-full font-bold text-xs sm:text-sm">
                            {actualIndex}
                          </span>
                        </td>

                        {/* University Name */}
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 text-gray-900 font-semibold text-xs sm:text-sm md:text-base border-0 align-middle">
                          {uni.name}
                        </td>

                        {/* Year */}
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 border-0 align-middle">
                          <span className="text-blue-600 font-bold text-sm sm:text-base md:text-lg">
                            {uni.established_year || "N/A"}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 border-0 align-middle">
                          <span className="inline-flex items-center gap-1.5 sm:gap-2 text-gray-700">
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-xs sm:text-sm md:text-base">
                              {uni.city && uni.state
                                ? `${uni.city} / ${uni.state}`
                                : uni.city || uni.state || "N/A"}
                            </span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page Info */}
                <div className="text-sm sm:text-base text-gray-700 font-medium">
                  Showing{" "}
                  <span className="font-bold text-blue-600">
                    {indexOfFirstItem + 1}
                  </span>
                  -
                  <span className="font-bold text-blue-600">
                    {Math.min(indexOfLastItem, data.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-blue-600">{data.length}</span>{" "}
                  universities
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPageNum - 1)}
                    disabled={currentPageNum === 1}
                    className={`flex items-center gap-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      currentPageNum === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:-translate-x-0.5"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1.5">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      // Show first page, last page, current page, and pages around current
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPageNum - 1 &&
                          pageNum <= currentPageNum + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg font-bold text-sm sm:text-base transition-all duration-200 ${
                              currentPageNum === pageNum
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-110 ring-2 ring-blue-300"
                                : "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 hover:shadow-md"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === currentPageNum - 2 ||
                        pageNum === currentPageNum + 2
                      ) {
                        return (
                          <span
                            key={pageNum}
                            className="px-1 text-gray-400 font-bold"
                          >
                            •••
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPageNum + 1)}
                    disabled={currentPageNum === totalPages}
                    className={`flex items-center gap-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      currentPageNum === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:translate-x-0.5"
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderColoredHeading = (title) => {
    if (!title) return null;
    const words = title.split(" ");
    return (
      <>
        {words.map((word, index) => (
          <span
            key={index}
            className={index % 2 === 0 ? "text-blue-800" : "text-blue-600"}
          >
            {word}{" "}
          </span>
        ))}
      </>
    );
  };

  const cardData = [
    {
      type: "public",
      icon: <FaUniversity className="text-blue-600 text-4xl" />,
      title: "Public Universities",
      description:
        "Discover Malaysia's top-ranked public institutions offering quality education at affordable rates.",
      bgColor: "blue",
      path: "/universities/public-institution-in-malaysia",
    },
    {
      type: "private",
      icon: <FaGraduationCap className="text-orange-600 text-4xl" />,
      title: "Private Universities",
      description:
        "Explore leading private universities known for industry connections and innovative programs.",
      bgColor: "orange",
      path: "/universities/private-institution-in-malaysia",
    },
    {
      type: "foreign",
      icon: <FaGlobe className="text-green-600 text-4xl" />,
      title: "Foreign Universities",
      description:
        "Find international branch campuses offering globally recognized degrees.",
      bgColor: "green",
      path: "/universities/foreign-universities-in-malaysia", // ✅ SAHI PATH
    },
  ];

  const colorClasses = {
    blue: {
      text: "text-blue-800",
      bg: "bg-blue-600",
      hover: "hover:bg-blue-700",
      lightBg: "bg-blue-100",
    },
    orange: {
      text: "text-orange-800",
      bg: "bg-orange-600",
      hover: "hover:bg-orange-700",
      lightBg: "bg-orange-100",
    },
    green: {
      text: "text-green-800",
      bg: "bg-green-600",
      hover: "hover:bg-green-700",
      lightBg: "bg-green-100",
    },
  };

  // Data for new accreditation sections
  const mainBodies = [
    {
      name: "Malaysian Qualifications Agency (MQA)",
      area: "Higher education: programmes & institutions",
      description:
        "Accredits higher-education programmes, implements the Malaysian Qualifications Framework (MQF), maintains the Malaysian Qualifications Register (MQR) listing accredited programmes.",
      note: "Statutory body under Malaysian Qualifications Agency Act 2007.",
      icon: Shield,
      color: "from-cyan-500 to-cyan-600",
    },
    {
      name: "Finance Accreditation Agency (FAA)",
      area: "Financial services / training programmes",
      description:
        "Accredits training programmes in financial services industry (banks, insurance, securities) to ensure quality of adult professional programmes.",
      note: "More specialised to professional continuing education rather than general higher ed.",
      icon: Shield,
      color: "from-cyan-500 to-cyan-700",
    },
  ];

  const professionalBodies = [
    {
      name: "Board of Engineers Malaysia (BEM)",
      area: "Engineering education & registration",
      description:
        "Accredits engineering degree & diploma programmes for registration as Graduate Engineers; ensures programmes meet international accords (Washington, Sydney, Dublin) via EAC.",
      note: "For engineering-related programmes, professional registration depends on this accreditation.",
      icon: Award,
    },
    {
      name: "Actuarial Society of Malaysia (ASM)",
      area: "Actuarial profession",
      description:
        "The representative body for actuaries in Malaysia; supports education, professional development and recognition of actuarial qualifications.",
      note: "Ensures actuarial standards and professional competence.",
      icon: FileCheck,
    },
    {
      name: "Technological Association Malaysia (TAM)",
      area: "Technology & engineering-science",
      description:
        "Serves as a learned society, professional association, supports education, research, professional development across technology/engineering disciplines.",
      note: "Membership-based, supportive/recognition role rather than formal accreditation of degrees.",
      icon: Users,
    },
  ];

  // Calculate items to show (2 rows x 3 columns = 6 items for main cards)
  const itemsPerRow = 3;
  const rowsToShow = 2;
  const maxItemsToShow = itemsPerRow * rowsToShow;

  // For University cards - show all 3 always
  const displayedCards = cardData;

  return (
    <>
      {/* ✅ Dynamic SEO with SeoHead */}
      <SeoHead
        pageType="universities-listing"
        data={{
          name: pageTitle,
          description: seo?.meta_description,
          keywords: seo?.meta_keyword,
        }}
      />

      {/* ✅ Dynamic Breadcrumb */}
      <DynamicBreadcrumb
        pageType="universities-listing"
        data={{
          name: pageTitle,
        }}
      />

      <div className="py-10 px-4">
        {/* Main Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
          {renderColoredHeading(pageTitle)}
        </h1>

        {/* University Cards - 2 rows, 3 columns */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayedCards.map((card) => {
              const color = colorClasses[card.bgColor];
              return (
                <div
                  key={card.type}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col items-center"
                >
                  <div className={`${color.lightBg} p-4 rounded-full mb-4`}>
                    {card.icon}
                  </div>
                  <h3 className={`text-xl font-bold ${color.text} mb-3`}>
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    {card.description}
                  </p>
                  <button
                    onClick={() => navigate(card.path)}
                    className={`mt-auto ${color.bg} ${color.hover} text-white font-semibold py-2 px-6 rounded-lg transition-colors`}
                  >
                    BROWSE ALL
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* INTERNATIONAL SCHOOLS SECTION */}
        <div className="max-w-6xl mx-auto mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            <span className="text-purple-800">International Schools</span>{" "}
            <span className="text-orange-500">in Malaysia</span>
          </h2>
          <div className="flex justify-center grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col items-center">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <FaSchool className="text-purple-600 text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-purple-800 mb-3">
                International Schools
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Discover top international schools in Malaysia that offer
                globally recognized curriculums like IGCSE, IB, and American
                diplomas.
              </p>
              <button
                onClick={() =>
                  navigate("/universities/international-school-in-malaysia")
                }
                className="mt-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                BROWSE ALL
              </button>
            </div>
          </div>
        </div>

        {/* ACCREDITING & PROFESSIONAL BODIES SECTION */}
        <div className="max-w-6xl mx-auto mt-24">
          {/* Main Accreditation Bodies Section */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            <span className="text-cyan-800">Accrediting</span>{" "}
            <span className="text-rose-600">and Professional Bodies</span>
          </h2>
          <section className="mb-16">
            <div className="mb-12">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Shield className="w-8 h-8 text-cyan-600" />
                <h2 className="text-3xl font-bold text-cyan-800">
                  Main Accreditation Bodies
                </h2>
              </div>
              <p className="text-lg text-gray-600 text-center">
                National agencies responsible for quality assurance and
                accreditation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {mainBodies.map((body, index) => {
                const Icon = body.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className={`h-2 bg-gradient-to-r ${body.color}`}></div>
                    <div className="p-8">
                      <div className="flex items-start gap-4 mb-6">
                        <div
                          className={`p-3 bg-gradient-to-br ${body.color} rounded-lg flex-shrink-0`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {body.name}
                          </h3>
                          <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wide">
                            {body.area}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {body.description}
                      </p>
                      <div className="bg-cyan-50 rounded-lg p-4 border-l-4 border-cyan-500">
                        <p className="text-sm text-gray-600 italic">
                          {body.note}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          navigate("/resources/Graduatepass/overview")
                        }
                        className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                      >
                        View Detail
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Professional Bodies Section */}
          <section className="mb-16">
            <div className="mb-12">
              <div className="flex items-center justify-center gap-3 mb-3">
                <BookOpen className="w-8 h-8 text-rose-600" />
                <h2 className="text-3xl font-bold text-rose-800">
                  Professional Bodies
                </h2>
              </div>
              <p className="text-lg text-gray-600 text-center">
                Discipline-specific organizations that regulate professional
                standards and recognition
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {professionalBodies.map((body, index) => {
                const Icon = body.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl hover:border-rose-300 transition-all duration-300 flex flex-col"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {body.name}
                    </h3>
                    <p className="text-sm font-semibold text-rose-600 uppercase tracking-wide mb-4">
                      {body.area}
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
                      {body.description}
                    </p>
                    <div className="bg-rose-50 rounded-lg p-4 border-l-4 border-rose-500 mb-6">
                      <p className="text-sm text-gray-600 italic">
                        {body.note}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        navigate("/resources/Graduatepass/overview")
                      }
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors mt-auto"
                    >
                      View Detail
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Key Takeaways Section */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Key Takeaways
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold">MQA accreditation</span> is
                    essential for higher education programmes to be recognized
                    and valid in Malaysia.
                  </p>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold">
                      Professional body recognition
                    </span>{" "}
                    adds significant value for regulated professions like
                    engineering, helping with registration and licensure.
                  </p>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold">Dual compliance</span> is
                    often required: institutions must meet both national
                    accreditation (MQA/FAA) and professional body standards for
                    regulated fields.
                  </p>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 leading-relaxed">
                    Always verify that your chosen programme is accredited by
                    the relevant bodies to ensure your qualification will be
                    recognized for employment and further study.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Tab Section */}
        <div className="max-w-6xl mx-auto mt-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">
            <span className="text-blue-800">Find out more</span>{" "}
            <span className="text-orange-500">about:</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setActiveTab("public")}
              className={`group relative overflow-hidden rounded-xl bg-white px-6 py-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${activeTab === "public" ? "ring-2 ring-blue-600" : ""}`}
            >
              <h3 className="text-xl font-bold text-blue-800">
                PUBLIC UNIVERSITIES
              </h3>
            </button>
            <button
              onClick={() => setActiveTab("private")}
              className={`group relative overflow-hidden rounded-xl bg-white px-6 py-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${activeTab === "private" ? "ring-2 ring-orange-600" : ""}`}
            >
              <h3 className="text-xl font-bold text-orange-800">
                PRIVATE UNIVERSITIES
              </h3>
            </button>
            <button
              onClick={() => setActiveTab("foreign")}
              className={`group relative overflow-hidden rounded-xl bg-white px-6 py-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${activeTab === "foreign" ? "ring-2 ring-green-600" : ""}`}
            >
              <h3 className="text-xl font-bold text-green-800">
                FOREIGN UNIVERSITIES
              </h3>
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="max-w-6xl mx-auto mt-8 sm:mt-12 md:mt-16 px-2 sm:px-4">
          {loading ? (
            <div className="flex justify-center items-center p-6 sm:p-10">
              <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
          ) : (
            <div className="p-3 sm:p-4 md:p-6 bg-white rounded-lg shadow-md">
              {/* API Generated Table ONLY */}
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                  {activeTab === "public" &&
                    "List of Public Universities in Malaysia"}
                  {activeTab === "private" &&
                    "List of Private Universities in Malaysia"}
                  {activeTab === "foreign" &&
                    "List of Foreign Universities in Malaysia"}
                </h3>
                {renderUniversityTable(universities[activeTab], activeTab)}
              </div>
            </div>
          )}
        </div>

        {/* Trending Courses */}
        <div className="max-w-6xl mx-auto mt-16">
          <TrendingCourses />
        </div>
      </div>
    </>
  );
};

export default Universities;
