import React, { useRef, useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Layers,
  Info,
  Clock,
  DollarSign,
  Briefcase,
  Share2,
  ArrowLeft,
  Star,
  MapPin,
  Users,
  BookOpen,
  CheckCircle,
  Award,
  TrendingUp,
  Building2,
  Target,
  Lightbulb,
  ChevronRight,
  GraduationCap,
  FileText,
  Calendar,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../api";
import GetInTouchForm from "../components/GetInTouchForm";
import FeaturedUniversities from "../components/FeaturedUniversities";
import TrendingCourse2 from "../components/TrandingCourse2";
import UniversityCard from "../components/UniversityCard";
import SeoHead from "../components/SeoHead";
// import { Helmet } from "react-helmet";

const tabIcons = {
  "About Course": <Info size={16} />,
  Duration: <Clock size={16} />,
  Cost: <DollarSign size={16} />,
  Career: <Briefcase size={16} />,
  Branches: <Share2 size={16} />,
  "Entry Requirement": <FileText size={16} />,
};

const formatHTML = (html) => {
  if (!html) return "";

  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  let decoded = textarea.value;

  // Clean spans and inline styles
  decoded = decoded.replace(/<span[^>]*>/gi, "").replace(/<\/span>/gi, "");
  decoded = decoded.replace(/style="[^"]*"/gi, "").replace(/&nbsp;/gi, " ");

  // TABLE PROCESSING - FINAL FORCE FIX
  // Using explicit grid display for container to force block context
  decoded = decoded.replace(
    /<table[^>]*>/gi,
    '<div class="table-responsive-wrapper" style="display: block !important; width: 100% !important; overflow-x: auto !important; -webkit-overflow-scrolling: touch !important; position: relative !important;">' +
      '<table style="min-width: 800px !important; width: 100% !important; border-collapse: collapse !important;">',
  );
  decoded = decoded.replace(/<\/table>/gi, "</table></div>");

  // Stylish Header
  if (!decoded.includes("<thead")) {
    decoded = decoded.replace(
      /(<table[^>]*>)\s*(<tr[^>]*>)/i,
      '$1<thead class="bg-gradient-to-r from-blue-600 to-blue-800 text-white uppercase text-xs font-bold tracking-wider">$2',
    );
    let firstTrEnd = decoded.indexOf("</tr>");
    if (firstTrEnd !== -1) {
      decoded =
        decoded.substring(0, firstTrEnd + 5) +
        '</thead><tbody class="divide-y divide-gray-100">' +
        decoded.substring(firstTrEnd + 5);
    }
    decoded = decoded.replace(/<\/table>/i, "</tbody></table>");
  } else {
    decoded = decoded.replace(
      /<thead[^>]*>/gi,
      '<thead class="bg-gradient-to-r from-blue-600 to-blue-800 text-white uppercase text-xs font-bold tracking-wider">',
    );
    decoded = decoded.replace(
      /<tbody[^>]*>/gi,
      '<tbody class="divide-y divide-gray-100">',
    );
  }

  // Premium Headers
  decoded = decoded.replace(
    /<th([^>]*)>/gi,
    '<th$1 class="px-5 py-4 border-r border-blue-500/30 last:border-r-0 whitespace-nowrap">',
  );

  // Premium Rows
  decoded = decoded.replace(
    /<tr([^>]*)>/gi,
    '<tr$1 class="hover:bg-blue-50/50 transition-colors even:bg-slate-50">',
  );

  // Premium Cells
  decoded = decoded.replace(
    /<td([^>]*)>/gi,
    '<td$1 class="px-5 py-4 text-gray-700 text-sm border-r border-gray-100 last:border-r-0 align-top leading-relaxed">',
  );

  decoded = decoded.replace(/<th([^>]*)><\/th>/gi, "<th$1>&nbsp;</th>");
  decoded = decoded.replace(/<td([^>]*)><\/td>/gi, "<td$1>&nbsp;</td>");

  // 🎯 ANCHOR/LINK STYLING
  decoded = decoded.replace(
    /<a\s+/gi,
    '<a class="text-blue-600 hover:text-blue-800 underline font-medium transition-colors" ',
  );

  // 🎯 LIST STYLING
  decoded = decoded.replace(/<ul>/gi, '<ul class="space-y-2 my-4 pl-6">');
  decoded = decoded.replace(/<ol>/gi, '<ol class="space-y-2 my-4 pl-6">');
  decoded = decoded.replace(
    /<li>/gi,
    '<li class="text-gray-700 leading-relaxed relative pl-2" style="display: list-item; list-style-position: outside;">',
  );

  decoded = decoded.replace(
    /<ul class="space-y-2 my-4 pl-6">/gi,
    '<ul class="space-y-2 my-4 pl-6" style="list-style-type: disc;">',
  );
  decoded = decoded.replace(
    /<ol class="space-y-2 my-4 pl-6">/gi,
    '<ol class="space-y-2 my-4 pl-6" style="list-style-type: decimal;">',
  );

  // ✅ HEADINGS WITHOUT BORDER

  // 1. Existing h2 tags - Mobile Responsive
  decoded = decoded.replace(
    /<h2([^>]*)>/gi,
    '<h2$1 class="text-2xl sm:text-3xl font-bold text-gray-900 mt-6 sm:mt-10 mb-4 sm:mb-5">',
  );

  // 2. Existing h3 tags - Mobile Responsive
  decoded = decoded.replace(
    /<h3([^>]*)>/gi,
    '<h3$1 class="text-2xl sm:text-3xl font-bold text-gray-900 mt-6 sm:mt-10 mb-4 sm:mb-5">',
  );

  // 3. Existing h4 tags - Mobile Responsive
  decoded = decoded.replace(
    /<h4([^>]*)>/gi,
    '<h4$1 class="text-lg sm:text-xl font-semibold text-gray-800 mt-3 sm:mt-6 mb-2 sm:mb-3">',
  );

  // 4. "About Diploma/Certificate/etc..." patterns to h3
  decoded = decoded.replace(
    /<p[^>]*>\s*<strong>(About\s+(Diploma|Certificate|Undergraduate|Postgraduate|Pre-University|PhD|Master|Degree|Bachelor|Program|Course)[^<]*)<\/strong>\s*<\/p>/gi,
    '<h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h3>',
  );

  // 5. Common section headings to h3
  decoded = decoded.replace(
    /<p[^>]*>\s*<strong>(Career Opportunities?|Cost for study[^<]*|Key Features?|Admission Process|Entry Requirements?|Top Universities|Specializations?|Duration|Overview|Comparison of[^<]*|Why Study[^<]*|Course Structure|Program Highlights?|Learning Outcomes?|Job Prospects?|Industry Demand|Future Scope|International Students[^<]*)<\/strong>\s*<\/p>/gi,
    '<h3 class="text-2xl sm:text-3xl font-bold text-gray-900 mt-8 mb-4">$1</h3>',
  );

  // 6. Engineering specializations to h4 - Mobile Responsive
  decoded = decoded.replace(
    /<p[^>]*>\s*<strong>(Aerodynamics Engineering|Propulsion Systems Engineering|Aerospace Structures Engineering|Aeronautical Engineering|Aircraft Engineering|Mechanical Engineering|Civil Engineering|Electrical Engineering|Chemical Engineering)[^<]*<\/strong>\s*<\/p>/gi,
    '<h4 class="text-lg sm:text-xl font-semibold text-gray-800 mt-3 sm:mt-6 mb-2 sm:mb-3">$1</h4>',
  );

  // 7. Other strong text starting with capital letter (minimum 10 chars) to h4 - Mobile Responsive
  decoded = decoded.replace(
    /<p[^>]*>\s*<strong>([A-Z][A-Za-z\s&-]{10,})<\/strong>\s*<\/p>/gi,
    '<h4 class="text-lg sm:text-xl font-semibold text-gray-800 mt-3 sm:mt-6 mb-2 sm:mb-3">$1</h4>',
  );

  // 🎯 PARAGRAPH STYLING
  decoded = decoded.replace(
    /<p>/gi,
    '<p class="mb-4 text-gray-700 leading-relaxed">',
  );

  // Clean up extra whitespace
  decoded = decoded.replace(/\n{3,}/g, "\n\n");
  decoded = decoded.replace(/<p[^>]*>\s*<\/p>/g, "");

  return decoded;
};
const detectCategoryFromSlug = (slug, name) => {
  const lowerSlug = slug?.toLowerCase() || "";
  const lowerName = name?.toLowerCase() || "";

  if (lowerSlug.includes("engineer") || lowerName.includes("engineer"))
    return "Engineering";
  if (
    lowerSlug.includes("computer") ||
    lowerSlug.includes("software") ||
    lowerSlug.includes("it") ||
    lowerSlug.includes("technology") ||
    lowerSlug.includes("cyber") ||
    lowerSlug.includes("data") ||
    lowerName.includes("computer") ||
    lowerName.includes("software")
  )
    return "Technology & IT";
  if (
    lowerSlug.includes("medic") ||
    lowerSlug.includes("health") ||
    lowerSlug.includes("nurs") ||
    lowerSlug.includes("pharmac") ||
    lowerSlug.includes("dent") ||
    lowerName.includes("medical")
  )
    return "Medical & Health";
  if (
    lowerSlug.includes("business") ||
    lowerSlug.includes("management") ||
    lowerSlug.includes("accounting") ||
    lowerSlug.includes("finance") ||
    lowerSlug.includes("marketing") ||
    lowerSlug.includes("entrepreneur") ||
    lowerSlug.includes("banking") ||
    lowerSlug.includes("human-resource") ||
    lowerSlug.includes("hrm") ||
    lowerSlug.includes("supply-chain") ||
    lowerName.includes("business") ||
    lowerName.includes("accounting")
  )
    return "Business & Management";
  if (
    lowerSlug.includes("science") ||
    lowerSlug.includes("biology") ||
    lowerSlug.includes("chemistry") ||
    lowerSlug.includes("physics") ||
    lowerSlug.includes("biotechnology") ||
    lowerSlug.includes("agriculture") ||
    lowerSlug.includes("actuarial") ||
    lowerName.includes("science")
  )
    return "Science";
  if (
    lowerSlug.includes("art") ||
    lowerSlug.includes("design") ||
    lowerSlug.includes("graphic") ||
    lowerSlug.includes("fashion") ||
    lowerSlug.includes("interior") ||
    lowerSlug.includes("architecture") ||
    lowerName.includes("design") ||
    lowerName.includes("art")
  )
    return "Arts & Design";
  if (
    lowerSlug.includes("social") ||
    lowerSlug.includes("psychology") ||
    lowerSlug.includes("sociology") ||
    lowerSlug.includes("education") ||
    lowerSlug.includes("law") ||
    lowerSlug.includes("political") ||
    lowerName.includes("social") ||
    lowerName.includes("law")
  )
    return "Social Sciences";
  if (
    lowerSlug.includes("math") ||
    lowerSlug.includes("statistic") ||
    lowerName.includes("math") ||
    lowerName.includes("statistic")
  )
    return "Mathematics";

  return "General";
};

const getCategoryImage = (category) => {
  const categoryImages = {
    Engineering:
      "https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "Technology & IT":
      "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "Medical & Health":
      "https://images.pexels.com/photos/356054/pexels-photo-356054.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "Business & Management":
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200",
    Science:
      "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "Arts & Design":
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "Social Sciences":
      "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=1200",
    Mathematics:
      "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800",
    General:
      "https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg?auto=compress&cs=tinysrgb&w=800",
  };

  return categoryImages[category] || categoryImages["General"];
};

const SpecializationDetail = () => {
  const { name, level, nameWithLevel } = useParams();

  // Extract name and level from combined slug
  let slug, selectedLevelFromUrl;

  if (nameWithLevel) {
    const parts = nameWithLevel.split("-");

    // ✅ ALL valid levels including compound ones
    const validLevels = [
      "pre-university",
      "certificate",
      "diploma",
      "undergraduate",
      "postgraduate-diploma", // ✅ Check this FIRST
      "postgraduate",
      "phd",
    ];

    // ✅ Check for compound levels first (postgraduate-diploma)
    let foundLevel = null;
    for (const level of validLevels) {
      if (nameWithLevel.endsWith(`-${level}`)) {
        foundLevel = level;
        slug = nameWithLevel.slice(0, -(level.length + 1)); // Remove -level
        break;
      }
    }

    if (foundLevel) {
      selectedLevelFromUrl = foundLevel;
    } else {
      slug = nameWithLevel;
      selectedLevelFromUrl = null;
    }
  } else {
    // Old format fallback: name/level
    slug = name?.toLowerCase();
    selectedLevelFromUrl = level;
  }

  const formattedName = slug
    ? slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Course";

  // const thumbnailFromState = location.state?.thumbnail;

  // const [selectedLevel, setSelectedLevel] = useState(selectedLevelFromUrl || 'undergraduate');
  const [selectedLevel, setSelectedLevel] = useState(
    selectedLevelFromUrl || null,
  );
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [contentMap, setContentMap] = useState({});
  const [faqs, setFaqs] = useState([]);
  const [seo, setSeo] = useState({});
  // Initialize with default object to render immediately
  const [categoryData, setCategoryData] = useState({
    name: formattedName,
    contents: [],
    specialization_levels: [],
    related_universities: [],
    faqs: [],
  });
  const [relatedUniversities, setRelatedUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [educationLevels, setEducationLevels] = useState({});

  const [availableLevelButtons, setAvailableLevelButtons] = useState([]);
  const sectionRefs = useRef({});
  const navigate = useNavigate();
  const location = useLocation();
  const thumbnailFromState = location.state?.thumbnail;

  // Scroll effect for sticky tabs
  useEffect(() => {
    const handleScroll = () => {
      const tabsElement = document.querySelector(".scroll-sticky");
      if (tabsElement) {
        if (window.scrollY > 100) {
          tabsElement.classList.add("scrolled");
        } else {
          tabsElement.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ COMPLETE FIXED VERSION - Replace from line 157
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) {
        setError("Invalid URL - No course name provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await api.get(`/specialization-detail-by-slug/${slug}`);

        const category =
          res?.data?.data?.specialization ||
          res?.data?.specialization ||
          res?.data?.category ||
          res?.data;

        if (!category || !category.name) {
          throw new Error("Course not found.");
        }

        setCategoryData(category);
        setSeo(res.data?.seo || res.data?.data?.seo || category?.seo || {});
        setRelatedUniversities(
          res.data?.related_universities ||
            res.data?.data?.related_universities ||
            category?.related_universities ||
            [],
        );
        setFaqs(category?.faqs || res.data?.faqs || []);

        // 🔥 IMPROVED LEVEL MAPPING - Handles ALL 7 levels from API
        const specializationLevels = category?.specialization_levels || [];

        console.log("🔥 API Levels:", specializationLevels);

        // ✅ EXACT API LABEL MAPPING - No Conversion
        const getLevelConfig = (levelSlug, apiLevelData) => {
          const slug = (levelSlug || "").toLowerCase().trim();

          // Pre-University
          if (slug.includes("pre-university") || slug.includes("pre-u")) {
            return {
              key: "pre-university",
              label: apiLevelData.level || "Pre-University", // ✅ API ka exact label
              icon: "FileText",
              order: 1,
            };
          }

          // Certificate
          if (slug.includes("certificates")) {
            return {
              key: "certificates",
              label: apiLevelData.level || "Certificates",
              icon: "BookOpen",
              order: 2,
            };
          }

          // Diploma (NOT PG Diploma)
          if (
            slug.includes("diploma") &&
            !slug.includes("post-graduate") &&
            !slug.includes("postgraduate")
          ) {
            return {
              key: "diploma",
              label: apiLevelData.level || "Diploma",
              icon: "FileText",
              order: 3,
            };
          }

          // Undergraduate
          if (
            slug.includes("under-graduate") ||
            slug.includes("undergraduate")
          ) {
            return {
              key: "undergraduate",
              label: apiLevelData.level || "UNDER-GRADUATE", // ✅ API se exact
              icon: "GraduationCap",
              order: 4,
            };
          }

          // PG Diploma (Check BEFORE postgraduate)
          if (
            slug.includes("post-graduate-diploma") ||
            slug.includes("postgraduate-diploma")
          ) {
            return {
              key: "postgraduate-diploma",
              label: apiLevelData.level || "POST-GRADUATE-DIPLOMA",
              icon: "Award",
              order: 5,
            };
          }

          // Postgraduate
          if (slug.includes("post-graduate") || slug.includes("postgraduate")) {
            return {
              key: "postgraduate",
              label: apiLevelData.level || "P", // ✅ API se exact
              icon: "Award",
              order: 6,
            };
          }

          // PhD
          if (slug.includes("phd")) {
            return {
              key: "phd",
              label: apiLevelData.level || "PhD",
              icon: "Target",
              order: 7,
            };
          }

          console.warn(`⚠️ Unknown level: "${slug}"`);
          return null;
        };
        const dynamicLevels = {};
        const availableLevels = [];

        // ✅ Process each level from API
        specializationLevels.forEach((apiLevel) => {
          const levelSlug = apiLevel.level_slug || "";

          const config = getLevelConfig(levelSlug, apiLevel);

          if (config) {
            // Store level data
            dynamicLevels[config.key] = {
              title: apiLevel.level || "N/A",
              duration: apiLevel.duration || "N/A",
              fees: apiLevel.tuition_fees || "Contact for Fees",
              intake: apiLevel.intake || "Contact for Intake",
              accreditation: apiLevel.accreditation || "MQA",
            };

            // Add to available levels (avoid duplicates)
            if (!availableLevels.find((l) => l.key === config.key)) {
              availableLevels.push(config);
            }

            console.log(
              `✅ "${levelSlug}" → Button: "${config.label}" (Key: ${config.key})`,
            );
          }
        });

        // ✅ Sort buttons by order
        availableLevels.sort((a, b) => a.order - b.order);

        console.log("📊 Final Levels:", dynamicLevels);
        console.log("🔘 Available Buttons:", availableLevels);

        setEducationLevels(dynamicLevels);
        setAvailableLevelButtons(availableLevels);

        // ✅ Set initial selected level
        // if (!selectedLevel && availableLevels.length > 0) {
        //   const defaultLevel = selectedLevelFromUrl
        //     ? availableLevels.find(l => l.key === selectedLevelFromUrl)
        //     : availableLevels[0];

        //   setSelectedLevel(defaultLevel?.key || availableLevels[0].key);
        // }

        const specializationId = category?.id;

        // Always use general contents as primary source
        const contents = category?.contents || [];
        console.log("📚 Available Contents:", contents);

        const map = {};
        const dynamicTabs = [];

        contents.forEach((c) => {
          if (c.tab && c.description) {
            map[c.tab] = c.description;
            dynamicTabs.push({
              name: c.tab,
              icon: tabIcons[c.tab] || <Info size={16} />,
            });
            sectionRefs.current[c.tab] = React.createRef();
          }
        });

        console.log(
          "📑 Tabs Created:",
          dynamicTabs.map((t) => t.name),
        );
        console.log("🗺️ Content Map Keys:", Object.keys(map));

        setContentMap(map);
        setTabs(dynamicTabs);
        setActiveTab(dynamicTabs[0]?.name || "");

        setLoading(false);
      } catch (e) {
        let errorMessage = "Failed to load course data";

        if (e.response?.status === 404) {
          errorMessage = `Course "${formattedName}" not found.`;
        } else if (e.response?.data?.message) {
          errorMessage = e.response.data.message;
        } else if (e.message) {
          errorMessage = e.message;
        }

        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchData();
    // }, [slug, formattedName, selectedLevel]);
  }, [slug, formattedName]); // ✅ selectedLevel hatao

  useEffect(() => {
    // Hash scroll only
    const hash = window.location.hash.replace("#", "");
    if (hash && tabs.length > 0) {
      const tabName = tabs.find(
        (tab) => tab.name.toLowerCase().replace(/\s+/g, "-") === hash,
      )?.name;

      if (tabName) {
        setTimeout(() => handleTabClick(tabName), 500);
      }
    }
  }, [tabs]);
  useEffect(() => {
    const loadLevelContent = async () => {
      if (!categoryData) return;

      // ✅ General content restore when no level selected
      if (!selectedLevel) {
        console.log("🔄 No level selected - Loading general content...");

        const contents = categoryData?.contents || [];
        const map = {};
        const dynamicTabs = [];

        contents.forEach((c) => {
          if (c.tab && c.description) {
            map[c.tab] = c.description;
            dynamicTabs.push({
              name: c.tab,
              icon: tabIcons[c.tab] || <Info size={16} />,
            });
            // ✅ CHANGE 1: Ref ko conditionally create karo
            if (!sectionRefs.current[c.tab]) {
              sectionRefs.current[c.tab] = React.createRef();
            }
          }
        });

        console.log(
          "✅ General tabs restored:",
          dynamicTabs.map((t) => t.name),
        );
        setContentMap(map);
        setTabs(dynamicTabs);
        setActiveTab(dynamicTabs[0]?.name || "");
        return;
      }

      // ✅ Level-specific content loading
      const specializationLevels = categoryData?.specialization_levels || [];
      if (!specializationLevels.length) return;

      console.log("🎯 Level changed to:", selectedLevel);

      const normalizeLevelSlug = (slug) => {
        return slug?.toLowerCase().replace(/-/g, "");
      };

      const levelIdMap = {};
      specializationLevels.forEach((lvl) => {
        const normalizedKey = normalizeLevelSlug(lvl.level_slug);
        if (normalizedKey) {
          levelIdMap[normalizedKey] = lvl.id;
        }
      });

      console.log("🔑 Level ID Map:", levelIdMap);
      console.log("🔍 Looking for:", selectedLevel);

      const levelId = levelIdMap[selectedLevel];
      console.log("✅ Matched Level ID:", levelId);

      if (levelId) {
        try {
          const res = await api.get(
            `/specialization-level-contents/${levelId}`,
          );
          const levelContents = res?.data?.data?.rows || [];

          console.log("📡 Level Content Response:", levelContents);

          if (levelContents.length > 0) {
            const levelMap = {};
            const levelTabs = [];

            levelContents.forEach((c) => {
              if (c.title && c.description) {
                levelMap[c.title] = c.description;
                levelTabs.push({
                  name: c.title,
                  icon: tabIcons[c.title] || <Info size={16} />,
                });
                // ✅ CHANGE 2: Yahan bhi conditionally create karo
                if (!sectionRefs.current[c.title]) {
                  sectionRefs.current[c.title] = React.createRef();
                }
              }
            });

            if (levelTabs.length > 0) {
              console.log(
                "✅ Level content loaded! Tabs:",
                levelTabs.map((t) => t.name),
              );
              setContentMap(levelMap);
              setTabs(levelTabs);
              setActiveTab(levelTabs[0]?.name || "");
            }
          } else {
            console.warn("⚠️ No level content found, keeping general content");
          }
        } catch (error) {
          console.warn("⚠️ API Error:", error.message);
        }
      } else {
        console.warn(`⚠️ No level ID found for: "${selectedLevel}"`);
        console.warn("Available keys:", Object.keys(levelIdMap));
      }
    };

    loadLevelContent();
  }, [selectedLevel, categoryData]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);

    const hashName = tabName.toLowerCase().replace(/\s+/g, "-");
    window.history.pushState(null, "", `#${hashName}`);

    const element = sectionRefs.current[tabName]?.current;
    if (element) {
      const offset = 120; // Adjusted offset for better positioning
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  /*
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading {formattedName}...
          </p>
          <p className="mt-2 text-sm text-gray-500">Fetching course details</p>
        </div>
      </div>
    );
  }
  */

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-2">{error}</p>
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Requested:</strong> {formattedName}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Slug:</strong> {slug}
            </p>
          </div>
          <div className="space-y-3">
            <Link
              to="/specialization"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Specializations
            </Link>
            <p className="text-sm text-gray-500">
              Check the browser console (F12) for detailed error information
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
  if (!categoryData) {
    return null;
  }
  */

  const currentLevel = educationLevels[selectedLevel] || {};
  const detectedCategory = detectCategoryFromSlug(slug, categoryData.name);

  // ✅ Example with ImgBB URL
  const heroImage = "/study-in-malaysia.webp";

  return (
    <>
      {/* ✅ Dynamic SEO */}
      {/* ✅ Dynamic SEO */}
      <SeoHead
        pageType="service-detail"
        data={{
          ...seo,
          name:
            seo?.meta_title ||
            `${categoryData.name} ${currentLevel.title || ""} Course in Malaysia`,
          description:
            seo?.meta_description ||
            `Complete guide to ${categoryData.name} ${currentLevel.title || ""} programs in Malaysia`,
          keywords: seo?.meta_keyword || categoryData.name,
          image: heroImage,
          url: window.location.href,
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
              to="/specialization"
              className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to All Specializations
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 -mt-6 sm:-mt-8 pb-12 sm:pb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Hero Image */}
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden">
              <img
                src={heroImage}
                alt={categoryData.name}
                fetchpriority="high"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.src = getCategoryImage("General");
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-tight">
                    {categoryData.name}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 md:gap-6 text-white/90">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      <span className="text-xs sm:text-sm md:text-base font-medium">
                        Study in Malaysia
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      <span className="text-xs sm:text-sm md:text-base">
                        Top Universities
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Breadcrumb */}
            <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 border-b border-gray-100">
              <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600 space-x-1 sm:space-x-2">
                <Link
                  to="/"
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <Home size={14} sm:size={16} md:size={18} />{" "}
                  <span className="hidden sm:inline">Home</span>
                  <span className="sm:hidden">Home</span>
                </Link>
                <span className="text-xs sm:text-sm">/</span>
                <Link
                  to="/specialization"
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <Layers size={14} sm:size={16} md:size={18} />{" "}
                  <span className="hidden sm:inline">Specialization</span>
                  <span className="sm:hidden">Specialization</span>
                </Link>
                <span className="text-xs sm:text-sm">/</span>
                <span className="font-medium text-gray-900 text-xs sm:text-sm break-words max-w-[150px] sm:max-w-full">
                  {categoryData.name}
                </span>
                {level && (
                  <>
                    <span className="text-xs sm:text-sm">/</span>
                    <span className="font-medium text-blue-600 text-xs sm:text-sm break-words max-w-[120px] sm:max-w-full">
                      {currentLevel.title}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Education Level Buttons */}
            <div className="border-b border-gray-200 bg-white shadow-sm mb-0">
              <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 sm:mb-4">
                  Select Education Level
                </h3>
                {availableLevelButtons.length > 0 ? (
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {availableLevelButtons.map((levelItem) => {
                      const IconComponent =
                        {
                          FileText: FileText,
                          GraduationCap: GraduationCap,
                          Award: Award,
                          Target: Target,
                          BookOpen: BookOpen,
                        }[levelItem.icon] || FileText;

                      return (
                        <button
                          key={levelItem.key}
                          onClick={(e) => {
                            e.preventDefault();
                            // ✅ TOGGLE LOGIC - Agar same button pe click ho to general view
                            if (selectedLevel === levelItem.key) {
                              console.log(
                                "🔄 Same button clicked again - Resetting to general view...",
                              );
                              // 1. Selected level ko null karo
                              setSelectedLevel(null);
                              // 2. URL se level remove karo
                              let cleanSlug = slug;
                              const allLevels = [
                                "pre-university",
                                "certificate",
                                "diploma",
                                "undergraduate",
                                "postgraduate-diploma",
                                "postgraduate",
                                "phd",
                              ];
                              allLevels.forEach((level) => {
                                if (cleanSlug.endsWith(`-${level}`)) {
                                  cleanSlug = cleanSlug.replace(
                                    `-${level}`,
                                    "",
                                  );
                                }
                              });
                              const newUrl = `/specialization/${cleanSlug}`;
                              window.history.pushState(
                                { preventScroll: true },
                                "",
                                newUrl,
                              );
                            } else {
                              // ✅ Different button - Load level content
                              console.log("🔘 Button clicked:", levelItem.key);
                              setSelectedLevel(levelItem.key);
                              let cleanSlug = slug;
                              const allLevels = [
                                "pre-university",
                                "certificate",
                                "diploma",
                                "undergraduate",
                                "postgraduate-diploma",
                                "postgraduate",
                                "phd",
                              ];
                              allLevels.forEach((level) => {
                                if (cleanSlug.endsWith(`-${level}`)) {
                                  cleanSlug = cleanSlug.replace(
                                    `-${level}`,
                                    "",
                                  );
                                }
                              });
                              const newUrl = `/specialization/${cleanSlug}-${levelItem.key}`;
                              window.history.pushState(
                                { preventScroll: true },
                                "",
                                newUrl,
                              );
                            }
                          }}
                          className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm transition-all duration-200 border-2 ${
                            selectedLevel === levelItem.key
                              ? "bg-blue-600 text-white border-blue-600 shadow-md"
                              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                          }`}
                        >
                          <IconComponent className="w-4 h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">
                            {levelItem.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-xs sm:text-sm">
                      No education levels available
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Course Information */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-b border-blue-100 mt-0">
              <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {currentLevel.title || "Course Information"}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm text-gray-600">
                        Duration
                      </div>
                      <div className="font-semibold text-gray-900 whitespace-nowrap text-xs sm:text-sm">
                        {currentLevel.duration || "Varies"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                      <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm text-gray-600">
                        Tuition Fees
                      </div>
                      <div className="font-semibold text-gray-900 whitespace-nowrap text-xs sm:text-sm">
                        {currentLevel.fees || "Contact Us"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-purple-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm text-gray-600">
                        Intake
                      </div>
                      <div className="font-semibold text-gray-900 whitespace-nowrap text-xs sm:text-sm">
                        {currentLevel.intake || "Multiple"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-orange-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm text-gray-600">
                        Accreditation
                      </div>
                      <div className="font-semibold text-gray-900 whitespace-nowrap text-xs sm:text-sm">
                        {currentLevel.accreditation || "MQA"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STICKY TABS - DESKTOP ONLY - MOVED OUTSIDE WHITE CONTAINER */}
        {tabs.length > 0 && (
          <div
            className="new-scoll-links scroll-sticky hidden lg:block"
            style={{
              position: "sticky",
              top: "56px",
              zIndex: 9998,
              backgroundColor: "white",
              borderBottom: "1px solid rgb(229, 231, 235)",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ul className="links scrollTo vertically-scrollbar">
                {tabs.map(({ name, icon }) => {
                  const hashName = name.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <li
                      key={name}
                      className={activeTab === name ? "active" : ""}
                    >
                      <a
                        href={`#${hashName}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleTabClick(name);
                        }}
                        className="flex items-center gap-2"
                      >
                        {icon}
                        <span>{name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-8 p-3 sm:p-4 md:p-6 lg:p-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
              {tabs.length > 0 ? (
                tabs.map(({ name }, idx) => (
                  <motion.section
                    key={name}
                    ref={sectionRefs.current[name]}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="scroll-mt-24"
                  >
                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-5 md:p-6 border border-blue-100 shadow-md hover:shadow-lg transition-shadow">
                      {/* ✅ NO h2 heading - Content starts with h3 from formatHTML */}
                      <div
                        className="prose prose-sm sm:prose prose-blue max-w-none text-gray-700 leading-relaxed [&_a]:text-blue-600 [&_a]:font-medium [&_a:hover]:underline [&_a_span]:!text-blue-600"
                        dangerouslySetInnerHTML={{
                          __html: formatHTML(contentMap[name]),
                        }}
                      />
                    </div>
                  </motion.section>
                ))
              ) : (
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200 text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Course details coming soon.</p>
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <UniversityCard />
              </motion.div>

              {faqs.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-md"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    {faqs.map((faq, i) => (
                      <details
                        key={i}
                        className="group bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl overflow-hidden border border-blue-100"
                      >
                        <summary className="cursor-pointer font-semibold text-gray-900 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-blue-100 transition-colors text-sm sm:text-base">
                          <span className="pr-2">{faq.question}</span>
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 group-open:rotate-90 transition-transform flex-shrink-0" />
                        </summary>
                        <div
                          className="px-4 sm:px-6 pb-3 sm:pb-4 text-gray-700 leading-relaxed prose prose-sm max-w-none text-xs sm:text-sm [&_a]:text-blue-600 [&_a]:font-medium [&_a:hover]:underline [&_a_span]:!text-blue-600"
                          dangerouslySetInnerHTML={{
                            __html: formatHTML(faq.answer),
                          }}
                        />
                      </details>
                    ))}
                  </div>
                </motion.section>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-3 sm:space-y-4 lg:space-y-6">
              <TrendingCourse2 />
              <GetInTouchForm />
              <div className="-mt-1 sm:-mt-2">
                <FeaturedUniversities />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecializationDetail;
