
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";


const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDropdownLocked, setIsDropdownLocked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]); // update whenever route changes

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen) {
        return;
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setIsDropdownLocked(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const closeAllMenus = () => {
    setMenuOpen(false);
    setShowDropdown(false);
    setIsDropdownLocked(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    closeAllMenus();
  }, [location]);



  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="px-4 sm:px-8 py-1 fixed top-0 left-0 right-0 z-30 transition-all duration-500 bg-white/95 backdrop-blur text-black shadow-lg">
        <div className="flex items-center justify-between">
          <Link to="/" aria-label="Home">
            <img
              src="/logo (2).png"
              alt="Malaysia Logo"
              className="h-12 sm:h-12 w-auto max-w-[250px] object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-7 font-medium">
            <Link to="/" className={`hover:text-blue-700 transition ${isActive("/") && "text-blue-900 font-bold underline underline-offset-8"}`}>Home</Link>

            {/* Resources Dropdown */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => window.innerWidth >= 768 && !isDropdownLocked && setShowDropdown(true)}
              onMouseLeave={() => window.innerWidth >= 768 && !isDropdownLocked && setShowDropdown(false)}
            >
              <button
                onClick={() => {
                  if (isDropdownLocked) {
                    setShowDropdown(false);
                    setIsDropdownLocked(false);
                  } else {
                    setShowDropdown(true);
                    setIsDropdownLocked(true);
                  }
                }}
                className="flex items-center gap-1 hover:text-blue-700"
              >
                Resources
                <FaChevronDown className={`transition-transform ${showDropdown ? "rotate-180" : ""}`} size={13} />
              </button>

              {showDropdown && (
                <div className="absolute top-full left-0 mt-1 w-[700px] bg-white/90 backdrop-blur shadow-2xl rounded-xl border border-blue-100 p-6 grid grid-cols-1 md:grid-cols-4 gap-4 z-50">
                  {/* Exams */}
                  <div>
                    <Link to="/resources/exams" className="font-bold text-blue-600 mb-3 hover:underline block">Exams</Link>
                    <ul className="space-y-2 text-sm">
                      <li><Link to="/resources/exams/muet" className="hover:underline">MUET</Link></li>
                      <li><Link to="/resources/exams/pte" className="hover:underline">PTE</Link></li>
                      <li><Link to="/resources/exams/toefl" className="hover:underline">TOEFL</Link></li>
                      <li><Link to="/resources/exams/ielts" className="hover:underline">IELTS</Link></li>
                    </ul>
                  </div>

                  {/* Services */}
                  <div>
                    <Link to="/resources/services" className="font-bold text-blue-600 mb-3 hover:underline block">Services</Link>
                    <ul className="space-y-2 text-sm">
                      <li><Link to="/resources/services/discover-malaysia" className="hover:underline">Discover Malaysia</Link></li>
                      <li><Link to="/resources/services/admission-guidance" className="hover:underline">Admission Guidance</Link></li>
                      <li><Link to="/resources/services/visa-guidance" className="hover:underline">Visa Guidance</Link></li>
                      <li><Link to="/resources/services/pre-departure-support" className="hover:underline">Pre Departure Support</Link></li>
                    </ul>
                  </div>


                  {/* Guidelines Section */}
                  <div>
                    <p className="font-bold text-black mb-3 hover:underline block">Guidelines</p>
                    <ul className="space-y-2 text-sm">
                      <li><Link to="/resources/Guidelines/graduate-pass" className="hover:underline">Graduate Pass</Link></li>
                      <li><Link to="/resources/Guidelines/MQA" className="hover:underline">MQA</Link></li>
                      <li><Link to="/resources/Guidelines/team-education-malaysia" className="hover:underline">Team Education Malaysia</Link></li>
                    </ul>
                  </div>



                  {/* About Us */}
                  <div>
                    <p className="font-bold text-black mb-3 hover:underline block">About Us</p>
                    <ul className="space-y-2 text-sm">
                      <li><Link to="/who-we-are" className="hover:underline">Who we are</Link></li>
                      <li><Link to="/students-say" className="hover:underline">What Students Say</Link></li>
                      <li><Link to="/study-malaysia" className="hover:underline">Study Malaysia</Link></li>
                      <li><Link to="/why-study" className="hover:underline">Why Study In Malaysia?</Link></li>
                      <li><Link to="/view-our-partners" className="hover:underline">View Our Partners</Link></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <Link to="/courses-in-malaysias" className={`hover:text-blue-700 transition ${isActive("/courses-in-malaysias") && "text-blue-900 font-bold underline underline-offset-8"}`}>Courses</Link>
            <Link to="/universities" className={`hover:text-blue-700 transition ${isActive("/universities") && "text-blue-900 font-bold underline underline-offset-8"}`}>Universities</Link>
            <Link to="/specialization" className={`hover:text-blue-700 transition ${isActive("/specialization") && "text-blue-900 font-bold underline underline-offset-8"}`}>Specialization</Link>
            <Link to="/scholarships" className={`hover:text-blue-700 transition ${isActive("/scholarship") && "text-blue-900 font-bold underline underline-offset-8"}`}>Scholarship</Link>
            <Link to="/blog" className={`hover:text-blue-700 transition ${isActive("/blog") && "text-blue-900 font-bold underline underline-offset-8"}`}>Blogs</Link>
            {isLoggedIn ? (
              <Link to="/student/profile">
                <button className="bg-blue-900 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-800 transition font-semibold">
                  Profile
                </button>
              </Link>
            ) : (
              <Link to="/signup">
                <button className="bg-blue-900 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-800 transition font-semibold">
                  Get Started
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Icon */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-blue-900 text-2xl font-thin z-[60]">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - SLIDE FROM RIGHT - FULL SCREEN */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-white shadow-2xl z-[55] transform transition-transform duration-300 ease-in-out md:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="p-6 space-y-4 font-medium overflow-y-auto h-full pt-20">
          {/* Close Button Inside Menu - TOP RIGHT */}
          <div className="absolute top-4 right-4">
            <button onClick={() => setMenuOpen(false)} className="text-blue-900 text-3xl">
              <FaTimes />
            </button>
          </div>

          <Link to="/" onClick={closeAllMenus} className="block text-left w-full hover:text-blue-700 transition py-2 text-lg">Home</Link>

          {/* Mobile Dropdown */}
          <div>
            <button onClick={() => setShowDropdown((prev) => !prev)} className="flex items-center gap-1 w-full hover:text-blue-700 transition py-2 text-lg">
              Resources
              <FaChevronDown className={`transition-transform ${showDropdown ? "rotate-180" : ""}`} size={15} />
            </button>

            {showDropdown && (
              <div className="bg-gray-50 border p-4 mt-2 rounded-xl shadow space-y-4">
                <div>
                  <Link to="/resources/exams" onClick={closeAllMenus} className="text-blue-600 font-semibold block text-left w-full">Exams</Link>
                  <Link to="/resources/exams/muet" onClick={closeAllMenus} className="block text-left w-full pl-2 hover:text-blue-700">MUET</Link>
                  <Link to="/resources/exams/pte" onClick={closeAllMenus} className="block text-left w-full pl-2 hover:text-blue-700">PTE</Link>
                  <Link to="/resources/exams/toefl" onClick={closeAllMenus} className="block text-left w-full pl-2 hover:text-blue-700">TOEFL</Link>
                  <Link to="/resources/exams/ielts" onClick={closeAllMenus} className="block text-left w-full pl-2 hover:text-blue-700">IELTS</Link>
                </div>
                <div>
                  <Link to="/resources/services" onClick={closeAllMenus} className="text-blue-600 font-semibold block text-left w-full">Services</Link>
                  <Link to="/resources/services/discover-malaysia" onClick={closeAllMenus} className="block text-left w-full pl-2 hover:text-blue-700">Discover Malaysia</Link>
                  <Link to="/resources/services/admission-guidance" onClick={closeAllMenus} className="block text-left w-full pl-2 hover:text-blue-700">Admission Guidance</Link>
                  <Link to="/resources/services/visa-guidance" onClick={closeAllMenus} className="block text-left w-full pl-2 hover:text-blue-700">Visa Guidance</Link>
                  <Link to="/resources/services/pre-departure-support" onClick={closeAllMenus} className="block text-left w-full pl-2 hover:text-blue-700">Pre Departure Support</Link>
                </div>

                {/* Guidelines - Mobile Section */}
                <div>
                  <p className="text-black font-semibold">Guidelines</p>
                  <ul className="space-y-2 text-sm">
                    <li><Link to="/resources/Guidelines/graduate-pass" onClick={closeAllMenus} className="block text-left w-full pl-2 hover:text-blue-700">Graduate Pass</Link></li>
                    <li><Link to="/resources/Guidelines/MQA" onClick={closeAllMenus} className="block text-left w-full pl-2 hover:text-blue-700">MQA</Link></li>
                    <li><Link to="/resources/Guidelines/team-education-malaysia" onClick={closeAllMenus} className="block text-left w-full pl-2 hover:text-blue-700">Team Education Malaysia</Link></li>
                  </ul>
                </div>

                <div>
                  <p className="text-black font-semibold">About Us</p>
                  <Link to="/who-we-are" onClick={closeAllMenus} className="block text-left w-full pl-2 hover:text-blue-700">Who we are</Link>
                  <Link to="/students-say" onClick={closeAllMenus} className="block text-left w-full pl-2 hover:text-blue-700">What Students Say</Link>
                  <Link to="/study-malaysia" onClick={closeAllMenus} className="block text-left w-full pl-2 hover:text-blue-700">Study Malaysia</Link>
                  <Link to="/why-study" onClick={closeAllMenus} className="block text-left w-full pl-2 hover:text-blue-700">Why Study In Malaysia?</Link>
                  <Link to="/view-our-partners" onClick={closeAllMenus} className="block text-left w-full pl-2 hover:text-blue-700">View Our Partners</Link>
                </div>
              </div>
            )}
          </div>

          <Link to="/courses-in-malaysias" onClick={closeAllMenus} className="block text-left w-full hover:text-blue-700 transition py-2 text-lg">Courses</Link>
          <Link to="/universities" onClick={closeAllMenus} className="block text-left w-full hover:text-blue-700 transition py-2 text-lg">Universities</Link>
          <Link to="/specialization" onClick={closeAllMenus} className="block text-left w-full hover:text-blue-700 transition py-2 text-lg">Specialization</Link>
          <Link to="/scholarships" onClick={closeAllMenus} className="block text-left w-full hover:text-blue-700 transition py-2 text-lg">Scholarship</Link>
          <Link to="/blog" onClick={closeAllMenus} className="block text-left w-full hover:text-blue-700 transition py-2 text-lg">Blog</Link>

          {isLoggedIn ? (
            <Link to="/student/profile" onClick={closeAllMenus} className="w-full block">
              <button className="cursor-pointer w-full border-2 border-blue-800 text-blue-800 bg-white py-2 rounded-lg shadow hover:bg-blue-800 hover:text-white transition font-semibold">
                Profile
              </button>
            </Link>
          ) : (
            <Link to="/signup" onClick={closeAllMenus} className="cursor-pointer w-full block">
              <button className="cursor-pointer w-full bg-blue-900 text-white py-2 rounded-lg shadow hover:bg-blue-800 transition font-semibold">
                Get Started
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Overlay - Dark background when menu is open */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[50] md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;