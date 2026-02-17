const DEFAULT_SITE_URL = "https://www.educationmalaysia.in";
const DEFAULT_TITLE = "Education Malaysia";
const DEFAULT_DESCRIPTION =
  "Study in Malaysia - Find top universities, courses, fees, visa requirements, and scholarships.";

function hasSeoShape(value) {
  if (!value || typeof value !== "object") return false;
  return Boolean(
    value.meta_title ||
      value.meta_description ||
      value.meta_keyword ||
      value.page_url ||
      value.og_image_path,
  );
}

function pickSeoObject(payload) {
  if (!payload || typeof payload !== "object") return null;

  const directCandidates = [
    payload.seo,
    payload.data?.seo,
    payload.data?.seos,
    payload.seos,
    payload.blog?.seo,
    payload.blog,
    payload.data,
    payload,
  ];

  for (const candidate of directCandidates) {
    if (hasSeoShape(candidate)) return candidate;
  }

  const stack = [payload];
  const seen = new Set();
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object" || seen.has(current)) continue;
    seen.add(current);
    if (hasSeoShape(current)) return current;
    for (const value of Object.values(current)) {
      if (value && typeof value === "object") stack.push(value);
    }
  }

  return null;
}

function decodeSlug(slug = "") {
  return decodeURIComponent(slug).replace(/-/g, " ").trim();
}

function toTitleFromPath(pathname) {
  if (pathname === "/" || !pathname) return "Home";
  return pathname
    .split("/")
    .filter(Boolean)
    .map((part) => decodeSlug(part))
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" | ");
}

function buildCourseFiltersFromPath(pathname) {
  const match = pathname.match(/^\/([a-z0-9-]+)-courses(?:\/page-\d+)?$/i);
  if (!match) return {};

  const slug = match[1].toLowerCase();
  const commonLevels = new Set([
    "pre-university",
    "diploma",
    "under-graduate",
    "post-graduate",
    "post-graduate-diploma",
    "phd",
  ]);
  const commonIntakes = new Set([
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ]);
  const commonStudyModes = new Set([
    "full-time",
    "part-time",
    "online",
    "by-course-work",
  ]);

  if (commonLevels.has(slug)) return { level: slug };
  if (commonIntakes.has(slug)) return { intake: slug };
  if (commonStudyModes.has(slug)) return { study_mode: slug };
  return { specialization: slug };
}

