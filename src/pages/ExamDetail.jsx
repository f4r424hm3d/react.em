import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import TrandingCourse2 from "../components/TrandingCourse2";
import FeaturedUniversities from "../components/FeaturedUniversities";
import GetinTouchinExam from "../components/GetinTouchinExam";
import api from "../api"; // your axios instance
import { Home, Layers } from "lucide-react";
import SeoHead from "../components/SeoHead";
import DynamicBreadcrumb from "../components/DynamicBreadcrumb";

// Skeleton Loader Component
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-pulse">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg">
        {/* Title Skeleton */}
        <div className="h-10 bg-gray-200 rounded-md w-3/4 mb-6"></div>

        {/* Image Skeleton */}
        <div className="w-full h-96 bg-gray-200 rounded-lg shadow-md mb-8"></div>

        {/* Headline Skeleton */}
        <div className="h-6 bg-gray-200 rounded-md w-full mb-4"></div>
        <div className="h-6 bg-gray-200 rounded-md w-5/6 mb-8"></div>

        {/* Content Skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-11/12"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-10/12"></div>
        </div>

        {/* Button Skeleton */}
        <div className="h-12 bg-gray-200 rounded-lg w-48 mt-10"></div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="h-6 bg-gray-200 rounded-md w-1/2 mb-5"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded-lg"></div>
            <div className="h-8 bg-gray-200 rounded-lg"></div>
            <div className="h-8 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="h-6 bg-gray-200 rounded-md w-1/2 mb-5"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded-lg"></div>
            <div className="h-8 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

<<<<<<< HEAD

// // Function to format HTML content from the API
// const formatExamDescription = (html) => {
//     if (!html) return ''; // Handle cases where description might be null or empty

//     return html
//         // Paragraphs
//         .replace(/<p>/g, `<p class="mb-4 text-gray-700 leading-relaxed">`)

//         // Unordered Lists
//         .replace(/<ul>/g, `<ul class="list-disc pl-5 mb-4 space-y-2 text-gray-700">`)
//         .replace(/<li>/g, `<li class="ml-4">`)

//         // Ordered Lists
//         .replace(/<ol>/g, `<ol class="list-decimal pl-5 mb-4 space-y-2 text-gray-700">`)

//         // Strong/Bold text
//         .replace(/<strong>/g, `<strong class="font-semibold text-gray-900">`)

//         // Anchor tags (links)
//         .replace(/<a href="(.*?)"/g, `<a href="$1" class="text-blue-600 hover:text-blue-800 underline transition">`)

//         // Images within the description
//         .replace(/<img src="(.*?)"/g, (match, src) => {
//             const fullSrc = src.startsWith('http') ? src : `https://admin.educationmalaysia.in/storage/${src}`;
//             return `<img src="${fullSrc}" class="w-full h-auto max-w-lg mx-auto my-6 rounded-lg shadow-md"`;
//         })

//         // Headings (Updated to match image)
//         // Specific styling for H2 as per screenshot
//         .replace(/<h2>(.*?)<\/h2>/g, `<h2 class="text-3xl font-extrabold text-blue-900 border-l-4 border-blue-600 pl-4 mb-5 mt-8">${'$1'}</h2>`) // text-3xl, font-extrabold, deeper blue border, increased left padding
//         // General styling for H3 and H4
//         .replace(/<h3>(.*?)<\/h3>/g, `<h3 class="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4 mt-6">${'$1'}</h3>`)
//         .replace(/<h4>(.*?)<\/h4>/g, `<h4 class="text-xl font-semibold text-gray-700 mb-3 mt-5">${'$1'}</h4>`)

//         // Tables (Updated to match image)
//         .replace(/<table/g, `<table class="min-w-full rounded-xl overflow-hidden shadow-md my-6 border-collapse"`) // Added rounded-xl, overflow-hidden, shadow-md, border-collapse
//         .replace(/<thead>/g, `<thead class="bg-blue-600 text-white text-left">`) // Solid blue background
//         .replace(/<th>/g, `<th scope="col" class="px-6 py-4 font-semibold uppercase tracking-wider">`) // Increased padding, uppercase
//         .replace(/<tbody>/g, `<tbody class="bg-white">`) // Set body background
//         .replace(/<tr>/g, `<tr class="even:bg-blue-50">`) // Alternating row colors as in image
//         .replace(/<td>/g, `<td class="px-6 py-4 text-gray-800 text-base border-b border-gray-200">`); // Increased padding, base text size, subtle bottom border
// };

