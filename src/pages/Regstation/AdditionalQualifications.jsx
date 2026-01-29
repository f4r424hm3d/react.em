import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { handleErrors } from "../../utils/handleErrors";

const AdditionalQualifications = () => {
  const [qualifications, setQualifications] = useState({
    gre1: false,
    gre2: false,
    sat: false,
  });

const [greData, setGreData] = useState({
    gre_exam_date: "",
    gre_v_score: "",
    gre_v_rank: "",
    gre_q_score: "",
    gre_q_rank: "",
    gre_w_score: "",
    gre_w_rank: "",
  });

  // GMAT state
  const [gmatData, setGmatData] = useState({
    gmat_exam_date: "",
    gmat_v_score: "",
    gmat_v_rank: "",
    gmat_q_score: "",
    gmat_q_rank: "",
    gmat_w_score: "",
    gmat_w_rank: "",
    gmat_ir_score: "",
    gmat_ir_rank: "",
    gmat_total_score: "",
    gmat_total_rank: "",
  });
  // SAT state
  const [satData, setSatData] = useState({
    sat_exam_date: "",
    sat_reasoning_point: "",
    sat_subject_point: "",
  });

  // GRE input change
  const handleGreChange = (e) => {
    setGreData({ ...greData, [e.target.name]: e.target.value });
  };
 // GMAT input change
  const handleGmatChange = (e) => {
    setGmatData({ ...gmatData, [e.target.name]: e.target.value });
  };
    // SAT input change
  const handleSatChange = (e) => {
    setSatData({ ...satData, [e.target.name]: e.target.value });
  };

const handleSaveGRE = async () => {
    try {
      const token = localStorage.getItem("token"); // token localStorage me save h
      const response = await api.post("/student/update-gre-score",
        greData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("GRE Score updated successfully ");
      console.log(response.data);
    } catch (error) {
      console.error("Error updating GRE:", error.response?.data?.errors?.gre_w_score || error.message);
      if (error.response?.data?.errors) {
        handleErrors(error.response.data.errors);
      } else {
        toast.error("Failed to update GRE ");
      }
    }
  };

const handleSaveGMAT = async () => {
    try {
      const token = localStorage.getItem("token"); // token localStorage me save h
      const response = await api.post("/student/update-gmat-score",
        gmatData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("GMAT Score updated successfully ✅");
      // console.log(response.data);
    } catch (error) {
      console.error("Error updating GMAT:", error.response?.data || error.message);
      if (error.response?.data?.errors) {
        handleErrors(error.response.data.errors);
      } else {
        toast.error("Failed to update GMAT ❌");
      }
    }
  };

const handleSaveSAT = async () => {
    try {
      const token = localStorage.getItem("token"); // token localStorage me save h
      const response = await api.post("/student/update-sat-score",
        satData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("SAT Score updated successfully ✅");
      console.log(response.data);
    } catch (error) {
      console.error("Error updating SAT:", error);
      if (error.response?.data?.errors) {
        handleErrors(error.response.data.errors);
      } else {
        toast.error("Failed to update SAT ❌");
      }
    }
  };

useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/student/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data.data.student);
        const qualificationsData = response.data.data.student;

        if (qualificationsData) {
          setGreData({
            gre_exam_date: qualificationsData.gre_exam_date,
            gre_v_score: qualificationsData.gre_v_score,
            gre_v_rank: qualificationsData.gre_v_rank,
            gre_q_score: qualificationsData.gre_q_score,
            gre_q_rank: qualificationsData.gre_q_rank,
            gre_w_score: qualificationsData.gre_w_score,
            gre_w_rank: qualificationsData.gre_w_rank,
          });

          setGmatData({
            gmat_exam_date: qualificationsData.gmat_exam_date,
            gmat_v_score: qualificationsData.gmat_v_score,
            gmat_v_rank: qualificationsData.gmat_v_rank,
            gmat_q_score: qualificationsData.gmat_q_score,
            gmat_q_rank: qualificationsData.gmat_q_rank,
            gmat_w_score: qualificationsData.gmat_w_score,
            gmat_w_rank: qualificationsData.gmat_w_rank,
            gmat_ir_score: qualificationsData.gmat_ir_score,
            gmat_ir_rank: qualificationsData.gmat_ir_rank,
            gmat_total_score: qualificationsData.gmat_total_score,
            gmat_total_rank: qualificationsData.gmat_total_rank,
          });

          setSatData({
            sat_exam_date: qualificationsData.sat_exam_date,
            sat_reasoning_point: qualificationsData.sat_reasoning_point,
            sat_subject_point: qualificationsData.sat_subject_point,
          });
        }

      } catch (error) {
        console.error("Error fetching qualifications:", error);
      }
    };

    fetchData();
  }, []);

  // toggle function
  const toggle = (key) => {
    setQualifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Additional Qualifications</h2>

      <div className="space-y-6 p-4 rounded-lg">
        {/* GRE 1 */}
        <div className="p-4 rounded-md bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">I Have GRE Exam Scores</span>
            <button
              onClick={() => toggle("gre1")}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                qualifications.gre1 ? "bg-blue-700" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  qualifications.gre1 ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>

          {/* GRE 1 Form */}
          {qualifications.gre1 && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium">Date of Exam</label>
                <input name="gre_exam_date" value={greData.gre_exam_date} onChange={handleGreChange} type="date" className="border p-2 rounded col-span-2" />
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium">Verbal</label>
                <input name="gre_v_score" value={greData.gre_v_score} onChange={handleGreChange} type="number" className="border p-2 rounded" placeholder="Score" />
                <input name="gre_v_rank" value={greData.gre_v_rank} onChange={handleGreChange} className="border p-2 rounded" placeholder="Rank" />
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium">Quantitative</label>
                <input name="gre_q_score" value={greData.gre_q_score} onChange={handleGreChange} className="border p-2 rounded" placeholder="Score" />
                <input name="gre_q_rank" value={greData.gre_q_rank} onChange={handleGreChange} className="border p-2 rounded" placeholder="Rank" />
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium">Writing</label>
                <input name="gre_w_score" value={greData.gre_w_score} onChange={handleGreChange} className="border p-2 rounded" placeholder="Score" />
                <input name="gre_w_rank" value={greData.gre_w_rank} onChange={handleGreChange} className="border p-2 rounded" placeholder="Rank" />
              </div>

              <div className="flex gap-3">
                <button onClick={handleSaveGRE} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                <button className="bg-black text-white px-4 py-2 rounded">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* GMAT */}
        <div className="p-4 rounded-md bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">I Have GMAT Exam Scores</span>
            <button
              onClick={() => toggle("gre2")}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                qualifications.gre2 ? "bg-blue-700" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  qualifications.gre2 ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>

          {qualifications.gre2 && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium">Date of Exam</label>
                <input name="gmat_exam_date" value={gmatData.gmat_exam_date} onChange={handleGmatChange} type="date" className="border p-2 rounded col-span-2" />
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium">Verbal</label>
                <input name="gmat_v_score" value={gmatData.gmat_v_score} onChange={handleGmatChange} className="border p-2 rounded" placeholder="Score" />
                <input name="gmat_v_rank" value={gmatData.gmat_v_rank} onChange={handleGmatChange} className="border p-2 rounded" placeholder="Rank" />
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium">Quantitative</label>
                <input name="gmat_q_score" value={gmatData.gmat_q_score} onChange={handleGmatChange} className="border p-2 rounded" placeholder="Score" />
                <input name="gmat_q_rank" value={gmatData.gmat_q_rank} onChange={handleGmatChange} className="border p-2 rounded" placeholder="Rank" />
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium">Writing</label>
                <input name="gmat_w_score" value={gmatData.gmat_w_score} onChange={handleGmatChange} className="border p-2 rounded" placeholder="Score" />
                <input name="gmat_w_rank" value={gmatData.gmat_w_rank} onChange={handleGmatChange} className="border p-2 rounded" placeholder="Rank" />
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium">Integrated Reasoning</label>
                <input name="gmat_ir_score" value={gmatData.gmat_ir_score} onChange={handleGmatChange} className="border p-2 rounded" placeholder="Score" />
                <input name="gmat_ir_rank" value={gmatData.gmat_ir_rank} onChange={handleGmatChange} className="border p-2 rounded" placeholder="Rank" />
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium">Total</label>
                <input name="gmat_total_score" value={gmatData.gmat_total_score} onChange={handleGmatChange} className="border p-2 rounded" placeholder="Score" />
                <input name="gmat_total_rank" value={gmatData.gmat_total_rank} onChange={handleGmatChange} className="border p-2 rounded" placeholder="Rank" />
              </div>

              <div className="flex gap-3">
                <button onClick={handleSaveGMAT} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                <button className="bg-black text-white px-4 py-2 rounded">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* SAT */}
        <div className="p-4 rounded-md bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">I Have SAT Exam Scores</span>
            <button
              onClick={() => toggle("sat")}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                qualifications.sat ? "bg-blue-700" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  qualifications.sat ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>

          {qualifications.sat && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Date of Exam</label>
                <input name="sat_exam_date" value={satData.sat_exam_date} onChange={handleSatChange} type="date" className="border p-2 rounded" placeholder="dd-mm-yyyy" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Reasoning Test Points</label>
                <input name="sat_reasoning_point" value={satData.sat_reasoning_point} onChange={handleSatChange} className="border p-2 rounded" placeholder="SAT Reasoning Point" />
              </div>
              <div className="flex flex-col">
          
                <label className="text-sm font-medium mb-1">SAT Subject Test Point</label>
                <input name="sat_subject_point" value={satData.sat_subject_point} onChange={handleSatChange} className="border p-2 rounded" placeholder="SAT Subject Point" />
    
              </div>
              <div className="col-span-3 flex justify-end gap-3 mt-4">
                <button onClick={handleSaveSAT} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                <button className="bg-black text-white px-4 py-2 rounded">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdditionalQualifications;