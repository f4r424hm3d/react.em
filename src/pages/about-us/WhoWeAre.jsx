import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUniversity,
  FaUserGraduate,
  FaHandshake,
  FaCogs,
  FaGlobeAsia,
  FaUsers
} from "react-icons/fa";
import { GraduationCap, FileText, Shield, DollarSign, Globe, Plane, Check, ArrowRight } from 'lucide-react';

const WhoWeAre = () => {
  const [activeTab, setActiveTab] = useState("universities");

  const services = [
    {
      icon: GraduationCap,
      title: "University & Course Selection",
      description: "Personalized guidance to help students choose the right university and program aligned with career goals and budget.",
      cta: "Explore Universities"
    },
    {
      icon: FileText,
      title: "Application & Admission Support",
      description: "Complete assistance with documentation, application submission, and follow-up to ensure smooth admission process.",
      cta: "Start Application"
    },
    {
      icon: Shield,
      title: "Student Visa & EMGS Guidance",
      description: "Expert support for visa applications and EMGS approval process, ensuring high success rates for international students.",
      cta: "Visa Assistance"
    },
    {
      icon: DollarSign,
      title: "Scholarship & Fee Advisory",
      description: "Access exclusive scholarships and financial planning support to make quality education affordable for every student.",
      cta: "Find Scholarships"
    },
    {
      icon: Globe,
      title: "International Student & Agent Support",
      description: "Dedicated support for students from 185+ countries and partnerships with education agents worldwide.",
      cta: "Partner With Us"
    },
    {
      icon: Plane,
      title: "Pre-Departure & Arrival Assistance",
      description: "Comprehensive support from travel planning to airport pickup, accommodation, and settling in Malaysia.",
      cta: "Learn More"
    }
  ];

  const cardData = [
    {
      icon: <FaUniversity className="mx-auto text-3xl text-blue-500 mb-4" />,
      title: "Establish an India Office",
      description:
        "We will guide you in setting up your India office, including legal aspects like RBI license handling."
    },
    {
      icon: <FaCogs className="mx-auto text-3xl text-blue-500 mb-4" />,
      title: "Market Research and Analysis",
      description:
        "We analyze markets and build effective strategies tailored to your institution's goals."
    },
    {
      icon: <FaGlobeAsia className="mx-auto text-3xl text-blue-500 mb-4" />,
      title: "Marketing and Branding",
      description:
        "Expand your international reach and attract global candidates through education fairs and branding."
    },
    {
      icon: <FaCogs className="mx-auto text-3xl text-blue-500 mb-4" />,
      title: "We Understand Business",
      description:
        "Our industry experience helps us understand and cater to the diverse needs of the education sector."
    },
    {
      icon: <FaUsers className="mx-auto text-3xl text-blue-500 mb-4" />,
      title: "We Are Good At What We Do",
      description:
        "A skilled and experienced team providing cost-effective marketing solutions that deliver."
    },
    {
      icon: <FaHandshake className="mx-auto text-3xl text-blue-500 mb-4" />,
      title: "An Accomplished Team",
      description:
        "Our team works closely with clients to provide guidance and strategic planning throughout the process."
    }
  ];

  return (
    <div className="px-6 md:px-12 py-10 max-w-screen-xl mx-auto bg-gray-50">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
        About <span className="text-blue-600">Education Malaysia</span>
      </h2>


    {/* ABOUT SECTION */}
<div className="mb-14">

  {/* Center Heading */}
  <div className="text-center mb-12">
    <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
      About <span className="text-blue-600">Us</span>
    </h3>
    <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full mx-auto mt-4"></div>
  </div>

  <div className="grid lg:grid-cols-2 gap-12 items-stretch">

    {/* LEFT SIDE - MAIN BOX */}
    <div className="relative bg-white p-10 rounded-3xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-60 pointer-events-none"></div>

      <p className="relative text-lg font-semibold text-blue-700 mb-5 italic">
        “The Achievement of Perfection is our goal but Excellence is Guarantee!”
      </p>

      <p className="relative text-gray-700 mb-5 leading-relaxed text-base">
        <strong>Britannica Overseas</strong> is the cutting edge of higher education recruitment, marketing, and student enrollment. Since 2015, we have delivered innovative solutions to partner institutions worldwide.
      </p>

      <p className="relative text-gray-700 mb-5 leading-relaxed text-base">
        We serve over <span className="font-semibold text-blue-600">100+ institutions worldwide</span>, operating multiple portals for countries like Malaysia, Germany, Canada, Australia, and the UK.
      </p>

      <p className="relative text-gray-700 leading-relaxed text-base">
        We connect global students to universities through branding, marketing, recruitment, and software-driven innovations.
      </p>
    </div>

    {/* RIGHT SIDE - 4 BOXES */}
    <div className="grid sm:grid-cols-2 gap-6 h-full">

      {/* Vision */}
      <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-3">
          <span className="text-xl">👁️</span>
          Vision
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          To make a transformative impact on Study Abroad Services through innovation.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-3">
          <span className="text-xl">🚀</span>
          Mission
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Simplify admission & provide best education solutions</li>
          <li>• Build strong business relationships</li>
          <li>• Become the world's most reliable brand</li>
        </ul>
      </div>

      {/* Core Values */}
      <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-3">
          <span className="text-xl">💎</span>
          Core Values
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          Integrity, Honesty, Commitment, Transparency, Excellence and Value Addition.
        </p>
      </div>

      {/* Objective */}
      <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-3">
          <span className="text-xl">🎯</span>
          Objective
        </h3>
        <p className="text-gray-700 text-sm font-medium">
          To Expand the Academic Horizons.
        </p>
      </div>

    </div>

  </div>
</div>


      {/* TABS */}
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {["universities", "students", "partners"].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition duration-300 flex items-center gap-2 ${activeTab === tab
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-blue-100"
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "universities" && <FaUniversity />}
            {tab === "students" && <FaUserGraduate />}
            {tab === "partners" && <FaHandshake />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-lg shadow-md p-6 md:p-10 border"
      >
        {activeTab === "universities" && (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FaUniversity className="text-blue-500" /> For Universities
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Partnered with esteemed institutions globally.</li>
              <li>Recruit highly qualified students via outreach programs.</li>
              <li>International student recruitment solutions, including marketing and support.</li>
              <li>Train and manage in-country agents to enhance reach and applications.</li>
              <li>Pre-screen applications to ensure quality and reduce workload.</li>
            </ul>
          </>
        )}

        {activeTab === "students" && (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FaUserGraduate className="text-blue-500" /> For Students
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Comprehensive services from counseling to visa processing.</li>
              <li>Smart tech-based search platforms to find best destinations & courses.</li>
              <li>Support with admissions, loans, test coaching, and allied services.</li>
            </ul>
          </>
        )}

        {activeTab === "partners" && (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FaHandshake className="text-blue-500" /> For Partners
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Swift, Simple and Rewarding partner services.</li>
              <li>Empowerment through product training & tech platforms.</li>
              <li>High commissions, fast payments, and transparent practices.</li>
              <li>Global presence with 100+ universities in 6+ countries.</li>
            </ul>
          </>
        )}
      </motion.div>

      {/* SUPPORT */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Support</h3>
        <p className="text-gray-700">
          Our expert team assists students and partners through admission, visa, and post-enrollment processes. We are committed to excellence in global education services.
        </p>
      </div>

      {/* WHY CHOOSE US CARDS - Only show when universities tab is active */}
      {activeTab === "universities" && (
        <div className="mt-10">
          <div className="flex justify-center mb-6">
            <button className="bg-blue-600 text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition">
              Why Choose Us
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {cardData.slice(0, 3).map((card, index) => (
              <motion.div
                key={index}
                className="bg-white border rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition duration-300"
                whileHover={{ scale: 1.05 }}
              >
                {card.icon}
                <h4 className="text-lg font-semibold mb-2">{card.title}</h4>
                <p className="text-gray-600">{card.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {cardData.slice(3).map((card, index) => (
              <motion.div
                key={index}
                className="bg-white border rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition duration-300"
                whileHover={{ scale: 1.05 }}
              >
                {card.icon}
                <h4 className="text-lg font-semibold mb-2">{card.title}</h4>
                <p className="text-gray-600">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* SERVICES SECTION */}
      <div className="pt-12  px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Services – Your Pathway to Studying in Malaysia
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              End-to-end guidance for international students — from course selection to arrival in Malaysia.
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                  <service.icon className="w-7 h-7 text-blue-600" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                <button className="text-blue-600 font-medium flex items-center space-x-2 group-hover:space-x-3 transition-all">
                  <span>{service.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoWeAre;
