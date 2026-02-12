import React from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import seoEngine from "../utils/seoEngine";

/**
 * DynamicBreadcrumb Component
 *
 * Automatically generates breadcrumbs based on current URL and page type.
 * Updates dynamically when navigation or pagination changes.
 *
 * @param {Object} props
 * @param {string} props.pageType - Override auto-detected page type (optional)
 * @param {Object} props.data - Page-specific data (name, category, etc.)
 * @param {string} props.className - Additional CSS classes (optional)
 */
const DynamicBreadcrumb = ({
  pageType: manualPageType,
  data = {},
  className = "",
}) => {
  const location = useLocation();

  // Parse URL
  const urlData = seoEngine.parseUrl(location);
  const { page } = seoEngine.getPagination(urlData.searchParams);

  // Detect page type
  const pageType = manualPageType || seoEngine.detectPageType(urlData.pathname);

  // Extract slug
  const slug = data.slug || seoEngine.extractSlug(urlData.pathname, pageType);

  // Generate breadcrumbs
  const pageData = { ...data, slug };
  const breadcrumbs = seoEngine.generateBreadcrumbs(
    urlData.pathname,
    pageType,
    pageData,
    page,
  );

  // Don't render if only home breadcrumb
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <div className={`w-full bg-blue-50 shadow-sm ${className}`}>
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 flex-wrap">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const isHome = index === 0;

              return (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <ChevronRight
                      size={16}
                      className="mx-2 text-gray-400 flex-shrink-0"
                    />
                  )}

                  {isLast ? (
                    // Last item (current page) - not a link
                    <span
                      className="text-gray-800 font-medium flex items-center gap-1"
                      aria-current="page"
                    >
                      {isHome && <Home size={18} />}
                      {crumb.label}
                    </span>
                  ) : (
                    // Clickable breadcrumb link
                    <Link
                      to={crumb.url}
                      className="hover:text-blue-600 hover:underline transition flex items-center gap-1"
                    >
                      {isHome && <Home size={18} />}
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default DynamicBreadcrumb;
