import { useState, useEffect, lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "./components/home section/Navbar";
import ScrollToTop from "./components/home section/ScrollToTop";
import Footer from "./components/home section/Footer";
import Hero from "./components/home section/Hero";
import StudyJurney from "./components/home section/studyjurney";

import UniversitySlider from "./components/home section/UniversitySlider";

import Malaysia from "./components/home section/malyisia";

import ProgrammeSelector from "./components/home section/ProgrammeSelector";
import Culture from "./components/home section/Culture";

import MalaysiaStudyInfo from "./components/home section/MalaysiaStudyInfo";
import PopularUniversities from "./components/home section/PopularUniversities";
import FieldStudy from "./components/home section/FieldStudy";
import CountryDashboard from "./components/home section/CountryDashboard ";

import TrendingCourses from "./components/TrendingCourses";
import UniversityRankingTable from "./components/home section/UniversityRankingTable";
import CounsellorSupport from "./components/home section/CounsellorSupport";

import Consultants from "./components/home section/Consultants";
import TestimonialSlider from "./components/home section/TestimonialSlider";
import WhatsAppButton from "./components/WhatsAppButton";
import ContactFormPopup from "./pages/OurPartners/ContactFormPopup";
import ScrollToTopButton from "./components/ScrollToTopButton";
import LoadingFallback from "./components/LoadingFallback";

// ✅ Code Splitting: Lazy load all page-level components
const Login = lazy(() => import("./pages/Regstation/StudentRegstation/Login"));
const SignUp = lazy(
  () => import("./pages/Regstation/StudentRegstation/SignUp"),
);
const Universities = lazy(
  () => import("./pages/universitysection/Universities"),
);
const Courses = lazy(() => import("./pages/Courses"));
const Specialization = lazy(() => import("./pages/Specialization"));
const SpecializationDetail = lazy(() => import("./pages/SpecializationDetail"));
const Scholarship = lazy(() => import("./pages/Scholarship"));
const ScholarshipDetail = lazy(() => import("./pages/ScholarshipDetail"));
const Exam = lazy(() => import("./pages/Exam"));
const ExamDetail = lazy(() => import("./pages/ExamDetail"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/Servicesdetail"));
const ServiceVisaGuidance = lazy(() => import("./pages/servicevisaguidence"));
const ServiceAdmission = lazy(() => import("./pages/Serviceaddmission"));
const ServicesDiscover = lazy(() => import("./pages/servicesdiscover"));
const Graduate = lazy(() => import("./pages/Grdadute"));
const Graduatedetail = lazy(() => import("./pages/Graduatedetail"));
const Home = lazy(() => import("./pages/Home"));
const TeamEducationMalaysia = lazy(
  () => import("./pages/TeamEducationMalaysia"),
);
const WhoWeAre = lazy(() => import("./pages/about-us/WhoWeAre"));
const WhatStudentSay = lazy(() => import("./pages/about-us/WhatStudentSay"));
const WhyStudyInM = lazy(() => import("./pages/about-us/WhyStudyInM"));
const Partners = lazy(() => import("./pages/OurPartners/Partners"));
const PartnerApplicationForm = lazy(
  () => import("./pages/OurPartners/PartnerApplicationForm"),
);
const UniversityDetail = lazy(
  () => import("./pages/universitysection/UniversityDetail"),
);
const QualifiedLevelDetail = lazy(
  () => import("./pages/QualifiedLevel/QualificationLevelDeatil"),
);
const UniversitiesList = lazy(
  () => import("./pages/universitysection/UniversitiesList"),
);
const Term = lazy(() => import("./pages/Faq-section/Term&Condition"));
const Contact = lazy(() => import("./pages/Faq-section/ContactUs"));
const PrivacyPolicy = lazy(() => import("./pages/Faq-section/PrivacyPolicy"));
const Faqs = lazy(() => import("./pages/Faq-section/Faqs"));
const Blob = lazy(() => import("./pages/Faq-section/Blob"));
const BlogDetail = lazy(() => import("./pages/Faq-section/BlogDetail"));
const WriteReviewPage = lazy(
  () => import("./pages/universitysection/WriteReviewPage"),
);
const SelectLevel = lazy(() => import("./pages/QualifiedLevel/SelectLevel"));
const LevelDetail = lazy(() => import("./pages/QualifiedLevel/LevelDetail"));
const RestPasword = lazy(
  () => import("./pages/Regstation/StudentRegstation/RestPasword"),
);
const Profile = lazy(() => import("./pages/Regstation/Profile"));
const Overview = lazy(() => import("./pages/Regstation/Overview"));
const ConfirmedEmail = lazy(
  () => import("./pages/Regstation/StudentRegstation/ConfirmedEmail"),
);
const AppliedColleges = lazy(() => import("./pages/Regstation/AppliedCollege"));
const ChangePassword = lazy(() => import("./pages/Regstation/ChangePassword"));
const BodiesPage = lazy(() => import("./pages/universitysection/BodiesPage"));
const Conversation = lazy(() => import("./pages/Regstation/Conversation"));
const EmailLogin = lazy(
  () => import("./pages/Regstation/StudentRegstation/EmailLogin"),
);
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if form already submitted - if so, never show popup
    const formSubmitted = localStorage.getItem("scholarshipFormSubmitted");
    if (formSubmitted) return;

    // Check how many times popup has been shown in this session
    const popupCount = parseInt(
      sessionStorage.getItem("popupShownCount") || "0",
    );
    const SESSION_LIMIT = 3;

    if (popupCount < SESSION_LIMIT) {
      const timer = setTimeout(() => {
        setIsPopupOpen(true);
        sessionStorage.setItem("popupShownCount", (popupCount + 1).toString());
      }, 5000); // 5 seconds delay

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <>
      <ToastContainer />
      <Navbar />
      <ScrollToTop />
      <ScrollToTopButton />
      <WhatsAppButton />

      {/* ✅ Suspense wrapper for code-split routes */}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/universities" element={<Universities />} />
          {/* ✅ Main Course Route - SINGULAR */}
          <Route path="/courses-in-malaysia" element={<Courses />} />
          <Route path="/courses-in-malaysia/:pageSlug" element={<Courses />} />

          {/* ✅ YE NAYA LINE ADD KARO - Extra 's' wale URL ko redirect karega */}
          <Route
            path="/courses-in-malaysias"
            element={<Navigate to="/courses-in-malaysia" replace />}
          />

          {/* ✅ Redirect /blogs to /blog */}
          <Route path="/blogs" element={<Navigate to="/blog" replace />} />

          {/* ✅ Redirect old study-malaysia route to home */}
          <Route path="/study-malaysia" element={<Navigate to="/" replace />} />

          {/* ✅ All Filter Routes - Dynamic Catch-All */}
          <Route path="/:filterSlug-courses" element={<Courses />} />
          <Route path="/:filterSlug-courses/:pageSlug" element={<Courses />} />

          {/* <Route path="/university/:slug/courses/:course_slug" element={<CourseDetail />} /> */}

          <Route
            path="/university/:slug/courses/:courseSlug"
            element={<UniversityDetail />}
          />
          <Route path="/specialization" element={<Specialization />} />

          {/* ✅ SEO FRIENDLY ROUTES - Level specific pages */}
          <Route
            path="/specialization/:nameWithLevel"
            element={<SpecializationDetail />}
          />

          {/* ✅ General specialization page without level */}
          <Route
            path="/specialization/:name"
            element={<SpecializationDetail />}
          />

          <Route path="/scholarships" element={<Scholarship />} />
          <Route path="/scholarships/:slug" element={<ScholarshipDetail />} />
          <Route path="/resources/exams" element={<Exam />} />
          <Route path="/resources/exams/:slug" element={<ExamDetail />} />
          <Route path="/resources/services" element={<Services />} />
          <Route path="/resources/services/:slug" element={<ServiceDetail />} />
          <Route
            path="/resources/services/visa-guidance"
            element={<ServiceVisaGuidance />}
          />
          <Route
            path="/resources/services/admission-guidance"
            element={<ServiceAdmission />}
          />
          <Route
            path="/resources/services/discover-malaysia"
            element={<ServicesDiscover />}
          />

          <Route
            path="/resources/Guidelines/graduate-pass"
            element={<Graduate />}
          />
          <Route
            path="/resources/Guidelines/MQA"
            element={<Graduatedetail />}
          />
          <Route
            path="/resources/Guidelines/team-education-malaysia"
            element={<TeamEducationMalaysia />}
          />

          <Route path="/who-we-are" element={<WhoWeAre />} />
          <Route path="/students-say" element={<WhatStudentSay />} />
          <Route path="/why-study" element={<WhyStudyInM />} />
          <Route path="/view-our-partners" element={<Partners />} />
          <Route
            path="/become-a-partner"
            element={<PartnerApplicationForm />}
          />
          <Route path="/courses/:slug" element={<QualifiedLevelDetail />} />

          <Route path="/university/:slug" element={<UniversityDetail />} />
          <Route
            path="/university/:slug/:section"
            element={<UniversityDetail />}
          />
          {/* <Route path="/university/:slug/courses" element={<UniversityDetail />} /> */}
          <Route
            path="/university/:slug/courses/:courseSlug"
            element={<UniversityDetail />}
          />

          <Route path="/universities/:type" element={<UniversitiesList />} />
          <Route
            path="/universities/:type/:pageSlug"
            element={<UniversitiesList />}
          />
          <Route path="/write-a-review" element={<WriteReviewPage />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/what-people-say" element={<WhatStudentSay />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/terms-and-conditions" element={<Term />} />
          <Route path="/blog" element={<Blob />} />
          <Route path="/blog/:category_slug" element={<Blob />} />
          <Route path="/blog/:category/:slugWithId" element={<BlogDetail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/select-level" element={<SelectLevel />} />
          <Route path="/courses" element={<SelectLevel />} />
          <Route path="/course/:slug" element={<LevelDetail />} />
          <Route path="/bodies/:slug" element={<BodiesPage />} />

          <Route path="/account/password/reset" element={<RestPasword />} />
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/student/overview" element={<Overview />} />
          <Route path="/confirmed-email" element={<ConfirmedEmail />} />
          <Route
            path="/student/applied-colleges"
            element={<AppliedColleges />}
          />
          <Route path="/student/Conversation" element={<Conversation />} />
          <Route path="/student/change-password" element={<ChangePassword />} />
          <Route path="/password/reset" element={<EmailLogin />} />

          {/* ✅ Catch-all route for 404 - MUST be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Footer />
      <ContactFormPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </>
  );
}

export default App;
