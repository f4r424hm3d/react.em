import React, { useRef, useState, useEffect, use } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { handleErrors } from "../../utils/handleErrors";
import { validateSelect, validateScore } from "../../utils/validation";

const TestScores = () => {
  const testScoresRef = useRef(null);

  const [examType, setExamType] = useState("");
  const [examDate, setExamDate] = useState("");
  const [listening, setListening] = useState("");
  const [reading, setReading] = useState("");
  const [writing, setWriting] = useState("");
  const [speaking, setSpeaking] = useState("");
  const [overall, setOverall] = useState("");

  // ✅ Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ✅ Handle blur for validation
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  };

  // ✅ Field validation logic
  const validateField = (field) => {
    let error = "";

    // Only validate if exam type is selected and is not a opt-out option
    const hasExam =
      examType &&
      examType !== "I don't have this" &&
      examType !== "I will provide this later";

    if (field === "examType") {
      error = validateSelect(examType, "English exam type");
    } else if (hasExam) {
      if (field === "examDate") {
        if (!examDate) error = "Exam date is required";
      } else {
        const value = { listening, reading, writing, speaking, overall }[field];
        // Scores are required if exam is selected
        if (value === "" || value === null || value === undefined) {
          error = `${field.charAt(0).toUpperCase() + field.slice(1)} score is required`;
        } else if (isNaN(parseFloat(value))) {
          error = "Must be a valid number";
        }
      }
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  // ✅ Validate form
  const validateForm = () => {
    const newErrors = {};

    // Exam type is required
    newErrors.examType = validateSelect(examType, "English exam type");

    // Only validate other fields if exam type is selected and is not a opt-out option
    const hasExam =
      examType &&
      examType !== "I don't have this" &&
      examType !== "I will provide this later";

    if (hasExam) {
      if (!examDate) newErrors.examDate = "Exam date is required";
      if (listening === "") newErrors.listening = "Listening score is required";
      if (reading === "") newErrors.reading = "Reading score is required";
      if (writing === "") newErrors.writing = "Writing score is required";
      if (speaking === "") newErrors.speaking = "Speaking score is required";
      if (overall === "") newErrors.overall = "Overall score is required";
    }

    setErrors(newErrors);
    setTouched({
      examType: true,
      examDate: true,
      listening: true,
      reading: true,
      writing: true,
      speaking: true,
      overall: true,
    });

    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSave = async () => {
    // ✅ Validate form before submission
    if (!validateForm()) {
      toast.error("Please select an exam type");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/student/update-test-score",
        {
          english_exam_type: examType,
          date_of_exam: examDate,
          listening_score: listening,
          reading_score: reading,
          writing_score: writing,
          speaking_score: speaking,
          overall_score: overall,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Test scores updated successfully");
    } catch (error) {
      console.error(
        "Error updating test scores:",
        error.response?.data || error,
      );
      if (error.response?.data?.errors) {
        // Display backend errors inline below fields
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach((key) => {
          const errorMessages = error.response.data.errors[key];
          const errorText = Array.isArray(errorMessages)
            ? errorMessages[0]
            : errorMessages;

          // Map backend field names to frontend error state
          const fieldMap = {
            date_of_exam: "examDate",
            speaking_score: "speaking",
            listening_score: "listening",
            reading_score: "reading",
            writing_score: "writing",
            overall_score: "overall",
            english_exam_type: "examType",
          };

          const frontendField = fieldMap[key] || key;
          backendErrors[frontendField] = errorText;
        });
        setErrors((prev) => ({ ...prev, ...backendErrors }));
        toast.error("Please fix the errors below");
      } else {
        toast.error("Failed to update test scores");
      }
    }
  };

  useEffect(() => {
    const fetchTestScores = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/student/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const student = response.data.data.student;
        if (student) {
          setExamType(student.english_exam_type || "");
          setExamDate(student.date_of_exam || "");
          setListening(student.listening_score || "");
          setReading(student.reading_score || "");
          setWriting(student.writing_score || "");
          setSpeaking(student.speaking_score || "");
          setOverall(student.overall_score || "");
        }
      } catch (error) {
        console.error("Error fetching test scores:", error);
      }
    };

    fetchTestScores();
  }, []);

  return (
    <>
      <div ref={testScoresRef} className="mb-10">
        <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-4 md:p-8">
          {/* Heading */}
          <div className="mb-6 ">
            <h3 className="text-2xl font-semibold text-blue-700">
              🎯 Test Scores
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Enter your latest English exam scores
            </p>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Exam Type */}
            <div className="space-y-1 col-span-4 md:col-span-2">
              <select
                value={examType}
                onChange={(e) => {
                  setExamType(e.target.value);
                  if (errors.examType) {
                    setErrors({ ...errors, examType: "" });
                  }
                }}
                onBlur={() => handleBlur("examType")}
                className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                  errors.examType
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              >
                <option value="">Select English Exam Type</option>
                <option>I don't have this</option>
                <option>I will provide this later</option>
                <option>IELTS</option>
                <option>TOEFL</option>
                <option>PTE</option>
                <option>Duolingo English Test</option>
              </select>
              {errors.examType && (
                <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.examType}
                </p>
              )}
            </div>

            {/* Exam Date */}
            {/* Exam Date */}
            <div className="col-span-4 md:col-span-2 space-y-1">
              <input
                type="date"
                value={examDate}
                onChange={(e) => {
                  setExamDate(e.target.value);
                  if (errors.examDate) {
                    setErrors({ ...errors, examDate: "" });
                  }
                }}
                onBlur={() => handleBlur("examDate")}
                className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                  errors.examDate
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.examDate && (
                <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.examDate}
                </p>
              )}
            </div>

            {/* Scores */}
            {/* Scores */}
            <div className="col-span-4 md:col-span-1 space-y-1">
              <input
                type="text"
                value={listening}
                onChange={(e) => {
                  setListening(e.target.value);
                  if (errors.listening) {
                    setErrors({ ...errors, listening: "" });
                  }
                }}
                onBlur={() => handleBlur("listening")}
                placeholder="Listening Score"
                className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                  errors.listening
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.listening && (
                <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.listening}
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-1 space-y-1">
              <input
                type="text"
                value={reading}
                onChange={(e) => {
                  setReading(e.target.value);
                  if (errors.reading) {
                    setErrors({ ...errors, reading: "" });
                  }
                }}
                onBlur={() => handleBlur("reading")}
                placeholder="Reading Score"
                className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                  errors.reading
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.reading && (
                <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.reading}
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-1 space-y-1">
              <input
                type="text"
                value={writing}
                onChange={(e) => {
                  setWriting(e.target.value);
                  if (errors.writing) {
                    setErrors({ ...errors, writing: "" });
                  }
                }}
                onBlur={() => handleBlur("writing")}
                placeholder="Writing Score"
                className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                  errors.writing
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.writing && (
                <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.writing}
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-1 space-y-1">
              <input
                type="text"
                value={speaking}
                onChange={(e) => {
                  setSpeaking(e.target.value);
                  if (errors.speaking) {
                    setErrors({ ...errors, speaking: "" });
                  }
                }}
                onBlur={() => handleBlur("speaking")}
                placeholder="Speaking Score"
                className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                  errors.speaking
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.speaking && (
                <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.speaking}
                </p>
              )}
            </div>
            <div className="col-span-4 md:col-span-1 space-y-1">
              <input
                type="text"
                value={overall}
                onChange={(e) => {
                  setOverall(e.target.value);
                  if (errors.overall) {
                    setErrors({ ...errors, overall: "" });
                  }
                }}
                onBlur={() => handleBlur("overall")}
                placeholder="Overall Score"
                className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                  errors.overall
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.overall && (
                <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.overall}
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

export default TestScores;
