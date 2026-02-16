import React from "react";
import {
  GraduationCap,
  MapPin,
  Building2,
  RefreshCw,
  Activity,
  Shield,
  Camera,
  Plane,
  DollarSign,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Heart,
  Globe,
} from "lucide-react";
import SeoHead from "../components/SeoHead";
import DynamicBreadcrumb from "../components/DynamicBreadcrumb";
import useStaticPageSeo from "../hooks/useStaticPageSeo";

//===== COMPONENT 1: Hero =====

function Hero() {
  return (
    <div className="relative bg-gradient-to-br bg-blue-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-xl">
              <GraduationCap className="w-16 h-16" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Malaysia Student Visa Guidelines
          </h1>

          <div className="flex items-center justify-center space-x-2 mb-6">
            <MapPin className="w-5 h-5" />
            <p className="text-xl sm:text-2xl text-blue-100">2025 Edition</p>
          </div>

          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Complete guidance on eligibility, required documents, and
            application rules from Education Malaysia Global Services (EMGS)
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="w-full h-8 sm:h-12 fill-white">
          <path d="M0,30 Q360,0 720,30 T1440,30 L1440,60 L0,60 Z"></path>
        </svg>
      </div>
    </div>
  );
}

//===== COMPONENT 2: DocumentCard (Helper) =====

function DocumentCard({ icon, title, details, color }) {
  return (
    <div className="group relative bg-gradient-to-br from-white via-white to-blue-50/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-blue-200/50 hover:border-blue-300 transform hover:-translate-y-1">
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/15 to-purple-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

      <div
        className={`relative z-10 bg-gradient-to-br ${color} p-4 overflow-hidden`}
      >
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9IndoaXRlIi8+PC9nPjwvc3ZnPg==')]"></div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="text-white drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500">
            {icon}
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-white/50 rounded-full animate-pulse delay-100"></div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-4">
        <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors duration-300">
          {title}
        </h3>

        <p className="text-slate-600 leading-relaxed text-base">{details}</p>
      </div>
    </div>
  );
}

//===== COMPONENT 3: DocumentsSection =====

function DocumentsSection() {
  const documents = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Passport",
      details:
        "Must be valid for at least 18 months, include bio-data page, all visa pages, and observation page (if any).",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Photograph",
      details:
        "Recent color photo, 35mm × 45mm, with a white background (check using EMGS Photo Checker).",
      color: "from-blue-400 to-blue-500",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Offer Letter",
      details:
        "Official Letter of Acceptance from a Malaysian university or college recognized by EMGS.",
      color: "from-blue-600 to-blue-700",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Academic Certificates",
      details:
        "Certified copies of all previous academic records and transcripts.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Health Declaration Form",
      details:
        "Must be filled, signed, and uploaded with your visa application.",
      color: "from-blue-400 to-blue-500",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "English Proficiency",
      details: "Valid test score (IELTS, TOEFL, PTE, MUET, OET, or Cambridge).",
      color: "from-blue-600 to-blue-700",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Yellow Fever Certificate",
      details: "Required if you are from a yellow-fever-risk country.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Special Documents",
      details:
        "NOC (Sudan), LOE (Iran), or others as notified by Immigration Malaysia (if applicable).",
      color: "from-blue-400 to-blue-500",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Personal Bond",
      details:
        "Paid by your institution to Immigration Malaysia; refundable after course completion.",
      color: "from-blue-600 to-blue-700",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center ">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
          Required Documents
        </h2>
        <p className="text-slate-600 text-lg">
          Ensure all documents are prepared and valid before applying
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc, index) => (
          <DocumentCard key={index} {...doc} />
        ))}
      </div>
    </div>
  );
}

//===== COMPONENT 4: ChecklistSection =====

