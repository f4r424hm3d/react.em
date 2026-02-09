import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import ModalSignUp from "./auth/ModalSignUp";
import ModalLogin from "./auth/ModalLogin";
import ModalOTP from "./auth/ModalOTP";
import api from "../api";
import { toast } from "react-toastify";

const AuthModal = ({ isOpen, onClose, courseId, onSuccess }) => {
  const [authStep, setAuthStep] = useState("signup"); // 'signup' | 'login' | 'otp'
  const [studentId, setStudentId] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  // Check if user is already registered on mount
  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem("token");
      if (token) {
        // User is already logged in, shouldn't show modal
        onClose();
        return;
      }

      // Default to signup for new users
      setAuthStep("signup");
    }
  }, [isOpen, onClose]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAuthStep("signup");
      setStudentId(null);
      setIsApplying(false);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const applyCourse = async (token) => {
    if (!courseId) {
      console.error("No course ID provided");
      return;
    }

    setIsApplying(true);

    try {
      await api.get(`/student/apply-program/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Course applied successfully!");

      if (onSuccess) {
        onSuccess();
      }

      onClose();

      // Automatically reload page to update applied courses and navbar
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      if (error.response?.status === 409) {
        toast.warn("You have already applied for this course.");
        if (onSuccess) {
          onSuccess();
        }
        onClose();

        // Reload page even if already applied to show correct state
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        console.error("Course application failed:", error);
        toast.error("Failed to apply for course. Please try again.");
      }
    } finally {
      setIsApplying(false);
    }
  };

  const handleSignUpSuccess = (studentId) => {
    setStudentId(studentId);
    setAuthStep("otp");
  };

  const handleLoginSuccess = (data) => {
    if (data.needsOTP) {
      setStudentId(data.studentId);
      setAuthStep("otp");
    } else if (data.token) {
      // Login successful, apply course immediately
      applyCourse(data.token);
    }
  };

  const handleOTPSuccess = (data) => {
    if (data.token) {
      // OTP verified, apply course immediately
      applyCourse(data.token);
    }
  };

  const handleSwitchToLogin = () => {
    setAuthStep("login");
  };

  const handleSwitchToSignUp = () => {
    setAuthStep("signup");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 overflow-y-auto py-8">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-auto max-h-[95vh] overflow-y-auto animate-fadeIn transform transition-all [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition z-10"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {isApplying ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">
              Applying for course...
            </p>
          </div>
        ) : (
          <>
            {authStep === "signup" && (
              <ModalSignUp
                onSuccess={handleSignUpSuccess}
                onSwitchToLogin={handleSwitchToLogin}
              />
            )}

            {authStep === "login" && (
              <ModalLogin
                onSuccess={handleLoginSuccess}
                onSwitchToSignUp={handleSwitchToSignUp}
              />
            )}

            {authStep === "otp" && (
              <ModalOTP studentId={studentId} onSuccess={handleOTPSuccess} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
