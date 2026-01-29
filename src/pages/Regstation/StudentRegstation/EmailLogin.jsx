import { useState } from "react";
import api from "../../../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // ✅ uid & token URL se
  const searchParams = new URLSearchParams(window.location.search);
  const uid = Number(searchParams.get("uid")); // integer
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      // ✅ Query string + empty body
      const res = await api.post(
        `/student/reset-password?uid=${uid}&token=${token}&new_password=${encodeURIComponent(
          newPassword
        )}&confirm_new_password=${encodeURIComponent(confirmPassword)}`,
        {}
      );

      // ✅ Save token + email to localStorage if present
      if (res.data?.data?.token) {
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("student_email", res.data.data.email);


        toast.success(res.data.message || "Password reset successful!");
        console.log("Password Reset Response:", res.data);
        navigate("/student/profile");
      }

    } catch (err) {
      toast.error("Failed: " + (err.response?.data?.message || err.message));
      console.error("API Error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Reset Account Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Enter New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter New Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 rounded-lg shadow-md transition transform hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
