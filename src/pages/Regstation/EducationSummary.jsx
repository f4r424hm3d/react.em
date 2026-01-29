import React from 'react'
import { useRef } from 'react'
import api from '../../api';
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { handleErrors } from '../../utils/handleErrors';

const EducationSummary = () => {
  const educationRef = useRef(null);
  const [countriesData, setCountriesData] = useState([]);
  const [levels, setLevels] = useState([]);

  const [country, setCountry] = useState("");
  const [level, setLevel] = useState("");
  const [gradingScheme, setGradingScheme] = useState("");
  const [gradeAverage, setGradeAverage] = useState("");

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
;
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
        }
      );
      toast.success("Education summary updated successfully");
    } catch (error) {
      console.error("Error updating education summary:", error.response.data.errors || error);
      if (error.response?.data?.errors) {
        handleErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || "Failed to update education summary");
      }
    }
  };

  return (
    <>
      <div ref={educationRef} className="mb-10">
        <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8">
          {/* Heading */}
          <div className="mb-6 ">
            <h3 className="text-2xl font-semibold text-blue-700">🎓 Education Summary</h3>
            <p className="text-gray-500 text-sm mt-1">Provide your latest education details</p>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Country of Education */}
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select Country of Education</option>
              {countriesData.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>

            {/* Highest Level */}
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select Highest Level</option>
              {levels.map((level) => (
                <option key={level.id} value={level.name}>
                  {level.level}
                </option>
              ))}
            </select>

            {/* Grading Scheme */}
            <select
              value={gradingScheme}
              onChange={(e) => setGradingScheme(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select Grading Scheme</option>
              <option value="Percentage">Percentage</option>
              <option value="CGPA">CGPA</option>
              <option value="GPA">GPA</option>
              <option value="Grade (A to E)">Grade (A to E)</option>
            </select>

            {/* Grade Average */}
            <input
              type="text"
              value={gradeAverage}
              onChange={(e) => setGradeAverage(e.target.value)}
              placeholder="Enter Grade Average"
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
            <button className="px-6 py-2 rounded-xl bg-gray-500 hover:bg-gray-700 text-white shadow-md transition">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default EducationSummary
