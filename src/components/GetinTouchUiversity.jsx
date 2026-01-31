import { useState, useEffect } from "react";
import api from "../api";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaVoicemail,
  FaBook,
  FaFlag,
  FaPaperPlane,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

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
    interested_program: "",
    captchaInput: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0 });
  const [countriesData, setCountriesData] = useState([]);
  const [program, setProgram] = useState([]);

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50";
  const { slug } = useParams();

  useEffect(() => {
    const num1 = Math.floor(Math.random() * 10) + 5;
    const num2 = Math.floor(Math.random() * 5);
    setCaptcha({ num1, num2 });

    const fetchData = async () => {
      try {
        const res = await api.get("/countries");
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setCountriesData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching country data:", err);
        setCountriesData([]);
      }
    };

    fetchData();
  }, []);




  useEffect(() => {
    const fetchAllPrograms = async () => {
      try {
        let allPrograms = [];
        let page = 1;
        let lastPage = 1;

        do {
          const response = await api.get(`/university-courses/${slug}?page=${page}`);
          const data = response.data.programs;

          if (data?.data) {
            allPrograms = [...allPrograms, ...data.data]; // merge all courses
          }

          lastPage = data?.last_page || 1;
          page++;
        } while (page <= lastPage);

        setProgram(allPrograms);
      } catch (err) {
        console.error("Error fetching all programs:", err);
        setProgram([]);
      }
    };

    fetchAllPrograms();
  }, [slug]);






  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // ✅ Smart Country Code Handler - Auto-sync Nationality
  const handleCountryCodeChange = (e) => {
    const code = e.target.value;
    let newFormData = { ...formData, country_code: code };

    // Sync Nationality from Country Code
    const numericCode = code.replace(/^\+/, '');
    if (numericCode) {
      const matchedCountry = countriesData.find(c => c.phonecode == numericCode);
      if (matchedCountry) {
        newFormData.nationality = matchedCountry.name;
      }
    }

    setFormData(newFormData);
  };

  // ✅ Smart Nationality Handler - Auto-sync Country Code
  const handleNationalityChange = (e) => {
    const selectedCountryName = e.target.value;
    let newFormData = { ...formData, nationality: selectedCountryName };

    // Find the country object to get the phone code
    const matchedCountry = countriesData.find(c => c.name === selectedCountryName);
    if (matchedCountry && matchedCountry.phonecode) {
      newFormData.country_code = `+${matchedCountry.phonecode}`;
    }

    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const expectedAnswer = captcha.num1 - captcha.num2;
    if (parseInt(formData.captchaInput) !== expectedAnswer) {
      setError("Captcha is incorrect. Please try again.");
      return;
    }
    if (!formData.agree) {
      setError("You must agree to the Terms and Privacy Statement.");
      return;
    }
    setError("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        country_code: formData.country_code.replace("+", ""),
        mobile: formData.phone,
        nationality: formData.nationality,
        university_id: 49, // static for now, replace dynamically if needed
        source: "Education Malaysia - University Profile Page",
        source_path: window.location.href,
        interested_program: formData.interested_program,
      };

      const res = await api.post("/inquiry/university-profile-form", payload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (res.status === 200) {
        toast.success("Form submitted successfully!");
        setFormData({
          name: "",
          email: "",
          country_code: "+91",
          phone: "",
          nationality: "",
          interested_program: "",
          captchaInput: "",
          agree: false,
          university_id: "",
          source: "",
          source_path: "",
        });
      } else {
        setError("Something went wrong. Please try again.");
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("API Error:", err.response?.data || err);
      setError("Failed to submit the form. Please try again later.");
      toast.error(err.response?.data?.message || "Failed to submit the form. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full">

        <form
          onSubmit={handleSubmit}
          className="bg-white w-full px-4 py-4 rounded-2xl border border-gray-200 shadow-sm"
        >
          {/* Heading Section (Perfect Horizontal Alignment) */}
          <div className="flex items-center justify-center gap-3 mb-4 mt-0">
            <FaPaperPlane className="text-blue-600 text-3xl" />
            <h2 className="text-3xl font-bold text-gray-800">
              Get In Touch
            </h2>
          </div>


          {/* Removed ALL top spacing inside form */}
          <div className="grid gap-5 mt-0 pt-0">

            <div className="grid grid-cols-1 md:grid-cols-1 gap-5 mt-0 pt-0">
              {/* Full Name */}
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

              {/* Email */}
              <InputWithIcon
                icon={<FaVoicemail />}
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            {/* Phone Code + Phone */}
            <div className="flex gap-3 mt-0 pt-0">
              <select
                name="country_code"
                value={formData.country_code}
                onChange={handleCountryCodeChange}
                className="w-1/5 appearance-none border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
              >
                <option value="+91">+91</option>
                {countriesData.map((c) => (
                  <option key={c.id} value={`+${c.phonecode}`}>
                    +{c.phonecode}
                  </option>
                ))}
              </select>

              <InputWithIcon
                icon={<FaPhoneAlt />}
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-[115%] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
              />

              <InputWithIcon type="hidden" name="source" value={formData.source} />
              <InputWithIcon type="hidden" name="source_path" value={formData.source_path} />
            </div>

            {/* Nationality */}
            <div className="relative mt-0 pt-0">
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

            {/* Program */}
            <div className="relative mt-0 pt-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaBook />
              </div>

              <select
                name="interested_program"
                value={formData.interested_program}
                onChange={handleChange}
                required
                className={`${inputClass} pl-10 bg-white appearance-none`}
              >
                <option value="">Select program</option>
                {Array.isArray(program) &&
                  program.map((p) => (
                    <option key={p.id} value={p.course_name}>
                      {p.course_name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Captcha */}
            <div className="bg-gray-100 p-4 rounded-lg flex flex-col sm:flex-row items-center gap-4 mt-4">
              <span className="text-sm text-gray-700 flex-shrink-0 font-semibold">
                Captcha: {captcha.num1} - {captcha.num2} = ?
              </span>

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

            {/* Terms */}
            <div className="flex items-start gap-3 text-sm text-gray-600 mt-0 pt-0">
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
                <a className="text-blue-600 hover:underline font-medium">
                  Terms and Privacy Statement
                </a>
              </label>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 text-center bg-red-50 p-2 rounded-md border border-red-200">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 text-base"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default GetInTouchForm;
