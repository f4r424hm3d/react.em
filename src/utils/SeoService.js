/**
 * SEO Service - Centralized SEO Meta Tag Generation
 * 
 * This service generates all SEO metadata for different page types including:
 * - Dynamic titles with counts and pagination
 * - Meta descriptions
 * - Canonical URLs
 * - Open Graph tags
 * - Twitter Card tags
 * - JSON-LD structured data schemas
 * - Pagination links (rel="next", rel="prev")
 */

const BASE_URL = "https://www.educationmalaysia.in";
const SITE_NAME = "Education Malaysia";
const TWITTER_HANDLE = "@educatemalaysia";

class SeoService {
  /**
   * Clean quotes from strings to prevent them appearing in titles
   * @param {string} str - String to clean
   * @returns {string} Cleaned string without quotes
   */
  static cleanQuotes(str) {
    if (!str) return '';
    return String(str)
      .replace(/^["'\u201C\u201D\u2018\u2019`]+/g, '')
      .replace(/["'\u201C\u201D\u2018\u2019`]+$/g, '')
      .replace(/["'\u201C\u201D\u2018\u2019`]/g, '')
      .trim();
  }

  /**
   * Generate complete SEO metadata for Course Listing Pages
   * @param {Object} data - { totalCourses, courseName, filters, currentPage, lastPage, seo }
   * @param {Object} location - React Router location object
   * @returns {Object} Complete SEO metadata
   */
  static generateCourseListingMeta(data, location) {
    const {
      totalCourses = 0,
      courseName = "",
      filters = {},
      currentPage = 1,
      lastPage = 1,
      seo = {},
    } = data;

    const pathname = location?.pathname || "";
    const search = location?.search || "";

    // Build dynamic title
    let title = "";
    if (courseName) {
      const formattedCourseName = courseName
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      if (currentPage === 1) {
        title = `${totalCourses} Top ${formattedCourseName} Universities in Malaysia | Courses, Fees & Admission`;
      } else {
        title = `${totalCourses} Top ${formattedCourseName} Universities in Malaysia | Page ${currentPage} | Courses, Fees & Admission`;
      }
    } else {
      title =
        currentPage === 1
          ? this.cleanQuotes(seo?.meta_title) ||
            `${totalCourses} Top Courses in Malaysia | Universities, Fees & Admission 2026`
          : `${totalCourses} Top Courses in Malaysia | Page ${currentPage} | Universities, Fees & Admission 2026`;
    }

    // Clean the final title
    title = this.cleanQuotes(title);

    // Build dynamic description
    const description =
      seo?.meta_description ||
      `Explore ${totalCourses} ${courseName ? courseName.replace(/-/g, " ") : ""} universities in Malaysia. Compare fees, rankings, admission requirements and apply today.`;

    // Build canonical URL
    const canonicalUrl = this.buildCanonicalUrl(pathname, search, currentPage);

    // Build pagination links
    const pagination = this.buildPaginationLinks(
      currentPage,
      lastPage,
      pathname,
      search
    );

    // Build Open Graph image
    const ogImage = seo?.og_image_path
      ? `${BASE_URL}${seo.og_image_path}`
      : `${BASE_URL}/default-og-image.jpg`;

    // Generate schema
    const schemas = [this.generateWebPageSchema(title, description, canonicalUrl)];

    return {
      title,
      description,
      keywords: seo?.meta_keyword || `study in malaysia, courses in malaysia, universities in malaysia, ${courseName}`,
      canonicalUrl,
      ogTitle: title,
      ogDescription: description,
      ogImage,
      ogUrl: canonicalUrl,
      ogType: "website",
      ogSiteName: SITE_NAME,
      twitterCard: "summary_large_image",
      twitterSite: TWITTER_HANDLE,
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: ogImage,
      schemas,
      pagination,
      robots: seo?.robots || "index, follow",
    };
  }

  /**
   * Generate SEO metadata for University Detail Pages
   * @param {Object} universityData - University object
   * @returns {Object} Complete SEO metadata
   */
  static generateUniversityDetailMeta(universityData) {
    const { name, slug, logo_path, city, seo = {} } = universityData;

    const title = this.cleanQuotes(
      seo?.meta_title ||
      `${name} Malaysia | Courses, Fees, Ranking & Admission 2026`
    );

    const description =
      seo?.meta_description ||
      `Explore ${name} Malaysia. View courses, tuition fees, global ranking, admission requirements and apply online.`;

    const canonicalUrl = `${BASE_URL}/university/${slug}`;

    const ogImage = logo_path
      ? `${BASE_URL}${logo_path}`
      : seo?.og_image_path
      ? `${BASE_URL}${seo.og_image_path}`
      : `${BASE_URL}/default-university.jpg`;

    // Generate CollegeOrUniversity schema
    const schemas = [this.generateUniversitySchema(universityData)];

    return {
      title,
      description,
      keywords: seo?.meta_keyword || `${name}, universities in malaysia, ${city}, courses, fees, admission`,
      canonicalUrl,
      ogTitle: title,
      ogDescription: description,
      ogImage,
      ogUrl: canonicalUrl,
      ogType: "website",
      ogSiteName: SITE_NAME,
      twitterCard: "summary_large_image",
      twitterSite: TWITTER_HANDLE,
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: ogImage,
      schemas,
      robots: seo?.robots || "index, follow",
    };
  }

  /**
   * Generate SEO metadata for Course Overview Pages
   * @param {Object} courseData - Course object
   * @returns {Object} Complete SEO metadata
   */
  static generateCourseOverviewMeta(courseData) {
    const { name, slug, seo = {} } = courseData;

    const title = this.cleanQuotes(
      seo?.meta_title ||
      `${name} in Malaysia | Fees, Eligibility, Top Universities`
    );

    const description =
      seo?.meta_description ||
      `Complete guide to studying ${name} in Malaysia including fees, duration, eligibility, career scope and top ranked universities.`;

    const canonicalUrl = `${BASE_URL}/courses/${slug}`;

    const ogImage = seo?.og_image_path
      ? `${BASE_URL}${seo.og_image_path}`
      : `${BASE_URL}/default-course.jpg`;

    // Generate Course schema
    const schemas = [this.generateCourseSchema(courseData)];

    return {
      title,
      description,
      keywords: seo?.meta_keyword || `${name}, study in malaysia, course fees, eligibility, universities`,
      canonicalUrl,
      ogTitle: title,
      ogDescription: description,
      ogImage,
      ogUrl: canonicalUrl,
      ogType: "article",
      ogSiteName: SITE_NAME,
      twitterCard: "summary_large_image",
      twitterSite: TWITTER_HANDLE,
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: ogImage,
      schemas,
      robots: seo?.robots || "index, follow",
    };
  }

  /**
   * Generate SEO metadata for Course Ranking Pages
   * @param {Object} data - { courseName, rankings, seo }
   * @returns {Object} Complete SEO metadata
   */
  static generateRankingMeta(data) {
    const { courseName = "", rankings = [], seo = {} } = data;

    const title = this.cleanQuotes(
      seo?.meta_title ||
      `Top Ranked ${courseName} Universities in Malaysia 2026`
    );

    const description =
      seo?.meta_description ||
      `Check updated rankings of ${courseName} universities in Malaysia. Compare top institutions based on performance and reputation.`;

    const canonicalUrl = `${BASE_URL}/course-ranking`;

    const ogImage = seo?.og_image_path
      ? `${BASE_URL}${seo.og_image_path}`
      : `${BASE_URL}/default-ranking.jpg`;

    // Generate ItemList schema
    const schemas = [this.generateItemListSchema(rankings)];

    return {
      title,
      description,
      keywords: seo?.meta_keyword || `university rankings, ${courseName}, malaysia rankings, top universities`,
      canonicalUrl,
      ogTitle: title,
      ogDescription: description,
      ogImage,
      ogUrl: canonicalUrl,
      ogType: "website",
      ogSiteName: SITE_NAME,
      twitterCard: "summary_large_image",
      twitterSite: TWITTER_HANDLE,
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: ogImage,
      schemas,
      robots: seo?.robots || "index, follow",
    };
  }

  /**
   * Build canonical URL with proper pagination and filters
   * @param {string} pathname - Current pathname
   * @param {string} search - Current search params
   * @param {number} currentPage - Current page number
   * @returns {string} Canonical URL
   */
  static buildCanonicalUrl(pathname, search, currentPage = 1) {
    const params = new URLSearchParams(search);
    
    // ✅ Always remove 'page' from query params (we use path-based pagination now)
    params.delete("page");

    let canonicalPath = pathname;

    // ✅ If page > 1 and path doesn't already have /page-N, append it
    // This handles legacy URLs (?page=3) by converting them to new format in canonical
    if (currentPage > 1 && !canonicalPath.match(/\/page-\d+/)) {
       // Ensure no trailing slash before appending
       canonicalPath = canonicalPath.replace(/\/$/, "");
       canonicalPath = `${canonicalPath}/page-${currentPage}`;
    }

    const queryString = params.toString();
    const url = `${BASE_URL}${canonicalPath}${queryString ? `?${queryString}` : ""}`;

    return url;
  }

  /**
   * Build pagination links for rel="next" and rel="prev"
   * @param {number} currentPage - Current page
   * @param {number} lastPage - Last page
   * @param {string} pathname - Current pathname
   * @param {string} search - Current search params
   * @returns {Object} { prev, next } URLs
   */
  static buildPaginationLinks(currentPage, lastPage, pathname, search) {
    const params = new URLSearchParams(search);
    params.delete("page"); // Remove existing page param
    
    // Clean base path (remove any existing /page-N) to append new one
    const cleanPath = pathname.replace(/\/page-\d+$/, "").replace(/\/$/, "");

    let prev = null;
    let next = null;

    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      if (prevPage === 1) {
        // Page 1 should not have /page-1
        prev = `${BASE_URL}${cleanPath}${params.toString() ? `?${params.toString()}` : ""}`;
      } else {
        prev = `${BASE_URL}${cleanPath}/page-${prevPage}${params.toString() ? `?${params.toString()}` : ""}`;
      }
    }

    if (currentPage < lastPage) {
      const nextPage = currentPage + 1;
      next = `${BASE_URL}${cleanPath}/page-${nextPage}${params.toString() ? `?${params.toString()}` : ""}`;
    }

    return { prev, next };
  }

  /**
   * Generate WebPage schema
   */
  static generateWebPageSchema(title, description, url) {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description: description,
      url: url,
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/logo.png`,
        },
      },
    };
  }

  /**
   * Generate Course schema
   */
  static generateCourseSchema(courseData) {
    const { name, description, slug } = courseData;

    return {
      "@context": "https://schema.org",
      "@type": "Course",
      name: name,
      description: description || `Study ${name} in Malaysia`,
      provider: {
        "@type": "Organization",
        name: SITE_NAME,
        url: BASE_URL,
      },
      url: `${BASE_URL}/courses/${slug}`,
    };
  }

  /**
   * Generate CollegeOrUniversity schema
   */
  static generateUniversitySchema(universityData) {
    const { name, slug, logo_path, city, address } = universityData;

    return {
      "@context": "https://schema.org",
      "@type": "CollegeOrUniversity",
      name: name,
      url: `${BASE_URL}/university/${slug}`,
      logo: logo_path ? `${BASE_URL}${logo_path}` : undefined,
      address: {
        "@type": "PostalAddress",
        addressLocality: city || "Kuala Lumpur",
        addressCountry: "MY",
        streetAddress: address || "",
      },
      sameAs: universityData.website || undefined,
      description: universityData.description || `${name} is a leading university in Malaysia`,
    };
  }

  /**
   * Generate ItemList schema for rankings
   */
  static generateItemListSchema(items) {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name || item.university_name,
        url: item.url || `${BASE_URL}/university/${item.slug}`,
      })),
    };
  }

  /**
   * Sanitize text for meta tags
   * @param {string} text - Text to sanitize
   * @param {number} maxLength - Maximum length
   * @returns {string} Sanitized text
   */
  static sanitizeText(text, maxLength = 160) {
    if (!text) return "";
    
    // Remove HTML tags
    let sanitized = text.replace(/<[^>]*>/g, "");
    
    // Decode HTML entities
    const textarea = document.createElement("textarea");
    textarea.innerHTML = sanitized;
    sanitized = textarea.value;
    
    // Truncate if needed
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength - 3) + "...";
    }
    
    return sanitized;
  }

  /**
   * Capitalize first letter of each word
   */
  static ucwords(str) {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}

export default SeoService;
