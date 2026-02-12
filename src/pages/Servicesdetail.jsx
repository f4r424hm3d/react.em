

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GetInTouchForm from '../components/GetInTouchForm';
import OtherServicesBox from '../components/OtherFeatures';
import TrendingCourse2 from "../components/TrandingCourse2";
import UniversityBox from '../components/FeaturedUniversities';
import api from '../api';
import { Helmet } from "react-helmet";
import { GraduationCap, MapPin, FileText, Globe, CheckCircle } from 'lucide-react';

// ---------------------- Skeleton Loader ----------------------
const ServiceDetailSkeleton = () => (
  <section className="bg-gradient-to-b from-blue-50 to-white py-8 px-4 md:px-8 animate-pulse">
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="h-10 bg-gray-200 rounded-md w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded-md w-1/2 mb-6"></div>
        <div className="w-full h-60 bg-gray-200 rounded-xl mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-11/12"></div>
        </div>
      </div>
    </div>
  </section>
);

// ---------------------- Main Component ----------------------
const ServiceDetail = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [seo, setSeo] = useState({});
  const [contentTab, setContentTab] = useState('documents');

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchService = async () => {
      try {
        const res = await api.get(`/service-details/${slug}`);
        const serviceData = res?.data?.data?.service;
        setSeo(res.data.data?.seo || {});
        setService(serviceData);
      } catch (error) {
        console.error("Error fetching service details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  if (loading) {
    return <ServiceDetailSkeleton />;
  }

  if (!service) {
    return <div className="text-center text-red-500 mt-10 p-4">Service not found.</div>;
  }

  const showEnhancedTabs = service.contents?.length >= 3;

  return (
    <>
      {/* 🔹 SEO Meta Tags */}
      <Helmet>
        <title>{seo?.meta_title}</title>
        <meta name="title" content={seo?.meta_title} />
        <meta name="description" content={seo?.meta_description} />
        <meta name="keywords" content={seo?.meta_keyword} />
        <meta name="robots" content={seo?.robots || "index, follow"} />
        {seo?.page_url && <link rel="canonical" href={seo?.page_url} />}
        <meta property="og:title" content={seo?.meta_title} />
        <meta property="og:description" content={seo?.meta_description} />
        <meta property="og:image" content={seo?.og_image_path} />
        <meta property="og:url" content={seo?.page_url} />
        <meta property="og:site_name" content={seo?.site_name || "Study in Malaysia"} />
        <meta property="og:type" content={seo?.og_type || "website"} />
        <meta property="og:locale" content={seo?.og_locale || "en_US"} />
        {seo?.seo_rating && <meta name="seo:rating" content={seo?.seo_rating} />}
        {seo?.seo_rating_schema && (
          <script type="application/ld+json">
            {JSON.stringify(seo.seo_rating_schema)}
          </script>
        )}
      </Helmet>

      {/* ✅ CUSTOM CSS - BLUE LINE REMOVED */}
      <style>{`
        .content-wrapper h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e40af;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        
        .content-wrapper h2 {
          font-size: 1.75rem;
          font-weight: 600;
          color: #1e3a8a;
          margin-top: 1.75rem;
          margin-bottom: 0.875rem;
          padding-bottom: 0.5rem;
        }
        
        .content-wrapper h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2563eb;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .content-wrapper h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #3b82f6;
          margin-top: 1.25rem;
          margin-bottom: 0.625rem;
        }
        
        .content-wrapper h5, .content-wrapper h6 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #60a5fa;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .content-wrapper p {
          margin-bottom: 1rem;
          line-height: 1.75;
          color: #334155;
          font-size: 1rem;
        }
        
        .content-wrapper ul, .content-wrapper ol {
          margin-left: 1.5rem;
          margin-bottom: 1.25rem;
          margin-top: 0.75rem;
        }
        
        .content-wrapper ul li, .content-wrapper ol li {
          margin-bottom: 0.625rem;
          line-height: 1.6;
          color: #475569;
        }
        
        .content-wrapper ul {
          list-style-type: disc;
        }
        
        .content-wrapper ol {
          list-style-type: decimal;
        }
        
        .content-wrapper a {
          color: #2563eb;
          text-decoration: underline;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .content-wrapper a:hover {
          color: #1e40af;
          text-decoration: none;
          background-color: #dbeafe;
          padding: 0 4px;
          border-radius: 3px;
        }
        
        .content-wrapper strong, .content-wrapper b {
          font-weight: 700;
          color: #1e293b;
        }
        
        .content-wrapper table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          background: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .content-wrapper table th {
          background-color: #3b82f6;
          color: white;
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
        }
        
        .content-wrapper table td {
          padding: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .content-wrapper table tr:hover {
          background-color: #f1f5f9;
        }
        
        .content-wrapper blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #64748b;
          background-color: #f8fafc;
          padding: 1rem;
          border-radius: 0.5rem;
        }
        
        .content-wrapper img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .content-wrapper pre {
          background-color: #1e293b;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        
        .content-wrapper code {
          background-color: #f1f5f9;
          color: #dc2626;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.9em;
          font-family: monospace;
        }
        
        .content-wrapper hr {
          border: none;
          border-top: 2px solid #e2e8f0;
          margin: 2rem 0;
        }
        
        @media (max-width: 640px) {
          .content-wrapper h1 { font-size: 1.75rem; }
          .content-wrapper h2 { font-size: 1.5rem; }
          .content-wrapper h3 { font-size: 1.25rem; }
          .content-wrapper h4 { font-size: 1.125rem; }
          .content-wrapper p { font-size: 0.95rem; }
        }
      `}</style>

      {/* 🔹 HERO SECTION */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-2xl">
                <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 tracking-tight px-2">
              {service?.page_name || "Service Details"}
            </h1>

            <div className="flex items-center justify-center space-x-2 mb-4 sm:mb-6">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <p className="text-base sm:text-lg md:text-xl text-emerald-100">2025 Edition</p>
            </div>

            {service?.headline && (
              <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
                {service.headline}
              </p>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-6 sm:h-8 md:h-12 fill-white">
            <path d="M0,30 Q360,0 720,30 T1440,30 L1440,60 L0,60 Z"></path>
          </svg>
        </div>
      </section>

      {/* 🔹 TAB NAVIGATION */}
      {showEnhancedTabs && (
        <div className="bg-white sticky top-[58px] z-[10] shadow-sm border-b border-gray-200 transition-all">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setContentTab('documents')}
                className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-semibold transition-all text-sm sm:text-base ${contentTab === 'documents'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                  }`}
              >
                <FileText className="w-4 h-4" />
                <span>Required Documents</span>
              </button>

              <button
                onClick={() => setContentTab('additional')}
                className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-semibold transition-all text-sm sm:text-base ${contentTab === 'additional'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                  }`}
              >
                <Globe className="w-4 h-4" />
                <span>Additional Info</span>
              </button>

              <button
                onClick={() => setContentTab('checklist')}
                className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-semibold transition-all text-sm sm:text-base ${contentTab === 'checklist'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                  }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Checklist</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 SERVICE DETAIL SECTION */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={toggleSidebar}
            className="md:hidden w-full bg-blue-600 text-white py-3 px-4 rounded-lg mb-4 font-semibold shadow-md hover:bg-blue-700 transition"
          >
            {showSidebar ? "✕ Close Menu" : "📂 View Other Services"}
          </button>

          <div className="md:grid md:grid-cols-12 md:gap-6 space-y-6 md:space-y-0">
            {showSidebar && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={closeSidebar}
              />
            )}

            {/* SIDEBAR */}
            <aside
              className={`
                md:col-span-4 
                fixed md:static 
                top-0 right-0 
                z-50 md:z-auto
                h-full md:h-auto
                w-80 md:w-auto
                bg-white 
                p-4 md:p-0
                overflow-y-auto
                shadow-2xl md:shadow-none
                transition-transform duration-300
                ${showSidebar ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
              `}
            >
              <button
                onClick={closeSidebar}
                className="md:hidden absolute top-4 right-4 text-2xl text-gray-600 hover:text-red-500 z-10"
              >
                ✕
              </button>

              <div className="space-y-4 mt-12 md:mt-0">
                <div className="mb-3">
                  <OtherServicesBox />
                </div>
                <div className="mb-3">
                  <GetInTouchForm />
                </div>
                <div className="mb-3">
                  <TrendingCourse2 />
                </div>
                <div className="mb-3">
                  <UniversityBox />
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="md:col-span-8">
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-blue-100">
                {service.thumbnail_path && (
                  <img
                    src={`https://admin.educationmalaysia.in/storage/${service.thumbnail_path}`}
                    alt={service.page_name}
                    className="w-full h-48 sm:h-60 md:h-80 object-cover rounded-xl mb-6 shadow-md"
                  />
                )}

                {service.contents?.length > 0 && (
                  <div className="content-wrapper">
                    {showEnhancedTabs ? (
                      <>
                        {contentTab === 'documents' && (
                          <div dangerouslySetInnerHTML={{ __html: service.contents[0].tab_content }} />
                        )}
                        {contentTab === 'additional' && (
                          <div dangerouslySetInnerHTML={{ __html: service.contents[1].tab_content }} />
                        )}
                        {contentTab === 'checklist' && (
                          <div dangerouslySetInnerHTML={{ __html: service.contents[2].tab_content }} />
                        )}
                      </>
                    ) : (
                      <>
                        <div className="overflow-x-auto -mx-4 px-4 mb-6">
                          <div className="flex gap-2 min-w-max pb-2">
                            {service.contents.map((item, index) => (
                              <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${activeTab === index
                                  ? "bg-blue-600 text-white shadow-md transform scale-105"
                                  : "bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                                  }`}
                              >
                                {item.tab_title.length > 40
                                  ? item.tab_title.slice(0, 40) + "..."
                                  : item.tab_title}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div dangerouslySetInnerHTML={{ __html: service.contents[activeTab].tab_content }} />
                      </>
                    )}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetail;