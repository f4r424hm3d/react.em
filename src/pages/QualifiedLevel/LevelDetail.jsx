import React, { useRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Layers,
  Clock,
  DollarSign,
  GraduationCap,
  Briefcase,
  FileText,
  ChevronDown,
} from "lucide-react";

import api from "../../api";
import GetInTouchForm from "../../components/GetInTouchForm";
import FeaturedUniversities from "../../components/FeaturedUniversities";
import RelatedUniversities from "../../components/UniversityCard";
import CatagoryTreandingCourse from "./CatagoryTreandingCourse";
import SeoHead from "../../components/SeoHead";

const ICON_MAP = {
  "About Course": <Home size={16} />,
  "Course Duration": <Clock size={16} />,
  Cost: <DollarSign size={16} />,
  Universities: <GraduationCap size={16} />,
  Career: <Briefcase size={16} />,
};

const LevelDetail = () => {
  const { slug } = useParams();
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [contentMap, setContentMap] = useState({});
  const [faqs, setFaqs] = useState([]); // New state for FAQs
  const [openFaq, setOpenFaq] = useState(null); // State to manage open/close FAQ items
  const sectionRefs = useRef({});

  const formattedName = slug
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  // Set up refs dynamically
  useEffect(() => {
    const allTabs = [...tabs, "FAQs"];
    sectionRefs.current = allTabs.reduce((acc, tab) => {
      acc[tab] = React.createRef();
      return acc;
    }, {});
  }, [tabs]);

  // Fetch data from API and update state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/course-category/${slug}`);
        console.log("Fetched Level Detail:", res);

        const categoryData = res.data?.category || {};

        const contents = categoryData.contents || [];
        const fetchedFaqs = categoryData.faqs || [];

        const newTabs = contents.map((section) => section.tab);
        if (fetchedFaqs.length > 0) {
          newTabs.push("FAQs"); // Add FAQ tab if data exists
        }

        const newContentMap = contents.reduce((acc, section) => {
          acc[section.tab] = section.description;
          return acc;
        }, {});

        setTabs(newTabs);
        setContentMap(newContentMap);
        setFaqs(fetchedFaqs);
        setActiveTab(newTabs[0] || "");
      } catch (error) {
        console.error("Error fetching level detail:", error);
      }
    };

    fetchData();
  }, [slug]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);

    // Find the element by ID - exact match
    let elementId = tabName.replace(/\s+/g, "-").toLowerCase();

    // Special handling for FAQ
    if (tabName === "FAQs") {
      elementId = "faqs";
    }

    console.log("Looking for element with ID:", elementId);
    const element = document.getElementById(elementId);

    if (element) {
      const headerOffset = 90;
      const y =
        element.getBoundingClientRect().top + window.scrollY - headerOffset;
      console.log("Scrolling to position:", y);

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    } else {
      console.log("Element not found for ID:", elementId);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const formatHTML = (html) => {
    if (!html) return "";
    return html.replace(/&nbsp;/g, " ").replace(/<span[^>]*>|<\/span>/g, "");
  };

  return (
    <>
      <SeoHead
        pageType="course-detail"
        data={{
          name: formattedName,
          description: course?.description, // Pass description if available, otherwise it falls back
          slug: slug,
        }}
      />
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-100 px-3 py-3 md:px-8 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="w-full bg-[#0A4DA3] py-3 px-3 mb-6">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              {[
                { name: "Home", link: "/" },
                { name: "Course", link: "/courses" },
                { name: formattedName, link: null },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative flex items-center max-w-full"
                >
                  {/* Box */}
                  <div
                    className="
            bg-[#1E5CB8]
            text-white
            px-3 md:px-4
            py-1.5 md:py-2
            text-xs md:text-sm
            font-semibold
            rounded-l-md
            flex items-center gap-2
            shadow-sm
            max-w-full
            overflow-hidden
            whitespace-nowrap
          "
                  >
                    {item.link ? (
                      <Link to={item.link} className="truncate">
                        {item.name}
                      </Link>
                    ) : (
                      <span className="truncate">{item.name}</span>
                    )}

                    {/* White dot */}
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"></span>
                  </div>

                  {/* Arrow */}
                  <div
                    className="
            w-0 h-0
            border-t-[12px] md:border-t-[16px] border-t-transparent
            border-b-[12px] md:border-b-[16px] border-b-transparent
            border-l-[10px] md:border-l-[12px] border-l-[#1E5CB8]
          "
                  ></div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          {/* TABS SECTION FIXED - HIDDEN ON MOBILE */}
          <div className="sticky top-[64px] z-30 bg-white p-3 shadow-md rounded-xl mb-10 overflow-x-auto hidden md:block">
            <div className="flex flex-nowrap gap-2 md:gap-3 min-w-max">
              {tabs.map((tabName) => (
                <button
                  key={tabName}
                  onClick={() => {
                    setActiveTab(tabName);
                    setTimeout(() => handleTabClick(tabName), 50);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs md:text-sm font-medium border shadow-sm transition-all whitespace-nowrap ${
                    activeTab === tabName
                      ? "text-blue-700 bg-blue-50 border-blue-300 ring-2 ring-blue-200"
                      : "text-gray-700 bg-white hover:bg-blue-50 border-gray-200"
                  }`}
                >
                  {ICON_MAP[tabName] || <FileText size={16} />}
                  {tabName}
                </button>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10 ">
            {/* Left Column */}
            <div className="space-y-10">
              {tabs.map((tabName, index) => {
                if (tabName === "FAQs") {
                  return (
                    <motion.div
                      key="FAQs"
                      id="faqs"
                      ref={sectionRefs.current["FAQs"]}
                      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition duration-300"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <RelatedUniversities />
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
                        Frequently Asked Questions (FAQs)
                      </h3>
                      <div className="space-y-4">
                        {faqs.map((faq, faqIndex) => (
                          <div
                            key={faq.id}
                            className="border-b border-gray-200 pb-4 last:border-b-0"
                          >
                            <button
                              className="flex justify-between items-center w-full text-left font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200"
                              onClick={() => toggleFaq(faqIndex)}
                            >
                              <span className="text-lg">{faq.question}</span>
                              <ChevronDown
                                size={20}
                                className={`transform transition-transform duration-300 ${
                                  openFaq === faqIndex ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {openFaq === faqIndex && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-2 text-gray-600 prose [&_a]:text-blue-600 [&_a]:font-medium [&_a:hover]:underline [&_a_span]:!text-blue-600"
                                dangerouslySetInnerHTML={{
                                  __html: formatHTML(faq.answer),
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                }
                // Existing content rendering for other tabs
                return (
                  <motion.div
                    key={tabName}
                    id={tabName.replace(/\s+/g, "-").toLowerCase()}
                    ref={sectionRefs.current[tabName]}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition duration-300"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    {contentMap[tabName] ? (
                      <>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-wide">
                            {tabName}
                          </span>
                        </h3>

                        <div
                          className="prose prose-p:mb-4 prose-h4:font-semibold prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-2 prose-p:text-gray-800 prose-p:text-base prose-ul:list-disc prose-ol:list-decimal prose-li:mb-2 prose-blockquote:border-l-4 prose-blockquote:border-blue-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 [&_a]:text-blue-600 [&_a]:font-medium [&_a:hover]:underline [&_a_span]:!text-blue-600"
                          dangerouslySetInnerHTML={{
                            __html: formatHTML(contentMap[tabName]),
                          }}
                        />
                      </>
                    ) : (
                      <p className="text-gray-500">
                        No info available for {tabName}.
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Right Column (Sidebar) */}
            <div className="md:sticky md:top-24 h-fit space-y-6">
              <CatagoryTreandingCourse />
              <FeaturedUniversities />
              <GetInTouchForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LevelDetail;
