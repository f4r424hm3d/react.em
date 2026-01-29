import React, { useRef, useState,useEffect} from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { handleErrors } from "../../utils/handleErrors";

const BackgroundInformation = () => {
  const backgroundRef = useRef(null);

  const [refusedVisa, setRefusedVisa] = useState("");
  const [validPermit, setValidPermit] = useState("");
  const [visaNote, setVisaNote] = useState("");

  const handleSave = async () => {
    if (!refusedVisa || !validPermit) {
      toast.error("Please answer all required questions.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/student/update-background-info",
        null,
        {
          params: {
            refused_visa: refusedVisa.toUpperCase(),
            valid_study_permit: validPermit.toUpperCase(),
            visa_note: visaNote,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
        <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8">
          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-blue-700">
              📝 Background Information
            </h2>
          </div>

          {/* Q1 */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              Have you been refused a visa from Canada, USA, UK, Australia
              more...?
              <span className="text-red-500">*</span>
            </label>
            <select
              value={refusedVisa}
              onChange={(e) => setRefusedVisa(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select</option>
              <option value="YES">Yes</option>
              <option value="NO">No</option>
            </select>
          </div>

          {/* Q2 */}
          <div className="mb-6">
            <label className=" font-medium text-gray-700 mb-2 flex items-center gap-2">
              Do you have a valid Study Permit / Visa?
              <span className="text-blue-500 cursor-pointer text-lg">ℹ</span>
            </label>
            <select
              value={validPermit}
              onChange={(e) => setValidPermit(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select</option>
              <option value="YES">Yes</option>
              <option value="NO">No</option>
            </select>
          </div>

          {/* Q3 */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              If you answered "Yes" to any of the questions above, please
              provide more details below:
              <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="4"
              value={visaNote}
              onChange={(e) => setVisaNote(e.target.value)}
              placeholder="Enter details here..."
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
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
