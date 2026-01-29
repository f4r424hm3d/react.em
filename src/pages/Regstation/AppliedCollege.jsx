import React, { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import { Link } from "react-router-dom";
import api from "../../api";
import { MdDelete } from "react-icons/md";
import ClipLoader from "react-spinners/ClipLoader";

const AppliedCollege = () => {
  const [appliedCourses, setAppliedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplied = async () => {
      try {
        const res = await api.get("/student/applied-college", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;
        console.log(data);

        // ✅ Ensure response is always an array
        if (Array.isArray(data?.applied_programs)) {
          setAppliedCourses(data.applied_programs);
        } else {
          setAppliedCourses([]);
        }
      } catch (err) {
        console.error("Error fetching applied courses:", err);
        setAppliedCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplied();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await api.get(`/student/delete-program/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppliedCourses((prev) => prev.filter((course) => course.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  if (loading) {
    return <p className="p-6 text-center"> <ClipLoader color="#2563eb" size={30} /></p>;
  }

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen p-4 md:p-6">
      {/* Sidebar */}
      <ProfileCard />

      {/* Right Side */}
      <div className="flex-1 mt-6 md:mt-0 md:ml-6 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Your Applied Colleges
        </h2>

        {appliedCourses.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm">
            <p className="text-gray-700 mb-6">
              Nothing to show yet. You haven't applied to any colleges.
            </p>
            <Link
              to="/courses-in-malaysias"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 bg-blue-800 hover:bg-blue-900 text-white font-medium transition"
            >
              Browse Colleges
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appliedCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white border rounded-lg p-6 shadow-sm flex flex-col"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {course.university_program?.course_name}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-700">
                  <div>
                    <span className="font-semibold text-blue-800">Study Mode:</span>{" "}
                    {course.university_program?.study_mode || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold text-blue-800">Duration:</span>{" "}
                    {course.university_program?.duration || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold text-blue-800">Deadline:</span>{" "}
                    {course.university_program?.application_deadline || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold text-blue-800">Intake:</span>{" "}
                    {course.university_program?.intake || "N/A"}
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-semibold text-blue-800">University:</span>{" "}
                  {course.university_program?.university?.name || "N/A"}
                </div>
                <div className="mt-3">
                  <span className="font-semibold text-blue-800">Application Status:</span>{" "}
                  {course.app_status}
                </div>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="mt-4 self-end bg-blue-800 hover:bg-blue-900 text-white px-5 py-2 rounded-lg text-sm"
                >
                  <MdDelete className="inline-block mr-2" /> Delete
                </button>

              </div>
             
            ))}
            <div className="text-center mt-6">
              <Link
              to="/courses-in-malaysias"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 bg-blue-800 hover:bg-blue-900 text-white font-medium transition"
            >
              Browse Colleges
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedCollege;
