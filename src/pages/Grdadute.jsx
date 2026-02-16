import {
  GraduationCap,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Globe,
  Calendar,
  Shield,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import SeoHead from "../components/SeoHead";
import DynamicBreadcrumb from "../components/DynamicBreadcrumb";
import useStaticPageSeo from "../hooks/useStaticPageSeo";

function App() {
  const { seo: apiSeo } = useStaticPageSeo(
    "resources/Guidelines/graduate-pass",
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  //   const scrollToSection = (id: string) => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div>
      {/* ✅ Dynamic SEO */}
      <SeoHead
        pageType="service-detail"
        data={{
          name: apiSeo?.meta_title,
          description: apiSeo?.meta_description,
          keywords: apiSeo?.meta_keyword,
          image: apiSeo?.og_image_path,
        }}
      />

      {/* ✅ Dynamic Breadcrumb */}
      <DynamicBreadcrumb
        pageType="service-detail"
        data={{
          title: "Graduate Pass",
          slug: "graduate-pass",
        }}
      />

      <main>
        <section className="relative bg-gradient-to-br bg-blue-800 text-white py-12 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Globe className="w-4 h-4" />
                Live & Work in Malaysia
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Graduate Pass — Your Gateway to{" "}
                <span className="text-blue-100">12 Months</span> in Malaysia
              </h1>
              <p className="text-lg sm:text-xl text-white mb-6 leading-relaxed">
                Stay, work, and explore opportunities in Malaysia for up to one
                year after graduation — no employer sponsorship required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => scrollToSection("apply")}
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg font-medium flex items-center justify-center gap-2"
                >
                  Start Your Application
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollToSection("eligibility")}
                  className="bg-transparent text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all border-2 border-white font-medium"
                >
                  Check Eligibility
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
                What is the Graduate Pass?
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                The Graduate Pass is a Social Visit Pass issued by the
                Department of Immigration Malaysia, allowing eligible
                international graduates to remain in Malaysia for an additional
                12 months after completing their degree.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
                <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  For Recent Graduates
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Designed for international students who have completed a
                  Bachelor's degree or higher from a recognized Malaysian
                  institution and want to extend their stay to explore career
                  opportunities.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
                <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  Facilitated by EMGS
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Applications are processed through Education Malaysia Global
                  Services (EMGS) in coordination with the Department of
                  Immigration Malaysia, ensuring a streamlined approval process.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
                The Benefits of the Graduate Pass
              </h2>
              <p className="text-lg text-slate-600">
                Everything you gain with the Graduate Pass
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                  <Globe className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Multiple Entry Visa (MEV)
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Provides ease of entry and exit into the country during your
                  pass validity.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Dependent Graduate Pass
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Dependents of the student are also eligible with the same
                  duration as the student.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Part-Time Work Allowed
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Can work part-time in permitted job sectors without employer
                  sponsorship.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  12-Month Validity
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Full year to explore job opportunities, internships, and
                  career paths in Malaysia.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="eligibility" className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
                Eligibility Requirements
              </h2>
              <p className="text-lg text-slate-600">
                You must meet all of the following criteria
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-100">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">
                      Bachelor's Degree or Higher
                    </h3>
                    <p className="text-slate-600">
                      Completed from a recognized Malaysian institution
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-100">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">
                      Valid Student Pass
                    </h3>
                    <p className="text-slate-600">
                      Must be active at the time of application
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-100">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">
                      Passport Validity
                    </h3>
                    <p className="text-slate-600">
                      Must be valid for at least 18 months from application date
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-100">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">
                      Graduation Confirmation
                    </h3>
                    <p className="text-slate-600">
                      Letter from institution confirming completion or expected
                      graduation date
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-100">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">
                      Health Insurance
                    </h3>
                    <p className="text-slate-600">
                      Active coverage for the full Graduate Pass duration (1
                      year)
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-100">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">
                      Malaysian Sponsor
                    </h3>
                    <p className="text-slate-600">
                      Personal bond and Malaysian citizen sponsor with minimum
                      monthly salary of RM 1,500
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-100">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">
                      Clean Legal Record
                    </h3>
                    <p className="text-slate-600">
                      No legal convictions in Malaysia
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                <div className="flex gap-3">
                  <Shield className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">
                      Special Note for India & China
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      Eligibility extended until{" "}
                      <strong>31 December 2024</strong> with case-by-case
                      approvals. Applicants must submit a{" "}
                      <strong>letter of good conduct</strong> from their
                      institution or embassy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-6-">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Eligible Nationalities
              </h2>
              <p className="mt-4 text-blue-100 text-lg">
                The Graduate Pass is available for applicants from a wide range
                of countries worldwide.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[
                  "Australia",
                  "New Zealand",
                  "Brunei",
                  "Cambodia",
                  "Myanmar",
                  "Philippines",
                  "Laos",
                  "Vietnam",
                  "Thailand",
                  "Indonesia",
                  "Singapore",
                  "South Korea",
                  "Japan",
                  "Germany",
                  "United Kingdom",
                  "France",
                  "Canada",
                  "Switzerland",
                  "Netherlands",
                  "Sweden",
                  "Norway",
                  "Denmark",
                  "Finland",
                  "United States",
                  "Saudi Arabia",
                  "Kuwait",
                  "UAE",
                  "Qatar",
                  "Oman",
                  "Bahrain",
                  "India*",
                  "China*",
                ].map((country) => (
                  <div
                    key={country}
                    className="bg-white/20 hover:bg-white/30 transition rounded-lg px-4 py-2 text-center text-sm font-medium"
                  >
                    {country}
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-blue-200">
                  *Additional conditions may apply for selected countries
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="documents" className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
                Required Documents
              </h2>
              <p className="text-lg text-slate-600">
                Prepare the following for your application
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                          Document
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900 font-medium">
                          Passport biodata page
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          Valid for at least 18 months from application date
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900 font-medium">
                          Valid Student Pass
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          Must be active during application
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900 font-medium">
                          Confirmation of graduation
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          Letter from institution confirming completion or
                          expected date
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900 font-medium">
                          Insurance cover note
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          Valid for one year (must match Graduate Pass duration)
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900 font-medium">
                          Personal bond
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          EMGS template, stamped by LHDN/IRBM
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900 font-medium">
                          Sponsor declaration letter
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          From Malaysian citizen (RM 1,500+ monthly income)
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900 font-medium">
                          Sponsor payslips
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          Latest 3 months as income evidence
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900 font-medium">
                          Sponsor NRIC
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          Front & back, clear scanned copies
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900 font-medium">
                          Photo
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          217 × 280 px (follow EMGS guidelines)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <div className="flex gap-3">
                  <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">
                      For Dependents
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      Family members holding a valid Dependent Pass can apply
                      for the Dependent Graduate Pass. Required documents mirror
                      those above (dependent passport, valid dependent pass,
                      insurance, personal bond, sponsor details).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
                Application Process
              </h2>
              <p className="text-lg text-slate-600">
                Simple steps to get your Graduate Pass
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200 hidden sm:block"></div>

                <div className="space-y-6">
                  <div className="relative flex gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg relative z-10">
                      1
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        Confirm Eligibility
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        Verify degree completion, Student Pass status, and
                        passport validity
                      </p>
                    </div>
                  </div>

                  <div className="relative flex gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg relative z-10">
                      2
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        Gather Documents
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        Prepare graduation letter, insurance, sponsor & bond
                        documents, and photos
                      </p>
                    </div>
                  </div>

                  <div className="relative flex gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg relative z-10">
                      3
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        Apply via EMGS
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        Submit application and supporting documents through the
                        EMGS portal
                      </p>
                    </div>
                  </div>

                  <div className="relative flex gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg relative z-10">
                      4
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        Receive Decision
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        EMGS/Immigration will review and issue approval if
                        eligible
                      </p>
                    </div>
                  </div>

                  <div className="relative flex gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg relative z-10">
                      5
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        Entry & Compliance
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        Keep printed and digital copies of your Visa Approval
                        Letter and comply with all pass conditions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-slate-600">
                Common questions about the Graduate Pass
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              <details className="bg-white p-4 rounded-xl shadow-sm group">
                <summary className="font-bold text-slate-800 cursor-pointer list-none flex items-center justify-between">
                  <span>Who can sponsor my Graduate Pass?</span>
                  <ArrowRight className="w-5 h-5 text-blue-600 transform group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  A Malaysian citizen with a minimum monthly income of RM 1,500
                  can act as your sponsor. Sponsor documents must include a
                  signed & officially stamped declaration (by a Sessions Court
                  Judge, Magistrate, Commissioner for Oaths, or Notary Public),
                  3 months' payslips, and NRIC copy.
                </p>
              </details>

              <details className="bg-white p-4 rounded-xl shadow-sm group">
                <summary className="font-bold text-slate-800 cursor-pointer list-none flex items-center justify-between">
                  <span>Can my dependents join me?</span>
                  <ArrowRight className="w-5 h-5 text-blue-600 transform group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  Yes — family members who currently hold a valid Dependent Pass
                  can apply to extend their stay under the Dependent Graduate
                  Pass for the same duration. Prepare dependent-specific
                  documents (passport, dependent pass, insurance, personal bond,
                  sponsor details).
                </p>
              </details>

              <details className="bg-white p-4 rounded-xl shadow-sm group">
                <summary className="font-bold text-slate-800 cursor-pointer list-none flex items-center justify-between">
                  <span>How long is the Graduate Pass valid?</span>
                  <ArrowRight className="w-5 h-5 text-blue-600 transform group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  Typically 12 months after graduation. The pass may include a
                  Multiple Entry Visa — confirm details on your approval letter.
                </p>
              </details>

              <details className="bg-white p-4 rounded-xl shadow-sm group">
                <summary className="font-bold text-slate-800 cursor-pointer list-none flex items-center justify-between">
                  <span>What special rule applies to India & China?</span>
                  <ArrowRight className="w-5 h-5 text-blue-600 transform group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  Eligibility for Indian and Chinese nationals is extended until
                  31 December 2024, with approvals considered case-by-case.
                  Applicants must include a letter of good conduct from their
                  institution or embassy.
                </p>
              </details>
            </div>
          </div>
        </section>

        <section
          id="apply"
          className="py-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Ready to Apply?
              </h2>
              <p className="text-xl text-emerald-50 mb-10 leading-relaxed">
                Your institution can submit the Graduate Pass application via
                the EMGS portal. For questions or help preparing documents,
                contact your university's international office.
              </p>

              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl mb-8">
                <h3 className="text-2xl font-bold mb-6">Quick Checklist</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                    <span className="text-emerald-50">
                      Completed Bachelor's degree or higher
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                    <span className="text-emerald-50">Valid Student Pass</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                    <span className="text-emerald-50">
                      Passport valid 18+ months
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                    <span className="text-emerald-50">
                      Graduation letter from institution
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                    <span className="text-emerald-50">
                      One-year insurance cover
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                    <span className="text-emerald-50">
                      Personal bond & sponsor
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                    <span className="text-emerald-50">
                      Sponsor payslips & NRIC
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                    <span className="text-emerald-50">
                      Required photo (217×280px)
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4">Benefits Snapshot</h3>
                <div className="grid sm:grid-cols-3 gap-6 text-center">
                  <div>
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-emerald-300" />
                    <div className="font-bold text-2xl mb-1">12 Months</div>
                    <div className="text-emerald-100 text-sm">
                      Post-graduation stay
                    </div>
                  </div>
                  <div>
                    <FileText className="w-8 h-8 mx-auto mb-2 text-emerald-300" />
                    <div className="font-bold text-2xl mb-1">Work Allowed</div>
                    <div className="text-emerald-100 text-sm">
                      In permitted sectors
                    </div>
                  </div>
                  <div>
                    <Users className="w-8 h-8 mx-auto mb-2 text-emerald-300" />
                    <div className="font-bold text-2xl mb-1">Family</div>
                    <div className="text-emerald-100 text-sm">
                      Dependents may apply
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
