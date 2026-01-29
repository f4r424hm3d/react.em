import React, { useState, useRef, useEffect } from "react";
import ProfileCard from "./ProfileCard";
import api from "../../api";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import EducationSummary from "./EducationSummary";
import SchoolAdd from "./SchoolAdd";
import TestScores from "./TestScores";
import AdditionalQualifications from "./AdditionalQualifications";
import BackgroundInformation from "./BackgroundInformation";
import DocumentUpload from "./DocumentUpload";
import { handleErrors } from "../../utils/handleErrors";


const Profile = () => {
  const [activeTab, setActiveTab] = useState("general");
  const generalRef = useRef(null);
  const educationRef = useRef(null);
  const testScoresRef = useRef(null);
  const backgroundRef = useRef(null);
  const uploadRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    c_code: "",
    father: "",
    mother: "",
    dob: "",
    first_language: "",
    nationality: "",
    passport_number: "",
    passport_expiry: "",
    marital_status: "",
    gender: "",
    home_address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    home_contact_number: "",
  });

  const token = localStorage.getItem("token"); // token from localStorage

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save API call
  const handleSave = async () => {
    try {
      const response = await api.post(
        "/student/personal-information",
        null, // body empty because API requires query params
        {
          params: formData, // send as query parameters
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Saved:", response.data);
      toast.success("Personal Information Updated Successfully!");
    } catch (error) {
      console.error("API Error:", error.response?.data || error);
      if (error.response?.data?.errors) {
        handleErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || "Failed to update. Please try again.");
      }
    }
  };

  // Cancel button (reset form)
  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      c_code: "",
      father: "",
      mother: "",
      dob: "",
      first_language: "",
      nationality: "",
      passport_number: "",
      passport_expiry: "",
      marital_status: "",
      gender: "",
      home_address: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
      home_contact_number: "",
    });
  };

  const handleTabClick = (tab, ref) => {
    setActiveTab(tab);
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  const [qualifications, setQualifications] = useState({
    gre1: true,
    gre2: true,
    sat: true,
  });

  const toggle = (key) => {
    setQualifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countriesData, setCountriesData] = useState([]);
  const [phoneCode, setPhoneCode] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ token login ke baad save kiya tha
        if (!token) {
          toast.error("No token found, please login again");
          return;
        }

        const res = await api.get("/student/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Bearer token header
          },
        });

        setStudent(res.data.data.student);
        // pre-fill formData from API response
        setFormData(res.data.data.student);
        // console.log("Profile data fetched successfully:", res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        toast.error("Failed to load profile Detail");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/countries");
        const countries = Array.isArray(res.data) ? res.data : res.data.data;
        setCountriesData(countries);

        const response = await api.get("/phonecodes");
        const phonecode = Array.isArray(response.data)
          ? response.data
          : response.data.data;
        setPhoneCode(phonecode);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <p className="text-center -mt-0">
        {" "}
        <ClipLoader color="#2563eb" size={30} />
      </p>
    );

  if (!student)
    return <p className="text-center mt-6 text-red-500">No profile data</p>;

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen p-4 md:p-6 md:items-start">
      {/* ✅ Sidebar */}
      <ProfileCard />

      {/* Right Section */}
      <div className="relative w-full md:w-3/4 bg-white rounded-2xl mt-6 md:mt-0 md:ml-6 shadow-xl">
        {/* Tabs */}
        <div className="sticky top-14 z-20 flex flex-wrap gap-3 py-3 text-sm font-semibold max-w-5xl mx-auto bg-white">
          <button
            onClick={() => handleTabClick("general", generalRef)}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 whitespace-nowrap ${
              activeTab === "general"
                ? "bg-blue-100 text-blue-700 shadow-md"
                : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            }`}
          >
            General Information
          </button>

          <button
            onClick={() => handleTabClick("education", educationRef)}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 whitespace-nowrap ${
              activeTab === "education"
                ? "bg-blue-100 text-blue-700 shadow-md"
                : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            }`}
          >
            Education History
          </button>

          <button
            onClick={() => handleTabClick("testScores", testScoresRef)}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 whitespace-nowrap ${
              activeTab === "testScores"
                ? "bg-blue-100 text-blue-700 shadow-md"
                : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            }`}
          >
            Test Scores
          </button>

          <button
            onClick={() =>
              handleTabClick("Background Information", backgroundRef)
            }
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 whitespace-nowrap ${
              activeTab === "Background Information"
                ? "bg-blue-100 text-blue-700 shadow-md"
                : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            }`}
          >
            Background Information
          </button>

          <button
            onClick={() => handleTabClick("Upload Documents", uploadRef)}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 whitespace-nowrap ${
              activeTab === "Upload Documents"
                ? "bg-blue-100 text-blue-700 shadow-md"
                : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            }`}
          >
            Upload Documents
          </button>
        </div>

        {/* ✅ Personal Information */}
        <div ref={generalRef} className="mb-10">
          <div className=" w-full max-w-5xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8">
            {/* Heading */}
            <div className="mb-6 ">
              <h3 className="text-2xl font-semibold text-blue-700">
                👤 Personal Information
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Fill in your personal and passport details
              </p>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />

              {/* Phone Number with Country Code */}
              <div className="flex">
                <select
                  name="c_code"
                  value={formData.c_code}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-l-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="">Code</option>
                  {Array.isArray(phoneCode) &&
                    phoneCode.map((code, idx) => (
                      <option key={idx} value={code.phonecode}>
                        +{code.phonecode}
                      </option>
                    ))}
                </select>
                <input
                  type="text"
                  name="mobile"
                  placeholder="Mobile"
                  value={formData.mobile}
                  required
                  onChange={handleChange}
                  className="border border-gray-300 rounded-r-xl p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <input
                type="text"
                name="father"
                placeholder="Father Name"
                value={formData.father}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <input
                type="text"
                name="mother"
                placeholder="Mother Name"
                value={formData.mother}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <input
                type="date"
                name="dob"
                placeholder="Date of Birth"
                value={formData.dob}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <input
                type="text"
                name="first_language"
                placeholder="First Language"
                value={formData.first_language}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />

              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="">Country of Citizenship</option>
                {countriesData.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="passport_number"
                placeholder="Passport Number"
                value={formData.passport_number}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <input
                type="text"
                name="passport_expiry"
                placeholder="Passport Expiry Date"
                value={formData.passport_expiry}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <select
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
              </select>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Address Detail */}
            <div className="mt-10">
              <h3 className="text-2xl font-semibold text-blue-700 mb-2">
                📍 Address Detail
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                ℹ️ Please make sure to enter the student's{" "}
                <b>residential address</b>. Organization address will not be
                accepted.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="home_address"
                  placeholder="Enter Address"
                  value={formData.home_address}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-xl p-3 col-span-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="Enter City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="Enter State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="">Select Country</option>
                  {countriesData.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="zipcode"
                  placeholder="Enter Postal / Zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <input
                  type="text"
                  name="home_contact_number"
                  placeholder="Enter Home Contact Number"
                  value={formData.home_contact_number}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 rounded-xl bg-gray-500 hover:bg-gray-700 text-white shadow-md transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <div ref={educationRef}>
          <EducationSummary />
          <SchoolAdd />
          <AdditionalQualifications />
        </div>
        <div ref={testScoresRef}>
          <TestScores />
        </div>
        <div ref={backgroundRef}>
          <BackgroundInformation />
        </div>
        <div ref={uploadRef}>
          <DocumentUpload />
        </div>
      </div>
    </div>
  );
};

export default Profile;
