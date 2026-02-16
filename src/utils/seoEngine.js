/**
 * SEO Engine - Central utility for dynamic SEO generation
 * 
 * Handles URL parsing, page type detection, and dynamic meta tag generation
 * for all pages based on URL patterns, pagination, and page types.
 */

const SITE_NAME = "Education Malaysia";
const SITE_URL = import.meta.env.VITE_SITE_URL || "https://www.educationmalaysia.in";
const DEFAULT_IMAGE = `${SITE_URL}/assets/default-og-image.jpg`;

/**
 * Parse URL location into structured data
 */
export function parseUrl(location) {
  const pathname = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const segments = pathname.split('/').filter(Boolean);
  
  return {
    pathname,
    search: location.search,
    searchParams,
    segments,
    hash: location.hash,
  };
}

/**
 * Detect page type from URL pathname
 */
export function detectPageType(pathname) {
  const path = pathname.toLowerCase();
  
  // Home page
  if (path === '/' || path === '') {
    return 'home';
  }
  
  // Detail pages (with slug/id at the end)
  if (path.match(/\/university\/[^/]+$/)) return 'university-detail';
  if (path.match(/\/course\/[^/]+$/)) return 'course-detail';
  if (path.match(/\/exam\/[^/]+$/)) return 'exam-detail';
  if (path.match(/\/service\/[^/]+$/)) return 'service-detail';
  if (path.match(/\/blog\/(?!category\/)[^/]+\/[^/]+$/)) return 'blog-detail';
  if (path.match(/\/specialization\/[^/]+$/)) return 'specialization-detail';
  if (path.match(/\/qualification-level\/[^/]+$/)) return 'qualification-detail';
  
  // Listing pages
  if (path === '/universities' || path.includes('/universities/')) return 'universities-listing';
  if (path === '/courses' || path.includes('/courses/')) return 'courses-listing';
  if (path === '/exams' || path.includes('/exams/')) return 'exams-listing';
  if (path === '/services' || path.includes('/services/')) return 'services-listing';
  if (path === '/blog') return 'blog-listing';
  // Match /blog/:category but NOT /blog/:category/:slug (blog detail)
  if (path.match(/^\/blog\/[^/]+$/) && !path.match(/^\/blog\/category\//)) return 'blog-listing';
  if (path === '/specializations') return 'specializations-listing';
  
  // Static pages
  if (path === '/about') return 'about';
  if (path === '/contact') return 'contact';
  if (path === '/faq') return 'faq';
  
  return 'generic';
}

/**
 * Extract slug from pathname based on page type
 */
export function extractSlug(pathname, pageType) {
  const segments = pathname.split('/').filter(Boolean);
  
  if (pageType.includes('-detail')) {
    // Detail pages: last segment is usually the slug
    return segments[segments.length - 1] || '';
  }
  
  if (pageType.includes('-listing') && segments.length > 1) {
    // Category/filter pages: second segment might be category
    return segments[1] || '';
  }
  
  return '';
}

/**
 * Get pagination info from search params and pathname
 */
export function getPagination(searchParams, pathname = '') {
  // Check path for /page-N pattern first
  const pathMatch = pathname.match(/\/page-(\d+)/);
  if (pathMatch) {
    const page = parseInt(pathMatch[1], 10);
    return {
      page,
      isPaginated: page > 1,
    };
  }
  
  // Fallback to query param
  const page = parseInt(searchParams.get('page')) || 1;
  return {
    page,
    isPaginated: page > 1,
  };
}

// ... existing code ...

/**
 * Build canonical URL from current location
 * CRITICAL: Must match EXACT current URL - no reconstruction with slugs!
 */
export function buildCanonical(location, options = {}) {
  const { removePageOne = true } = options;
  
  // Use window.location as fallback if location prop is incomplete
  const currentLocation = location || window.location;
  
  // Build from actual pathname (NO slug reconstruction!)
  let canonicalPath = currentLocation.pathname;
  
  // Get search params for pagination
  const searchParams = new URLSearchParams(currentLocation.search);
  
  // Check for path-based pagination
  const pathMatch = canonicalPath.match(/\/page-(\d+)/);
  let page = 1;

  if (pathMatch) {
     page = parseInt(pathMatch[1], 10);
  } else {
     page = parseInt(searchParams.get('page')) || 1;
  }
  
  // Always remove 'page' from query params for canonical
  searchParams.delete('page');

  // If page > 1 and not in path, append it (for legacy URLs)
  if (page > 1 && !pathMatch) {
      canonicalPath = canonicalPath.replace(/\/$/, "");
      canonicalPath += `/page-${page}`;
  }
  
  let canonical = SITE_URL + canonicalPath;
  
  // Remove any trailing slashes
  canonical = canonical.replace(/\/$/, '');
  
  // Append remaining search params
  const queryString = searchParams.toString();
  if (queryString) {
    canonical += `?${queryString}`;
  }
  
  // Validate: ensure no "undefined" in URL
  if (canonical.includes('undefined')) {
    console.warn('⚠️ Canonical URL contains "undefined". Using window.location as fallback.');
    canonical = window.location.origin + window.location.pathname; // Fallback might be wrong if we rely on path manip, but safest immediate fallback
  }
  
  return canonical;
}

/**
 * Format slug for display (kebab-case to Title Case)
 */
export function formatSlugForDisplay(slug) {
  if (!slug) return '';
  
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Remove surrounding quotes from strings (if API returns quoted values)
 */
/**
 * Remove surrounding quotes from strings (if API returns quoted values)
 * Handles both double, single, and smart Unicode quotes.
 * Recursively removes layers of quotes and trims whitespace.
 */
export function cleanQuotes(str) {
  if (!str) return "";
  if (typeof str !== 'string') return String(str);
  
  let cleaned = str.trim();

  // Decode HTML entities (extended)
  cleaned = cleaned
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  // Remove JSON stringified quotes (e.g., "\"Name\"")
  cleaned = cleaned.replace(/^"|"$/g, ''); 
  
  // Recursively remove specific quote characters from start and end
  // This handles unbalanced quotes too, e.g. '"Name' -> 'Name'
  const quotes = ['"', "'", '\u201C', '\u201D', '\u2018', '\u2019', '`'];
  
  while (true) {
    const original = cleaned;
    let changed = false;
    
    // Remove from start
    for (const q of quotes) {
      if (cleaned.startsWith(q)) {
        cleaned = cleaned.substring(1).trim();
        changed = true;
      }
    }
    
    // Remove from end
    for (const q of quotes) {
      if (cleaned.endsWith(q)) {
        cleaned = cleaned.substring(0, cleaned.length - 1).trim();
        changed = true;
      }
    }
    
    if (!changed || cleaned === original) break;
  }
  
  return cleaned;
}

/**
 * Build dynamic title based on page type and data
 */
export function buildTitle(pageType, data = {}, page = 1) {
  // Clean any quotes from incoming data
  const name = cleanQuotes(data.name);
  const category = cleanQuotes(data.category);
  const slug = cleanQuotes(data.slug);
  let title = '';
  
  switch (pageType) {
    // Home page
    case 'home':
      title = `Study in Malaysia | Find Top Universities, Courses & Admission 2026`;
      break;
    
    // University detail
    case 'university-detail':
      title = `${name || formatSlugForDisplay(slug)} | Courses, Fees & Admission 2026`;
      break;
    
    // Course detail
    case 'course-detail':
      title = `${name || formatSlugForDisplay(slug)} | Course Details & Fees`;
      break;
    
    // Exam detail
    case 'exam-detail':
      title = `${name || formatSlugForDisplay(slug)} | Exam Pattern, Eligibility & Dates`;
      break;
    
    // Service detail
    case 'service-detail':
      title = `${name || formatSlugForDisplay(slug)} | ${SITE_NAME}`;
      break;
    
    // Blog detail
    case 'blog-detail':
      title = `${name || formatSlugForDisplay(slug)}`;
      break;
    
    // Specialization detail
    case 'specialization-detail':
      title = `${name || formatSlugForDisplay(slug)} | Universities & Courses in Malaysia`;
      break;
    
    // Qualification detail
    case 'qualification-detail':
      title = `${name || formatSlugForDisplay(slug)} | Courses & Universities`;
      break;

    // Scholarship detail
    case 'scholarship-detail':
      title = `${name || formatSlugForDisplay(slug)} | Scholarships in Malaysia 2026`;
      break;
    
    // Universities listing
    case 'universities-listing':
      if (category) {
        title = `${formatSlugForDisplay(category)} Universities in Malaysia`;
      } else {
        title = `Top Universities in Malaysia | Complete List 2026`;
      }
      break;
    
    // Courses listing
    case 'courses-listing':
      if (category) {
        title = `${formatSlugForDisplay(category)} Courses in Malaysia`;
      } else {
        title = `Courses in Malaysia | Find Your Perfect Program 2026`;
      }
      break;
    
    // Exams listing
    case 'exams-listing':
      title = `Entrance Exams for Malaysia | Exam Calendar 2026`;
      break;
    
    // Services listing
    case 'services-listing':
      title = `Our Services | ${SITE_NAME}`;
      break;
    
    // Blog listing
    case 'blog-listing':
      if (category) {
        title = `${formatSlugForDisplay(category)} Articles & Guides`;
      } else {
        title = `Blog | Latest News & Guides for Study in Malaysia`;
      }
      break;
    
    // Specializations listing
    case 'specializations-listing':
      title = `Study Specializations in Malaysia | All Fields 2026`;
      break;
    
    // Static pages
    case 'about':
      title = `About Us | ${SITE_NAME}`;
      break;
    case 'contact':
      title = `Contact Us | ${SITE_NAME}`;
      break;
    case 'faq':
      title = `Frequently Asked Questions | ${SITE_NAME}`;
      break;
    
    // Generic fallback
    default:
      title = SITE_NAME;
  }
  
  // Add pagination suffix if page > 1
  if (page > 1) {
    title += ` – Page ${page}`;
  }
  
  // Add site name if not already present (for detail pages)
  if (!title.includes(SITE_NAME) && pageType.includes('-detail')) {
    title += ` | ${SITE_NAME}`;
  }
  
  // Final cleanup: ensure no quotes in the final title
  return cleanQuotes(title);
}

/**
 * Build dynamic description based on page type and data
 */
export function buildDescription(pageType, data = {}, page = 1) {
  // Clean any quotes from incoming data
  const name = cleanQuotes(data.name);
  const category = cleanQuotes(data.category);
  const slug = cleanQuotes(data.slug);
  const description = cleanQuotes(data.description);
  let desc = '';
  
  switch (pageType) {
    case 'home':
      desc = `Explore top universities in Malaysia. Find courses, fees, scholarships, admission requirements, and visa information for international students studying in Malaysia.`;
      break;
    
    case 'university-detail':
      desc = `Learn about ${name || formatSlugForDisplay(slug)} including courses offered, fees structure, admission process, rankings, and student reviews. Apply now for 2026 intake.`;
      break;
    
    case 'course-detail':
      desc = `Complete information about ${name || formatSlugForDisplay(slug)} course in Malaysia. Check fees, duration, eligibility, career prospects, and universities offering this program.`;
      break;
    
    case 'exam-detail':
      desc = `${name || formatSlugForDisplay(slug)} exam details including pattern, syllabus, eligibility criteria, important dates, and preparation tips for admission to Malaysian universities.`;
      break;
    
    case 'blog-detail':
      desc = description || `Read our comprehensive guide on ${name || formatSlugForDisplay(slug)}. Get insights and tips for studying in Malaysia.`;
      break;
    
    case 'universities-listing':
      if (category) {
        desc = `Browse all ${formatSlugForDisplay(category).toLowerCase()} universities in Malaysia. Compare rankings, fees, courses, and admission requirements.`;
      } else {
        desc = `Comprehensive list of top universities in Malaysia. Compare public and private universities, check rankings, fees, courses, and admission requirements for 2026.`;
      }
      break;
    
    case 'courses-listing':
      if (category) {
        desc = `Find ${formatSlugForDisplay(category).toLowerCase()} courses available in Malaysian universities. Compare fees, duration, eligibility, and career prospects.`;
      } else {
        desc = `Explore thousands of courses in Malaysia across all fields. Find undergraduate, postgraduate, and diploma programs with fees and admission details.`;
      }
      break;
    
    case 'blog-listing':
      if (category) {
        desc = `Read latest articles and guides about ${formatSlugForDisplay(category).toLowerCase()}. Expert insights for studying in Malaysia.`;
      } else {
        desc = `Latest news, guides, and articles about studying in Malaysia. Get expert advice on admissions, scholarships, visa process, and student life.`;
      }
      break;
    
    default:
      desc = `${SITE_NAME} - Your comprehensive guide to studying in Malaysia. Find universities, courses, fees, and admission information.`;
  }
  
  // Add pagination note if page > 1
  if (page > 1) {
    desc += ` (Page ${page})`;
  }
  
  return desc;
}

/**
 * Generate breadcrumb array from pathname and page data
 */
export function generateBreadcrumbs(pathname, pageType, data = {}, page = 1) {
  const breadcrumbs = [
    { label: 'Home', url: '/' }
  ];
  
  const segments = pathname.split('/').filter(Boolean);
  
  // Build breadcrumbs based on page type
  if (pageType === 'universities-listing') {
    breadcrumbs.push({ label: 'Universities', url: '/universities' });
    
    if (data.category) {
      breadcrumbs.push({ 
        label: formatSlugForDisplay(data.category), 
        url: `/universities/${data.category}` 
      });
    }
  } else if (pageType === 'university-detail') {
    breadcrumbs.push({ label: 'Universities', url: '/universities' });
    breadcrumbs.push({ 
      label: data.name || formatSlugForDisplay(data.slug), 
      url: pathname 
    });
  } else if (pageType === 'courses-listing') {
    breadcrumbs.push({ label: 'Courses', url: '/courses' });
    
    if (data.category) {
      breadcrumbs.push({ 
        label: formatSlugForDisplay(data.category), 
        url: `/courses/${data.category}` 
      });
    }
  } else if (pageType === 'course-detail') {
    breadcrumbs.push({ label: 'Courses', url: '/courses' });
    breadcrumbs.push({ 
      label: data.name || formatSlugForDisplay(data.slug), 
      url: pathname 
    });
  } else if (pageType === 'blog-listing') {
    breadcrumbs.push({ label: 'Blog', url: '/blog' });
    
    if (data.category) {
      breadcrumbs.push({ 
        label: formatSlugForDisplay(data.category), 
        url: `/blog/${data.category}` 
      });
    }
  } else if (pageType === 'blog-detail') {
    breadcrumbs.push({ label: 'Blog', url: '/blog' });
    
    if (data.category) {
      breadcrumbs.push({ 
        label: formatSlugForDisplay(data.category),
        url: `/blog/${data.category}` 
      });
    }
    
    breadcrumbs.push({ 
      label: data.name || formatSlugForDisplay(data.slug), 
      url: pathname 
    });
  } else {
    // Generic breadcrumb generation from segments
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip if it's the last segment and it's a detail page (already added)
      if (index === segments.length - 1 && pageType.includes('-detail')) {
        return;
      }
      
      breadcrumbs.push({
        label: formatSlugForDisplay(segment),
        url: currentPath
      });
    });
  }
  
  // Add page number to last breadcrumb if paginated
  if (page > 1) {
    breadcrumbs.push({ label: `Page ${page}`, url: `${pathname}?page=${page}` });
  }
  
  return breadcrumbs;
}

/**
 * Generate structured data for breadcrumbs (JSON-LD)
 */
export function generateBreadcrumbSchema(breadcrumbs, pageTitle = '', pageDescription = '') {
  return {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    "name": pageTitle || breadcrumbs[breadcrumbs.length - 1]?.label || SITE_NAME,
    "description": pageDescription || `Navigate to ${breadcrumbs[breadcrumbs.length - 1]?.label || 'this page'} on ${SITE_NAME}`,
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.label,
      "item": `${SITE_URL}${crumb.url}`
    }))
  };
}

export default {
  parseUrl,
  detectPageType,
  extractSlug,
  getPagination,
  formatSlugForDisplay,
  cleanQuotes,
  buildTitle,
  buildDescription,
  buildCanonical,
  generateBreadcrumbs,
  generateBreadcrumbSchema,
  SITE_NAME,
  SITE_URL,
  DEFAULT_IMAGE,
};
