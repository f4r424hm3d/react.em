import { useState, useEffect } from "react";
import api from "../api";

/**
 * Route-to-page-name mapping for the static-page-seo API.
 * The API returns SEO data keyed by page_name (or slug).
 */
const ROUTE_TO_PAGE_NAME = {
  "/": "Home Page",
  "/login": "Login",
  "/signup": "Signup",
  "/account/password/reset": "Reset Password",
  "/resources/services": "Services",
  "/resources/services/discover-malaysia": "Discover Malaysia",
  "/resources/services/admission-guidance": "Admission Guidance",
  "/resources/services/visa-guidance": "Visa Guidance",
  "/resources/Guidelines/graduate-pass": "Graduate Pass",
  "/resources/Guidelines/MQA": "MQA",
  "/resources/Guidelines/team-education-malaysia": "Team Education Malaysia",
  "/who-we-are": "Who We Are",
  "/students-say": "What Students Say",
  "/what-people-say": "What Students Say",
  "/why-study": "Why Study In Malaysia?",
  "/view-our-partners": "View Our Partners",
  "/contact-us": "Contact Us",
  "/faqs": "FAQs",
  "/terms-and-conditions": "Terms & Conditions",
  "/privacy-policy": "Privacy Policy",
  "/blog": "Blog",
};

// Cache to avoid re-fetching on every page navigation
let seoCache = null;
let fetchPromise = null;

/**
 * useStaticPageSeo - Fetches SEO data from the static-page-seo API
 *
 * @param {string} pagePath - The page path (e.g. "resources/services/visa-guidance")
 * @returns {{ seo: Object, loading: boolean }}
 *
 * Usage:
 *   const { seo, loading } = useStaticPageSeo("resources/services/visa-guidance");
 *   <SeoHead data={{ name: seo?.meta_title, ... }} />
 */
export default function useStaticPageSeo(pagePath) {
  const [seo, setSeo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchSeo = async () => {
      try {
        if (!pagePath) {
          console.warn("[useStaticPageSeo] No page path provided");
          if (!cancelled) {
            setSeo({});
            setLoading(false);
          }
          return;
        }

        console.log(`[useStaticPageSeo] Fetching SEO for: ${pagePath}`);
        
        const response = await api.get(`/static-page-seo/${pagePath}`);
        console.log("[useStaticPageSeo] API Response:", response.data);

        const seoData = response.data?.data || response.data || {};
        
        if (!cancelled) {
          setSeo(seoData);
          setLoading(false);
        }
      } catch (error) {
        console.error("[useStaticPageSeo] Error fetching SEO:", error);
        if (!cancelled) {
          setSeo({});
          setLoading(false);
        }
      }
    };

    fetchSeo();

    return () => {
      cancelled = true;
    };
  }, [pagePath]);

  return { seo, loading };
}
