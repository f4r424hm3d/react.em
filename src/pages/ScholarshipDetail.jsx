import React, { useRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

import SeoHead from "../components/SeoHead";
import DynamicBreadcrumb from "../components/DynamicBreadcrumb"; // Assuming you want this too, but for strict replacement focusing on SeoHead

import {
  Home,
  Info,
  Gift,
  Building2,
  FileEdit,
  CheckCircle,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import GetInTouchForm from "../components/GetInTouchForm";
import api from "../api";

// ✅ Formatting function for API HTML
const formatHTML = (html) => {
  if (!html) return "";

  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  let decoded = textarea.value;

  // REMOVE spans + inline styles
  decoded = decoded.replace(/<span[^>]*>/gi, "");
  decoded = decoded.replace(/<\/span>/gi, "");
  decoded = decoded.replace(/style="[^"]*"/gi, "");
  decoded = decoded.replace(/&nbsp;/gi, " ");

  // ❌ REMOVE ALL HEADINGS (FIX DUPLICATE OVERVIEW)
  decoded = decoded.replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, "");

  // Convert strong/bold to subheadings
  decoded = decoded.replace(
    /<strong>(.*?)<\/strong>/gi,
    `<h4 class="text-lg font-semibold mb-2 mt-4">$1</h4>`,
  );
  decoded = decoded.replace(
    /<b>(.*?)<\/b>/gi,
    `<h4 class="text-lg font-semibold mb-2 mt-4">$1</h4>`,
  );

  // Paragraph wrapping
  decoded = decoded.replace(/(?:\r\n|\r|\n)/g, "</p><p>");
  decoded = `<p>${decoded}</p>`;
  decoded = decoded.replace(/<p><\/p>/g, "");

  return decoded;
};

// Icon map for common tab names
const iconMap = {
  Overview: <Info size={16} />,
  "Scholarship Opportunity": <Gift size={16} />,
  University: <Building2 size={16} />,
  "Application Process": <FileEdit size={16} />,
  Conclusion: <CheckCircle size={16} />,
};

const ScholarshipDetail = () => {
  const { slug } = useParams();
  // Dynamic tabs state (populated from API contents)
  const [tabsState, setTabsState] = useState([]);
  const sectionRefs = useRef({});

  const [activeTab, setActiveTab] = useState("");
  const [toastShown, setToastShown] = useState(false);
  const [scholarshipData, setScholarshipData] = useState(null);
  const [otherScholarships, setOtherScholarships] = useState([]);
  const [seo, setSeo] = useState({});

  useEffect(() => {
    const fetchScholarshipDetail = async () => {
      try {
        const response = await api.get(`/scholarship-details/${slug}`);
        const sch = response.data?.scholarship || null;
        setScholarshipData(sch);
        setOtherScholarships(response.data.other_scholarships || []);
        setSeo(response.data.seo || {});

        // Build dynamic tabs from scholarship contents (preserve API order via position when available)
        const contents = Array.isArray(sch?.contents) ? [...sch.contents] : [];
        contents.sort((a, b) => (a.position || 0) - (b.position || 0));

        // Use tab names as-is from API, but map icons for known names
        const newTabs = contents.map((c) => {
          const tabName = (c.tab || "").trim();
          // Map "Programs" to "Scholarship Opportunity" for icon only
          let iconKey = tabName;
          if (tabName.toLowerCase().includes("program"))
            iconKey = "Scholarship Opportunity";
          if (tabName.toLowerCase().includes("overview")) iconKey = "Overview";
          if (tabName.toLowerCase().includes("university"))
            iconKey = "University";
          if (tabName.toLowerCase().includes("application"))
            iconKey = "Application Process";
          if (tabName.toLowerCase().includes("conclusion"))
            iconKey = "Conclusion";
          return {
            name: tabName,
            icon: iconMap[iconKey] || <Info size={16} />,
          };
        });

        setTabsState(newTabs);
        // set the active tab to first tab
        setActiveTab(newTabs[0]?.name || "");

        // Initialize refs for each tab
        newTabs.forEach((t) => {
          if (!sectionRefs.current[t.name])
            sectionRefs.current[t.name] = React.createRef();
        });

        console.log(
          "Tabs generated:",
          newTabs.map((t) => t.name),
        );
      } catch (error) {
        console.error("Error fetching scholarship details:", error);
      }
    };
    fetchScholarshipDetail();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      for (const tab of tabsState) {
        const ref = sectionRefs.current[tab.name]?.current;
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveTab(tab.name);
            if (tab.name === "Conclusion" && !toastShown) {
              toast.success("You've reached the Conclusion section ✨");
              setToastShown(true);
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tabsState, toastShown]);

  const handleTabClick = (tabName) => {
    const ref = sectionRefs.current[tabName]?.current;
    if (!ref) return;
    ref.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!scholarshipData) {
    return <p className="text-center py-20 text-gray-500">Loading...</p>;
  }

  return (
    <>
      {/* ✅ Dynamic SEO */}
      <SeoHead
        pageType="scholarship-detail"
        data={{
          ...scholarshipData, // Pass all scholarship data (includes meta_title, etc.)
          ...(seo || {}), // Merge SEO object if present
          name: scholarshipData?.title || seo?.meta_title,
          description:
            seo?.meta_description || scholarshipData?.meta_description,
          keywords: seo?.meta_keyword || scholarshipData?.meta_keyword,
          slug: slug,
          image: seo?.og_image_path || scholarshipData?.og_image_path,
        }}
      />
      <section className="bg-gradient-to-br from-blue-50 to-white px-4 py-10 md:px-10 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 text-[10px] sm:text-xs md:text-sm text-gray-600 flex flex-col">
            {/* Desktop: all in one line | Mobile: only Home/Scholarships */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to="/"
                className="flex items-center gap-1 text-gray-600 hover:text-black font-medium"
              >
                <Home size={16} /> Home
              </Link>

              <span className="text-gray-400">/</span>

              <Link
                to="/scholarships"
                className="flex items-center gap-1 text-gray-600 hover:text-black font-medium"
              >
                <Layers size={16} /> Scholarships
              </Link>

              {/* Title — shown inline only on desktop */}
              <span className="text-gray-400 hidden sm:inline">/</span>
              <span className="capitalize text-blue-600 font-semibold hidden sm:inline">
                {scholarshipData?.title || "Scholarship Detail"}
              </span>
            </div>

            {/* Mobile: Title comes on 2nd line */}
            <span className="capitalize text-blue-600 font-semibold sm:hidden mt-1">
              {scholarshipData?.title || "Scholarship Detail"}
            </span>
          </div>

          {/* Title */}
          <motion.h1
            className="text-2xl md:text-5xl font-bold text-center text-blue-800 mb-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {scholarshipData?.title}
          </motion.h1>

          {/* Tab Navigation */}
          <motion.div
            className="sticky top-16 md:top-20 z-40 bg-ring-blue-300  w-full flex items-center gap-3 overflow-x-auto border-b border-gray-200 py-3 mb-8 no-scrollbar px-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {tabsState.map(({ name, icon }) => (
              <button
                key={name}
                onClick={() => handleTabClick(name)}
                className={`relative flex items-center gap-2 px-5 py-2 rounded-full whitespace-nowrap transition-all duration-300 text-sm md:text-base font-medium shadow-sm 
            ${
              activeTab === name
                ? "bg-blue-100 text-blue-700 ring-2 ring-blue-300 shadow-md scale-[1.02]"
                : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700"
            }`}
              >
                <span className="text-lg">{icon}</span>
                {name}
              </button>
            ))}
          </motion.div>

          {/* Two-column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-5">
            {/* Left Content */}
            <div className="space-y-6">
              {tabsState.map(({ name }, index) => {
                // Find content for this tab (robust match)
                const contentObj = scholarshipData?.contents?.find((c) => {
                  if (!c.tab) return false;
                  const s = c.tab.trim().toLowerCase();
                  if (
                    name === "Scholarship Opportunity" &&
                    s.includes("program")
                  )
                    return true;
                  if (name === "Overview" && s.includes("overview"))
                    return true;
                  if (name === "University" && s.includes("university"))
                    return true;
                  if (
                    name === "Application Process" &&
                    s.includes("application")
                  )
                    return true;
                  if (name === "Conclusion" && s.includes("conclusion"))
                    return true;
                  return c.tab.trim().toLowerCase() === name.toLowerCase();
                });
                return (
                  <motion.div
                    key={name}
                    ref={sectionRefs.current[name]}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <Section title={name}>
                      <div
                        className="formatted-content"
                        dangerouslySetInnerHTML={{
                          __html: formatHTML(contentObj?.description || ""),
                        }}
                      />
                    </Section>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              {/* Other Scholarships Section */}
              {Array.isArray(otherScholarships) && (
                <div className="border rounded-lg px-4 pb-4 bg-white shadow-sm ">
                  <h2 className="text-lg font-bold mb-4">Other Scholarships</h2>
                  <div className="space-y-3">
                    {otherScholarships.map((sch) => (
                      <div
                        key={sch.id}
                        className="flex justify-between items-center border-b last:border-b-0 pb-3 last:pb-0"
                      >
                        <Link
                          to={`/scholarships/${sch.slug}`}
                          className="flex-1 text-sm hover:text-blue-600 transition-colors"
                        >
                          {sch.title}
                        </Link>
                        <FaChevronRight className="text-white bg-blue-500 rounded-full p-1 w-6 h-6 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <GetInTouchForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ScholarshipDetail;

// Reusable Section Component
const Section = ({ title, children }) => (
  <div className="bg-white border border-blue-100 shadow-md rounded-xl p-6">
    <h3 className="text-lg md:text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
      {title}
    </h3>
    <div className="text-gray-700 leading-relaxed space-y-2">{children}</div>
  </div>
);
