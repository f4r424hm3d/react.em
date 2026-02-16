import {
  Briefcase,
  GraduationCap,
  Globe,
  Clock,
  TrendingUp,
  FileText,
  Users,
  CheckCircle,
} from "lucide-react";
import SeoHead from "../components/SeoHead";
import DynamicBreadcrumb from "../components/DynamicBreadcrumb";
import useStaticPageSeo from "../hooks/useStaticPageSeo";

function App() {
  const { seo: apiSeo } = useStaticPageSeo(
    "resources/services/discover-malaysia",
  );

  return (
    <div className="min-h-screen bg-white">
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
          title: "Discover Malaysia",
          slug: "discover-malaysia",
        }}
      />
      <header
        className="bg-gradient-to-r from-blue-600 to-blue-400
 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Jobs & Career Opportunities in Malaysia
            </h1>
            <p className="text-xl text-emerald-50 max-w-3xl mx-auto">
              Your complete guide to working in Malaysia as an international
              student - during studies, after graduation, and beyond
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl border border-emerald-200">
              <div className="bg-emerald-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                During Studies
              </h3>
              <p className="text-gray-600">
                Part-time work opportunities while you study
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl border border-blue-200">
              <div className="bg-blue-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                After Graduation
              </h3>
              <p className="text-gray-600">
                Transition from student to professional
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-xl border border-amber-200">
              <div className="bg-amber-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Direct Jobs Market
              </h3>
              <p className="text-gray-600">
                Professional opportunities for foreigners
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-emerald-600 w-12 h-12 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Working During Your Studies
            </h2>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Work Permit Requirements
            </h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              International students in Malaysia are allowed to work part-time
              during semester breaks and holidays, subject to approval from the
              Immigration Department of Malaysia.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3">
                  Allowed Work Hours
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Maximum 20 hours per week during semester breaks
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Full-time during semester holidays (exceeding 7 days)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>No work allowed during academic sessions</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3">
                  Permitted Sectors
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Restaurants and hotels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Retail and mini markets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Petrol stations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
            <h4 className="font-bold text-blue-900 mb-2">
              Application Process
            </h4>
            <p className="text-blue-800 leading-relaxed">
              Students must apply through their institution's international
              office. The university will submit the application to the
              Immigration Department on your behalf. Processing typically takes
              2-4 weeks.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              After Graduation
            </h2>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Post-Study Work Opportunities
            </h3>

            <div className="mb-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 mb-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2">
                      Employment Pass (Category I, II, III)
                    </h4>
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      Fresh graduates can apply for an Employment Pass if they
                      secure a job offer from a Malaysian company. The employer
                      typically sponsors this pass.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-blue-900 mb-2">
                        Minimum Requirements:
                      </p>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Bachelor's degree or higher qualification</li>
                        <li>
                          • Minimum monthly salary of RM 3,000 - RM 5,000
                          (varies by category)
                        </li>
                        <li>• Job offer from a Malaysian registered company</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2">
                      Graduate Job Search Pass
                    </h4>
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      International students who graduate from Malaysian
                      universities can apply for a special pass that allows them
                      to stay and look for work for up to 12 months.
                    </p>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-emerald-900 mb-2">
                        Key Benefits:
                      </p>
                      <ul className="text-sm text-emerald-800 space-y-1">
                        <li>• Valid for 12 months</li>
                        <li>• Can attend job interviews and network</li>
                        <li>
                          • Must convert to Employment Pass upon securing a job
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-4">
                In-Demand Industries
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  <span>Information Technology & Software Development</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  <span>Engineering & Manufacturing</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  <span>Finance & Banking</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  <span>Healthcare & Pharmaceuticals</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  <span>Digital Marketing & E-commerce</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-4">
                Average Starting Salaries
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-700">IT & Software</span>
                  <span className="font-bold text-gray-900">
                    RM 3,500 - 5,500
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Engineering</span>
                  <span className="font-bold text-gray-900">
                    RM 3,200 - 5,000
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Finance</span>
                  <span className="font-bold text-gray-900">
                    RM 3,000 - 4,500
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Marketing</span>
                  <span className="font-bold text-gray-900">
                    RM 2,800 - 4,000
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Healthcare</span>
                  <span className="font-bold text-gray-900">
                    RM 3,500 - 6,000
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-amber-600 w-12 h-12 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Direct Jobs Market for Foreigners
            </h2>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Professional Employment Options
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Malaysia actively welcomes skilled foreign professionals to
              support its growing economy. Various employment pass categories
              cater to different skill levels and industries.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="text-center mb-4">
                  <div className="inline-block bg-amber-100 px-4 py-2 rounded-full">
                    <span className="font-bold text-amber-900">Category I</span>
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 mb-3 text-center">
                  Top-Level Positions
                </h4>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p>
                    <strong>Salary:</strong> RM 10,000+
                  </p>
                  <p>
                    <strong>Duration:</strong> Up to 5 years
                  </p>
                  <p>
                    <strong>Roles:</strong> Senior executives, C-level positions
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="text-center mb-4">
                  <div className="inline-block bg-blue-100 px-4 py-2 rounded-full">
                    <span className="font-bold text-blue-900">Category II</span>
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 mb-3 text-center">
                  Mid-Level Positions
                </h4>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p>
                    <strong>Salary:</strong> RM 5,000 - 9,999
                  </p>
                  <p>
                    <strong>Duration:</strong> Up to 2 years
                  </p>
                  <p>
                    <strong>Roles:</strong> Managers, specialists
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="text-center mb-4">
                  <div className="inline-block bg-emerald-100 px-4 py-2 rounded-full">
                    <span className="font-bold text-emerald-900">
                      Category III
                    </span>
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 mb-3 text-center">
                  Entry-Level Positions
                </h4>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p>
                    <strong>Salary:</strong> RM 3,000 - 4,999
                  </p>
                  <p>
                    <strong>Duration:</strong> Up to 1 year
                  </p>
                  <p>
                    <strong>Roles:</strong> Graduates, junior staff
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 border-2 border-gray-200 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Popular Job Portals
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  General Job Portals
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    <span>JobStreet Malaysia</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    <span>LinkedIn Malaysia</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    <span>Indeed Malaysia</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    <span>Ricebowl</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Specialized Portals
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>Tech in Asia Jobs (Tech roles)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>eFinancialCareers (Finance)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>Hiredly (Tech & Startups)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>Glints (Regional opportunities)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <Users className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Malaysia Tech Talent Program
                </h4>
                <p className="text-gray-700 leading-relaxed mb-3">
                  A special initiative to attract global tech talent. Offers
                  streamlined visa processing and special benefits for tech
                  professionals in areas like AI, blockchain, cybersecurity, and
                  cloud computing.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    Fast-track processing
                  </span>
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    Family inclusion
                  </span>
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    Long-term stay
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Important Resources
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h4 className="font-bold text-gray-900 mb-2">
                Immigration Department
              </h4>
              <p className="text-sm text-gray-600">
                Official visa and pass information
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h4 className="font-bold text-gray-900 mb-2">
                TalentCorp Malaysia
              </h4>
              <p className="text-sm text-gray-600">
                Professional talent programs
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h4 className="font-bold text-gray-900 mb-2">MDEC</h4>
              <p className="text-sm text-gray-600">
                Digital economy & tech careers
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h4 className="font-bold text-gray-900 mb-2">
                University Career Centers
              </h4>
              <p className="text-sm text-gray-600">
                Campus job placement support
              </p>
            </div>
          </div>
        </section>

        <section
          className="bg-gradient-to-r from-blue-600 to-blue-400
 rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Career in Malaysia?
          </h2>
          <p className="text-xl text-emerald-50 mb-6 max-w-2xl mx-auto">
            Malaysia offers diverse opportunities for international talent. From
            gaining experience during your studies to building a long-term
            career, the pathway is clear and accessible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Contact Your University
            </button>
            <button className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors border-2 border-blue-500">
              Learn More
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
