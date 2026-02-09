import React, { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import {
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  Award,
  Plane,
  MessageCircle,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import ClipLoader from "react-spinners/ClipLoader";

const Overview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    review: 0,
    progress: 0,
  });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        // 1. Fetch Applied Courses (Using correct endpoint)
        const res = await api.get("/student/applied-college", {
          headers: { Authorization: `Bearer ${token}` },
        });

        let courses = [];
        if (res.data && Array.isArray(res.data.applied_programs)) {
          courses = res.data.applied_programs;
        }

        // Calculate Stats
        const total = courses.length;
        const accepted = courses.filter(
          (c) => c.app_status === "accepted" || c.app_status === "approved",
        ).length;
        const review = courses.filter(
          (c) =>
            c.app_status === "pending" ||
            c.app_status === "review" ||
            !c.app_status,
        ).length;

        // Sort by date (newest first)
        const sorted = [...courses].sort((a, b) => {
          const dateA = new Date(a.created_at || a.updated_at || 0).getTime();
          const dateB = new Date(b.created_at || b.updated_at || 0).getTime();

          if (dateA !== dateB) return dateB - dateA; // Sort by date desc
          return b.id - a.id; // Fallback to ID desc
        });

        setRecentApps(sorted.slice(0, 3)); // Top 3

        // 2. Fetch Profile for Progress
        const profileRes = await api.get("/student/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const student = profileRes.data?.data?.student || {};

        // Calculate Progress (Simple logic based on filled fields)
        const fields = [
          student.name,
          student.email,
          student.mobile,
          student.dob,
          student.nationality,
          student.passport_number,
          student.home_address,
        ];
        const filled = fields.filter((f) => f).length;
        const progress = Math.round((filled / fields.length) * 100);

        setStats({ total, accepted, review, progress });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const s = (status || "pending").toLowerCase();
    if (s === "accepted" || s === "approved")
      return "bg-green-100 text-green-700 border-green-200";
    if (s === "rejected") return "bg-red-100 text-red-700 border-red-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  return (
    <>
      <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen p-4 md:p-6">
        {/* Sidebar */}
        <ProfileCard />

        {/* Right Side Content */}
        <div className="flex-1 mt-6 md:mt-0 md:ml-6 flex justify-center items-start shadow-lg p-6 rounded-2xl bg-white">
          <div className="min-h-screen w-full">
            <div className="max-w-7xl mx-auto">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <ClipLoader color="#2563eb" size={40} />
                </div>
              ) : (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Applications */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            {stats.total}
                          </div>
                          <div className="text-sm text-gray-500">
                            Total Applications
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    {/* Accepted */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            {stats.accepted}
                          </div>
                          <div className="text-sm text-gray-500">Accepted</div>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </div>

                    {/* Under Review */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            {stats.review}
                          </div>
                          <div className="text-sm text-gray-500">
                            Under Review
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                    </div>

                    {/* Average Progress */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            {stats.progress}%
                          </div>
                          <div className="text-sm text-gray-500">
                            Avg Progress
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Recent Applications */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">
                          Recent Applications
                        </h2>
                        <button
                          onClick={() => navigate("/student/applied-colleges")}
                          className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          View All <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-6 space-y-4">
                        {recentApps.length > 0 ? (
                          recentApps.map((app, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 rounded-xl bg-gray-50"
                            >
                              <div className="flex items-center space-x-4">
                                <div
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                    app.app_status === "accepted"
                                      ? "bg-green-100 text-green-600"
                                      : "bg-blue-100 text-blue-600"
                                  }`}
                                >
                                  {app.app_status === "accepted" ? (
                                    <CheckCircle className="w-6 h-6" />
                                  ) : (
                                    <FileText className="w-6 h-6" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 line-clamp-1">
                                    {app.university_program?.course_name ||
                                      "Course Application"}
                                  </div>
                                  <div className="text-sm text-gray-500 mb-1">
                                    {app.university_program?.university?.name ||
                                      "University"}
                                  </div>

                                  <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                      Updated{" "}
                                      {formatDate(
                                        app.created_at || app.updated_at,
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`px-3 py-1 text-center text-[10px] uppercase font-bold rounded-full mb-1 ${getStatusColor(
                                    app.app_status,
                                  )}`}
                                >
                                  {app.app_status || "PENDING"}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500 mb-2">
                              No applications yet.
                            </p>
                            <button
                              onClick={() => navigate("/courses-in-malaysias")}
                              className="text-blue-600 hover:underline text-sm font-medium"
                            >
                              Browse Courses
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                      <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900">
                          Quick Actions
                        </h2>
                      </div>
                      <div className="p-6 space-y-4">
                        {/* View All Applications */}
                        <button
                          onClick={() => navigate("/student/applied-colleges")}
                          className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Eye className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">
                              View All Applications
                            </div>
                          </div>
                        </button>

                        {/* Check Offer Letters */}
                        <button className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Award className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">
                              Check Offer Letters
                            </div>
                          </div>
                        </button>

                        {/* Visa Applications */}
                        <button className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Plane className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">
                              Visa Applications
                            </div>
                          </div>
                        </button>

                        {/* Get Support */}
                        <button
                          onClick={() => navigate("/contact-us")}
                          className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-orange-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">
                              Get Support
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Floating Chat Button */}
                  <button className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
