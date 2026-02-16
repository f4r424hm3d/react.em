import React, { useState, useEffect } from "react";
import { FaEnvelope, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../../api";

const Recover = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleRecover = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post("/student/forget-password", { email });
      setMessage(response.data.message || "Recovery link sent to your email.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong, please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* Left Side - Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden flex-col justify-between p-16 text-white text-left">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 opacity-60"></div>

        <div className="relative z-10 animate-fade-in-right">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-xl">🔑</span>
            <span className="text-xs font-semibold tracking-wide uppercase">
              Secure Recovery
            </span>
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-6 tracking-tight">
            Lost Your <br />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
              Password?
            </span>
          </h1>
          <p className="text-lg text-blue-100 max-w-lg leading-relaxed font-light">
            No worries! It happens to the best of us. Enter your email and we'll
            help you reset it in no time.
          </p>
        </div>

        <div className="relative z-10 mt-auto pt-10 border-t border-white/10">
          <p className="text-sm font-medium text-blue-100">
            Need help? Contact support at support@educationmalaysia.com
          </p>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative bg-white">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          <div className="text-center lg:text-left">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
            >
              <FaArrowLeft size={12} /> Back to Login
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Recover Account
            </h2>
            <p className="mt-2 text-gray-500">
              Enter your registered email address.
            </p>
          </div>

          <form onSubmit={handleRecover} className="mt-8 space-y-6">
            <ModernInput
              label="Email Address"
              icon={<FaEnvelope />}
              placeholder="Enter your registered email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-base"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Send Recovery Link <FaArrowRight />
                </>
              )}
            </button>

            {/* Messages */}
            {message && (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                {message}
              </div>
            )}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

// Modern Clean Input
const ModernInput = ({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  icon,
  required,
}) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm font-medium"
      />
    </div>
  </div>
);

export default Recover;
