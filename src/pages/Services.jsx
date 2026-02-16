import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home, Layers, ArrowRight, Sparkles } from "lucide-react";
import api from "../api";
import SeoHead from "../components/SeoHead";
import DynamicBreadcrumb from "../components/DynamicBreadcrumb";

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
      {/* ✅ Dynamic SEO */}
      <SeoHead
        pageType="services-listing"
        data={{
          ...seo,
          name: "Services for International Students",
          description: seo?.meta_description,
          keywords: seo?.meta_keyword,
        }}
        // FORCE override if SEO data is available
        overrides={{
          title:
            seo?.meta_title && seo.meta_title !== "%title%"
              ? seo.meta_title
              : undefined,
          description:
            seo?.meta_description && seo.meta_description !== "%description%"
              ? seo.meta_description
              : undefined,
        }}
      />

      {/* ✅ Dynamic Breadcrumb */}
      <DynamicBreadcrumb
        pageType="services-listing"
        data={{
          name: "Services",
        }}
      />

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-3">
            <span className="text-blue-600">What We Do</span>
          </h2>
          <p className="text-gray-700 text-center mb-10 max-w-3xl mx-auto">
            Having and managing a correct marketing strategy is crucial in a
            fast-moving market.
          </p>

          {/* Services Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? [...Array(8)].map((_, i) => <ServiceCardSkeleton key={i} />)
              : services.map((item) => (
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
                ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