=======
>>>>>>> origin/prince
const formatExamDescription = (html) => {
  if (!html) return "";

  return (
    html
      // Remove empty paragraphs and excessive line breaks
      .replace(/<p>\s*<\/p>/g, "")
      .replace(/<p>&nbsp;<\/p>/g, "")
      .replace(/<br\s*\/?>\s*<br\s*\/?>/g, "<br/>")
      .replace(/(\s*<br\s*\/?>\s*)+/g, "<br/>")

      // Paragraphs - minimal margin
      .replace(/<p>/g, `<p class="mb-1 text-gray-700 leading-relaxed">`)

      // Unordered Lists - minimal margin
      .replace(
        /<ul>/g,
        `<ul class="list-disc pl-5 mb-1 space-y-1 text-gray-700">`,
      )
      .replace(/<li>/g, `<li class="ml-4">`)

      // Ordered Lists - minimal margin
      .replace(
        /<ol>/g,
        `<ol class="list-decimal pl-5 mb-1 space-y-1 text-gray-700">`,
      )

      // Strong/Bold text
      .replace(/<strong>/g, `<strong class="font-semibold text-gray-900">`)

      // Anchor tags (links)
      .replace(
        /<a href="(.*?)"/g,
        `<a href="$1" class="text-blue-600 hover:text-blue-800 underline transition">`,
      )

      // Images within the description - minimal margin
      .replace(/<img src="(.*?)"/g, (match, src) => {
        const fullSrc = src.startsWith("http")
          ? src
          : `https://admin.educationmalaysia.in/${src}`;
        return `<img src="${fullSrc}" class="w-full h-auto max-w-lg mx-auto my-2 rounded-lg shadow-md"`;
      })

      // Headings - minimal margins with responsive text sizes
      .replace(
        /<h2>(.*?)<\/h2>/g,
        `<h2 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-blue-900 border-l-4 border-blue-600 pl-3 sm:pl-4 mb-2 mt-4">${"$1"}</h2>`,
      )
      .replace(
        /<h3>(.*?)<\/h3>/g,
        `<h3 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-2 mt-3">${"$1"}</h3>`,
      )
      .replace(
        /<h4>(.*?)<\/h4>/g,
        `<h4 class="text-base sm:text-lg md:text-xl font-semibold text-gray-700 mb-1 mt-2">${"$1"}</h4>`,
      )

      // Tables - mobile responsive
      .replace(
        /<table/g,
        `<div class="overflow-x-auto -mx-4 sm:mx-0 my-2 rounded-lg"><table class="w-full text-xs sm:text-sm md:text-base border-collapse"`,
      )
      .replace(/<\/table>/g, `</table></div>`) // Close the wrapper div
      .replace(/<thead>/g, `<thead class="bg-blue-600 text-white text-left">`)
      .replace(
        /<th>/g,
        `<th scope="col" class="px-2 sm:px-4 md:px-6 py-2 sm:py-3 font-semibold text-xs sm:text-sm md:text-base">`,
      )
      .replace(/<tbody>/g, `<tbody class="bg-white divide-y divide-gray-200">`)
      .replace(
        /<tr>/g,
        `<tr class="even:bg-blue-50 hover:bg-blue-100 transition">`,
      )
      .replace(
        /<td>/g,
        `<td class="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-gray-800 text-xs sm:text-sm md:text-base border-b border-gray-200">`,
      )
  );
};
const Sidebar = () => (
  <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-20">
    <div className="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 border-b pb-3 sm:pb-4 mb-4 sm:mb-5">
        Important Exams
      </h2>
      {["PTE", "TOEFL", "MUET"].map((exam) => (
        <Link
          key={exam}
          to={`/resources/exams/${exam.toLowerCase()}`}
          className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition group border-b border-gray-100 last:border-b-0"
        >
          <span className="font-medium text-sm sm:text-base group-hover:translate-x-1 transition">
            {exam}
          </span>
          <FaArrowRight
            className="text-blue-500 group-hover:translate-x-1 transition"
            size={14}
          />
        </Link>
      ))}
    </div>
    <TrandingCourse2 />
    <FeaturedUniversities />
    <GetinTouchinExam />
  </div>
);

const ExamDetail = () => {
  const { slug } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [seo, setSeo] = useState({});

<<<<<<< HEAD
    const API_IMAGE_BASE_URL = "https://admin.educationmalaysia.in/storage/";
=======
  const API_IMAGE_BASE_URL = "https://admin.educationmalaysia.in/storage/";
>>>>>>> origin/prince

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await api.get(`/exam-details/${slug}`);
        if (res.data.status && res.data.data.exam) {
          setExam(res.data.data.exam);
        } else {
          setError(true);
        }
        setSeo(res.data.data.seo || {});
        // console.log("SEO Data:", res.data.data.seo);
      } catch (err) {
        console.error("Failed to fetch exam details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchExam();
  }, [slug]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !exam) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <p className="text-center text-2xl text-red-700 font-bold">
          Oops! Exam Not Found or An Error Occurred.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ✅ Dynamic SEO */}
      <SeoHead
        pageType="exam-detail"
        data={{
          name: exam.page_name,
          description: seo?.meta_description,
          keywords: seo?.meta_keyword,
          slug: slug,
          image: exam.imgpath ? `${API_IMAGE_BASE_URL}${exam.imgpath}` : null,
        }}
      />

      {/* ✅ Dynamic Breadcrumb */}
      <DynamicBreadcrumb
        pageType="exam-detail"
        data={{
          title: slug?.toUpperCase(),
          slug: slug,
        }}
      />

      <div className="min-h-screen bg-gray-50 py-4 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
          <div className="lg:col-span-2 bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight">
              {exam.page_name} - Exam Details
            </h1>

            {exam.imgpath && (
              <img
                src={`${API_IMAGE_BASE_URL}${exam.imgpath}`}
                alt={exam.page_name}
                className="w-full max-h-48 sm:max-h-64 md:max-h-96 object-cover rounded-lg shadow-md mb-4 sm:mb-6 md:mb-8"
              />
            )}

            <p className="text-gray-700 mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-relaxed">
              {exam.headline}
            </p>

            <div
              className="text-sm sm:text-base text-gray-800 prose-sm sm:prose"
              dangerouslySetInnerHTML={{
                __html: formatExamDescription(exam.description),
              }}
            />

            <Link
              to="/resources/exams"
              className="inline-flex items-center mt-6 sm:mt-8 md:mt-10 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
            >
              <FaArrowRight className="rotate-180 mr-2" size={14} /> Back to
              Exams
            </Link>
          </div>

          <Sidebar />
        </div>
      </div>
    </>
  );
};

export default ExamDetail;
