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
import Login from "./pages/Regstation/StudentRegstation/Login";
import SignUp from "./pages/Regstation/StudentRegstation/SignUp";

import Universities from "./pages/universitysection/Universities";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/universitysection/CourseDetail";

import Specialization from "./pages/Specialization";
import SpecializationDetail from "./pages/SpecializationDetail";
import Scholarship from "./pages/Scholarship";
import ScholarshipDetail from "./pages/ScholarshipDetail";
import Exam from "./pages/Exam";
import ExamDetail from "./pages/ExamDetail";
import Services from "./pages/Services";
import ServiceDetail from "./pages/Servicesdetail";
import ServiceVisaGuidance from "./pages/servicevisaguidence";
import ServiceAdmission from "./pages/Serviceaddmission";
import ServicesDiscover from "./pages/servicesdiscover";

import Graduate from "./pages/Grdadute";
import Graduatedetail from "./pages/Graduatedetail";
import Home from "./pages/Home";
import TeamEducationMalaysia from "./pages/TeamEducationMalaysia";

//about us pages
import WhoWeAre from "./pages/about-us/WhoWeAre";
import WhatStudentSay from "./pages/about-us/WhatStudentSay";
import WhyStudyInM from "./pages/about-us/WhyStudyInM";
import Partners from "./pages/OurPartners/Partners";
// university pages
import UniversityDetail from "./pages/universitysection/UniversityDetail";
import ScrollToTopButton from "./components/ScrollToTopButton";
import QualifiedLevelDetail from "./pages/QualifiedLevel/QualificationLevelDeatil";
import UniversitiesList from "./pages/universitysection/UniversitiesList";

//Help & Support pages
import Term from "./pages/Faq-section/Term&Condition";
import Contact from "./pages/Faq-section/ContactUs";
import PrivacyPolicy from "./pages/Faq-section/PrivacyPolicy";
import Faqs from "./pages/Faq-section/Faqs";
import WhatPepoleSay from "./pages/about-us/WhatStudentSay";
import Blob from "./pages/Faq-section/Blob";
import BlogDetail from "./pages/Faq-section/BlogDetail";
import WriteReviewPage from "./pages/universitysection/WriteReviewPage";
import ExpandableCard from "./components/ExpandableCard";

import SelectLevel from "./pages/QualifiedLevel/SelectLevel";
import LevelDetail from "./pages/QualifiedLevel/LevelDetail";
import RestPasword from "./pages/Regstation/StudentRegstation/RestPasword";
import Profile from "./pages/Regstation/Profile";
import Overview from "./pages/Regstation/Overview";
import ConfirmedEmail from "./pages/Regstation/StudentRegstation/ConfirmedEmail";
import AppliedColleges from "./pages/Regstation/AppliedCollege";

import ChangePassword from "./pages/Regstation/ChangePassword";
import BodiesPage from "./pages/universitysection/BodiesPage";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import ModelSignUpform from "./pages/Regstation/ModelSignUpForm";
import Conversation from "./pages/Regstation/Conversation";
import EmailLogin from "./pages/Regstation/StudentRegstation/EmailLogin";
import NotFound from "./pages/NotFound";

function App() {
  const location = useLocation();

  return (
    <>
      <ToastContainer />
      <Navbar />
      <ScrollToTop />
      <ScrollToTopButton />
      <WhatsAppButton />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/universities" element={<Universities />} />
        {/* ✅ Main Course Route - SINGULAR */}
        <Route path="/courses-in-malaysia" element={<Courses />} />

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
        <Route path="/resources/Guidelines/MQA" element={<Graduatedetail />} />
        <Route
          path="/resources/Guidelines/team-education-malaysia"
          element={<TeamEducationMalaysia />}
        />

        <Route path="/who-we-are" element={<WhoWeAre />} />
        <Route path="/students-say" element={<WhatStudentSay />} />
        <Route path="/why-study" element={<WhyStudyInM />} />
        <Route path="/view-our-partners" element={<Partners />} />
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
        <Route path="/write-a-review" element={<WriteReviewPage />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/what-people-say" element={<WhatPepoleSay />} />
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
        <Route path="/student/applied-colleges" element={<AppliedColleges />} />
        <Route path="/student/Conversation" element={<Conversation />} />
        <Route path="/student/change-password" element={<ChangePassword />} />
        <Route path="/password/reset" element={<EmailLogin />} />

        {/* ✅ Catch-all route for 404 - MUST be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
