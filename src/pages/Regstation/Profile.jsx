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
import {
  validateEmail,
  validateRequired,
  validateName,
  validatePhone,
  validatePassport,
  validateDateOfBirth,
  validateZipcode,
  validateSelect,
} from "../../utils/validation";

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

  // ✅ Validation state similar to Login form
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const token = localStorage.getItem("token"); // token from localStorage

  // ✅ Handle input changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Validate on change if field was touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  // ✅ Auto-sync country code with nationality
  const handleNationalityChange = (e) => {
    const selectedCountry = e.target.value;
    setFormData({ ...formData, nationality: selectedCountry });

    // Clear errors
    if (errors.nationality) {
      setErrors({ ...errors, nationality: "" });
    }

    // Auto-select matching country code
    if (
      selectedCountry &&
      Array.isArray(countriesData) &&
      countriesData.length > 0
    ) {
      console.log("🌍 Selected Country:", selectedCountry);
      console.log("🌍 Countries Data:", countriesData);

      // Find the matching country
      const matchingCountry = countriesData.find(
        (c) =>
          c.name === selectedCountry ||
          c.name?.toLowerCase() === selectedCountry?.toLowerCase(),
      );

      console.log("🌍 Matching Country Object:", matchingCountry);

      if (matchingCountry && Array.isArray(phoneCode) && phoneCode.length > 0) {
        console.log("📞 Phone Code Data:", phoneCode);

        // Try multiple matching strategies
        let matchingCode = null;

        // Strategy 1: Match by ISO code
        if (matchingCountry.code) {
          matchingCode = phoneCode.find(
            (code) =>
              code.iso === matchingCountry.code ||
              code.iso === matchingCountry.code.toUpperCase() ||
              code.iso === matchingCountry.code.toLowerCase() ||
              code.iso2 === matchingCountry.code ||
              code.iso3 === matchingCountry.code,
          );
        }

        // Strategy 2: Match by country name
        if (!matchingCode && matchingCountry.name) {
          matchingCode = phoneCode.find(
            (code) =>
              code.name === matchingCountry.name ||
              code.name?.toLowerCase() ===
                matchingCountry.name?.toLowerCase() ||
              code.country === matchingCountry.name ||
              code.country?.toLowerCase() ===
                matchingCountry.name?.toLowerCase(),
          );
        }

        // Strategy 3: Match by nicename field
        if (!matchingCode && matchingCountry.nicename) {
          matchingCode = phoneCode.find(
            (code) =>
              code.name === matchingCountry.nicename ||
              code.country === matchingCountry.nicename,
          );
        }

        console.log("📞 Matching Phone Code:", matchingCode);

        if (matchingCode) {
          setFormData((prev) => ({
            ...prev,
            c_code: matchingCode.phonecode,
            nationality: selectedCountry,
          }));
          console.log("✅ Country Code updated to:", matchingCode.phonecode);
        } else {
          console.log("❌ No matching phone code found");
          console.log("Available phone code fields:", phoneCode[0]); // Show first entry structure
        }
      }
    }

    // Validate if touched
    if (touched.nationality) {
      validateField("nationality", selectedCountry);
    }
  };

  // ✅ Auto-sync nationality with country code
  const handleCountryCodeChange = (e) => {
    const selectedCode = e.target.value;
    setFormData({ ...formData, c_code: selectedCode });

    // Clear errors
    if (errors.c_code) {
      setErrors({ ...errors, c_code: "" });
    }

    // Auto-select matching nationality
    if (selectedCode && Array.isArray(phoneCode) && phoneCode.length > 0) {
      console.log("Selected Code:", selectedCode);
      console.log("Phone Code Data:", phoneCode);

      // Find the matching phone code entry
      const matchingPhoneCode = phoneCode.find(
        (code) =>
          code.phonecode === selectedCode ||
          code.phonecode === selectedCode.replace("+", "") ||
          String(code.phonecode) === String(selectedCode),
      );

      console.log("Matching Phone Code:", matchingPhoneCode);

      if (
        matchingPhoneCode &&
        Array.isArray(countriesData) &&
        countriesData.length > 0
      ) {
        console.log("Countries Data:", countriesData);

        // Try multiple matching strategies
        let matchingCountry = null;

        // Strategy 1: Match by ISO code
        if (matchingPhoneCode.iso) {
          matchingCountry = countriesData.find(
            (c) =>
              c.code === matchingPhoneCode.iso ||
              c.iso === matchingPhoneCode.iso ||
              c.code === matchingPhoneCode.iso.toUpperCase() ||
              c.code === matchingPhoneCode.iso.toLowerCase(),
          );
        }

        // Strategy 2: Match by country name
        if (!matchingCountry && matchingPhoneCode.name) {
          matchingCountry = countriesData.find(
            (c) =>
              c.name === matchingPhoneCode.name ||
              c.name?.toLowerCase() === matchingPhoneCode.name?.toLowerCase(),
          );
        }

        // Strategy 3: Match by country field in phoneCode
        if (!matchingCountry && matchingPhoneCode.country) {
          matchingCountry = countriesData.find(
            (c) =>
              c.name === matchingPhoneCode.country ||
              c.name?.toLowerCase() ===
                matchingPhoneCode.country?.toLowerCase(),
          );
        }

        console.log("Matching Country:", matchingCountry);

        if (matchingCountry) {
          setFormData((prev) => ({
            ...prev,
            nationality: matchingCountry.name,
            c_code: selectedCode,
          }));
          console.log("✅ Nationality updated to:", matchingCountry.name);
        } else {
          console.log("❌ No matching country found");
        }
      }
    }

    // Validate if touched
    if (touched.c_code) {
      validateField("c_code", selectedCode);
    }
  };

  // ✅ Validate field on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  // ✅ Field validation logic
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        error = validateName(value, "Full name");
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "mobile":
        error = validatePhone(value, "Mobile number");
        break;
      case "c_code":
        error = validateSelect(value, "country code");
        break;
      case "father":
        error = validateName(value, "Father's name");
        break;
      case "mother":
        error = validateName(value, "Mother's name");
        break;
      case "dob":
        error = validateDateOfBirth(value);
        break;
      case "first_language":
        error = validateRequired(value, "First language");
        break;
      case "nationality":
        error = validateSelect(value, "nationality");
        break;
      case "passport_number":
        error = validatePassport(value);
        break;
      case "passport_expiry":
        error = validateRequired(value, "Passport expiry date");
        break;
      case "marital_status":
        error = validateSelect(value, "marital status");
        break;
      case "gender":
        error = validateSelect(value, "gender");
        break;
      case "home_address":
        error = validateRequired(value, "Home address");
        break;
      case "city":
        error = validateRequired(value, "City");
        break;
      case "state":
        error = validateRequired(value, "State");
        break;
      case "country":
        error = validateSelect(value, "country");
        break;
      case "zipcode":
        error = validateZipcode(value);
        break;
      case "home_contact_number":
        error = validatePhone(value, "Home contact number");
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  // ✅ Validate all fields before submit
  const validateForm = () => {
    const newErrors = {};

    // Validate all required fields
    newErrors.name = validateName(formData.name, "Full name");
    newErrors.email = validateEmail(formData.email);
    newErrors.mobile = validatePhone(formData.mobile, "Mobile number");
    newErrors.c_code = validateSelect(formData.c_code, "country code");
    newErrors.father = validateName(formData.father, "Father's name");
    newErrors.mother = validateName(formData.mother, "Mother's name");
    newErrors.dob = validateDateOfBirth(formData.dob);
    newErrors.first_language = validateRequired(
      formData.first_language,
      "First language",
    );
    newErrors.nationality = validateSelect(formData.nationality, "nationality");
    newErrors.passport_number = validatePassport(formData.passport_number);
    newErrors.passport_expiry = validateRequired(
      formData.passport_expiry,
      "Passport expiry date",
    );
    newErrors.marital_status = validateSelect(
      formData.marital_status,
      "marital status",
    );
    newErrors.gender = validateSelect(formData.gender, "gender");
    newErrors.home_address = validateRequired(
      formData.home_address,
      "Home address",
    );
    newErrors.city = validateRequired(formData.city, "City");
    newErrors.state = validateRequired(formData.state, "State");
    newErrors.country = validateSelect(formData.country, "country");
    newErrors.zipcode = validateZipcode(formData.zipcode);
    newErrors.home_contact_number = validatePhone(
      formData.home_contact_number,
      "Home contact number",
    );

    setErrors(newErrors);

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error !== "");
  };

  // Save API call with validation
  const handleSave = async () => {
    // ✅ Validate form before submission
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      // Scroll to first error
      const firstErrorField = Object.keys(errors).find((key) => errors[key]);
      if (firstErrorField) {
        document.getElementsByName(firstErrorField)[0]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    try {
      const response = await api.post(
        "/student/personal-information",
        null, // body empty because API requires query params
        {
          params: formData, // send as query parameters
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("✅ Saved:", response.data);
      toast.success("Personal Information Updated Successfully!");
    } catch (error) {
      console.error("API Error:", error.response?.data || error);
      if (error.response?.data?.errors) {
        handleErrors(error.response.data.errors);
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to update. Please try again.",
        );
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

  // ✅ Scroll Spy to update active tab on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "general", ref: generalRef },
        { id: "education", ref: educationRef },
        { id: "testScores", ref: testScoresRef },
        { id: "Background Information", ref: backgroundRef },
        { id: "Upload Documents", ref: uploadRef },
      ];

      for (const section of sections) {
        const element = section.ref.current;
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if the section is crossing the "active line" (approx 180px from top)
          if (rect.top <= 180 && rect.bottom >= 180) {
            setActiveTab((prev) => (prev !== section.id ? section.id : prev));
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        {/* Tabs */}
        <div className="sticky top-14 z-20 bg-white border-b md:border-none shadow-sm md:shadow-none">
          <div className="flex overflow-x-auto md:flex-wrap gap-3 py-3 px-4 text-sm font-semibold max-w-5xl mx-auto scrollbar-hide">
            <button
              onClick={() => handleTabClick("general", generalRef)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                activeTab === "general"
                  ? "bg-blue-100 text-blue-700 shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              General Information
            </button>

            <button
              onClick={() => handleTabClick("education", educationRef)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                activeTab === "education"
                  ? "bg-blue-100 text-blue-700 shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              Education History
            </button>

            <button
              onClick={() => handleTabClick("testScores", testScoresRef)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
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
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                activeTab === "Background Information"
                  ? "bg-blue-100 text-blue-700 shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              Background Information
            </button>

            <button
              onClick={() => handleTabClick("Upload Documents", uploadRef)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                activeTab === "Upload Documents"
                  ? "bg-blue-100 text-blue-700 shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              Upload Documents
            </button>
          </div>
        </div>

        {/* ✅ Personal Information */}
        <div ref={generalRef} className="mb-10">
          <div className=" w-full max-w-5xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-4 md:p-8">
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
              {/* Full Name */}
              <div className="space-y-1">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                    errors.name
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number with Country Code */}
              <div className="space-y-1">
                <div className="flex">
                  <select
                    name="c_code"
                    value={formData.c_code}
                    onChange={handleCountryCodeChange}
                    onBlur={handleBlur}
                    className={`border rounded-l-xl p-3 focus:ring-2 outline-none transition ${
                      errors.c_code
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`border rounded-r-xl p-3 w-full focus:ring-2 outline-none transition ${
                      errors.mobile
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>
                {(errors.c_code || errors.mobile) && (
                  <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.c_code || errors.mobile}
                  </p>
                )}
              </div>

              {/* Father Name */}
              <div className="space-y-1">
                <input
                  type="text"
                  name="father"
                  placeholder="Father Name"
                  value={formData.father}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                    errors.father
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {errors.father && (
                  <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.father}
                  </p>
                )}
              </div>

              {/* Mother Name */}
              <div className="space-y-1">
                <input
                  type="text"
                  name="mother"
                  placeholder="Mother Name"
                  value={formData.mother}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                    errors.mother
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {errors.mother && (
                  <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.mother}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1">
                <input
                  type="date"
                  name="dob"
                  placeholder="Date of Birth"
                  value={formData.dob}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                    errors.dob
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {errors.dob && (
                  <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.dob}
                  </p>
                )}
              </div>

              {/* First Language */}
              <div className="space-y-1">
                <input
                  type="text"
                  name="first_language"
                  placeholder="First Language"
                  value={formData.first_language}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                    errors.first_language
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {errors.first_language && (
                  <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.first_language}
                  </p>
                )}
              </div>

              {/* Nationality */}
              <div className="space-y-1">
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleNationalityChange}
                  onBlur={handleBlur}
                  className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                    errors.nationality
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                >
                  <option value="">Country of Citizenship</option>
                  {countriesData.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.nationality && (
                  <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.nationality}
                  </p>
                )}
              </div>

              {/* Passport Number */}
              <div className="space-y-1">
                <input
                  type="text"
                  name="passport_number"
                  placeholder="Passport Number"
                  value={formData.passport_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                    errors.passport_number
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {errors.passport_number && (
                  <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.passport_number}
                  </p>
                )}
              </div>

              {/* Passport Expiry */}
              <div className="space-y-1">
                <input
                  type="date"
                  name="passport_expiry"
                  placeholder="Passport Expiry Date"
                  value={formData.passport_expiry}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                    errors.passport_expiry
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {errors.passport_expiry && (
                  <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.passport_expiry}
                  </p>
                )}
              </div>

              {/* Marital Status */}
              <div className="space-y-1">
                <select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                    errors.marital_status
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
                {errors.marital_status && (
                  <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.marital_status}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                    errors.gender
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.gender}
                  </p>
                )}
              </div>
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
                {/* Home Address */}
                <div className="col-span-2 space-y-1">
                  <input
                    type="text"
                    name="home_address"
                    placeholder="Enter Address"
                    value={formData.home_address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                      errors.home_address
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                  {errors.home_address && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.home_address}
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="space-y-1">
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter City"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                      errors.city
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                  {errors.city && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.city}
                    </p>
                  )}
                </div>

                {/* State */}
                <div className="space-y-1">
                  <input
                    type="text"
                    name="state"
                    placeholder="Enter State"
                    value={formData.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                      errors.state
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                  {errors.state && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.state}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-1">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                      errors.country
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  >
                    <option value="">Select Country</option>
                    {countriesData.map((country) => (
                      <option
                        key={country.id || country.code}
                        value={country.name}
                      >
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.country}
                    </p>
                  )}
                </div>

                {/* Zipcode */}
                <div className="space-y-1">
                  <input
                    type="text"
                    name="zipcode"
                    placeholder="Enter Postal / Zipcode"
                    value={formData.zipcode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                      errors.zipcode
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                  {errors.zipcode && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.zipcode}
                    </p>
                  )}
                </div>

                {/* Home Contact Number */}
                <div className="space-y-1">
                  <input
                    type="text"
                    name="home_contact_number"
                    placeholder="Enter Home Contact Number"
                    value={formData.home_contact_number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                      errors.home_contact_number
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                  {errors.home_contact_number && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.home_contact_number}
                    </p>
                  )}
                </div>
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
