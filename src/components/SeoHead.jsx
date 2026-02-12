import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import seoEngine from "../utils/seoEngine";

/**
 * SeoHead Component
 *
 * Automatically generates all SEO meta tags based on current URL and page data.
 * Supports pagination, Open Graph, Twitter Cards, and structured data.
 *
 * @param {Object} props
 * @param {string} props.pageType - Override auto-detected page type (optional)
 * @param {Object} props.data - Page-specific data (name, category, description, etc.)
 * @param {string} props.image - Custom Open Graph image URL (optional)
 * @param {boolean} props.noindex - Prevent search engine indexing (optional)
 * @param {Object} props.overrides - Manual overrides for title, description, canonical (optional)
 */
const SeoHead = ({
  pageType: manualPageType,
  data = {},
  image,
  noindex = false,
  overrides = {},
}) => {
  const location = useLocation();

  // Parse URL
  const urlData = seoEngine.parseUrl(location);
  const { page, isPaginated } = seoEngine.getPagination(urlData.searchParams);

  // Detect page type (use manual if provided, otherwise auto-detect)
  const pageType = manualPageType || seoEngine.detectPageType(urlData.pathname);

  // Extract slug if needed
  const slug = data.slug || seoEngine.extractSlug(urlData.pathname, pageType);

  // Build SEO data
  const pageData = { ...data, slug };
  const title =
    overrides.title || seoEngine.buildTitle(pageType, pageData, page);
  const description =
    overrides.description ||
    seoEngine.buildDescription(pageType, pageData, page);
  const canonical = overrides.canonical || seoEngine.buildCanonical(location);
  const ogImage = image || data.image || seoEngine.DEFAULT_IMAGE;

  // Generate breadcrumbs
  const breadcrumbs = seoEngine.generateBreadcrumbs(
    urlData.pathname,
    pageType,
    pageData,
    page,
  );
  const breadcrumbSchema = seoEngine.generateBreadcrumbSchema(
    breadcrumbs,
    title,
    description,
  );

  // Pagination links (for rel="prev" and rel="next")
  const prevPage =
    page > 2
      ? `${seoEngine.SITE_URL}${urlData.pathname}?page=${page - 1}`
      : page === 2
        ? `${seoEngine.SITE_URL}${urlData.pathname}`
        : null;
  const nextPage = `${seoEngine.SITE_URL}${urlData.pathname}?page=${page + 1}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={data.keywords || ""} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Pagination Links */}
      {isPaginated && prevPage && <link rel="prev" href={prevPage} />}
      {isPaginated && <link rel="next" href={nextPage} />}

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta
        property="og:type"
        content={pageType.includes("-detail") ? "article" : "website"}
      />
      <meta property="og:site_name" content={seoEngine.SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@educatemalaysia" />

      {/* Structured Data - Breadcrumbs */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>

      {/* Structured Data - WebPage */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          inLanguage: "en-US",
          name: title,
          description: description,
          url: `${window.location.origin}${location.pathname}${location.search}`,
          publisher: {
            "@type": "Organization",
            name: "Education Malaysia",
            logo: {
              "@type": "ImageObject",
              url: "https://www.educationmalaysia.in/assets/web/images/education-malaysia-new-logo.png",
              width: 230,
              height: 55,
            },
          },
        })}
      </script>

      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "http://schema.org",
          "@type": "Organization",
          name: "EducationMalaysia",
          url: "https://www.educationmalaysia.in/",
          logo: "https://www.educationmalaysia.in/assets/web/images/education-malaysia-new-logo.png",
          image:
            "https://www.educationmalaysia.in/assets/web/images/education-malaysia-new-logo.png",
          sameAs: [
            "https://www.facebook.com/educationmalaysia.in",
            "https://www.pinterest.com/educationmalaysiain/",
            "https://twitter.com/educatemalaysia/",
            "https://www.instagram.com/educationmalaysia.in/",
            "https://www.quora.com/profile/Education-Malaysia-3",
            "https://www.linkedin.com/company/educationmalaysia/",
            "https://www.youtube.com/channel/UCK7S9yvQnx08CgcDMMfYAyg",
          ],
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: "+91 9818560331",
              contactType: "customer support",
            },
          ],
        })}
      </script>

      {/* Additional Structured Data (if provided) */}
      {data.structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(data.structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SeoHead;
