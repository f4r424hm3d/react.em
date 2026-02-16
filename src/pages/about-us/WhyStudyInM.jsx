import React, { useEffect } from "react";
import OtherFeatures from "../../components/OtherFeatures";
import FeaturedUniversities from "../../components/FeaturedUniversities";
import SeoHead from "../../components/SeoHead";
import DynamicBreadcrumb from "../../components/DynamicBreadcrumb";
import useStaticPageSeo from "../../hooks/useStaticPageSeo";

const WhyStudyInM = () => {
  const { seo: apiSeo } = useStaticPageSeo("why-study");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* ✅ Dynamic SEO */}
      <SeoHead
        pageType="service-detail"
        data={{
          name: apiSeo?.meta_title,
          description: apiSeo?.meta_description,
          keywords: apiSeo?.meta_keyword,
          image: apiSeo?.og_image_path,
        }}
      />

      {/* ✅ Dynamic Breadcrumb */}
      <DynamicBreadcrumb
        pageType="service-detail"
        data={{
          title: "Why Study in Malaysia",
          slug: "why-study",
        }}
      />

      {/* Left Sidebar - Expanded Width & Better Spacing */}
      <div className="hidden lg:block lg:w-[350px] xl:w-[400px] bg-white border-r border-gray-200 shadow-md p-6 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto shrink-0 z-10">
        <div className="text-left text-blue-700 font-semibold space-y-8">
          <OtherFeatures />
          <div className="mt-8">
            <FeaturedUniversities />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:p-10 space-y-10 overflow-x-hidden">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
          Why Study in Malaysia for Higher Education?
        </h1>

        <p className="text-gray-700 leading-relaxed">
          Malaysia is one of Asia's leading education hubs with global
          university campuses, affordable costs, and diverse culture. It is
          known for its infrastructure, safety, and English-medium instruction,
          making it a great study destination.
        </p>

        <div className="bg-white p-6 rounded-xl shadow space-y-6">
          <h2 className="text-2xl font-semibold text-blue-700">
            Top Reasons To Study In Malaysia
          </h2>
          <ul className="grid md:grid-cols-2 gap-4 list-disc pl-5 text-gray-700">
            <li>Affordable education and living</li>
            <li>English as the medium of instruction</li>
            <li>Single-door visa process</li>
            <li>International lecturers and researchers</li>
            <li>High-quality infrastructure</li>
            <li>Career and job opportunities</li>
            <li>Part-time work during semester break</li>
            <li>Global university branch campuses</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-2xl font-semibold text-blue-700">
            Cost of Studying in Malaysia
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm border">
              <thead>
                <tr className="bg-blue-100 text-left">
                  <th className="p-2 border">Programme</th>
                  <th className="p-2 border">Duration</th>
                  <th className="p-2 border">Cost (USD)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Pre-university</td>
                  <td className="border p-2">10 – 24 months</td>
                  <td className="border p-2">$3,000 – $10,000</td>
                </tr>
                <tr>
                  <td className="border p-2">Bachelor's Degree</td>
                  <td className="border p-2">3 Years</td>
                  <td className="border p-2">$10,000 – $20,000</td>
                </tr>
                <tr>
                  <td className="border p-2">International Degree</td>
                  <td className="border p-2">3-4 Years</td>
                  <td className="border p-2">$40,000 – $100,000</td>
                </tr>
                <tr>
                  <td className="border p-2">Medical Programme</td>
                  <td className="border p-2">4-5 Years</td>
                  <td className="border p-2">$30,000 – $100,000</td>
                </tr>
                <tr>
                  <td className="border p-2">Post-Graduate</td>
                  <td className="border p-2">1-2 Years</td>
                  <td className="border p-2">$5,000 – $10,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow space-y-3">
          <h2 className="text-2xl font-semibold text-blue-700">
            Culture, Climate & Connectivity
          </h2>
          <p className="text-gray-700">
            Malaysia's multicultural society offers exposure to global
            perspectives, tasty cuisines, and friendly communities. With its
            strategic location, it provides easy access to popular destinations
            like Bali, Krabi, and Seoul.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow space-y-3">
          <h2 className="text-2xl font-semibold text-blue-700">
            Top Global Universities in Malaysia
          </h2>
          <p className="text-gray-700">
            Universities like University of Malaya, Monash, Nottingham, and
            Heriot-Watt have global rankings and offer international degrees at
            lower cost.
          </p>
        </div>

        {/* Mobile: Sidebar content at bottom */}
        <div className="lg:hidden bg-white p-6 rounded-xl shadow space-y-6">
          <div className="text-center text-blue-700 font-semibold">
            <OtherFeatures />
            <div className="mt-8">
              {" "}
              {/* Yeh wrapper add karo */}
              <FeaturedUniversities />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyStudyInM;
