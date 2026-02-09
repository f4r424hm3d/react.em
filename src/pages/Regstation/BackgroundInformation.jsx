import React, { useRef, useState, useEffect } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { handleErrors } from "../../utils/handleErrors";
import { validateSelect, validateRequired } from "../../utils/validation";

const BackgroundInformation = () => {
  const backgroundRef = useRef(null);

  const [refusedVisa, setRefusedVisa] = useState("");
  const [validPermit, setValidPermit] = useState("");
  const [visaNote, setVisaNote] = useState("");

  // ✅ Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ✅ Validate field on blur
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  };

  // ✅ Field validation logic
  const validateField = (field) => {
    let error = "";

    if (field === "refusedVisa") {
      error = validateSelect(refusedVisa, "visa refusal status");
    } else if (field === "validPermit") {
      error = validateSelect(validPermit, "study permit status");
    } else if (field === "visaNote") {
      // Only require note if either answer is "YES"
      if (
        (refusedVisa === "YES" || validPermit === "YES") &&
        !visaNote.trim()
      ) {
        error = "Please provide details since you answered 'Yes' above";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  // ✅ Validate form before submit
  const validateForm = () => {
    const newErrors = {};

    newErrors.refusedVisa = validateSelect(refusedVisa, "visa refusal status");
    newErrors.validPermit = validateSelect(validPermit, "study permit status");

    // Check if note is required
    if ((refusedVisa === "YES" || validPermit === "YES") && !visaNote.trim()) {
      newErrors.visaNote =
        "Please provide details since you answered 'Yes' above";
    }

    setErrors(newErrors);
    setTouched({ refusedVisa: true, validPermit: true, visaNote: true });

    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSave = async () => {
    // ✅ Validate form before submission
    if (!validateForm()) {
      toast.error("Please answer all required questions");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/student/update-background-info", null, {
        params: {
          refused_visa: refusedVisa.toUpperCase(),
          valid_study_permit: validPermit.toUpperCase(),
          visa_note: visaNote,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Background information updated successfully!");
    } catch (error) {
      handleErrors(error);
    }
  };

  useEffect(() => {
    const fetchBackgroundInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/student/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const student = response.data.data.student;
        if (student) {
          setRefusedVisa(student.refused_visa || "");
          setValidPermit(student.valid_study_permit || "");
          setVisaNote(student.visa_note || "");
        }
      } catch (error) {
        console.error("Error fetching background information:", error);
      }
    };

    fetchBackgroundInfo();
  }, []);

  return (
    <>
      {/* ✅ Background Information */}
      <div ref={backgroundRef} className="mb-10">
        <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-4 md:p-8">
          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-blue-700">
              📝 Background Information
            </h2>
          </div>

          {/* Q1 */}
          <div className="mb-6 space-y-1">
            <label className="block font-medium text-gray-700 mb-2">
              Have you been refused a visa from Canada, USA, UK, Australia
              more...?
              <span className="text-red-500">*</span>
            </label>
            <select
              value={refusedVisa}
              onChange={(e) => {
                setRefusedVisa(e.target.value);
                if (errors.refusedVisa) {
                  setErrors({ ...errors, refusedVisa: "" });
                }
              }}
              onBlur={() => handleBlur("refusedVisa")}
              className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                errors.refusedVisa
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            >
              <option value="">Select</option>
              <option value="YES">Yes</option>
              <option value="NO">No</option>
            </select>
            {errors.refusedVisa && (
              <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.refusedVisa}
              </p>
            )}
          </div>

          {/* Q2 */}
          <div className="mb-6 space-y-1">
            <label className=" font-medium text-gray-700 mb-2 flex items-center gap-2">
              Do you have a valid Study Permit / Visa?
              <span className="text-blue-500 cursor-pointer text-lg">ℹ</span>
            </label>
            <select
              value={validPermit}
              onChange={(e) => {
                setValidPermit(e.target.value);
                if (errors.validPermit) {
                  setErrors({ ...errors, validPermit: "" });
                }
              }}
              onBlur={() => handleBlur("validPermit")}
              className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                errors.validPermit
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            >
              <option value="">Select</option>
              <option value="YES">Yes</option>
              <option value="NO">No</option>
            </select>
            {errors.validPermit && (
              <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.validPermit}
              </p>
            )}
          </div>

          {/* Q3 */}
          <div className="mb-6 space-y-1">
            <label className="block font-medium text-gray-700 mb-2">
              If you answered "Yes" to any of the questions above, please
              provide more details below:
              {(refusedVisa === "YES" || validPermit === "YES") && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <textarea
              rows="4"
              value={visaNote}
              onChange={(e) => {
                setVisaNote(e.target.value);
                if (errors.visaNote) {
                  setErrors({ ...errors, visaNote: "" });
                }
              }}
              onBlur={() => handleBlur("visaNote")}
              placeholder="Enter details here..."
              className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                errors.visaNote
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            />
            {errors.visaNote && (
              <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.visaNote}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
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

export default BackgroundInformation;
