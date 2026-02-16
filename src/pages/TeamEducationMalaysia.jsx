import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import SeoHead from "../components/SeoHead";
import DynamicBreadcrumb from "../components/DynamicBreadcrumb";
import useStaticPageSeo from "../hooks/useStaticPageSeo";
import api from "../api";

// ✅ Your formatting function
const formatHTML = (html) => {
  if (!html) return "";

  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  let decoded = textarea.value;

  decoded = decoded.replace(/<span[^>]*>/gi, "");
  decoded = decoded.replace(/<\/span>/gi, "");
  decoded = decoded.replace(/style="[^"]*"/gi, "");
  decoded = decoded.replace(/&nbsp;/gi, " ");
  decoded = decoded.replace(
    /<h([1-6])[^>]*>([^<]*?)\s*:\s*<\/h\1>/gi,
    (_m, level, title) => {
      return `<h${level}>${title.trim()}</h${level}>`;
    },
  );
  decoded = decoded.replace(/<p>\s*:\s*/gi, "<p>");
  decoded = decoded.replace(
    /<strong>(.*?)<\/strong>/gi,
    `<h4 class="text-lg font-semibold mb-2 mt-4">$1</h4>`,
  );
  decoded = decoded.replace(
    /<b>(.*?)<\/b>/gi,
    `<h4 class="text-lg font-semibold mb-2 mt-4">$1</h4>`,
  );
  decoded = decoded.replace(/(?:\r\n|\r|\n)/g, "</p><p>");
  decoded = `<p>${decoded}</p>`;
  decoded = decoded.replace(/<p><\/p>/g, "");

  decoded = decoded.replace(
    /<table(.*?)>/g,
    `<div class="overflow-auto rounded-xl shadow-sm border border-gray-200 my-6"><table class="w-full border-collapse" $1>`,
  );
  decoded = decoded.replace(/<\/table>/g, "</table></div>");
  decoded = decoded.replace(
    /<thead>/g,
    '<thead class="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-left text-sm">',
  );
  decoded = decoded.replace(
    /<th>/g,
    '<th class="px-4 py-3 font-medium whitespace-nowrap border-b border-blue-200 text-white text-sm">',
  );
  decoded = decoded.replace(/<tr>/g, '<tr class="even:bg-blue-50">');
  decoded = decoded.replace(
    /<td>(.*?)<\/td>/g,
    '<td class="px-4 py-3 text-sm text-gray-800">$1</td>',
  );

  decoded = decoded.replace(
    /<input[^>]*type=["']checkbox["'][^>]*>/gi,
    `<span class="inline-block w-4 h-4 rounded border border-gray-400 mr-2 bg-white"></span>`,
  );
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

export default function ExpandableCard() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { seo: apiSeo } = useStaticPageSeo(
    "resources/Guidelines/team-education-malaysia",
  );

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get("/home");
        const pageContent = res.data?.data?.pageContent;
        if (pageContent) {
          setContent(pageContent);
        } else {
          console.warn("pageContent not found in response");
        }
      } catch (err) {
        console.error("Failed to load page content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="w-full bg-white">
      {/* ✅ Dynamic SEO - Always render */}
      <SeoHead
        pageType="service-detail"
        data={{
          name: apiSeo?.meta_title,
          description: apiSeo?.meta_description,
          keywords: apiSeo?.meta_keyword,
          image: apiSeo?.og_image_path,
        }}
      />

      {/* ✅ Dynamic Breadcrumb - Always render */}
      <DynamicBreadcrumb
        pageType="service-detail"
        data={{
          title: "Team Education Malaysia",
          slug: "team-education-malaysia",
        }}
      />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
          {/* Header Section - Always Visible */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500 absolute -top-1 -right-1 bg-white rounded-full" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Team Education Malaysia
              </h2>
              <p className="text-sm text-gray-600">Updated on - Mar 26, 2025</p>
            </div>
          </div>

          {/* Dynamic Content - Renders when available (No Spinner) */}
          {content && (
            <div className="animate-fadeIn">
              {/* Dynamic Heading */}
              {content.heading && (
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {content.heading}
                </h1>
              )}

              {/* Rich HTML Content */}
              {content.description && (
                <div className="text-[15px] leading-relaxed">
                  <div
                    className="custom-html"
                    dangerouslySetInnerHTML={{
                      __html: formatHTML(content.description),
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Optional: Show error only if NOT loading and NO content */}
          {!loading && !content && (
            <p className="text-center py-10 text-red-500">No content found</p>
          )}
        </div>
      </div>
    </div>
  );
}
