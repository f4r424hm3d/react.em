import React, { useState, useMemo, useEffect } from "react";
import PartnerApplicationForm from "./PartnerApplicationForm";
import ContactTeam from "./ContactTeam";
import ContactFormPopup from "./ContactFormPopup";
import {
  MapPin,
  Users,
  Globe,
  Phone,
  Mail,
  Search,
  Star,
  Award,
  ExternalLink,
  Shield,
  CheckCircle,
  Target,
  TrendingUp,
  Handshake,
  FileText,
  ShieldCheck,
  LayoutDashboard,
  GraduationCap,
} from "lucide-react";

const partners = [
  {
    id: "1",
    name: "Dr. Rajesh Kumar",
    company: "MedEdu Consultants Pvt Ltd",
    email: "rajesh.kumar@mededu.com",
    mobile: "+91 98765 43210",
    city: "New Delhi",
    state: "Delhi",
    designation: "Senior Education Consultant",
    experience: "12 years",
    specialization: [
      "MBBS Admissions",
      "Medical Counseling",
      "Visa Assistance",
    ],
    rating: 4.9,
    studentsPlaced: 450,
    joinedYear: 2018,
    image:
      "https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=300",
    verified: true,
  },
  {
    id: "2",
    name: "Priya Sharma",
    company: "Global Medical Education",
    email: "priya.sharma@globalmeded.in",
    mobile: "+91 87654 32109",
    city: "Mumbai",
    state: "Maharashtra",
    designation: "Director - International Relations",
    experience: "8 years",
    specialization: [
      "International Admissions",
      "Student Support",
      "Career Guidance",
    ],
    rating: 4.8,
    studentsPlaced: 320,
    joinedYear: 2019,
    image:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300",
    verified: true,
  },
  {
    id: "3",
    name: "Amit Patel",
    company: "Future Doctors Academy",
    email: "amit.patel@futuredoctors.co.in",
    mobile: "+91 76543 21098",
    city: "Ahmedabad",
    state: "Gujarat",
    designation: "Founder & CEO",
    experience: "15 years",
    specialization: ["NEET Coaching", "Abroad Studies", "Scholarship Guidance"],
    rating: 4.9,
    studentsPlaced: 680,
    joinedYear: 2016,
    image:
      "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300",
    verified: true,
  },
  {
    id: "4",
    name: "Dr. Sunita Reddy",
    company: "South India Medical Consultancy",
    email: "sunita.reddy@simconsult.com",
    mobile: "+91 65432 10987",
    city: "Hyderabad",
    state: "Telangana",
    designation: "Chief Medical Advisor",
    experience: "10 years",
    specialization: [
      "Medical Admissions",
      "University Partnerships",
      "Student Mentoring",
    ],
    rating: 4.7,
    studentsPlaced: 380,
    joinedYear: 2020,
    image:
      "https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300",
    verified: true,
  },
  {
    id: "5",
    name: "Vikram Singh",
    company: "North Star Education Services",
    email: "vikram.singh@northstar.edu.in",
    mobile: "+91 54321 09876",
    city: "Jaipur",
    state: "Rajasthan",
    designation: "Regional Manager",
    experience: "6 years",
    specialization: ["Study Abroad", "Documentation", "Pre-departure Support"],
    rating: 4.6,
    studentsPlaced: 250,
    joinedYear: 2021,
    image:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300",
    verified: true,
  },
  {
    id: "6",
    name: "Meera Krishnan",
    company: "Kerala Medical Education Hub",
    email: "meera.krishnan@kmeh.org",
    mobile: "+91 43210 98765",
    city: "Kochi",
    state: "Kerala",
    designation: "Senior Counselor",
    experience: "9 years",
    specialization: [
      "Medical Counseling",
      "Admission Guidance",
      "Parent Consultation",
    ],
    rating: 4.8,
    studentsPlaced: 420,
    joinedYear: 2019,
    image:
      "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=300",
    verified: true,
  },
  {
    id: "7",
    name: "Ravi Gupta",
    company: "Eastern Medical Consultants",
    email: "ravi.gupta@easternmed.in",
    mobile: "+91 32109 87654",
    city: "Kolkata",
    state: "West Bengal",
    designation: "Business Development Manager",
    experience: "7 years",
    specialization: [
      "Business Development",
      "University Relations",
      "Student Recruitment",
    ],
    rating: 4.5,
    studentsPlaced: 290,
    joinedYear: 2020,
    image:
      "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300",
    verified: true,
  },
  {
    id: "8",
    name: "Dr. Anita Joshi",
    company: "Himalayan Education Services",
    email: "anita.joshi@himalayanedu.com",
    mobile: "+91 21098 76543",
    city: "Dehradun",
    state: "Uttarakhand",
    designation: "Medical Education Specialist",
    experience: "11 years",
    specialization: [
      "Medical Education",
      "Research Guidance",
      "Academic Support",
    ],
    rating: 4.9,
    studentsPlaced: 360,
    joinedYear: 2018,
    image:
      "https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300",
    verified: true,
  },
  {
    id: "9",
    name: "Suresh Nair",
    company: "Bangalore Medical Academy",
    email: "suresh.nair@bmacademy.co.in",
    mobile: "+91 10987 65432",
    city: "Bangalore",
    state: "Karnataka",
    designation: "Academic Director",
    experience: "13 years",
    specialization: [
      "Academic Planning",
      "Curriculum Design",
      "Faculty Training",
    ],
    rating: 4.7,
    studentsPlaced: 520,
    joinedYear: 2017,
    image:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300",
    verified: true,
  },
  {
    id: "10",
    name: "Kavita Agarwal",
    company: "Central India Medical Services",
    email: "kavita.agarwal@cims.edu.in",
    mobile: "+91 09876 54321",
    city: "Bhopal",
    state: "Madhya Pradesh",
    designation: "Operations Manager",
    experience: "5 years",
    specialization: [
      "Operations Management",
      "Student Services",
      "Quality Assurance",
    ],
    rating: 4.6,
    studentsPlaced: 180,
    joinedYear: 2022,
    image:
      "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=300",
    verified: true,
  },
];