function getEndpointForPath(pathname, searchParams) {
  if (pathname === "/") return "/home";

  if (pathname === "/courses-in-malaysia" || pathname === "/courses-in-malaysias") {
    const page = searchParams.get("page") || "1";
    const params = new URLSearchParams(searchParams);
    if (!params.has("page")) params.set("page", page);
    return `/courses-in-malaysia?${params.toString()}`;
  }

  if (/^\/[a-z0-9-]+-courses(?:\/page-\d+)?$/i.test(pathname)) {
    const params = new URLSearchParams(searchParams);
    const pathPageMatch = pathname.match(/\/page-(\d+)$/);
    if (pathPageMatch) params.set("page", pathPageMatch[1]);
    if (!params.has("page")) params.set("page", "1");
    const filters = buildCourseFiltersFromPath(pathname);
    for (const [key, value] of Object.entries(filters)) params.set(key, value);
    return `/courses-in-malaysia?${params.toString()}`;
  }

  if (pathname === "/universities") return "/universities";
  if (/^\/universities\/[^/]+(?:\/page-\d+)?$/i.test(pathname)) {
    const params = new URLSearchParams(searchParams);
    const pageMatch = pathname.match(/\/page-(\d+)$/);
    if (pageMatch) params.set("page", pageMatch[1]);
    if (!params.has("page")) params.set("page", "1");
    params.set("per_page", params.get("per_page") || "21");
    return `/universities/universities-in-malaysia?${params.toString()}`;
  }

  if (/^\/university\/[^/]+$/i.test(pathname)) {
    const slug = pathname.split("/")[2];
    return `/university-details/${slug}`;
  }

  if (/^\/university\/[^/]+\/courses\/[^/]+$/i.test(pathname)) {
    const parts = pathname.split("/");
    return `/university-course-details/${parts[2]}/${parts[4]}`;
  }

  if (pathname === "/resources/exams") return "/exams";
  if (/^\/resources\/exams\/[^/]+$/i.test(pathname)) {
    const slug = pathname.split("/").at(-1);
    return `/exam-details/${slug}`;
  }

  if (pathname === "/resources/services") return "/services";
  if (/^\/resources\/services\/[^/]+$/i.test(pathname)) {
    const slug = pathname.split("/").at(-1);
    return `/service-details/${slug}`;
  }

  if (pathname === "/blog") {
    const page = searchParams.get("page") || "1";
    return `/blog?page=${page}&per_page=1000`;
  }
  if (/^\/blog\/[^/]+$/i.test(pathname)) {
    const category = pathname.split("/")[2];
    const page = searchParams.get("page") || "1";
    return `/blog?category_slug=${category}&page=${page}&per_page=1000`;
  }
  if (/^\/blog\/[^/]+\/[^/]+$/i.test(pathname)) {
    const parts = pathname.split("/");
    return `/blog-details/${parts[2]}/${parts[3]}`;
  }

  if (pathname === "/scholarships") return "/scholarships";
  if (/^\/scholarships\/[^/]+$/i.test(pathname)) {
    const slug = pathname.split("/")[2];
    return `/scholarship-details/${slug}`;
  }

  if (pathname === "/specialization") return "/specializations/course-categories";
  if (/^\/specialization\/[^/]+$/i.test(pathname)) {
    const slug = pathname.split("/")[2];
    return `/specialization-detail-by-slug/${slug}`;
  }

  if (pathname === "/faqs") return "/faqs";
  if (/^\/courses\/[^/]+$/i.test(pathname)) {
    const slug = pathname.split("/")[2];
    return `/courses/${slug}`;
  }

  return null;
}

function buildImageUrl(siteUrl, rawPath) {
  if (!rawPath || typeof rawPath !== "string") return null;
  if (/^https?:\/\//i.test(rawPath)) return rawPath;
  const cleaned = rawPath.replace(/^\/+/, "");
  return `${siteUrl}/storage/${cleaned}`;
}

export async function resolveSeoForRequest({ pathname, search, env }) {
  const siteUrl = env.VITE_SITE_URL || DEFAULT_SITE_URL;
  const apiBaseUrl = env.VITE_API_BASE_URL;
  const apiKey = env.VITE_API_KEY;
  const searchParams = new URLSearchParams(search || "");

  const endpoint = getEndpointForPath(pathname, searchParams);
  let seoPayload = null;

  if (endpoint && apiBaseUrl) {
    try {
      const url = `${apiBaseUrl.replace(/\/$/, "")}/api${endpoint}`;
      const res = await fetch(url, {
        headers: apiKey ? { "x-api-key": apiKey } : {},
      });
      if (res.ok) {
        const json = await res.json();
        seoPayload = pickSeoObject(json);
      }
    } catch {
      seoPayload = null;
    }
  }

  const fallbackTitle = `${toTitleFromPath(pathname)} | ${DEFAULT_TITLE}`;
  const title =
    seoPayload?.meta_title && seoPayload.meta_title !== "%title%"
      ? seoPayload.meta_title
      : fallbackTitle;

  const description =
    seoPayload?.meta_description && seoPayload.meta_description !== "%description%"
      ? seoPayload.meta_description
      : DEFAULT_DESCRIPTION;

  const canonical =
    seoPayload?.page_url || `${siteUrl.replace(/\/$/, "")}${pathname}${search || ""}`;

  const keywords = seoPayload?.meta_keyword || "";
  const ogImage =
    buildImageUrl(siteUrl, seoPayload?.og_image_path) || `${siteUrl}/favicon.png`;

  return {
    title,
    description,
    keywords,
    canonical,
    ogImage,
  };
}

