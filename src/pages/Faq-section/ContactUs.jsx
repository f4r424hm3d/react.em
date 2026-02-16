import React, { useState, useEffect } from "react";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Home, Layers, User, MessageSquare, RefreshCw } from "lucide-react";
import SeoHead from "../../components/SeoHead";
import useStaticPageSeo from "../../hooks/useStaticPageSeo";

const locationsData = {
  INDIA: [
    {
      city: "Gurgaon",
      address:
        "B-16 Ground Floor, Mayfield Garden, Sector 50, Gurugram, Haryana, India 122002",
      contact: "+91-9818560331",
      email: "info@educationmalaysia.in",
    },
    {
      city: "Chennai",
      address:
        "#1 H, first floor, Vantage Plaza, Door No.1, L.B.Road and MG Road Junction, Thiruvanmiyur-600 041",
      contact: "+60-17-647-2057",
      email: "info@educationmalaysia.in",
    },
    {
      city: "Chittoor",
      address:
        "2nd floor, opp. to Indian Bank, Bairagi Patteda, Tirupati 517501",
      contact: "+91-9818560331",
      email: "info@educationmalaysia.in",
    },
    {
      city: "Maharashtra",
      address:
        "Office No. 35, PP Chamber, Fathe Ali Road, Dombivli East, Thane, Maharashtra, 421201",
      contact: "+91-9818560331",
      email: "info@educationmalaysia.in",
    },
    {
      city: "Hyderabad",
      address: "H.no:-16-2-669 Flat no–116, Jamuna Towers, Malakpet 500036 TS",
      contact: "+91-9818560331",
      email: "info@educationmalaysia.in",
    },
  ],
  MALAYSIA: [
    {
      city: "Kuala Lumpur",
      address:
        "8, Jalan Tun Sambanthan, Wilayah Persekutuan Kuala Lumpur Malaysia 50470",
      contact: "+60-3-12345678",
      email: "kl@educationmalaysia.in",
    },
  ],
  BANGLADESH: [
    {
      city: "Uttara Dhaka",
      address:
        "H-16, Road-09, Sector-01, (Flat-A5/B), Uttara, Dhaka, Bangladesh 1230",
      contact: "+60-11-1778-4424",
      email: "info@educationmalaysia.in",
    },
  ],
  PAKISTAN: [
    {
      city: "Lahore",
      address: "#311, Garden Heights, Garden Town Lahore Pakistan 54000",
      contact: "+60-11-1778-4424",
      email: " info@educationmalaysia.in",
    },
  ],
};

