

import { useState, useEffect } from "react";
import api from "../api";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaFlag,
  FaPaperPlane,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

const InputWithIcon = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
      {icon}
    </div>
    <input {...props} className={`${props.className} pl-10`} />
  </div>
);

const GetInTouchForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country_code: "+91",
    phone: "",
    nationality: "",
    captchaInput: "",
    agree: false,
    source: "",
    source_path: "",
  });

  const [error, setError] = useState("");
  const [phoneValid, setPhoneValid] = useState(false);
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0 });
  const [countriesData, setCountriesData] = useState([]);

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50";

  useEffect(() => {
    const num1 = Math.floor(Math.random() * 10) + 5;
    const num2 = Math.floor(Math.random() * 5);
    setCaptcha({ num1, num2 });

    const fetchData = async () => {
      try {
        const res = await api.get("/countries");
        // Ensure data is array
        const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setCountriesData(data);
      } catch (err) {
        console.error("Error fetching country data:", err);
        setCountriesData([]);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // ✅ Smart Phone Handler
  const handlePhoneChange = (e) => {
    const phoneNumber = e.target.value.replace(/\D/g, '');
    let newFormData = { ...formData, phone: phoneNumber };
    let newPhoneValid = false;
    let detectedCountryCode = null;

    if (phoneNumber.length >= 6) {
      for (const country of countriesData) {
        const pCode = country.phonecode;
        if (!pCode) continue;

        const fullNumber = `+${pCode}${phoneNumber}`;
        try {
          if (isValidPhoneNumber(fullNumber)) {
            const parsed = parsePhoneNumber(fullNumber);
            if (parsed && parsed.country) {
              detectedCountryCode = `+${pCode}`;
              newPhoneValid = true;
              break;
            }
          }
        } catch (err) { }
      }

      if (detectedCountryCode && newFormData.country_code !== detectedCountryCode) {
        newFormData.country_code = detectedCountryCode;

        // Sync Nationality from detected code
        const numericCode = detectedCountryCode.replace(/^\+/, '');
        const matchedCountry = countriesData.find(c => c.phonecode == numericCode);
        if (matchedCountry) {
          newFormData.nationality = matchedCountry.name;
        }
      } else if (!detectedCountryCode && newFormData.country_code) {
        try {
          if (isValidPhoneNumber(`${newFormData.country_code}${phoneNumber}`)) {
            newPhoneValid = true;
          }
        } catch (e) { }
      }
    }
    setPhoneValid(newPhoneValid);
    setFormData(newFormData);
  };

  const handleCountryCodeChange = (e) => {
    const code = e.target.value;
    let newFormData = { ...formData, country_code: code };

    // ✅ Sync Nationality (Code -> Nationality)
    // Remove '+' for comparison
    const numericCode = code.replace(/^\+/, '');
    if (numericCode) {
      const matchedCountry = countriesData.find(c => c.phonecode == numericCode);
      if (matchedCountry) {
        newFormData.nationality = matchedCountry.name;
      }
    }

    let newPhoneValid = false;
    if (newFormData.phone) {
      try {
        if (isValidPhoneNumber(`${code}${newFormData.phone}`)) {
          newPhoneValid = true;
        }
      } catch (e) { }
    }
    setPhoneValid(newPhoneValid);
    setFormData(newFormData);
  };

  const handleNationalityChange = (e) => {
    const selectedCountryName = e.target.value;
    let newFormData = { ...formData, nationality: selectedCountryName };

    // Find the country object to get the phone code
    const matchedCountry = countriesData.find(c => c.name === selectedCountryName);
    if (matchedCountry && matchedCountry.phonecode) {
      newFormData.country_code = `+${matchedCountry.phonecode}`;

      // Optional: Validate phone with new code immediately if phone exists
      if (newFormData.phone) {
        let newPhoneValid = false;
        try {
          if (isValidPhoneNumber(`${newFormData.country_code}${newFormData.phone}`)) {
            newPhoneValid = true;
          }
        } catch (e) { }
        setPhoneValid(newPhoneValid);
      }
    } else {
      // If no matching country or phonecode, or if nationality is reset, re-evaluate phone validity
      if (newFormData.phone) {
        let newPhoneValid = false;
        try {
          if (isValidPhoneNumber(`${newFormData.country_code}${newFormData.phone}`)) {
            newPhoneValid = true;
          }
        } catch (e) { }
        setPhoneValid(newPhoneValid);
      } else {
        setPhoneValid(false);
      }
    }
    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expectedAnswer = captcha.num1 - captcha.num2;
    if (parseInt(formData.captchaInput) !== expectedAnswer) {
      toast.error("Captcha is incorrect. Please try again.");
      return;
    }
    if (!formData.agree) {
      toast.error("You must agree to the Terms and Privacy Statement.");
      return;
    }
    if (!phoneValid) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    setError("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        country_code: formData.country_code.replace("+", ""),
        mobile: formData.phone,
        source: "Education Malaysia - Scholarship/Blog/Service Page",
        source_path: window.location.href,
        nationality: formData.nationality,
      };

      const res = await api.post(
        "/inquiry/simple-form",
        payload,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (res.status === 200) {
        toast.success("Form submitted successfully!");
        setFormData({
          name: "",
          email: "",
          country_code: "+91",
          phone: "",
          nationality: "",
          captchaInput: "",
          agree: false,
          source: "",
          source_path: "",
        });
        setPhoneValid(false);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("API Error:", err.response?.data || err);
      toast.error("Failed to submit the form. Please try again later.");
    }
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-2xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full px-6 rounded-2xl border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2 mt-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <FaPaperPlane className="text-blue-600" />
              <span>Get In Touch</span>
            </div>
          </h2>


          <div className="grid gap-4">
            {/* Name and Email - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputWithIcon
                icon={<FaUser />}
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClass}
              />

              <InputWithIcon
                icon={<FaEnvelope />}
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            {/* Country Code and Phone Number */}
            <div className="flex gap-3 w-full relative">
              <div className="w-1/3 md:w-1/4 relative">
                <select
                  name="country_code"
                  value={formData.country_code}
                  onChange={handleCountryCodeChange}
                  className="w-full appearance-none border border-gray-300 rounded-lg px-2 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  <option value="+91">+91</option>
                  {countriesData.map((c) => (
                    <option key={c.id} value={`+${c.phonecode}`}>
                      +{c.phonecode}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-gray-500">▼</div>
              </div>

              <div className="relative w-2/3 md:w-3/4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaPhoneAlt />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  required
                  className={`${inputClass} pl-10 ${phoneValid ? 'border-green-500 ring-1 ring-green-500 focus:ring-green-500' : ''}`}
                />
                {phoneValid && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                )}
              </div>
            </div>


            {/* Nationality */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaFlag />
              </div>
              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleNationalityChange}
                required
                className={`${inputClass} pl-10 bg-white appearance-none`}
              >
                <option value="">Select Nationality</option>
                {countriesData.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Captcha */}
            <div className="bg-gray-100 p-4 rounded-lg flex flex-col sm:flex-row items-center gap-4">
              <label className="text-sm font-medium text-gray-700 flex-shrink-0">
                <span className="font-semibold text-gray-700">
                  Captcha: {captcha.num1} - {captcha.num2} = ?
                </span>
              </label>
              <input
                type="text"
                name="captchaInput"
                placeholder="Your answer"
                value={formData.captchaInput}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <input
                type="checkbox"
                name="agree"
                id="agree-checkbox"
                checked={formData.agree}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="agree-checkbox">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Terms and Privacy Statement
                </a>
              </label>
            </div>

            {/* Error Message */}
{/* Error Message Removed - Handled by Toast */}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 text-base mb-4"
            >
              Submit
            </button>
          </div>

          {/* Hidden Fields */}
          <input type="hidden" name="source" value="Education Malaysia - Scholarship/Blog/Service Page" />
          <input type="hidden" name="source_path" value={window.location.href} />
        </form>
      </div>
    </div>
  );
};

export default GetInTouchForm;