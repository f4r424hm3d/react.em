import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "react-toastify";

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} , ${year}`;
};

const SchoolAdd = () => {
  const [showForm, setShowForm] = useState(false);
  const [schools, setSchools] = useState([]);
  const [expandedSchool, setExpandedSchool] = useState(null);
  const [formData, setFormData] = useState({
    country_of_institution: "",
    name_of_institution: "",
    level_of_education: "",
    primary_language_of_instruction: "",
    attended_institution_from: "",
    attended_institution_to: "",
    graduation_date: "",
    degree_name: "",
    graduated_from_this: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
  });

  // Fetch schools list
  const fetchSchools = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/student/schools", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data && res.data.data && Array.isArray(res.data.data.schools)) {
        setSchools(res.data.data.schools);
        console.log("Fetched Schools:", res.data.data.schools);
        
      }
    } catch (err) {
      console.error("Error fetching schools", err);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  // Handle change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleRadio = (e) => {
    setFormData({ ...formData, graduated_from_this: e.target.value });
  };

  // Submit API call
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (expandedSchool) {
        await api.post('/student/update-school', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("School Updated Successfully ✅");
      } else {
        await api.post("/student/add-school", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("School Added Successfully ✅");
      }
      setShowForm(false);
      setExpandedSchool(null);
      fetchSchools();
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.message || `Failed to ${expandedSchool ? "update" : "add"} school `);
      toast.error(`Failed to ${expandedSchool ? "update" : "add"} school `);
    }
  };

  // Delete School
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this school?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/student/delete-school/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted Successfully ✅");
      fetchSchools();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete ❌");
    }
  };

  // Expand (fetch single school detail)
  const handleExpand = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/student/school/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data && res.data.data) {
        setFormData(res.data.data.school);
        // console.log("Fetched School Details:", res.data.data.school);
      } else {
        setFormData(res.data || {});
      }
      setExpandedSchool(id);
      setShowForm(true);
    } catch (err) {
      console.error("Error fetching school details", err);
      toast.error("Failed to fetch school details ❌");
    }
  };

  return (
    <div className="w-full p-4">
      {/* Header + Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Schools Attended</h2>
        <button
          onClick={() => {
            setExpandedSchool(null);
            setFormData({
              country_of_institution: "",
              name_of_institution: "",
              level_of_education: "",
              primary_language_of_instruction: "",
              attended_institution_from: "",
              attended_institution_to: "",
              graduation_date: "",
              degree_name: "",
              graduated_from_this: "",
              address: "",
              city: "",
              state: "",
              zipcode: "",
            });
            setShowForm(!showForm);
          }}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md flex items-center"
        >
          Add Attended School <span className="ml-1">＋</span>
        </button>
      </div>

      {/* School List */}
      <div className="space-y-4">
        {Array.isArray(schools) && schools.length > 0 ? (
          schools.map((school) => (
            <div
              key={school.id}
              className="p-4 border rounded-lg shadow-sm bg-white flex justify-between items-start"
            >
              <div>
                <p className="font-bold">{school.name_of_institution}</p>
                <p className="text-md">{school.degree_name}</p>
                {school.graduation_date && (
                  <p className="text-md text-gray-700">
                    Graduated from Institution {formatDate(school.graduation_date)}
                  </p>
                )}
                <p className="text-md text-gray-700">
                  <span className="font-semibold">Level:</span>{" "}
                  {school.level_of_education}
                </p>
                {school.attended_institution_from && school.attended_institution_to && (
                  <p className="text-md text-gray-700">
                    Attended from {formatDate(school.attended_institution_from)} to {formatDate(school.attended_institution_to)}
                  </p>
                )}
                <p className="text-md text-gray-700">
                  <span className="font-semibold">
                    Language of instruction:
                  </span>{" "}
                  {school.primary_language_of_instruction}
                </p>
                <p className="text-md text-gray-700">
                  <span className="font-semibold">Address:</span>{" "}
                  {school.address}, {school.city}, {school.state}{" "}
                  {school.zipcode}
                </p>
                <p className="text-md text-gray-700">{school.country_of_institution}</p>
              </div>

              <div className="flex flex-col gap-2 items-end">
                <button
                  onClick={() => handleExpand(school.id)}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded"
                >
                  Expand
                </button>
                <button
                  onClick={() => handleDelete(school.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No schools have been added yet.
          </p>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mt-6 rounded-2xl p-8 shadow-lg bg-gradient-to-br from-white to-blue-50 border border-gray-100">
          {/* form fields reused */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Country of Institution *
              </label>
              <select
                name="country_of_institution"
                value={formData.country_of_institution}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">Select</option>
                <option value="INDIA">India</option>
                <option value="MALAYSIA">Malaysia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Name of Institution *
              </label>
              <input
                type="text"
                name="name_of_institution"
                value={formData.name_of_institution}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Level of Education *
              </label>
              <select
                name="level_of_education"
                value={formData.level_of_education}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">Select</option>
                <option value="POST-GRADUATE">Post Graduate</option>
                <option value="UNDER-GRADUATE">Under Graduate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Primary Language of Instruction *
              </label>
              <input
                type="text"
                name="primary_language_of_instruction"
                value={formData.primary_language_of_instruction}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Attended Institution From *
              </label>
              <input
                type="date"
                name="attended_institution_from"
                value={formData.attended_institution_from}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Attended Institution To *
              </label>
              <input
                type="date"
                name="attended_institution_to"
                value={formData.attended_institution_to}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Graduation Date
              </label>
              <input
                type="date"
                name="graduation_date"
                value={formData.graduation_date}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Degree Name *
              </label>
              <input
                type="text"
                name="degree_name"
                value={formData.degree_name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

 {/* Radio */}
    <div className="mt-6">
      <p className="text-sm font-medium text-gray-700">I have graduated from this institution *</p>
      <div className="flex gap-6 mt-2">
        <label className="flex items-center gap-2 text-gray-700">
          <input type="radio" name="graduated" className="accent-blue-600" /> Yes
        </label>
        <label className="flex items-center gap-2 text-gray-700">
          <input type="radio" name="graduated" className="accent-blue-600" /> No
        </label>
      </div>
    </div>

    {/* Checkbox */}
    <div className="mt-4">
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="graduated_from_this"
          checked={!!formData.graduated_from_this}
          onChange={handleChange}
          className="accent-blue-600"
        />
        I have the physical certificate for this degree
      </label>
    </div>

    {/* Address */}
    <h3 className="mt-8 mb-3 font-semibold text-lg text-gray-800">
      School Address Detail
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Address *
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter address"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          City/Town *
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Enter city"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Province
        </label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="Enter State/Province"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Postal/Zip Code
        </label>
        <input
          type="text"
          name="zipcode"
          value={formData.zipcode}
          onChange={handleChange}
          placeholder="Enter Postal Code"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
    </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-md transition"
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-700 hover:bg-black text-white px-6 py-2.5 rounded-xl shadow-md transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolAdd;
