import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api";
import { toast } from "react-toastify";

export default function ConfirmeMail() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const studentId = localStorage.getItem("student_id");

  // Debugging OTP verification

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const studentId = localStorage.getItem("student_id");
    if (!studentId) {
      toast.error("No student ID found. Please register first.");
      return;
    }

    console.log("Sending OTP verification:", { id: studentId, otp });

    const response = await api.post("/student/verify-otp", {
      id: studentId,
      otp,
    });

    console.log("OTP verify response:", response.data);

 

try {
  if (response.data?.data?.token) {
    localStorage.setItem("token", response.data.data.token);
    localStorage.setItem("student_email", response.data.data.email);

    toast.success(response.data.message || "OTP Verified Successfully!");
    navigate("/student/profile");
  } else if (response.data?.message) {
    toast.error(response.data.message);
  } else {
    toast.error("OTP Verification Failed");
  }
} catch (error) {
  console.error("OTP Verification failed:", error);
  if (error.response) {
    console.error("Server response:", error.response.data);
    alert(error.response.data.message || "Invalid OTP or expired.");
  } else {
    alert("Network error. Please try again.");
  }
}
  } catch (error) {
    console.error("OTP verification failed:", error);
  }
}

  const handleResend = async () => {
    try {
      setLoading(true);
      const response = await api.post("/student/resend-otp", {
        id: studentId,
      });
      if (response.data) {
        setMessage("📩 New OTP sent to your email!");
      }
    } catch (error) {
      console.error("Resend OTP failed:", error);
      setMessage(" Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 via-blue-500 to-blue-500">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">Confirm Email</h2>
        <p className="text-sm text-gray-600 text-center mt-1">
          An OTP has been sent to your registered email
        </p>
        <p className="text-xs text-gray-500 text-center mt-1">
          OTP will expire in <span className="font-semibold">5 minutes</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex items-center border rounded-lg px-3 py-2">
            <KeyRound className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full ml-2 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition"
          >
            {loading ? "Verifying..." : "Submit"}
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={loading}
          className="w-full mt-3 bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Resend OTP
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}

        
      </div>
    </div>
  );
}
