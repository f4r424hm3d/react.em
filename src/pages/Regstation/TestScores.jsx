import React, { useRef, useState,useEffect, use } from 'react';
import api from '../../api';
import { toast } from "react-toastify";
import { handleErrors } from '../../utils/handleErrors';

const TestScores = () => {
  const testScoresRef = useRef(null);

  const [examType, setExamType] = useState("");
  const [examDate, setExamDate] = useState("");
  const [listening, setListening] = useState("");
  const [reading, setReading] = useState("");
  const [writing, setWriting] = useState("");
  const [speaking, setSpeaking] = useState("");
  const [overall, setOverall] = useState("");

  const handleSave = async () => {
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
        }
      );
      toast.success("Test scores updated successfully");
    } catch (error) {
      console.error("Error updating test scores:", error.response?.data || error);
      if (error.response?.data?.errors) {
        handleErrors(error.response.data.errors);
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
        <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8">
          {/* Heading */}
          <div className="mb-6 ">
            <h3 className="text-2xl font-semibold text-blue-700">🎯 Test Scores</h3>
            <p className="text-gray-500 text-sm mt-1">Enter your latest English exam scores</p>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Exam Type */}
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select English Exam Type</option>
              <option>I don't have this</option>
              <option>I will provide this later</option>
              <option>IELTS</option>
              <option>TOEFL</option>
              <option>PTE</option>
              <option>Duolingo English Test</option>
            </select>

            {/* Exam Date */}
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />

            {/* Scores */}
            <input
              type="text"
              value={listening}
              onChange={(e) => setListening(e.target.value)}
              placeholder="Listening Score"
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <input
              type="text"
              value={reading}
              onChange={(e) => setReading(e.target.value)}
              placeholder="Reading Score"
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <input
              type="text"
              value={writing}
              onChange={(e) => setWriting(e.target.value)}
              placeholder="Writing Score"
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <input
              type="text"
              value={speaking}
              onChange={(e) => setSpeaking(e.target.value)}
              placeholder="Speaking Score"
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <input
              type="text"
              value={overall}
              onChange={(e) => setOverall(e.target.value)}
              placeholder="Overall Score"
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
};

export default TestScores;