function Partners() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [viewMode, setViewMode] = useState("grid");
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showContactTeam, setShowContactTeam] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  const countries = [
    "All Countries",
    ...Array.from(new Set(partners.map((p) => p.country || "India"))).sort(),
  ];
  const states =
    selectedCountry === "All Countries"
      ? [
          "All States",
          ...Array.from(new Set(partners.map((p) => p.state))).sort(),
        ]
      : [
          "All States",
          ...Array.from(
            new Set(
              partners
                .filter((p) => (p.country || "India") === selectedCountry)
                .map((p) => p.state),
            ),
          ).sort(),
        ];

  const cities =
    selectedState === "All States"
      ? [
          "All Cities",
          ...Array.from(
            new Set(
              partners
                .filter(
                  (p) =>
                    selectedCountry === "All Countries" ||
                    (p.country || "India") === selectedCountry,
                )
                .map((p) => p.city),
            ),
          ).sort(),
        ]
      : [
          "All Cities",
          ...Array.from(
            new Set(
              partners
                .filter(
                  (p) =>
                    p.state === selectedState &&
                    (selectedCountry === "All Countries" ||
                      (p.country || "India") === selectedCountry),
                )
                .map((p) => p.city),
            ),
          ).sort(),
        ];

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const matchesSearch =
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.state.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry =
        selectedCountry === "All Countries" ||
        (partner.country || "India") === selectedCountry;
      const matchesState =
        selectedState === "All States" || partner.state === selectedState;
      const matchesCity =
        selectedCity === "All Cities" || partner.city === selectedCity;

      return matchesSearch && matchesCountry && matchesState && matchesCity;
    });
  }, [searchTerm, selectedCountry, selectedState, selectedCity]);

  const partnersByState = useMemo(() => {
    const grouped = filteredPartners.reduce((acc, partner) => {
      if (!acc[partner.state]) {
        acc[partner.state] = [];
      }
      acc[partner.state].push(partner);
      return acc;
    }, {});

    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredPartners]);

  const totalStats = useMemo(() => {
    return {
      totalPartners: partners.length,
      totalStudents: partners.reduce((sum, p) => sum + p.studentsPlaced, 0),
      averageRating: (
        partners.reduce((sum, p) => sum + p.rating, 0) / partners.length
      ).toFixed(1),
      states: new Set(partners.map((p) => p.state)).size,
    };
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const handleContactNow = (partner) => {
    setSelectedPartner(partner);
    setShowContactForm(true);
  };

  if (showApplicationForm) {
    return <PartnerApplicationForm />;
  }

  if (showContactTeam) {
    return <ContactTeam />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-blue-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-blue/30"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-cyan-300 mr-3" />
              <span className="text-cyan-100 text-lg font-medium">
                Global Network
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Our Global <span className="text-cyan-300">Partners</span> Network
            </h1>

            <p className="text-xl text-blue-50 mb-8 max-w-4xl mx-auto leading-relaxed">
              Empowering education consultants, agents, and institutions to
              connect students with Malaysia's top universities.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => setShowApplicationForm(true)}
                className="px-8 py-4 bg-white text-blue-800 font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Become a Partner
              </button>
              <button
                onClick={() => setShowContactTeam(true)}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-800 transition-all duration-200"
              >
                Login to Partner Portal
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-300 mb-2">
                  185+
                </div>
                <div className="text-blue-100">Student Source Countries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-300 mb-2">
                  120+
                </div>
                <div className="text-blue-100">Malaysian Universities</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-300 mb-2">
                  100+
                </div>
                <div className="text-blue-100">Active Global Partners</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-300 mb-2">
                  4.7/5
                </div>
                <div className="text-blue-100">Partner Satisfaction Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Network Intro Section */}
      <section className="py-10 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
              <Handshake className="w-4 h-4 mr-2" />
              Growing Global Network
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Join a Fast-Growing Network of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Authorized Education Partners
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Join a fast-growing network of authorized education partners
              across{" "}
              <span className="font-semibold text-gray-800">
                Asia, Africa, and the Middle East
              </span>
              . We provide end-to-end support — from university access and
              transparent commissions to visa guidance and dedicated partner
              tools — helping you{" "}
              <span className="font-semibold text-gray-800">
                scale student admissions to Malaysia confidently
              </span>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                  <Search className="w-4 h-4 mr-2 text-blue-600" />
                  Search Partners
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <input
                    type="text"
                    placeholder="Search by name, company, city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-white shadow-sm"
                  />
                </div>
              </div>

              {/* Country Filter */}
              <div>
                <label className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-blue-600" />
                  Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setSelectedState("All States");
                    setSelectedCity("All Cities");
                  }}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-white shadow-sm cursor-pointer"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* State Filter */}
              <div>
                <label className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                  State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCity("All Cities");
                  }}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-white shadow-sm cursor-pointer"
                >
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-white shadow-sm cursor-pointer"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="text-gray-600">
                Showing{" "}
                <span className="font-semibold text-blue-600">
                  {filteredPartners.length}
                </span>{" "}
                partners
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                >
                  <div className="w-4 h-4 flex flex-col gap-0.5">
                    <div className="bg-current h-0.5 rounded"></div>
                    <div className="bg-current h-0.5 rounded"></div>
                    <div className="bg-current h-0.5 rounded"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Directory */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {partnersByState.map(([state, statePartners]) => (
            <div key={state} className="mb-16">
              <div className="flex items-center mb-8">
                <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">{state}</h2>
                <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {statePartners.length} Partners
                </span>
              </div>

              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    : "space-y-6"
                }
              >
                {statePartners.map((partner) => (
                  <div
                    key={partner.id}
                    className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                      viewMode === "list"
                        ? "flex items-center p-6"
                        : "transform hover:-translate-y-2"
                    }`}
                  >
                    {viewMode === "grid" ? (
                      <>
                        <div className="relative">
                          <img
                            src={partner.image}
                            alt={partner.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-4 right-4 flex space-x-2">
                            {partner.verified && (
                              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </div>
                            )}
                            <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              {partner.rating}
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {partner.name}
                              </h3>
                              <p className="text-blue-600 font-medium">
                                {partner.designation}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {partner.company}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div className="flex items-center text-gray-600">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="text-sm">
                                {partner.city}, {partner.state}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="text-sm">{partner.mobile}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="text-sm">{partner.email}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                            <div className="bg-blue-50 rounded-lg p-3">
                              <div className="text-2xl font-bold text-blue-600">
                                {partner.studentsPlaced}
                              </div>
                              <div className="text-xs text-gray-600">
                                Students Placed
                              </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                              <div className="text-2xl font-bold text-green-600">
                                {partner.experience}
                              </div>
                              <div className="text-xs text-gray-600">
                                Experience
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="text-sm font-medium text-gray-700 mb-2">
                              Specializations:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {partner.specialization
                                .slice(0, 2)
                                .map((spec, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                  >
                                    {spec}
                                  </span>
                                ))}
                              {partner.specialization.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                  +{partner.specialization.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleContactNow(partner)}
                              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              Contact Now
                            </button>
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-shrink-0 mr-6">
                          <img
                            src={partner.image}
                            alt={partner.name}
                            className="w-24 h-24 rounded-xl object-cover"
                          />
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {partner.name}
                            </h3>
                            <p className="text-blue-600 font-medium text-sm">
                              {partner.designation}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {partner.company}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center text-gray-600">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span className="text-sm">{partner.city}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Phone className="w-3 h-3 mr-1" />
                              <span className="text-sm">{partner.mobile}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Mail className="w-3 h-3 mr-1" />
                              <span className="text-sm">{partner.email}</span>
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">
                              {partner.studentsPlaced}
                            </div>
                            <div className="text-xs text-gray-600">
                              Students Placed
                            </div>
                            <div className="flex items-center justify-center mt-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                              <span className="text-sm font-medium">
                                {partner.rating}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <button
                              onClick={() => handleContactNow(partner)}
                              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              Contact Now
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who Can Partner with Us Section */}
      <section className="pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full text-sm font-semibold mb-6">
              <Users className="w-4 h-4 mr-2" />
              Partner Categories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Who Can Partner with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Education Malaysia
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you are an individual counselor or a large recruitment
              organization, our partner program is designed to grow with you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: "🎓",
                title: "Education Consultants & Overseas Agents",
                description:
                  "Individual consultants and agencies helping students with study abroad guidance",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: "🏫",
                title: "Universities & Colleges",
                description:
                  "Educational institutions seeking international collaboration opportunities",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: "🧑‍💼",
                title: "Career Counselors & Study Abroad Advisors",
                description:
                  "Professional counselors guiding students on academic and career paths",
                gradient: "from-green-500 to-teal-500",
              },
              {
                icon: "🌐",
                title: "EdTech Platforms & Recruitment Aggregators",
                description:
                  "Technology platforms connecting students with educational opportunities",
                gradient: "from-orange-500 to-red-500",
              },
              {
                icon: "🏢",
                title: "Franchise & Regional Admission Offices",
                description:
                  "Franchise operations and regional centers for student recruitment",
                gradient: "from-indigo-500 to-blue-500",
              },
            ].map((category, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${category.gradient} rounded-2xl flex items-center justify-center mb-6 text-4xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {category.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {category.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-gray-700 max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
              <span className="font-semibold text-blue-800">
                Whether you are an individual counselor or a large recruitment
                organization
              </span>
              , our partner program is designed to grow with you.
            </p>
          </div>
        </div>
      </section>

      {/* Why Partner with Us Section */}
      <section className="py-10 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
              <CheckCircle className="w-4 h-4 mr-2" />
              Core Benefits
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Partner with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Education Malaysia
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get access to exclusive benefits and comprehensive support to grow
              your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Authorized University Access",
                description:
                  "Direct tie-ups with Malaysian public & private universities",
                color: "bg-blue-600",
                iconBg: "bg-blue-100",
                iconColor: "text-blue-600",
              },
              {
                icon: TrendingUp,
                title: "Transparent Commission Structure",
                description: "Clear, course-wise & university-wise commissions",
                color: "bg-green-600",
                iconBg: "bg-green-100",
                iconColor: "text-green-600",
              },
              {
                icon: Handshake,
                title: "Dedicated Partner Support",
                description: "Application, offer letter, visa & EMGS guidance",
                color: "bg-purple-600",
                iconBg: "bg-purple-100",
                iconColor: "text-purple-600",
              },
              {
                icon: Target,
                title: "Partner CRM & Dashboard",
                description: "Track applications, commissions & student status",
                color: "bg-cyan-600",
                iconBg: "bg-cyan-100",
                iconColor: "text-cyan-600",
              },
              {
                icon: Globe,
                title: "Marketing & Training Support",
                description: "University brochures, webinars & regular updates",
                color: "bg-orange-600",
                iconBg: "bg-orange-100",
                iconColor: "text-orange-600",
              },
              {
                icon: CheckCircle,
                title: "High Visa Success Rate",
                description: "Structured documentation & compliance process",
                color: "bg-emerald-600",
                iconBg: "bg-emerald-100",
                iconColor: "text-emerald-600",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div
                  className={`w-16 h-16 ${benefit.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <benefit.icon className={`w-8 h-8 ${benefit.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Become a Partner Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
              <Target className="w-4 h-4 mr-2" />
              Partnership Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How to Join Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Partner Network
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple 4-step process to become an authorized education partner
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {[
                {
                  step: "01",
                  title: "Register Online",
                  description: "Submit your organization & credential details",
                  icon: FileText,
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  step: "02",
                  title: "Verification & Approval",
                  description: "Compliance and background review",
                  icon: ShieldCheck,
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  step: "03",
                  title: "Access Partner Dashboard",
                  description: "View universities, courses & commissions",
                  icon: LayoutDashboard,
                  gradient: "from-green-500 to-teal-500",
                },
                {
                  step: "04",
                  title: "Start Submitting Students",
                  description:
                    "Dedicated support from application to enrollment",
                  icon: GraduationCap,
                  gradient: "from-orange-500 to-red-500",
                },
              ].map((step, index) => (
                <div key={index} className="relative group h-full">
                  <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-blue-300 h-full flex flex-col items-center">
                    <div
                      className={`absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r ${step.gradient} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                    >
                      {step.step}
                    </div>
                    <div className="flex justify-center mb-4 mt-3 group-hover:scale-110 transition-transform duration-300">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r ${step.gradient} shadow-lg shadow-blue-100`}
                      >
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm text-center leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <div className="text-blue-300 text-3xl">→</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button
                onClick={() => setShowApplicationForm(true)}
                className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <Handshake className="w-6 h-6 mr-3" />
                Apply to Become a Partner
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-10 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Partner With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our network of successful education consultants and help
              students achieve their medical education dreams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "High Success Rate",
                description:
                  "Our partners achieve 95%+ admission success rate with comprehensive support and guidance",
                color: "bg-green-500",
              },
              {
                icon: Handshake,
                title: "Trusted Network",
                description:
                  "Join a network of verified, experienced professionals with proven track records",
                color: "bg-blue-500",
              },
              {
                icon: Target,
                title: "Quality Leads",
                description:
                  "Receive pre-qualified student leads matching your expertise and location",
                color: "bg-indigo-500",
              },
              {
                icon: Award,
                title: "Recognition & Rewards",
                description:
                  "Get recognized for your achievements with awards and performance-based incentives",
                color: "bg-amber-500",
              },
              {
                icon: Shield,
                title: "Complete Support",
                description:
                  "Access to training, marketing materials, and ongoing support from our team",
                color: "bg-blue-600",
              },
              {
                icon: Globe,
                title: "Global Opportunities",
                description:
                  "Connect students with top medical universities across multiple countries",
                color: "bg-cyan-500",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div
                  className={`w-16 h-16 ${benefit.color} rounded-2xl flex items-center justify-center mb-6`}
                >
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-10 bg-gradient-to-r from-blue-800 via-blue-900 to-cyan-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <Users className="w-16 h-16 mx-auto mb-8 text-blue-200" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Join Our Network?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Become a trusted partner and help students achieve their dreams of
              studying medicine abroad. Join our growing network of successful
              education consultants across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowApplicationForm(true)}
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
              >
                Become a Partner
              </button>
              <button
                onClick={() => setShowContactTeam(true)}
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Contact Our Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Partners Button - Fixed Position */}
      {(showApplicationForm || showContactTeam) && (
        <button
          onClick={() => {
            setShowApplicationForm(false);
            setShowContactTeam(false);
          }}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
          title="Back to Partners Directory"
        >
          <Users className="w-6 h-6" />
        </button>
      )}

      {/* Contact Form Popup */}
      {selectedPartner && (
        <ContactFormPopup
          isOpen={showContactForm}
          onClose={() => {
            setShowContactForm(false);
            setSelectedPartner(null);
          }}
          partnerName={selectedPartner.name}
          partnerCompany={selectedPartner.company}
          partnerEmail={selectedPartner.email}
          partnerPhone={selectedPartner.mobile}
        />
      )}
    </div>
  );
}

export default Partners;
