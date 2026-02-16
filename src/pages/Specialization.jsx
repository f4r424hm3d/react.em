import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Layers,
  BookOpen,
  GraduationCap,
  Sparkles,
  Star,
  Wrench,
  Monitor,
  Heart,
  Briefcase,
  FlaskConical,
  Palette,
  Globe,
  Calculator,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api";
import SeoHead from "../components/SeoHead";
import DynamicBreadcrumb from "../components/DynamicBreadcrumb";

const Specialization = () => {
  const [categories, setCategories] = useState([]);
  const [allSpecializations, setAllSpecializations] = useState([]);
  const [displayedSpecializations, setDisplayedSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seo, setSeo] = useState({});
  const [selectedCategories, setSelectedCategories] = useState(["all"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [coursesDescription, setCoursesDescription] = useState("");

  // Default description text
  const defaultDescription =
    "Whether you're interested in Engineering, Technology, Medicine, Business, Science, or Arts, our platform offers detailed insights to guide your choices.";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchInitialData();
  }, []);

  // Fetch categories and all specializations on mount
  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // Fetch categories
      const categoriesRes = await api.get("/specializations/course-categories");

      if (categoriesRes.data.status && Array.isArray(categoriesRes.data.data)) {
        setCategories(categoriesRes.data.data);
        setSeo(categoriesRes.data.seo || {});
      }

      // Fetch ALL specializations (90 courses)
      const specializationsRes = await api.get("/specializations");

      if (
        specializationsRes.data.status &&
        Array.isArray(specializationsRes.data.data)
      ) {
        setAllSpecializations(specializationsRes.data.data);
        setDisplayedSpecializations(specializationsRes.data.data);
      }

      // Fetch courses description from API (if available)
      // Note: You might need a specific specialization_id here
      // For now, trying with a default ID or can be made dynamic
      try {
        const descriptionRes = await api.get("/page-contents/specialization");
        if (descriptionRes.data.status && descriptionRes.data.data.contents) {
          setCoursesDescription(descriptionRes.data.data.contents.description);
        }
      } catch (error) {
        console.log("No description from API, using default");
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data", error);
      setLoading(false);
    }
  };

  // Handle category selection - Only one category at a time
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories([categoryId]);
    setSearchQuery("");

    if (categoryId === "all") {
      setDisplayedSpecializations(allSpecializations);
    } else {
      const filtered = allSpecializations.filter((spec) => {
        const categoryMatch = categories.find((cat) => cat.slug === categoryId);
        if (categoryMatch) {
          return spec.course_category_id === categoryMatch.id;
        }
        return false;
      });
      setDisplayedSpecializations(filtered);
    }
  };

  const LoadingSkeleton = () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-md p-5 animate-pulse border border-gray-100"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-16 mb-3"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-6 bg-blue-200 rounded-full w-24"></div>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const getSpecializationIcon = (index) => {
    const icons = [
      Wrench,
      Heart,
      FlaskConical,
      GraduationCap,
      Monitor,
      Briefcase,
      Palette,
      Globe,
      Calculator,
      BookOpen,
      Sparkles,
      Star,
    ];
    const IconComponent = icons[index % icons.length];
    return <IconComponent size={22} strokeWidth={2} />;
  };

  const getCategoryIcon = (categoryName) => {
    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes("engineering")) return Wrench;
    if (lowerName.includes("computer") || lowerName.includes("it"))
      return Monitor;
    if (lowerName.includes("health") || lowerName.includes("medicine"))
      return Heart;
    if (
      lowerName.includes("business") ||
      lowerName.includes("management") ||
      lowerName.includes("mba")
    )
      return Briefcase;
    if (lowerName.includes("science")) return FlaskConical;
    if (lowerName.includes("arts") || lowerName.includes("design"))
      return Palette;
    if (
      lowerName.includes("social") ||
      lowerName.includes("media") ||
      lowerName.includes("law")
    )
      return Globe;
    if (lowerName.includes("education")) return GraduationCap;
    return BookOpen;
  };

  // Calculate count for each category from allSpecializations
  const getCategoryCount = (categoryId) => {
    return allSpecializations.filter(
      (spec) => spec.course_category_id === categoryId,
    ).length;
  };

  // Calculate total count for "All" category
  const totalCount = allSpecializations.length;

  // Build category list with "All" at the top
  const categoryList = [
    {
      id: "all",
      name: "All Specializations",
      icon: BookOpen,
      count: totalCount,
      slug: "all",
    },
    ...categories.map((cat) => ({
      id: cat.slug,
      name: cat.name,
      icon: getCategoryIcon(cat.name),
      count: getCategoryCount(cat.id),
      slug: cat.slug,
      categoryId: cat.id,
    })),
  ];

  // Filter displayed specializations based on search
  const filteredSpecializations = displayedSpecializations.filter((spec) =>
    spec.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Display description - FIXED LOGIC
  const shouldShowButton =
    coursesDescription && coursesDescription.length > 200;
  const displayDescription = coursesDescription || defaultDescription;
  const descriptionPreview = showMore
    ? displayDescription
    : displayDescription.substring(0, 501);

  // ✅ Helper to format content: Wraps tables for horizontal scrolling & styling
  const formatContent = (html) => {
    if (!html) return "";
    return html
      .replace(
        /<table/g,
        '<div class="overflow-x-auto my-6 rounded-xl border border-blue-100 shadow-sm bg-white"><table class="w-full min-w-[600px]"',
      )
      .replace(/<\/table>/g, "</table></div>");
  };

  return (
    <>
      {/* ✅ Dynamic SEO */}
      <SeoHead
        pageType="service-detail"
        data={{
          ...seo,
          title: seo?.meta_title || "Specializations - Education Malaysia",
          description:
            seo?.meta_description ||
            "Explore top courses and fields of study in Malaysia with expert guidance.",
          keywords:
            seo?.meta_keyword ||
            "specializations, courses in malaysia, study fields, education malaysia",
          image: seo?.og_image_path,
          url: seo?.page_url,
          canonicalUrl: seo?.page_url, // Ensure this is passed if available
        }}
      />

      {/* ✅ Dynamic Breadcrumb */}
      <DynamicBreadcrumb
        pageType="service-detail"
        data={{
          title: "Specializations",
          slug: "specialization",
        }}
      />

      {/* Hero Section */}
      <div className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{ backgroundImage: "url('/girl banner.png')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-indigo-900/80"></div>
        <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Discover Your Perfect
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Specialization
            </span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Start your academic journey with the right path. Explore top courses
            and fields of study in Malaysia with expert guidance.
          </p>
        </div>
      </div>

      {/* Informational Text Section - Dynamic Content */}
      {/* <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
       */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 px-3 sm:px-4 py-4 sm:py-6 md:py-8 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg shadow-sm relative">
            {/* ✅ Fixed Close Button - Shows only when expanded */}
            {showMore && (
              <button
                onClick={() => setShowMore(false)}
                className="absolute top-3 right-3 z-20 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                title="Close"
              >
                <X size={20} />
              </button>
            )}

            <div className="p-4 sm:p-5 md:p-6">
              <div className="relative">
                <div
                  className={`content-html text-gray-700 text-sm sm:text-base
                  transition-all duration-300 ease-in-out
                  ${showMore ? "max-h-none pt-12 sm:pt-14" : "max-h-[300px]"}
                  ${!showMore && "overflow-hidden"}
                  
                  [&>p]:mb-3 sm:[&>p]:mb-4 [&>p]:leading-relaxed [&>p]:text-sm sm:[&>p]:text-base
                  [&>ul]:my-4 sm:[&>ul]:my-6 [&>ul]:pl-5 sm:[&>ul]:pl-6 [&>ul]:list-disc
                  [&>ul>li]:mb-2 sm:[&>ul>li]:mb-3 [&>ul>li]:pl-2 [&>ul>li]:leading-relaxed [&>ul>li]:text-sm sm:[&>ul>li]:text-base
                  [&>h2]:text-xl sm:[&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-4 sm:[&>h2]:mt-6 [&>h2]:mb-3 sm:[&>h2]:mb-4 [&>h2]:text-gray-800
                  [&>h3]:text-lg sm:[&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-3 sm:[&>h3]:mt-4 [&>h3]:mb-2 sm:[&>h3]:mb-3 [&>h3]:text-gray-800
                  [&>strong]:font-semibold [&>strong]:text-gray-900
                  
                  /* Table Styles Updated for Wrapped Tables */
                  [&>div>table]:w-full [&>div>table]:border-collapse [&>div>table]:text-sm
                  [&>div>table>thead>tr>th]:p-3 [&>div>table>thead>tr>th]:bg-blue-100/50 [&>div>table>thead>tr>th]:text-blue-900 [&>div>table>thead>tr>th]:border-b [&>div>table>thead>tr>th]:border-blue-200 [&>div>table>thead>tr>th]:text-left [&>div>table>thead>tr>th]:font-semibold
                  [&>div>table>tbody>tr>td]:p-3 [&>div>table>tbody>tr>td]:border-b [&>div>table>tbody>tr>td]:border-gray-100 [&>div>table>tbody>tr:last-child>td]:border-0`}
                  dangerouslySetInnerHTML={{
                    __html: formatContent(
                      showMore ? displayDescription : descriptionPreview,
                    ),
                  }}
                />

                {/* Gradient Fade Overlay */}
                {!showMore && shouldShowButton && (
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-50 to-transparent pointer-events-none sm:h-32" />
                )}
              </div>

              {/* Only show button if content is longer than 200 chars */}
              {shouldShowButton && !showMore && (
                <div className="relative z-10 mt-2 sm:mt-4 flex justify-center sm:justify-start">
                  <button
                    onClick={() => setShowMore(true)}
                    className="text-white bg-blue-600 font-medium hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 px-5 py-2 rounded-full shadow-md text-sm sm:text-base cursor-pointer transform hover:scale-105"
                  >
                    Show More
                    <ChevronDown
                      size={16}
                      className="transition-transform duration-200"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 px-3 sm:px-4 py-6 sm:py-8 md:py-12 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Categories Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md lg:shadow-lg p-3 sm:p-4 lg:p-5 sticky top-20 sm:top-24 lg:top-20 z-40 max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col transition-all duration-300">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                Categories
              </h3>

              {/* All Specializations - Always visible with arrow (only on mobile) */}
              <div
                className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer bg-blue-50 border-2 border-blue-200 mb-2 flex-shrink-0"
                onClick={() => {
                  handleCategoryToggle("all");
                  setIsCategoriesExpanded(!isCategoriesExpanded);
                }}
              >
                <div className="flex items-center justify-between flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <BookOpen
                      size={18}
                      className="text-blue-600 flex-shrink-0 sm:w-5 sm:h-5"
                    />
                    <span className="font-medium text-xs sm:text-sm leading-tight text-blue-600 truncate">
                      All Specializations
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0 bg-blue-600 text-white">
                      {totalCount}
                    </span>
                    {/* Arrow icon - Only visible on mobile (lg:hidden) */}
                    <div className="lg:hidden">
                      {isCategoriesExpanded ? (
                        <ChevronUp size={16} className="text-blue-600" />
                      ) : (
                        <ChevronDown size={16} className="text-blue-600" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Categories - Collapsible on mobile, always visible on desktop */}
              <div
                className={`overflow-y-auto overflow-x-hidden transition-all duration-300 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100
                lg:!block lg:!max-h-[60vh] lg:!opacity-100 lg:space-y-1
                ${isCategoriesExpanded ? "block max-h-[60vh] opacity-100 space-y-1" : "hidden max-h-0 opacity-0"}`}
              >
                {categoryList.slice(1).map((category) => {
                  const IconComponent = category.icon;
                  const isSelected = selectedCategories.includes(category.id);

                  return (
                    <div
                      key={category.id}
                      className={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 border-2 border-blue-200"
                          : "hover:bg-gray-50 border-2 border-transparent"
                      }`}
                      onClick={() => handleCategoryToggle(category.id)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      />

                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <IconComponent
                            size={16}
                            className={`flex-shrink-0 sm:w-5 sm:h-5 ${isSelected ? "text-blue-600" : "text-gray-700"}`}
                          />
                          <span
                            className={`font-medium text-xs sm:text-sm leading-tight truncate ${
                              isSelected ? "text-blue-600" : "text-gray-700"
                            }`}
                          >
                            {category.name}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0 ml-1 sm:ml-2 ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {category.count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side: Search + Cards */}
          <div className="flex-1 min-w-0">
            <div className="mb-4 sm:mb-6 lg:sticky lg:top-[60px] lg:z-30 lg:bg-[#f4f8fa] lg:p-2 lg:-mx-2 lg:rounded-xl lg:shadow-md">
              <input
                type="text"
                placeholder="Search specializations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
              />
            </div>

            {/* Cards */}
            {loading ? (
              <LoadingSkeleton />
            ) : filteredSpecializations.length > 0 ? (
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredSpecializations.map((item, index) => (
                  <Link
                    key={item.id}
                    to={`/specialization/${item.slug}`}
                    className="group bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl p-4 sm:p-5 transition-all duration-300 border border-gray-100 hover:border-blue-200 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-gray-700 font-medium text-xs sm:text-sm">
                            Study
                          </span>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md">
                            {getSpecializationIcon(index)}
                          </div>
                        </div>

                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                          <ArrowRight
                            size={14}
                            className="text-white sm:w-4 sm:h-4"
                          />
                        </div>
                      </div>

                      <h3 className="text-gray-900 font-semibold text-sm sm:text-base mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                        {item.name}
                      </h3>

                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-full">
                          In Malaysia
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                          Explore
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layers size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Specializations Found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or select a different category.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Specialization;
