import React from "react";
import { useRef } from "react";
import api from "../../api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handleErrors } from "../../utils/handleErrors";
import { validateSelect, validateRequired } from "../../utils/validation";

const EducationSummary = () => {
  const educationRef = useRef(null);
  const [countriesData, setCountriesData] = useState([]);
  const [levels, setLevels] = useState([]);

  const [country, setCountry] = useState("");
  const [level, setLevel] = useState("");
  const [gradingScheme, setGradingScheme] = useState("");
  const [gradeAverage, setGradeAverage] = useState("");

  // ✅ Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ✅ Validate field on blur
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  };

  // ✅ Field validation logic
  const validateField = (field) => {
    let error = "";

    switch (field) {
      case "country":
        error = validateSelect(country, "country of education");
        break;
      case "level":
        error = validateSelect(level, "highest level of education");
        break;
      case "gradingScheme":
        error = validateSelect(gradingScheme, "grading scheme");
        break;
      case "gradeAverage":
        error = validateRequired(gradeAverage, "grade average");
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  // ✅ Validate form
  const validateForm = () => {
    const newErrors = {};

    newErrors.country = validateSelect(country, "country of education");
    newErrors.level = validateSelect(level, "highest level of education");
    newErrors.gradingScheme = validateSelect(gradingScheme, "grading scheme");
    newErrors.gradeAverage = validateRequired(gradeAverage, "grade average");

    setErrors(newErrors);
    setTouched({
      country: true,
      level: true,
      gradingScheme: true,
      gradeAverage: true,
    });

    return !Object.values(newErrors).some((error) => error !== "");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/countries");
        const countries = Array.isArray(res.data) ? res.data : res.data.data;
        setCountriesData(countries);
        const levelsResponse = await api.get("/levels");
        const levels = levelsResponse.data.data;
        setLevels(levels);

        const response = await api.get("/student/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Bearer token header
          },
        });
        const education = response.data.data.student;
        // console.log(education);

        if (education) {
          setCountry(education.country_of_education || "");
          setLevel(education.highest_level_of_education || "");
          setGradingScheme(education.grading_scheme || "");
          setGradeAverage(education.grade_average || "");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    // ✅ Validate form before submission
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/student/education-summary",
        {
          country_of_education: country,
          highest_level_of_education: level,
          grading_scheme: gradingScheme,
          grade_average: gradeAverage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Education summary updated successfully");
    } catch (error) {
      console.error(
        "Error updating education summary:",
        error.response.data.errors || error,
      );
      if (error.response?.data?.errors) {
        handleErrors(error.response.data.errors);
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update education summary",
        );
      }
    }
  };

  return (
    <>
      <div ref={educationRef} className="mb-10">
        <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-4 md:p-8">
          {/* Heading */}
          <div className="mb-6 ">
            <h3 className="text-2xl font-semibold text-blue-700">
              🎓 Education Summary
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Provide your latest education details
            </p>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Country of Education */}
            <div className="space-y-1">
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  if (errors.country) {
                    setErrors({ ...errors, country: "" });
                  }
                }}
                onBlur={() => handleBlur("country")}
                className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                  errors.country
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              >
                <option value="">Select Country of Education</option>
                {countriesData.map((country) => (
                  <option key={country.id} value={country.name}>
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

            {/* Highest Level */}
            <div className="space-y-1">
              <select
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value);
                  if (errors.level) {
                    setErrors({ ...errors, level: "" });
                  }
                }}
                onBlur={() => handleBlur("level")}
                className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                  errors.level
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              >
                <option value="">Select Highest Level</option>
                {levels.map((level) => (
                  <option key={level.id} value={level.name}>
                    {level.level}
                  </option>
                ))}
              </select>
              {errors.level && (
                <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.level}
                </p>
              )}
            </div>

            {/* Grading Scheme */}
            <div className="space-y-1">
              <select
                value={gradingScheme}
                onChange={(e) => {
                  setGradingScheme(e.target.value);
                  if (errors.gradingScheme) {
                    setErrors({ ...errors, gradingScheme: "" });
                  }
                }}
                onBlur={() => handleBlur("gradingScheme")}
                className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                  errors.gradingScheme
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              >
                <option value="">Select Grading Scheme</option>
                <option value="Percentage">Percentage</option>
                <option value="CGPA">CGPA</option>
                <option value="GPA">GPA</option>
                <option value="Grade (A to E)">Grade (A to E)</option>
              </select>
              {errors.gradingScheme && (
                <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.gradingScheme}
                </p>
              )}
            </div>

            {/* Grade Average */}
            <div className="space-y-1">
              <input
                type="text"
                value={gradeAverage}
                onChange={(e) => {
                  setGradeAverage(e.target.value);
                  if (errors.gradeAverage) {
                    setErrors({ ...errors, gradeAverage: "" });
                  }
                }}
                onBlur={() => handleBlur("gradeAverage")}
                placeholder="Enter Grade Average"
                className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                  errors.gradeAverage
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.gradeAverage && (
                <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.gradeAverage}
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
            <button className="px-6 py-2 rounded-xl bg-gray-500 hover:bg-gray-700 text-white shadow-md transition">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EducationSummary;
