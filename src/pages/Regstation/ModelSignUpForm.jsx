import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ScholarshipModal() {
    const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [countriesData, setCountriesData] = useState([]);
  const [levels, setLevels] = useState([]);
  const [courseCategories, setCourseCategories] = useState([]);
  const [phonecode, setPhonecode] = useState([]);

  // form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country_code: "",
    mobile: "",
    nationality: "",
    highest_qualification: "",
    interested_course_category: "",
    source_path: "",
  });

  useEffect(() => {
    const submitted = localStorage.getItem("scholarshipSubmitted");
    const closedCount = parseInt(localStorage.getItem("scholarshipClosed") || "0", 0);

    if (submitted || closedCount >= 10) return;

    const timer = setTimeout(() => {
      setOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);
    let closedCount = parseInt(localStorage.getItem("scholarshipClosed") || "0", 10);
    localStorage.setItem("scholarshipClosed", closedCount + 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/inquiry/modal-form",
        {
          ...formData,
          source_path: window.location.href, // current page
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",// <-- yaha tumhara API key
          },
        }
      );
      
if (res.data?.status) {
        const { id,  } = res.data.data;

        // save in localStorage
        localStorage.setItem("student_id", id);
      
        localStorage.setItem("scholarshipSubmitted", "true");

        // close modal
        setOpen(false);

        // navigate to confirmed email page
        navigate("/confirmed-email");
        toast.success(res.data?.message || "Form submitted successfully!");
        console.log("Form submitted successfully:", res.data.data);

      }
    } catch (error) {
      console.error("Form submit error:", error);
        console.error("API Error:", error.response?.data || error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/phonecodes");
        const phonecode = Array.isArray(response.data) ? response.data : response.data.data;
        setPhonecode(phonecode);

        const res = await api.get("/countries");
        const countries = Array.isArray(res.data) ? res.data : res.data.data;
        setCountriesData(countries);

        const levelsResponse = await api.get("/levels");
        const levels = levelsResponse.data.data;
        setLevels(levels);

        const categoriesResponse = await api.get("/course-categories");
        const categories = Array.isArray(categoriesResponse.data)
          ? categoriesResponse.data
          : categoriesResponse.data.data;
        setCourseCategories(categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn transform transition-all">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          <X size={22} />
        </button>

        <div className="absolute top-4  left-1/2 -translate-x-1/2 bg-white ">
          <img src="/logo (2).png" alt="Education Malaysia" className="h-10" />
        </div>

        <div className="p-8 pt-16">
          <h2 className="text-center font-bold text-2xl text-blue-800">
            MALAYSIA CALLING – UP TO 100% SCHOLARSHIPS!
          </h2>
          <p className="text-center text-red-600 font-semibold mt-2 text-sm">
            ( Limited Time Only! )
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
             
              <input
                type="hidden"
                name="source_path"
                placeholder=""
                value={formData.source_path=window.location.href}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="country_code"
                value={formData.country_code}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Country Code</option>
                {phonecode.map((code, idx) => (
                  <option key={idx} value={code.phonecode}>
                    +{code.phonecode} ({code.name})
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Mobile Number"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Country</option>
              {countriesData.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>

            <select
              name="highest_qualification"
              value={formData.highest_qualification}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select your qualification</option>
              {levels.map((level) => (
                <option key={level.id} value={level.level}>
                  {level.level}
                </option>
              ))}
            </select>

            <select
              name="interested_course_category"
              value={formData.interested_course_category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select a program</option>
              {courseCategories.map((courseCategories) => (
                <option key={courseCategories.id} value={courseCategories.name}>
                  {courseCategories.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold text-sm tracking-wide hover:bg-blue-900 transition-all shadow-md"
            >
              Submit
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            ( SUBMIT ONCE – NO MORE POPUPS AFTER THAT! )
          </p>
        </div>
      </div>
    </div>
  );
}
