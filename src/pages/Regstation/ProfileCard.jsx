import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect ,useState} from "react";
import { BiConversation } from "react-icons/bi";
import { MdPersonSearch } from "react-icons/md";
import { 
  FaUserCircle, 
  FaEdit, 
  FaSignOutAlt, 
  FaLock, 
  FaListUl, 
  FaSchool 
} from "react-icons/fa";
import api from "../../api"
import { toast } from "react-toastify";

const ProfileCard = () => {
  const navigate = useNavigate();

 const handleLogout = async () => {
  const token = localStorage.getItem("token"); // token saved from login

  try {
    await api.post(
      "/student/logout",
      {}, // body empty
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ add only for this request
        },
      }
    );

    // Clear storage & redirect
     toast.success("Logged out successfully");
    localStorage.clear();
    navigate("/login");
  } catch (error) {
    console.error("Logout failed:", error);
    localStorage.clear();
    navigate("/login");
  }
};


const [studentData, setStudentData] = useState(null);

useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ token login ke baad save kiya tha
        if (!token) {
          toast.error("No token found, please login again");
          return;
        }

        const res = await api.get("/student/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Bearer token header
          },
        });

       setStudentData(res.data.data.student);
        console.log("Profile data fetched successfully:", res.data);

      } catch (err) {
        console.error("Profile fetch error:", err);
        toast.error("Failed to load profile Detail");
      } 
    };

    fetchProfile();
  }, []);

  return (
    <div className="w-full md:w-1/4 bg-gradient-to-b from-blue-800 via-blue-700 to-blue-900 text-white rounded-2xl p-8 shadow-2xl flex flex-col items-center">
      {/* Profile Section */}
      <div className="relative">
        <FaUserCircle className="w-28 h-28 text-white drop-shadow-lg" />
        <button className="absolute bottom-2 right-2 bg-white text-blue-800 p-2 rounded-full shadow-md hover:bg-blue-100 transition">
          <FaEdit size={16} />
        </button>
      </div>

      {/* Name & Email */}
      <h2 className="mt-4 font-semibold text-xl tracking-wide">
        {studentData ? studentData.name : "Loading..."}
      </h2>
      <p className="text-sm mb-8 opacity-80">
        {studentData ? studentData.email : "..."}
      </p>

      {/* Sidebar Menu */}
      <div className="space-y-3 w-full">

        <Link to="/student/overview" className="flex items-center gap-3 w-full bg-white/10 backdrop-blur-sm text-white rounded-xl py-3 px-4 shadow hover:bg-white/20 transition">
          <MdPersonSearch /> Overview
        </Link>
        <Link to="/student/profile" className="flex items-center gap-3 w-full bg-white/10 backdrop-blur-sm text-white rounded-xl py-3 px-4 shadow hover:bg-white/20 transition">
          <FaUserCircle /> My Profile
        </Link>
        <Link to="/student/applied-colleges" className="flex items-center gap-3 w-full bg-white/10 backdrop-blur-sm text-white rounded-xl py-3 px-4 shadow hover:bg-white/20 transition">
          <FaSchool /> Applied Colleges
        </Link>
        <Link to="/student/Conversation" className="flex items-center gap-3 w-full bg-white/10 backdrop-blur-sm text-white rounded-xl py-3 px-4 shadow hover:bg-white/20 transition">
          <BiConversation /> Conversations
        </Link>
        <Link to="/student/change-password" className="flex items-center gap-3 w-full bg-white/10 backdrop-blur-sm text-white rounded-xl py-3 px-4 shadow hover:bg-white/20 transition">
          <FaLock /> Change Password
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl py-3 px-4 shadow transition cursor-pointer"
        >
          <FaSignOutAlt /> Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
