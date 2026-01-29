import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import api from "../../api";
import {Helmet} from "react-helmet";
import LinearDeterminate from '../../components/LinearDeterminate';
import { Link } from "react-router-dom";
import { Home, Layers } from "lucide-react";



const Faqs = () => {
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [faqLoading, setFaqLoading] = useState(false);
  const [error, setError] = useState(null);
  const [faqError, setFaqError] = useState(null);
  const [seo , setSeo] = useState({});

  const toggleQuestion = (index) => {
    setOpenQuestionIndex(openQuestionIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/faqs");
        const cats = res.data?.data?.categories || [];
        setSeo(res.data?.data?.seo || {});
        setCategories(cats);
        console.log(res.data?.data?.seo || {});

        if (cats.length > 0) {
          setActiveTab(cats[0].category_slug);
        }
        setError(null);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Could not load FAQ categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!activeTab) return;

    const fetchFaqs = async () => {
      setFaqLoading(true);
      setFaqError(null);
      try {
        const res = await api.get(`/faq-details/${activeTab}`);
        setFaqs(res.data?.data?.faqs || []);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setFaqError("Could not load questions for this category.");
      } finally {
        setFaqLoading(false);
      }
    };

    fetchFaqs();
  }, [activeTab]);

  const formatHTML = (html) => {
    if (!html) return "";
    return html
      .replace(/&nbsp;/g, " ")
      .replace(/<span[^>]*>/g, "")
      .replace(/<span>/g, "")
      .replace(/style=\"[^\"]*\"/g, "")
      .replace(/<p>\s*<\/p>/g, "")
      .trim();
  };

  if (loading) {
    return <div className="py-10 text-center text-lg text-gray-600">... </div>;
  }

  if (error) {
    return <div className="py-10 text-center text-lg text-red-600">{error}</div>;
  }

  if (!categories || categories.length === 0) {
    return <div className="py-10 text-center text-lg text-red-600">No FAQ Categories available.</div>;
  }

  return (
    <>
 <Helmet>
      {/* 🔹 Basic SEO */}
      <title>{seo?.meta_title}</title>
      <meta name="title" content={seo?.meta_title} />
      <meta name="description" content={seo?.meta_description} />
      <meta name="keywords" content={seo?.meta_keyword} />

      {/* 🔹 Robots */}
      <meta name="robots" content={seo?.robots || "index, follow"} />

      {/* 🔹 Canonical */}
      {seo?.page_url && <link rel="canonical" href={seo?.page_url} />}

      {/* 🔹 Open Graph (Facebook, LinkedIn, etc.) */}
      <meta property="og:title" content={seo?.meta_title} />
      <meta property="og:description" content={seo?.meta_description} />
      <meta property="og:image" content={seo?.og_image_path} />
      <meta property="og:url" content={seo?.page_url} />
      <meta property="og:site_name" content={seo?.site_name || "Study in Malaysia"} />
      <meta property="og:type" content={seo?.og_type || "website"} />
      <meta property="og:locale" content={seo?.og_locale || "en_US"} />
 {/* 🔹 SEO Rating (as meta) */}
      {seo?.seo_rating && <meta name="seo:rating" content={seo?.seo_rating} />}

      {/* 🔹 JSON-LD Schema (Structured Data) */}
      {seo?.seo_rating_schema && (
        <script type="application/ld+json">
          {JSON.stringify(seo.seo_rating_schema)}
        </script>
      )}
     
    </Helmet>

 {/* Breadcrumb */}
      <div className="w-full bg-blue-50 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Link to="/" className="flex items-center gap-1 hover:underline hover:text-blue-500">
              <Home size={18} /> Home
            </Link>
            <span>/</span>
            <Link to="/faqs" className="flex items-center gap-1 hover:underline hover:text-blue-500">
              <Layers size={18} /> FAQs
            </Link>
          </div>
        </div>
      </div>

    <div className="py-10 px-4 max-w-5xl mx-auto">
      <h2 className="text-center text-2xl md:text-3xl font-semibold mb-6">
        Frequently Asked Questions
      </h2>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.category_slug}
            onClick={() => {
              setActiveTab(cat.category_slug);
              setOpenQuestionIndex(null);
            }}
            className={`px-4 py-2 rounded-2xl font-medium text-sm capitalize ${activeTab === cat.category_slug
                ? "bg-blue-800 text-white"
                : "bg-gray-100 text-blue-700"
            }`}
          >
            {cat.category_name}
          </button>
        ))}
      </div>

      {faqLoading ? (
        <div className="text-center text-gray-600"><LinearDeterminate /></div>
      ) : faqError ? (
        <div className="text-center text-red-600">{faqError}</div>
      ) : (
        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="bg-white border rounded-2xl shadow-sm hover:shadow transition duration-300"
            >
              <button
                className="w-full flex justify-between items-center px-5 py-4 text-left text-blue-800 font-medium"
                onClick={() => toggleQuestion(index)}
              >
                <span>{item.question}</span>
                {openQuestionIndex === index ? (
                  <FaMinus className="text-blue-600" />
                ) : (
                  <FaPlus className="text-blue-600" />
                )}
              </button>
              {openQuestionIndex === index && (
                <div
                  className="px-5 pb-4 text-sm text-gray-700 whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: formatHTML(item.answer) }}
                />
              )}
            </div>
          ))}

          {faqs.length === 0 && (
            <div className="text-center text-gray-500">No FAQs found for this category.</div>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default Faqs;
