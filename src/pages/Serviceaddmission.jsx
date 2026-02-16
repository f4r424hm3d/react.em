import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ListChecks,
  Clock,
  Check,
  FileText,
  Plane,
  ClipboardCheck,
  Shield,
  UserCheck,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import SeoHead from "../components/SeoHead";
import DynamicBreadcrumb from "../components/DynamicBreadcrumb";
import useStaticPageSeo from "../hooks/useStaticPageSeo";

/* ================= CHECKLIST SECTION ================= */
function ChecklistSection({ items }) {
  const [checkedItems, setCheckedItems] = useState(new Set());

  const toggleItem = (index) => {
    const newChecked = new Set(checkedItems);
    newChecked.has(index) ? newChecked.delete(index) : newChecked.add(index);
    setCheckedItems(newChecked);
  };

  const progress = Math.round((checkedItems.size / items.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-3 rounded-xl shadow-lg">
            <ListChecks className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Summary Checklist
            </h2>
            <p className="text-slate-500 text-sm">
              Track your progress interactively
            </p>
          </div>
        </div>

        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.2 }}
          className="text-right"
        >
          <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            {progress}%
          </div>
          <p className="text-xs text-slate-500">Completed</p>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-3 mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Items */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => {
          const isChecked = checkedItems.has(index);
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggleItem(index)}
              className={`flex gap-3 p-4 rounded-xl border transition-all duration-200 text-left ${
                isChecked
                  ? "bg-green-50 border-green-300 shadow-md"
                  : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              <motion.div
                animate={{ rotate: isChecked ? 360 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <CheckCircle2
                  className={`w-5 h-5 mt-0.5 ${
                    isChecked ? "text-green-600" : "text-slate-300"
                  }`}
                />
              </motion.div>
              <span
                className={`text-sm ${
                  isChecked ? "text-slate-800 font-medium" : "text-slate-600"
                }`}
              >
                {item}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ================= PROCESS STEP (PREMIUM TIMELINE) ================= */
function ProcessStep({
  number,
  title,
  description,
  icon: Icon,
  duration,
  isLast,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative flex gap-8"
    >
      {!isLast && (
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "100%" }}
          transition={{ duration: 0.8 }}
          className="absolute left-[22px] top-14 w-[2px] bg-gradient-to-b from-indigo-400 to-transparent"
        />
      )}

      {/* Step Icon */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white flex items-center justify-center font-bold shadow-lg"
      >
        {number}
      </motion.div>

      {/* Card */}
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="flex-1 bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl p-6"
      >
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Icon className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          </div>

          <div className="bg-slate-100 px-3 py-1 rounded-lg flex items-center gap-1 text-xs font-semibold text-slate-700">
            <Clock className="w-3.5 h-3.5" />
            {duration}
          </div>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
      </motion.div>
    </motion.div>
  );
}

/* ================= MAIN APP ================= */
export default function App() {
  const { seo: apiSeo } = useStaticPageSeo(
    "resources/services/admission-guidance",
  );

  const steps = [
    {
      number: 1,
      title: "Obtain Offer from Malaysian Institution",
      description:
        "Apply to a recognised Malaysian institution registered with EMGS. Once accepted, you will receive an Offer Letter detailing your programme, duration, and tuition.",
      icon: FileText,
      duration: "2-4 weeks",
    },
    {
      number: 2,
      title: "Prepare Required Documents",
      description:
        "Collect all necessary documents including passport, photographs, academic certificates, English proficiency certificates, health forms, and proof of financial capacity.",
      icon: ClipboardCheck,
      duration: "1-2 weeks",
    },
    {
      number: 3,
      title: "Institution Submits EMGS Application",
      description:
        "Your institution submits the student pass application on your behalf through the EMGS online portal. Track your application status online.",
      icon: Shield,
      duration: "2-4 weeks",
    },
    {
      number: 4,
      title: "Receive Visa Approval Letter (VAL)",
      description:
        "Once approved, EMGS issues a VAL necessary for travel and entry. Keep both printed and digital copies safe.",
      icon: Check,
      duration: "1-2 days",
    },
    {
      number: 5,
      title: "Apply for Entry Visa (if required)",
      description:
        "Depending on your nationality, obtain a Single-Entry Visa (SEV) from a Malaysian embassy or consulate before arrival.",
      icon: UserCheck,
      duration: "1-2 weeks",
    },
    {
      number: 6,
      title: "Travel to Malaysia & Medical Screening",
      description:
        "Travel with your passport, VAL, and SEV. Undergo medical screening at an EMGS-approved clinic within the first few days.",
      icon: Plane,
      duration: "3-5 days",
    },
    {
      number: 7,
      title: "Student Pass Endorsement",
      description:
        "After medical clearance, the Immigration Department endorses your Student Pass sticker in your passport, valid for one year.",
      icon: Calendar,
      duration: "1-2 weeks",
    },
  ];

  const checklistItems = [
    "Receive Offer Letter from recognised institution",
    "Prepare passport (18+ months validity)",
    "Passport-size photograph (white background)",
    "Academic certificates and transcripts",
    "English proficiency certificate (IELTS/TOEFL/PTE)",
    "Health Declaration Form",
    "Proof of financial capacity",
    "Institution submits via EMGS portal",
    "Pay processing fees",
    "Receive VAL",
    "Obtain Entry Visa/SEV (if required)",
    "Travel to Malaysia",
    "Complete medical screening",
    "Get Student Pass sticker endorsed",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#f0f9ff]">
      {/* ✅ Dynamic SEO */}
      <SeoHead
        pageType="service-detail"
        data={{
          name: apiSeo?.meta_title,
          description: apiSeo?.meta_description,
          keywords: apiSeo?.meta_keyword,
          image: apiSeo?.og_image_path,
        }}
        overrides={{
          title: apiSeo?.meta_title,
          description: apiSeo?.meta_description,
        }}
      />

      {/* ✅ Dynamic Breadcrumb */}
      <DynamicBreadcrumb
        pageType="service-detail"
        data={{
          title: "Visa Guidance",
          slug: "visa-guidance",
        }}
      />

      {/* Header */}
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-lg top-0 z-50"
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex items-center gap-3 md:gap-4">
          {/* Icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 p-2.5 md:p-3 rounded-lg shadow-lg flex items-center justify-center"
          >
            <FileText className="w-5 md:w-6 h-5 md:h-6 text-white" />
          </motion.div>

          {/* Title & Subtitle */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Malaysian Student Visa Process
            </h1>
            <p className="text-slate-600 mt-1 text-xs md:text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Complete guide to obtaining your student pass
            </p>
          </div>
        </div>
      </motion.header>

      <main className="max-w-5xl mx-auto px-8 py-14 space-y-14">
        {/* Notice */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 flex items-start gap-4 shadow-lg hover:shadow-2xl transition-shadow duration-300"
        >
          {/* Small Gradient Icon */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-md flex-shrink-0 flex items-center justify-center"
          >
            <AlertTriangle className="w-5 h-5 text-white" />
          </motion.div>

          {/* Text Section */}
          <div className="flex-1 flex flex-col gap-1">
            <h3 className="font-semibold text-lg text-indigo-900">
              Important Information
            </h3>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed">
              Processing times are approximate. Maintain{" "}
              <span className="font-medium">80% attendance</span> and
              satisfactory academic progress for annual renewals.
            </p>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed">
              Your Student Pass is valid for{" "}
              <span className="font-medium">one year</span> and must be renewed
              until programme completion.
            </p>
          </div>
        </motion.div>

        {/* Steps Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                STEP-BY-STEP
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl font-black mt-6 bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent"
            >
              Process Flow
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "200px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mx-auto mt-4"
            />
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <ProcessStep
                key={step.number}
                {...step}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </motion.div>

        {/* Checklist */}
        <ChecklistSection items={checklistItems} />

        {/* Renewal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          whileHover={{ y: -4, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
          className="bg-gradient-to-br from-white via-purple-50 to-indigo-50 border border-purple-100 rounded-2xl shadow-md p-4 flex flex-col md:flex-row gap-4 md:gap-6 transition-all duration-300"
        >
          {/* Small Icon */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 shadow-sm flex items-center justify-center"
          >
            <Calendar className="w-6 h-6 text-white" />
          </motion.div>

          {/* Content */}
          <div className="flex-1 flex flex-col gap-2">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-800 to-indigo-800 bg-clip-text text-transparent">
              Renewal & Variation
            </h3>
            <p className="text-slate-700 text-xs md:text-sm leading-snug">
              Prior to expiry, your institution will submit a renewal
              application to EMGS. For programme changes, level variations, or
              stay extensions, updated documents must be submitted as per EMGS
              guidelines.
            </p>

            {/* Note box */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-200 shadow-sm"
            >
              <p className="text-slate-700 text-xs flex items-start gap-2">
                <span className="text-lg">💡</span>
                <span className="font-medium">
                  <span className="font-semibold text-amber-900">
                    Important Note:
                  </span>{" "}
                  Start the renewal process 2–3 months before your current pass
                  expires.
                </span>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white/90 backdrop-blur-sm border-t border-gray-200 py-4"
      >
        <div className="flex items-center justify-center gap-3">
          {/* Animated Icon */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center"
          >
            <FileText className="w-4 h-4 text-white" />
          </motion.div>

          {/* Footer Text */}
          <p className="text-slate-600 text-xs md:text-sm text-center">
            This guide provides general info about the{" "}
            <span className="font-semibold">Malaysian student visa</span>.
            Always verify requirements with your institution and EMGS.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
