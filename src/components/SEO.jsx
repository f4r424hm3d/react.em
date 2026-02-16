import { useEffect } from "react";

const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = "website",
  canonicalUrl,
  noIndex = false,
}) => {
  useEffect(() => {
    // Helper function to clean quotes from strings
    const cleanQuotes = (str) => {
      if (!str) return "";
      return String(str)
        .replace(/^["'\u201C\u201D\u2018\u2019`]+/g, "")
        .replace(/["'\u201C\u201D\u2018\u2019`]+$/g, "")
        .replace(/["'\u201C\u201D\u2018\u2019`]/g, "")
        .trim();
    };

    // Update document title - CLEAN QUOTES
    if (title) {
      document.title = cleanQuotes(title);
    }

    // Update or create meta tags
    const updateMetaTag = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update meta description
    if (description) {
      updateMetaTag("description", description);
      updatePropertyTag("og:description", description);
    }

    // Update meta keywords
    if (keywords) {
      updateMetaTag("keywords", keywords);
    }

    // Update Open Graph tags
    if (title) {
      updatePropertyTag("og:title", title);
    }

    if (ogImage) {
      updatePropertyTag("og:image", ogImage);
    }

    updatePropertyTag("og:type", ogType);

    // Update canonical URL
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    }

    // Handle noindex
    if (noIndex) {
      updateMetaTag("robots", "noindex, nofollow");
    } else {
      updateMetaTag("robots", "index, follow");
    }

    // Cleanup function to reset to default values when component unmounts
    return () => {
      document.title =
        "Study In Malaysia: Find Universities, Fees, Courses, Visa, Requirements, Scholarships";
      updateMetaTag(
        "description",
        "Study in Malaysia - Find top universities, courses, fees, visa requirements, and scholarships. Get expert guidance for your study abroad journey in Malaysia.",
      );
      updateMetaTag(
        "keywords",
        "study in malaysia, universities in malaysia, courses in malaysia, education malaysia",
      );
      updatePropertyTag(
        "og:title",
        "Study In Malaysia: Find Universities, Fees, Courses, Visa, Requirements, Scholarships",
      );
      updatePropertyTag(
        "og:description",
        "Study in Malaysia - Find top universities, courses, fees, visa requirements, and scholarships. Get expert guidance for your study abroad journey in Malaysia.",
      );
      updatePropertyTag("og:type", "website");
      updateMetaTag("robots", "index, follow");
    };
  }, [title, description, keywords, ogImage, ogType, canonicalUrl, noIndex]);

  return null; // This component doesn't render anything
};

export default SEO;