function ChecklistSection() {
  const checklist = [
    "Offer Letter from a Malaysian university/college",
    "Valid passport (18+ months)",
    "Academic transcripts & English test results",
    "Health declaration form",
    "Passport photo (white background)",
    "Insurance coverage & personal bond",
    "VAL approval from EMGS",
    "SEV (if required)",
    "Medical screening in Malaysia (within 7 days)",
    "Student Pass endorsement on passport",
  ];

  return (
    <div className="space-y-12 px-4 sm:px-0">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
          Summary Checklist
        </h2>
        <p className="text-slate-500 text-sm sm:text-base">
          Everything you need before applying
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Main Checklist Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden hover:shadow-3xl transition-all duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-7 h-7" />
              <h3 className="text-2xl sm:text-3xl font-bold">
                Application Checklist
              </h3>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-3">
            {checklist.map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 sm:p-4 rounded-xl bg-white/90 hover:bg-blue-50 shadow-sm transition-all duration-300"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-snug flex-1">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              title: "Processing Time",
              icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
              description:
                "Applications typically take 3–6 weeks to process, depending on your nationality and documentation completeness.",
              gradient: "from-blue-500 to-indigo-500",
            },
            {
              title: "Stay Compliant",
              icon: (
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ),
              description:
                "Maintain good academic performance and at least 80% attendance to ensure successful visa renewal.",
              gradient: "from-pink-500 to-purple-500",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className={`p-3 rounded-xl shadow-md bg-gradient-to-br ${card.gradient} flex items-center justify-center`}
                >
                  {card.icon}
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900">
                  {card.title}
                </h4>
              </div>
              <p className="text-slate-700 text-sm sm:text-base leading-snug">
                {card.description}
              </p>
              <div className="mt-4 flex items-center text-blue-600 font-medium text-sm cursor-pointer hover:underline"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

//===== COMPONENT 5: InfoCard (Helper) =====

function InfoCard({ icon, title, color, items }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 hover:border-blue-300 transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${color} px-5 py-3 text-white`}>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-xl">{icon}</div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                className="w-3.5 h-3.5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

//===== COMPONENT 6: AdditionalInfo =====

function AdditionalInfo() {
  const sections = [
    {
      icon: <Building2 className="w-7 h-7" />,
      title: "Additional Documents for Sarawak",
      color: "from-blue-400 to-blue-500",
      items: [
        "Authorization Letter from the institution",
        "Cover Letter addressed to the Sarawak Immigration Department",
        "Pre-VAL Medical Report if completed outside EMGS-approved clinics",
      ],
    },
    {
      icon: <RefreshCw className="w-7 h-7" />,
      title: "Renewal of Student Pass",
      color: "from-blue-600 to-blue-700",
      items: [
        "Updated passport photo and valid passport",
        "Latest academic transcript and attendance record (minimum 80%)",
        "Medical screening (if required)",
        "Insurance renewal certificate",
        "Apply for renewal at least 6–8 weeks before expiry to avoid penalties",
      ],
    },
    {
      icon: <Activity className="w-7 h-7" />,
      title: "Medical Screening Guidelines",
      color: "from-blue-500 to-blue-600",
      items: [
        "Must be completed within 7 days of arrival in Malaysia",
        "Screening should be done only at EMGS-approved clinics",
        "Medical results are uploaded directly to EMGS for clearance",
        "Failure to comply may result in visa cancellation or rejection",
      ],
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Health Insurance",
      color: "from-blue-400 to-blue-500",
      items: [
        "Every international student must hold valid EMGS-approved health insurance",
        "Choose between New Scheme (comprehensive) or Old Scheme (limited)",
        "Insurance must cover hospitalization, surgical costs, and emergency treatments",
        "Insurance validity must match the duration of your Student Pass",
      ],
    },
    {
      icon: <Camera className="w-7 h-7" />,
      title: "Photo & Passport Format",
      color: "from-blue-600 to-blue-700",
      items: [
        "Neutral facial expression, no shadows, plain white background",
        "No headgear unless for religious reasons",
        "Passport must be clear, uncut, and unobstructed in scans",
        "Use the EMGS Photo Checker before uploading",
      ],
    },
    {
      icon: <Plane className="w-7 h-7" />,
      title: "Single Entry Visa (SEV)",
      color: "from-blue-500 to-blue-600",
      items: [
        "Check if your nationality requires a Single Entry Visa (SEV)",
        "Apply at the nearest Malaysian Embassy or Consulate in your country",
        "Bring along your Visa Approval Letter (VAL) when applying",
        "Nationals from SEV-exempt countries can enter with the VAL only",
        "Find the updated SEV-required country list on the EMGS website",
      ],
    },
    {
      icon: <DollarSign className="w-7 h-7" />,
      title: "Personal Bond",
      color: "from-blue-400 to-blue-500",
      items: [
        "Refundable security deposit paid to Immigration Malaysia by your university/college",
        "Amount varies depending on nationality (ranging roughly from RM 200 to RM 2,000)",
        "Refundable after you complete or withdraw from your course (subject to compliance with laws)",
      ],
    },
    {
      icon: <BookOpen className="w-7 h-7" />,
      title: "English Proficiency Rules",
      color: "from-blue-600 to-blue-700",
      items: [
        "Upload your English certificate during the VAL application",
        "Missing or invalid certificates can cause processing delays or shorter visa validity",
        "Accepted tests: IELTS, TOEFL, PTE, MUET, OET, Cambridge, ELS CIEP",
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
          Additional Information
        </h2>
        <p className="text-slate-600 text-lg">
          Important guidelines for your visa application process
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <InfoCard key={index} {...section} />
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mt-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">
              Important Notes
            </h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <span>
                  Applications must be submitted through the institution via
                  EMGS
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <span>
                  Processing time may vary (3–6 weeks) depending on nationality
                  and documentation
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <span>
                  Students must maintain good academic performance and
                  attendance to renew
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

//===== MAIN PAGE: Merged Component =====
// Yeh file ka main component hai jo sabko render karta hai

export default function MalaysiaVisaPage() {
  const { seo: apiSeo, loading } = useStaticPageSeo(
    "resources/services/visa-guidance",
  );

  console.log("🔍 [Visa Page] apiSeo:", apiSeo);
  console.log("🔍 [Visa Page] loading:", loading);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
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
          title: "Visa Guidelines",
          slug: "visa-guidance",
        }}
      />

      <Hero />

      {/* Hero ke neeche ka content area */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
          <DocumentsSection />
          <ChecklistSection />
          <AdditionalInfo />
        </div>
      </div>
    </div>
  );
}
