import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home, Layers, ArrowRight, Sparkles } from "lucide-react";
import api from "../api";
import { Helmet } from "react-helmet";

const ServiceCardSkeleton = () => (
  <div className="bg-gray-50 rounded-2xl shadow-md p-5 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-full bg-gray-200"></div>
      <div className="w-6 h-6 bg-gray-200 rounded"></div>
    </div>
    <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
  </div>
);


const Services = () => {
  const [services, setServices] = useState([]);
  const [seo, setSeo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        setSeo(response.data.data?.seo || {});
        if (Array.isArray(response.data.data?.services)) {
          setServices(response.data.data.services);
        } else {
          console.error("Unexpected API response format");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

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



      <section className="bg-white px-4 py-16 md:px-10 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center space-x-3 text-sm text-blue-700">
            <Link to="/" className="flex items-center gap-1 hover:underline">
              <Home size={18} /> Home
            </Link>
            <span>/</span>
            <Link to="/resources/services" className="flex items-center gap-1 hover:underline">
              <Layers size={18} /> resources
            </Link>
            <span>/</span>
            <span className="flex items-center gap-1 font-semibold text-gray-900">
              <Layers size={18} /> Services
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-3">
            <span className="text-blue-600">What We Do</span>
          </h2>
          <p className="text-gray-700 text-center mb-10 max-w-3xl mx-auto">
            Having and managing a correct marketing strategy is crucial in a fast-moving market.
          </p>

          {/* Services Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              [...Array(8)].map((_, i) => <ServiceCardSkeleton key={i} />)
            ) : (
              services.map((item) => (
                <Link
                  key={item.id}
                  to={`/resources/services/${item.uri}`}
                  className="bg-gray-50 rounded-2xl shadow-md p-5 group hover:shadow-xl hover:-translate-y-1 transition duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 text-white flex items-center justify-center text-xl">
                      <Sparkles size={20} />
                    </div>
                    <ArrowRight className="text-orange-500 group-hover:text-white transition" />
                  </div>
                  <h3 className="text-gray-800 font-semibold text-base truncate group-hover:text-blue-600 transition">
                    {item.page_name}
                  </h3>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;