const ContactUs = () => {
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [activeTab, setActiveTab] = useState("INDIA");
  const { seo: apiSeo } = useStaticPageSeo("contact-us");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    userAnswer: "",
  });
  /* REMOVED: const [error, setError] = useState(""); */
  /* We will use toast instead */

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10 + 1);
    const b = Math.floor(Math.random() * 10 + 1);
    setCaptchaQuestion(`${a} * ${b}`);
    setCaptchaAnswer((a * b).toString());
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {
      toast.error("Please fill out all fields!");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    if (formData.userAnswer !== captchaAnswer) {
      toast.error("Wrong Captcha! Please try again.");
      generateCaptcha();
      return;
    }

    // Success
    console.log("✅ Form Submitted:", formData);
    toast.success("Submit Successfully!");

    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      userAnswer: "",
    });
    generateCaptcha();
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const tabStyles = (tab) =>
    `px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
      activeTab === tab
        ? "bg-blue-700 text-white shadow-lg transform scale-105"
        : "bg-white text-blue-700 hover:bg-blue-100 shadow-md"
    }`;

  return (
    <>
      <SeoHead
        pageType="service-detail"
        data={{
          name: apiSeo?.meta_title,
          description: apiSeo?.meta_description,
          keywords: apiSeo?.meta_keyword,
          image: apiSeo?.og_image_path,
        }}
      />

      {/* Breadcrumb */}
      <div className="w-full bg-white shadow-sm border-b">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Link
              to="/"
              className="flex items-center gap-1 hover:underline hover:text-blue-600 transition"
            >
              <Home size={18} /> Home
            </Link>
            <span>/</span>
            <Link
              to="/contact-us"
              className="flex items-center gap-1 hover:underline hover:text-blue-600 transition"
            >
              <Layers size={18} /> Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Main Contact Section with Blue Background */}
      <div className="bg-gradient-to-br from-[#0f1f3d] via-[#1a2f4f] to-[#2a4365] py-16 px-4 md:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Get in Touch
            </h2>

            <div className="space-y-5">
              {/* Name Input with Icon */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Email Input with Icon */}
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Phone Input with Icon */}
              <div className="relative">
                <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Mobile Number"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Message Textarea with Icon */}
              <div className="relative">
                <MessageSquare className="absolute left-3 top-4 text-gray-400 w-5 h-5" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Write your message..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
                ></textarea>
              </div>

              {/* Captcha */}
              <div className="flex items-center gap-4">
                <div className="px-5 py-3 bg-gray-100 rounded-lg font-semibold text-gray-800 text-lg">
                  {captchaQuestion}
                </div>

                {/* Refresh Button */}
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300 transform hover:rotate-180"
                  title="Refresh Captcha"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  name="userAnswer"
                  value={formData.userAnswer}
                  onChange={handleInputChange}
                  placeholder="Answer"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              {/* Error/Success Message */}
              {/* Error/Success Message Removed - Handled by Toast */}
              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg font-semibold transition duration-300 transform hover:scale-105"
              >
                Submit Request
              </button>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="text-white space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Contact Info</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                We at Britannica Education support and guide students and
                families in making informed decisions for a bright future.
              </p>
            </div>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="bg-[#1a3a5c] p-3 rounded-lg flex-shrink-0">
                  <MdLocationOn className="text-white text-2xl" />
                </div>
                <div>
                  <p className="text-blue-100 text-base">
                    B-16 Ground Floor, Mayfield Garden, Sector 50,
                    <br />
                    Gurugram, Haryana, India 122002
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="bg-[#1a3a5c] p-3 rounded-lg flex-shrink-0">
                  <MdEmail className="text-white text-2xl" />
                </div>
                <div>
                  <p className="text-blue-100">info@educationmalaysia.in</p>
                  <p className="text-blue-100">sales@educationmalaysia.in</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="bg-[#1a3a5c] p-3 rounded-lg flex-shrink-0">
                  <MdPhone className="text-white text-2xl" />
                </div>
                <div>
                  <p className="text-blue-100">+91 9818560331</p>
                  <p className="text-blue-100">+91 8130798532</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="bg-blue-800 bg-opacity-50 backdrop-blur-sm p-5 rounded-lg">
                <p className="text-3xl font-bold text-white">12+</p>
                <p className="text-blue-200 text-sm mt-1">
                  Years of Experience
                </p>
              </div>
              <div className="bg-blue-800 bg-opacity-50 backdrop-blur-sm p-5 rounded-lg">
                <p className="text-3xl font-bold text-white">5000+</p>
                <p className="text-blue-200 text-sm mt-1">Students Guided</p>
              </div>
              <div className="bg-blue-800 bg-opacity-50 backdrop-blur-sm p-5 rounded-lg">
                <p className="text-3xl font-bold text-white">97%</p>
                <p className="text-blue-200 text-sm mt-1">Visa Success Rate</p>
              </div>
              <div className="bg-blue-800 bg-opacity-50 backdrop-blur-sm p-5 rounded-lg">
                <p className="text-xl font-bold text-white">Direct Tie-up</p>
                <p className="text-blue-200 text-sm mt-1">
                  Malaysian Universities
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Tabs Section */}
      <div className="bg-gradient-to-br from-[#0f1f3d]  to-[#2a4365]  py-16 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-4xl font-bold text-white mb-10">
            Our <span className="text-white-400">Locations</span>
          </h2>
          <div className="flex justify-center flex-wrap gap-4 mb-12">
            {["INDIA", "MALAYSIA", "BANGLADESH", "PAKISTAN"].map((country) => (
              <button
                key={country}
                className={tabStyles(country)}
                onClick={() => setActiveTab(country)}
              >
                {country}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locationsData[activeTab].map((loc, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FaBuilding className="text-blue-700 text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {loc.city}
                  </h3>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 flex items-start gap-2">
                    <MdLocationOn className="text-blue-600 text-lg flex-shrink-0 mt-0.5" />
                    <span>{loc.address}</span>
                  </p>
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <MdPhone className="text-blue-600 text-lg" />
                    {loc.contact}
                  </p>
                  <p className="text-sm text-blue-600 flex items-center gap-2">
                    <MdEmail className="text-blue-600 text-lg" />
                    {loc.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded Map Section */}
      <div className="bg-white py-12 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">
            Find Us on Map
          </h2>
          <div className="w-full h-[450px] rounded-xl overflow-hidden shadow-2xl">
            <iframe
              title="Google Map"
              src={
                {
                  INDIA:
                    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7004.303129814315!2d77.0554621!3d28.4165369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18c4f2546a01%3A0x6455c6b75e55b144!2sMayfield%20Garden%2C%20Sector%2050%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1695710000000!5m2!1sen!2sin",
                  MALAYSIA:
                    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1993.0368803700766!2d101.69296431614036!3d3.135667000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc49f65b24d13f%3A0x1eaf1b07bc8a4171!2sJalan%20Tun%20Sambanthan%2C%20Kuala%20Lumpur!5e0!3m2!1sen!2smy!4v1695710000001!5m2!1sen!2smy",
                  BANGLADESH:
                    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.432555942795!2d90.39129481538585!3d23.766332394294655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c427c23f8f5f%3A0xa1a6c5794873d890!2sUttara%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1695710000002!5m2!1sen!2sbd",
                  PAKISTAN:
                    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13613.520763872065!2d74.3211251!3d31.4969397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391904a3aeaad4fb%3A0x4044ab6fae594b3d!2sGarden%20Town%2C%20Lahore%2C%20Pakistan!5e0!3m2!1sen!2s!4v1695710000003!5m2!1sen!2s",
                }[activeTab]
              }
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
