import React, { useState, useEffect } from "react";
import { FaKey, FaCheckCircle } from "react-icons/fa";
import ProfileCard from "./ProfileCard";
import api from "../../api"; // axios instance
import { toast } from "react-toastify";
import SeoHead from "../../components/SeoHead";
import useStaticPageSeo from "../../hooks/useStaticPageSeo";

const ChangePassword = () => {
  const { seo: apiSeo } = useStaticPageSeo("account/password/reset");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // token fetch from localStorage
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      // API call with query params and Authorization header
      const url = `/student/change-password?old_password=${encodeURIComponent(
        oldPassword,
      )}&new_password=${encodeURIComponent(
        newPassword,
      )}&confirm_new_password=${encodeURIComponent(confirmPassword)}`;

      const res = await api.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessage(res.data.message || "Password changed successfully!");
      toast.success(res.data.message || "Password changed successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to change password. Try again.",
      );
      toast.error(
        err.response?.data?.message || "Failed to change password. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SeoHead
        pageType="service-detail"
        data={{
          ...apiSeo,
          name: apiSeo?.meta_title || "Reset Password - Education Malaysia",
          description:
            apiSeo?.meta_description ||
            "Reset your Education Malaysia account password securely.",
        }}
      />
      <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen p-4 md:p-6">
        {/* Sidebar */}
        <ProfileCard />

        {/* Right Side Content */}
        <div className="flex-1 mt-6 md:mt-0 md:ml-6 flex justify-center items-start shadow-lg p-6 rounded-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-1xl border border-gray-200">
            {/* Heading */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
              Change <span className="text-blue-700">Password</span>
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Old Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Old Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaKey className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Enter Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaKey className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaCheckCircle className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Messages */}
              {message && (
                <p className="text-green-600 text-center">{message}</p>
              )}
              {error && <p className="text-red-600 text-center">{error}</p>}

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2.5 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-6 py-2.5 rounded-lg shadow-md transition disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
