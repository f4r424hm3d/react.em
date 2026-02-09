import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { handleErrors } from "../../utils/handleErrors";
import { validateRequired, validateScore } from "../../utils/validation";

const AdditionalQualifications = () => {
  // Load toggle state from localStorage
  const [qualifications, setQualifications] = useState(() => {
    const saved = localStorage.getItem("qualificationsToggle");
    return saved
      ? JSON.parse(saved)
      : {
          gre1: false,
          gre2: false,
          sat: false,
        };
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

  // ✅ Validation states
  const [greErrors, setGreErrors] = useState({});
  const [gmatErrors, setGmatErrors] = useState({});
  const [satErrors, setSatErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ✅ Validate field on blur
  const handleBlur = (section, field) => {
    setTouched({ ...touched, [`${section}_${field}`]: true });
    validateField(section, field);
  };

  // ✅ Field validation logic
  const validateField = (section, field) => {
    let error = "";

    if (section === "gre") {
      const value = greData[field];
      if (field === "gre_exam_date") {
        error = validateRequired(value, "exam date");
      } else if (field === "gre_w_score") {
        if (value) {
          error = validateScore(value);
          if (!error && parseFloat(value) > 6) {
            error = "The gre w score field must not be greater than 6";
          }
        }
      } else if (field === "gre_v_rank") {
        if (value) {
          error = validateScore(value);
          if (!error && parseFloat(value) > 100) {
            error = "The gre v rank field must not be greater than 100";
          }
        }
      } else if (field === "gre_q_rank") {
        if (value) {
          error = validateScore(value);
          if (!error && parseFloat(value) > 100) {
            error = "The gre q rank field must not be greater than 100";
          }
        }
      } else if (field === "gre_w_rank") {
        if (value) {
          error = validateScore(value);
          if (!error && parseFloat(value) > 100) {
            error = "The gre w rank field must not be greater than 100";
          }
        }
      } else if (field.includes("score") || field.includes("rank")) {
        if (value) {
          error = validateScore(value);
        }
      }
      setGreErrors((prev) => ({ ...prev, [field]: error }));
    } else if (section === "gmat") {
      const value = gmatData[field];
      if (field === "gmat_exam_date") {
        error = validateRequired(value, "exam date");
      } else if (field === "gmat_v_score") {
        if (value) {
          error = validateScore(value);
          if (!error && parseFloat(value) > 60) {
            error = "The gmat v score field must not be greater than 60";
          }
        }
      } else if (field === "gmat_q_score") {
        if (value) {
          error = validateScore(value);
          if (!error && parseFloat(value) > 60) {
            error = "The gmat q score field must not be greater than 60";
          }
        }
      } else if (field === "gmat_w_score") {
        if (value) {
          error = validateScore(value);
          if (!error && parseFloat(value) > 6) {
            error = "The gmat w score field must not be greater than 6";
          }
        }
      } else if (field === "gmat_ir_score") {
        if (value) {
          error = validateScore(value);
          if (!error && parseFloat(value) > 8) {
            error = "The gmat ir score field must not be greater than 8";
          }
        }
      } else if (field === "gmat_total_score") {
        if (value) {
          // Skip default validateScore (0-100), only check numeric and custom range
          const numScore = parseFloat(value);
          if (isNaN(numScore)) {
            error = "Total score must be a number";
          } else if (numScore > 800 || numScore < 200) {
            error = "The gmat total score must be between 200 and 800";
          }
        }
      } else if (
        field === "gmat_v_rank" ||
        field === "gmat_q_rank" ||
        field === "gmat_w_rank" ||
        field === "gmat_ir_rank" ||
        field === "gmat_total_rank"
      ) {
        if (value) {
          error = validateScore(value);
          if (!error && parseFloat(value) > 100) {
            error = `The ${field.replace("gmat_", "").replace("_", " ")} field must not be greater than 100`;
          }
        }
      } else if (field.includes("score") || field.includes("rank")) {
        if (value) {
          error = validateScore(value);
        }
      }
      setGmatErrors((prev) => ({ ...prev, [field]: error }));
    } else if (section === "sat") {
      const value = satData[field];
      if (field === "sat_exam_date") {
        error = validateRequired(value, "exam date");
      } else if (field.includes("point")) {
        if (value) {
          error = validateScore(value);
        }
      }
      setSatErrors((prev) => ({ ...prev, [field]: error }));
    }

    return error;
  };

  // ✅ Validate GRE form
  const validateGreForm = () => {
    const errors = {};
    errors.gre_exam_date = validateRequired(greData.gre_exam_date, "exam date");

    if (greData.gre_v_score)
      errors.gre_v_score = validateScore(greData.gre_v_score);
    if (greData.gre_q_score)
      errors.gre_q_score = validateScore(greData.gre_q_score);
    if (greData.gre_w_score) {
      errors.gre_w_score = validateScore(greData.gre_w_score);
      if (!errors.gre_w_score && parseFloat(greData.gre_w_score) > 6) {
        errors.gre_w_score = "The gre w score field must not be greater than 6";
      }
    }

    if (greData.gre_v_rank) {
      errors.gre_v_rank = validateScore(greData.gre_v_rank);
      if (!errors.gre_v_rank && parseFloat(greData.gre_v_rank) > 100) {
        errors.gre_v_rank = "The gre v rank field must not be greater than 100";
      }
    }
    if (greData.gre_q_rank) {
      errors.gre_q_rank = validateScore(greData.gre_q_rank);
      if (!errors.gre_q_rank && parseFloat(greData.gre_q_rank) > 100) {
        errors.gre_q_rank = "The gre q rank field must not be greater than 100";
      }
    }
    if (greData.gre_w_rank) {
      errors.gre_w_rank = validateScore(greData.gre_w_rank);
      if (!errors.gre_w_rank && parseFloat(greData.gre_w_rank) > 100) {
        errors.gre_w_rank = "The gre w rank field must not be greater than 100";
      }
    }

    setGreErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  // ✅ Validate GMAT form
  const validateGmatForm = () => {
    const errors = {};
    errors.gmat_exam_date = validateRequired(
      gmatData.gmat_exam_date,
      "exam date",
    );

    if (gmatData.gmat_v_score) {
      errors.gmat_v_score = validateScore(gmatData.gmat_v_score);
      if (!errors.gmat_v_score && parseFloat(gmatData.gmat_v_score) > 60) {
        errors.gmat_v_score =
          "The gmat v score field must not be greater than 60";
      }
    }
    if (gmatData.gmat_q_score) {
      errors.gmat_q_score = validateScore(gmatData.gmat_q_score);
      if (!errors.gmat_q_score && parseFloat(gmatData.gmat_q_score) > 60) {
        errors.gmat_q_score =
          "The gmat q score field must not be greater than 60";
      }
    }
    if (gmatData.gmat_w_score) {
      errors.gmat_w_score = validateScore(gmatData.gmat_w_score);
      if (!errors.gmat_w_score && parseFloat(gmatData.gmat_w_score) > 6) {
        errors.gmat_w_score =
          "The gmat w score field must not be greater than 6";
      }
    }
    if (gmatData.gmat_ir_score) {
      errors.gmat_ir_score = validateScore(gmatData.gmat_ir_score);
      if (!errors.gmat_ir_score && parseFloat(gmatData.gmat_ir_score) > 8) {
        errors.gmat_ir_score =
          "The gmat ir score field must not be greater than 8";
      }
    }
    if (gmatData.gmat_total_score) {
      // Skip default validateScore (0-100), only check numeric and custom range
      const numScore = parseFloat(gmatData.gmat_total_score);
      if (isNaN(numScore)) {
        errors.gmat_total_score = "Total score must be a number";
      } else if (numScore > 800 || numScore < 200) {
        errors.gmat_total_score =
          "The gmat total score must be between 200 and 800";
      }
    }

    // Rank validations
    if (gmatData.gmat_v_rank) {
      errors.gmat_v_rank = validateScore(gmatData.gmat_v_rank);
      if (!errors.gmat_v_rank && parseFloat(gmatData.gmat_v_rank) > 100) {
        errors.gmat_v_rank =
          "The gmat v rank field must not be greater than 100";
      }
    }
    if (gmatData.gmat_q_rank) {
      errors.gmat_q_rank = validateScore(gmatData.gmat_q_rank);
      if (!errors.gmat_q_rank && parseFloat(gmatData.gmat_q_rank) > 100) {
        errors.gmat_q_rank =
          "The gmat q rank field must not be greater than 100";
      }
    }
    if (gmatData.gmat_w_rank) {
      errors.gmat_w_rank = validateScore(gmatData.gmat_w_rank);
      if (!errors.gmat_w_rank && parseFloat(gmatData.gmat_w_rank) > 100) {
        errors.gmat_w_rank =
          "The gmat w rank field must not be greater than 100";
      }
    }
    if (gmatData.gmat_ir_rank) {
      errors.gmat_ir_rank = validateScore(gmatData.gmat_ir_rank);
      if (!errors.gmat_ir_rank && parseFloat(gmatData.gmat_ir_rank) > 100) {
        errors.gmat_ir_rank =
          "The gmat ir rank field must not be greater than 100";
      }
    }
    if (gmatData.gmat_total_rank) {
      errors.gmat_total_rank = validateScore(gmatData.gmat_total_rank);
      if (
        !errors.gmat_total_rank &&
        parseFloat(gmatData.gmat_total_rank) > 100
      ) {
        errors.gmat_total_rank =
          "The gmat total rank field must not be greater than 100";
      }
    }

    setGmatErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  // ✅ Validate SAT form
  const validateSatForm = () => {
    const errors = {};
    // Exam date is optional

    if (satData.sat_reasoning_point)
      errors.sat_reasoning_point = validateScore(satData.sat_reasoning_point);
    if (satData.sat_subject_point)
      errors.sat_subject_point = validateScore(satData.sat_subject_point);

    setSatErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  // GRE input change
  const handleGreChange = (e) => {
    setGreData({ ...greData, [e.target.name]: e.target.value });
    if (greErrors[e.target.name]) {
      setGreErrors({ ...greErrors, [e.target.name]: "" });
    }
  };

  // GMAT input change
  const handleGmatChange = (e) => {
    setGmatData({ ...gmatData, [e.target.name]: e.target.value });
    if (gmatErrors[e.target.name]) {
      setGmatErrors({ ...gmatErrors, [e.target.name]: "" });
    }
  };

  // SAT input change
  const handleSatChange = (e) => {
    setSatData({ ...satData, [e.target.name]: e.target.value });
    if (satErrors[e.target.name]) {
      setSatErrors({ ...satErrors, [e.target.name]: "" });
    }
  };

  const handleSaveGRE = async () => {
    // ✅ Validate before submission
    if (!validateGreForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/student/update-gre-score", greData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("GRE Score updated successfully ✅");
      console.log(response.data);
    } catch (error) {
      console.error(
        "Error updating GRE:",
        error.response?.data?.errors?.gre_w_score || error.message,
      );
      if (error.response?.data?.errors) {
        handleErrors(error.response.data.errors);
      } else {
        toast.error("Failed to update GRE ❌");
      }
    }
  };

  const handleSaveGMAT = async () => {
    // ✅ Validate before submission
    if (!validateGmatForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/student/update-gmat-score", gmatData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("GMAT Score updated successfully ✅");
    } catch (error) {
      console.error(
        "Error updating GMAT:",
        error.response?.data || error.message,
      );
      if (error.response?.data?.errors) {
        // Display backend errors inline below fields
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach((key) => {
          const errorMessages = error.response.data.errors[key];
          backendErrors[key] = Array.isArray(errorMessages)
            ? errorMessages[0]
            : errorMessages;
        });
        setGmatErrors((prev) => ({ ...prev, ...backendErrors }));
        toast.error("Please fix the errors below");
      } else {
        toast.error("Failed to update GMAT ❌");
      }
    }
  };

  const handleSaveSAT = async () => {
    // ✅ Validate before submission
    if (!validateSatForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/student/update-sat-score", satData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("SAT Score updated successfully ✅");
      console.log(response.data);
    } catch (error) {
      console.error("Error updating SAT:", error);
      if (error.response?.data?.errors) {
        // Display backend errors inline below fields
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach((key) => {
          const errorMessages = error.response.data.errors[key];
          backendErrors[key] = Array.isArray(errorMessages)
            ? errorMessages[0]
            : errorMessages;
        });
        setSatErrors((prev) => ({ ...prev, ...backendErrors }));
        toast.error("Please fix the errors below");
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
            gre_exam_date: qualificationsData.gre_exam_date || "",
            gre_v_score: qualificationsData.gre_v_score || "",
            gre_v_rank: qualificationsData.gre_v_rank || "",
            gre_q_score: qualificationsData.gre_q_score || "",
            gre_q_rank: qualificationsData.gre_q_rank || "",
            gre_w_score: qualificationsData.gre_w_score || "",
            gre_w_rank: qualificationsData.gre_w_rank || "",
          });

          setGmatData({
            gmat_exam_date: qualificationsData.gmat_exam_date || "",
            gmat_v_score: qualificationsData.gmat_v_score || "",
            gmat_v_rank: qualificationsData.gmat_v_rank || "",
            gmat_q_score: qualificationsData.gmat_q_score || "",
            gmat_q_rank: qualificationsData.gmat_q_rank || "",
            gmat_w_score: qualificationsData.gmat_w_score || "",
            gmat_w_rank: qualificationsData.gmat_w_rank || "",
            gmat_ir_score: qualificationsData.gmat_ir_score || "",
            gmat_ir_rank: qualificationsData.gmat_ir_rank || "",
            gmat_total_score: qualificationsData.gmat_total_score || "",
            gmat_total_rank: qualificationsData.gmat_total_rank || "",
          });

          setSatData({
            sat_exam_date: qualificationsData.sat_exam_date || "",
            sat_reasoning_point: qualificationsData.sat_reasoning_point || "",
            sat_subject_point: qualificationsData.sat_subject_point || "",
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
    setQualifications((prev) => {
      const newState = {
        ...prev,
        [key]: !prev[key],
      };
      // Save to localStorage
      localStorage.setItem("qualificationsToggle", JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-lg font-semibold mb-4">Additional Qualifications</h2>

      <div className="space-y-6 p-4 rounded-lg">
        {/* GRE */}
        <div className="p-4 rounded-md bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">
              I Have GRE Exam Scores
            </span>
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

          {/* GRE Form */}
          {qualifications.gre1 && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4 items-start">
                <label className="text-sm font-medium pt-2">
                  Date of Exam *
                </label>
                <div className="col-span-2 space-y-1">
                  <input
                    name="gre_exam_date"
                    value={greData.gre_exam_date}
                    onChange={handleGreChange}
                    onBlur={() => handleBlur("gre", "gre_exam_date")}
                    type="date"
                    className={`w-full border p-2 rounded outline-none transition ${
                      greErrors.gre_exam_date
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {greErrors.gre_exam_date && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {greErrors.gre_exam_date}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-start">
                <label className="text-sm font-medium pt-2">Verbal</label>
                <div className="space-y-1">
                  <input
                    name="gre_v_score"
                    value={greData.gre_v_score}
                    onChange={handleGreChange}
                    onBlur={() => handleBlur("gre", "gre_v_score")}
                    type="number"
                    className={`w-full border p-2 rounded outline-none transition ${
                      greErrors.gre_v_score
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Score"
                  />
                  {greErrors.gre_v_score && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {greErrors.gre_v_score}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <input
                    name="gre_v_rank"
                    value={greData.gre_v_rank}
                    onChange={handleGreChange}
                    onBlur={() => handleBlur("gre", "gre_v_rank")}
                    type="number"
                    className={`w-full border p-2 rounded outline-none transition ${
                      greErrors.gre_v_rank
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Rank"
                  />
                  {greErrors.gre_v_rank && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {greErrors.gre_v_rank}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-start">
                <label className="text-sm font-medium pt-2">Quantitative</label>
                <div className="space-y-1">
                  <input
                    name="gre_q_score"
                    value={greData.gre_q_score}
                    onChange={handleGreChange}
                    onBlur={() => handleBlur("gre", "gre_q_score")}
                    type="number"
                    className={`w-full border p-2 rounded outline-none transition ${
                      greErrors.gre_q_score
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Score"
                  />
                  {greErrors.gre_q_score && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {greErrors.gre_q_score}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <input
                    name="gre_q_rank"
                    value={greData.gre_q_rank}
                    onChange={handleGreChange}
                    onBlur={() => handleBlur("gre", "gre_q_rank")}
                    type="number"
                    className={`w-full border p-2 rounded outline-none transition ${
                      greErrors.gre_q_rank
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Rank"
                  />
                  {greErrors.gre_q_rank && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {greErrors.gre_q_rank}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-start">
                <label className="text-sm font-medium pt-2">Writing</label>
                <div className="space-y-1">
                  <input
                    name="gre_w_score"
                    value={greData.gre_w_score}
                    onChange={handleGreChange}
                    onBlur={() => handleBlur("gre", "gre_w_score")}
                    type="number"
                    className={`w-full border p-2 rounded outline-none transition ${
                      greErrors.gre_w_score
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Score"
                  />
                  {greErrors.gre_w_score && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {greErrors.gre_w_score}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <input
                    name="gre_w_rank"
                    value={greData.gre_w_rank}
                    onChange={handleGreChange}
                    onBlur={() => handleBlur("gre", "gre_w_rank")}
                    type="number"
                    className={`w-full border p-2 rounded outline-none transition ${
                      greErrors.gre_w_rank
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Rank"
                  />
                  {greErrors.gre_w_rank && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {greErrors.gre_w_rank}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveGRE}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                >
                  Save
                </button>
                <button
                  onClick={() => toggle("gre1")}
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* GMAT */}
        <div className="p-4 rounded-md bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">
              I Have GMAT Exam Scores
            </span>
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
              <div className="grid grid-cols-3 gap-4 items-start">
                <label className="text-sm font-medium pt-2">
                  Date of Exam *
                </label>
                <div className="col-span-2 space-y-1">
                  <input
                    name="gmat_exam_date"
                    value={gmatData.gmat_exam_date}
                    onChange={handleGmatChange}
                    onBlur={() => handleBlur("gmat", "gmat_exam_date")}
                    type="date"
                    className={`w-full border p-2 rounded outline-none transition ${
                      gmatErrors.gmat_exam_date
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {gmatErrors.gmat_exam_date && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {gmatErrors.gmat_exam_date}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-start">
                <label className="text-sm font-medium pt-2">Verbal</label>
                <div className="space-y-1">
                  <input
                    name="gmat_v_score"
                    value={gmatData.gmat_v_score}
                    onChange={handleGmatChange}
                    onBlur={() => handleBlur("gmat", "gmat_v_score")}
                    type="number"
                    className={`w-full border p-2 rounded outline-none ${
                      gmatErrors.gmat_v_score
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Score"
                  />
                  {gmatErrors.gmat_v_score && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {gmatErrors.gmat_v_score}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <input
                    name="gmat_v_rank"
                    value={gmatData.gmat_v_rank}
                    onChange={handleGmatChange}
                    onBlur={() => handleBlur("gmat", "gmat_v_rank")}
                    type="number"
                    className={`w-full border p-2 rounded outline-none transition ${
                      gmatErrors.gmat_v_rank
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Rank"
                  />
                  {gmatErrors.gmat_v_rank && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {gmatErrors.gmat_v_rank}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-start">
                <label className="text-sm font-medium pt-2">Quantitative</label>
                <div className="space-y-1">
                  <input
                    name="gmat_q_score"
                    value={gmatData.gmat_q_score}
                    onChange={handleGmatChange}
                    onBlur={() => handleBlur("gmat", "gmat_q_score")}
                    type="number"
                    className={`w-full border p-2 rounded outline-none ${
                      gmatErrors.gmat_q_score
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Score"
                  />
                  {gmatErrors.gmat_q_score && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {gmatErrors.gmat_q_score}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <input
                    name="gmat_q_rank"
                    value={gmatData.gmat_q_rank}
                    onChange={handleGmatChange}
                    onBlur={() => handleBlur("gmat", "gmat_q_rank")}
                    type="number"
                    className={`w-full border p-2 rounded outline-none transition ${
                      gmatErrors.gmat_q_rank
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Rank"
                  />
                  {gmatErrors.gmat_q_rank && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {gmatErrors.gmat_q_rank}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-start">
                <label className="text-sm font-medium pt-2">Writing</label>
                <div className="space-y-1">
                  <input
                    name="gmat_w_score"
                    value={gmatData.gmat_w_score}
                    onChange={handleGmatChange}
                    onBlur={() => handleBlur("gmat", "gmat_w_score")}
                    type="number"
                    className={`w-full border p-2 rounded outline-none ${
                      gmatErrors.gmat_w_score
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Score"
                  />
                  {gmatErrors.gmat_w_score && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {gmatErrors.gmat_w_score}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <input
                    name="gmat_w_rank"
                    value={gmatData.gmat_w_rank}
                    onChange={handleGmatChange}
                    onBlur={() => handleBlur("gmat", "gmat_w_rank")}
                    type="number"
                    className={`w-full border p-2 rounded outline-none transition ${
                      gmatErrors.gmat_w_rank
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Rank"
                  />
                  {gmatErrors.gmat_w_rank && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {gmatErrors.gmat_w_rank}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-start">
                <label className="text-sm font-medium pt-2">
                  Integrated Reasoning
                </label>
                <div className="space-y-1">
                  <input
                    name="gmat_ir_score"
                    value={gmatData.gmat_ir_score}
                    onChange={handleGmatChange}
                    onBlur={() => handleBlur("gmat", "gmat_ir_score")}
                    type="number"
                    className={`w-full border p-2 rounded outline-none ${
                      gmatErrors.gmat_ir_score
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Score"
                  />
                  {gmatErrors.gmat_ir_score && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {gmatErrors.gmat_ir_score}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <input
                    name="gmat_ir_rank"
                    value={gmatData.gmat_ir_rank}
                    onChange={handleGmatChange}
                    onBlur={() => handleBlur("gmat", "gmat_ir_rank")}
                    type="number"
                    className={`w-full border p-2 rounded outline-none transition ${
                      gmatErrors.gmat_ir_rank
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Rank"
                  />
                  {gmatErrors.gmat_ir_rank && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {gmatErrors.gmat_ir_rank}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-start">
                <label className="text-sm font-medium pt-2">Total</label>
                <div className="space-y-1">
                  <input
                    name="gmat_total_score"
                    value={gmatData.gmat_total_score}
                    onChange={handleGmatChange}
                    onBlur={() => handleBlur("gmat", "gmat_total_score")}
                    type="number"
                    className={`w-full border p-2 rounded outline-none ${
                      gmatErrors.gmat_total_score
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Score"
                  />
                  {gmatErrors.gmat_total_score && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {gmatErrors.gmat_total_score}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <input
                    name="gmat_total_rank"
                    value={gmatData.gmat_total_rank}
                    onChange={handleGmatChange}
                    onBlur={() => handleBlur("gmat", "gmat_total_rank")}
                    type="number"
                    className={`w-full border p-2 rounded outline-none transition ${
                      gmatErrors.gmat_total_rank
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Rank"
                  />
                  {gmatErrors.gmat_total_rank && (
                    <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {gmatErrors.gmat_total_rank}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveGMAT}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                >
                  Save
                </button>
                <button
                  onClick={() => toggle("gre2")}
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SAT */}
        <div className="p-4 rounded-md bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">
              I Have SAT Exam Scores
            </span>
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
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium mb-1">
                  Date of Exam *
                </label>
                <input
                  name="sat_exam_date"
                  value={satData.sat_exam_date}
                  onChange={handleSatChange}
                  onBlur={() => handleBlur("sat", "sat_exam_date")}
                  type="date"
                  className={`border p-2 rounded outline-none ${
                    satErrors.sat_exam_date
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  placeholder="dd-mm-yyyy"
                />
                {satErrors.sat_exam_date && (
                  <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {satErrors.sat_exam_date}
                  </p>
                )}
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium mb-1">
                  Reasoning Test Points
                </label>
                <input
                  name="sat_reasoning_point"
                  value={satData.sat_reasoning_point}
                  onChange={handleSatChange}
                  onBlur={() => handleBlur("sat", "sat_reasoning_point")}
                  type="number"
                  className={`border p-2 rounded outline-none ${
                    satErrors.sat_reasoning_point
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="SAT Reasoning Point"
                />
                {satErrors.sat_reasoning_point && (
                  <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {satErrors.sat_reasoning_point}
                  </p>
                )}
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium mb-1">
                  SAT Subject Test Point
                </label>
                <input
                  name="sat_subject_point"
                  value={satData.sat_subject_point}
                  onChange={handleSatChange}
                  onBlur={() => handleBlur("sat", "sat_subject_point")}
                  type="number"
                  className={`border p-2 rounded outline-none ${
                    satErrors.sat_subject_point
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="SAT Subject Point"
                />
                {satErrors.sat_subject_point && (
                  <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {satErrors.sat_subject_point}
                  </p>
                )}
              </div>

              <div className="col-span-3 flex justify-end gap-3 mt-4">
                <button
                  onClick={handleSaveSAT}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                >
                  Save
                </button>
                <button
                  onClick={() => toggle("sat")}
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdditionalQualifications;
