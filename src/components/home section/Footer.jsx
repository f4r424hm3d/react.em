import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaPinterest,
  FaInstagram,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";
import { MdPhone } from "react-icons/md";
import { LuPhone } from "react-icons/lu";
import { Link } from "react-router-dom";
import logo from "/logo (2).png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const courses = [
    {
      to: "/courses-in-malaysia/accounting-finance",
      label: "Accounting & Finance",
    },
    {
      to: "/courses-in-malaysia/business-management",
      label: "Business Management",
    },
    {
      to: "/courses-in-malaysia/computer-engineering",
      label: "Computer Engineering",
    },
    { to: "/courses-in-malaysia/medicine", label: "Medicine" },
    { to: "/courses-in-malaysia/hospitality", label: "Hospitality" },
    {
      to: "/courses-in-malaysia/civil-engineering",
      label: "Civil Engineering",
    },
  ];

  const levels = [
    { to: "/courses/pre-university", label: "Pre University" },
    { to: "/courses/diploma", label: "Diploma" },
    { to: "/courses/under-graduate", label: "Undergraduate" },
    { to: "/courses/post-graduate", label: "Post Graduate" },
    { to: "/courses/phd", label: "PhD" },
  ];

  const support = [
    { to: "/faqs", label: "FAQs" },
    { to: "/contact-us", label: "Contact Us" },
    { to: "/blog", label: "Blog" },
    { to: "/what-people-say", label: "Reviews" },
  ];

  const socials = [
    {
      icon: FaFacebook,
      url: "https://www.facebook.com/educationmalaysia.in",
      color: "hover:bg-blue-600",
    },
    {
      icon: FaInstagram,
      url: "https://www.instagram.com/educationmalaysia.in/",
      color: "hover:bg-pink-500",
    },
    {
      icon: FaLinkedin,
      url: "https://www.linkedin.com/company/educationmalaysia/",
      color: "hover:bg-blue-700",
    },
    {
      icon: FaYoutube,
      url: "https://www.youtube.com/@educationmalaysia6986",
      color: "hover:bg-red-600",
    },
    {
      icon: FaTwitter,
      url: "https://twitter.com/educatemalaysia/",
      color: "hover:bg-sky-500",
    },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Main Footer */}
      <div className="bg-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 mb-8 border-b border-gray-200">
            <div className="flex-1">
              <img
                src={logo}
                alt="Education Malaysia"
                width="256"
                height="64"
                className="w-56 sm:w-64 mb-3 brightness-125 drop-shadow-lg"
              />
              <p className="text-gray-600 text-sm max-w-md leading-relaxed">
                Guiding students with trusted counseling, scholarships, and
                admission support to build successful careers through Malaysian
                education.
              </p>
            </div>

            {/* Contact CTA */}
            <div className="bg-blue-50 rounded-xl p-4 sm:p-6 w-full lg:w-auto border border-blue-100">
              <h4 className="text-gray-800 font-semibold mb-3 text-sm sm:text-base">
                Start Your Journey Today
              </h4>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:+919818560331"
                  className="flex items-center gap-2 bg-[#003893] text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-[#002966] transition-all"
                >
                  <LuPhone /> Call Now
                </a>

                <a
                  href="mailto:info@educationmalaysia.in"
                  className="flex items-center gap-2 border-2 border-[#003893] text-[#003893] px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-[#003893] hover:text-white transition-all"
                >
                  <FaEnvelope /> Email Us
                </a>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Office */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#003893] w-8 h-8" />
                <h3 className="text-gray-800 text-2xl font-bold leading-none">
                  Our Office
                </h3>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                B-16 Ground Floor, Mayfield Garden, Sector 50, Gurugram, Haryana
                122002
              </p>

              <div className="space-y-2 text-sm">
                <a
                  href="tel:+919818560331"
                  className="flex items-center gap-2 text-gray-600 hover:text-[#003893] transition-colors"
                >
                  <MdPhone className="text-xs" /> +91-98185-60331
                </a>
                <a
                  href="mailto:info@educationmalaysia.in"
                  className="flex items-center gap-2 text-gray-600 hover:text-[#003893] transition-colors"
                >
                  <FaEnvelope className="text-xs" /> info@educationmalaysia.in
                </a>
              </div>
            </div>

            {/* Top Courses */}
            <div>
              <h3 className="text-gray-800 text-2xl font-bold mb-4">
                Top Courses
              </h3>
              <ul className="space-y-2">
                {courses.map((item) => (
                  <li key={item.to} className="group">
                    <Link
                      to={item.to}
                      className="inline-flex items-center gap-1 text-gray-600 text-sm transition-all group-hover:text-[#003893] group-hover:translate-x-1"
                    >
                      <FaArrowRight className="text-[8px] opacity-0 transition-all group-hover:opacity-100" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Study Levels */}
            <div>
              <h3 className="text-gray-800 text-2xl font-bold mb-4">
                Study Levels
              </h3>
              <ul className="space-y-2">
                {levels.map((item) => (
                  <li key={item.label} className="group">
                    <Link
                      to={item.to}
                      className="inline-flex items-center gap-1 text-gray-600 text-sm transition-all group-hover:text-[#003893] group-hover:translate-x-1"
                    >
                      <FaArrowRight className="text-[8px] opacity-0 transition-all group-hover:opacity-100" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-gray-800 text-2xl font-bold mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {support.map((item) => (
                  <li key={item.to} className="group">
                    <Link
                      to={item.to}
                      className="inline-flex items-center gap-1 text-gray-600 text-sm transition-all group-hover:text-[#003893] group-hover:translate-x-1"
                    >
                      <FaArrowRight className="text-[8px] opacity-0 transition-all group-hover:opacity-100" />
                      {item.label}
                    </Link>
                  </li>
                ))}

                <li className="group">
                  <Link
                    to="/privacy-policy"
                    className="inline-flex items-center gap-1 text-gray-600 text-sm transition-all group-hover:text-[#003893] group-hover:translate-x-1"
                  >
                    <FaArrowRight className="text-[8px] opacity-0 group-hover:opacity-100 transition-all" />
                    Privacy Policy
                  </Link>
                </li>

                <li className="group">
                  <Link
                    to="/terms-and-conditions"
                    className="inline-flex items-center gap-1 text-gray-600 text-sm transition-all group-hover:text-[#003893] group-hover:translate-x-1"
                  >
                    <FaArrowRight className="text-[8px] opacity-0 group-hover:opacity-100 transition-all" />
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-blue-900 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white text-xs sm:text-sm">
              © {currentYear} Education Malaysia. All rights reserved.
            </p>

            <div className="flex gap-2">
              {socials.map(({ icon: Icon, url, color }) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 sm:w-9 sm:h-9 bg-white/10 ${color} rounded-full flex items-center justify-center text-white text-sm transition-all duration-300`}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
