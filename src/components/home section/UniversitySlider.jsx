import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  BookOpen,
  Eye,
  ChevronRight,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import api from "../../api";
import {
  FeeStructureForm,
  BrochureForm,
  CompareUniversitiesForm,
} from "../../pages/universitysection/universitypopform";
import { API_URL } from "../../config";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function UniversityCardsSlider() {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const [likedUniversities, setLikedUniversities] = useState(new Set());
  const [expandedCards, setExpandedCards] = useState(new Set());

  // Modal states
  const [feeModalOpen, setFeeModalOpen] = useState(false);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedUniversityForModal, setSelectedUniversityForModal] =
    useState(null);

  // Fetch universities
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await api.get("/home");
        const data = res.data?.data?.universities || [];
        setUniversities(data);
        console.log("✅ Universities fetched:", data);
      } catch (err) {
        console.error("Failed to fetch universities:", err);
      }
    };
    fetchUniversities();
  }, []);

  // Toggle like
  const toggleLike = (universityId) => {
    const newLiked = new Set(likedUniversities);
    if (newLiked.has(universityId)) newLiked.delete(universityId);
    else newLiked.add(universityId);
    setLikedUniversities(newLiked);
  };

  // Toggle expand/collapse description
  const toggleExpand = (universityId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(universityId)) {
      newExpanded.delete(universityId);
    } else {
      newExpanded.add(universityId);
    }
    setExpandedCards(newExpanded);
  };

  // Utility functions
  const getUniversityTypeColor = (type) =>
    type === "public"
      ? "bg-green-100 text-green-800"
      : "bg-purple-100 text-purple-800";

  const getUniversityTypeIcon = (type) => (type === "public" ? "🏛️" : "🏢");

  // Helper for Card Image (Banner priority)
  const logoFor = (uni) => {
    if (!uni) return "https://via.placeholder.com/200x200?text=University";

    if (uni.banner_path && uni.banner_path.trim() !== "") {
      if (uni.banner_path.startsWith("http")) {
        return uni.banner_path;
      }
      return `${API_URL}${uni.banner_path}`;
    }

    if (uni.banner && uni.banner.trim() !== "") {
      if (uni.banner.startsWith("http")) {
        return uni.banner;
      }
      return `${API_URL}${uni.banner}`;
    }

    return "https://via.placeholder.com/200x200?text=No+Logo";
  };

  const handleFeeStructure = (uni) => {
    setSelectedUniversityForModal(uni);
    setFeeModalOpen(true);
  };

  const handleBrochure = (uni) => {
    setSelectedUniversityForModal(uni);
    setBrochureModalOpen(true);
  };

  const handleCompare = () => {
    setCompareModalOpen(true);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setSuccessModalOpen(true);
    setTimeout(() => setSuccessModalOpen(false), 2200);
  };

  return (
    <div className="relative px-2 sm:px-6 py-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-black mb-8">
          🎓 Top Trending Universities{" "}
          <span className="text-blue-600">in Malaysia</span>
        </h2>

        {/* Slider Layout */}
        {universities.length === 0 ? (
          <div className="h-56 flex items-center justify-center">
            <p className="text-gray-600">Loading universities...</p>
          </div>
        ) : (
          <div className="relative group/slider px-0 sm:px-4">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={10}
              slidesPerView={1}
              navigation={true}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
              }}
              className="!pb-6 [&_.swiper-button-next]:!hidden md:[&_.swiper-button-next]:!flex [&_.swiper-button-prev]:!hidden md:[&_.swiper-button-prev]:!flex [&_.swiper-button-next]:text-blue-600 [&_.swiper-button-prev]:text-blue-600 [&_.swiper-button-next]:after:text-lg [&_.swiper-button-prev]:after:text-lg [&_.swiper-button-next]:w-10 [&_.swiper-button-next]:h-10 [&_.swiper-button-next]:bg-white [&_.swiper-button-next]:rounded-full [&_.swiper-button-next]:shadow-md [&_.swiper-button-prev]:w-10 [&_.swiper-button-prev]:h-10 [&_.swiper-button-prev]:bg-white [&_.swiper-button-prev]:rounded-full [&_.swiper-button-prev]:shadow-md"
            >
              {universities.map((uni, idx) => {
                const uniId = uni.id || uni._id || idx;
                const isExpanded = expandedCards.has(uniId);
                const shortNote = uni.shortnote || "Explore this university.";
                const shouldTruncate = shortNote.length > 100;

                return (
                  <SwiperSlide key={uniId} className="h-auto pb-4">
                    <div className="group bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full mx-1">
                      {/* University Image */}
                      <div className="h-48 overflow-hidden relative bg-gray-100 flex-shrink-0">
                        <img
                          src={logoFor(uni)}
                          alt={uni.name || "University Logo"}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/200x200?text=No+Logo";
                          }}
                          className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110"
                        />

                        {/* Overlay Icons */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                            <div className="flex space-x-2">
                              {/* Overlay actions can go here */}
                            </div>
                          </div>
                        </div>

                        {/* Type Badge */}
                        {uni.type && (
                          <div className="absolute top-4 left-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getUniversityTypeColor(uni.type)}`}
                            >
                              <span className="mr-1">
                                {getUniversityTypeIcon(uni.type)}
                              </span>
                              {uni.type.charAt(0).toUpperCase() +
                                uni.type.slice(1)}
                            </span>
                          </div>
                        )}

                        {/* Ranking Badge */}
                        {uni.ranking && (
                          <div className="absolute top-4 right-4">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                              #{uni.ranking}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-4 flex flex-col flex-grow">
                        <h3
                          onClick={() => navigate(`/university/${uni.uname}`)}
                          className="font-bold text-gray-800 text-xl group-hover:text-blue-600 mb-1 line-clamp-2 min-h-[3.5rem] cursor-pointer transition-all"
                        >
                          {uni.name}
                        </h3>

                        <div className="flex items-center text-gray-600 mb-1.5">
                          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="text-sm font-medium">
                            {uni.location || "Malaysia"}
                          </span>
                        </div>

                        {/* Description with Show More/Less */}
                        <div className="mb-4">
                          <p
                            className={`text-gray-600 text-sm leading-relaxed ${!isExpanded && shouldTruncate ? "line-clamp-2" : ""}`}
                          >
                            {shortNote}
                          </p>
                          {shouldTruncate && (
                            <button
                              onClick={() => toggleExpand(uniId)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1 flex items-center gap-1 transition-colors"
                            >
                              {isExpanded ? (
                                <>
                                  Show Less <ChevronUp className="w-4 h-4" />
                                </>
                              ) : (
                                <>
                                  Show More <ChevronDown className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-4 mt-auto">
                          <div className="text-center p-3 bg-blue-50 rounded-xl">
                            <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                            <div className="text-lg font-bold text-blue-600">
                              {uni.active_programs_count || 0}
                            </div>
                            <div className="text-xs text-gray-600">
                              Programs
                            </div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-xl">
                            <Eye className="w-5 h-5 text-green-600 mx-auto mb-1" />
                            <div className="text-lg font-bold text-green-600">
                              {uni.click || 0}
                            </div>
                            <div className="text-xs text-gray-600">Views</div>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded-xl">
                            <Star className="w-5 h-5 text-yellow-600 mx-auto mb-1 fill-current" />
                            <div className="text-lg font-bold text-yellow-600">
                              {uni.rating
                                ? parseFloat(uni.rating).toFixed(1)
                                : "0.0"}
                            </div>
                            <div className="text-xs text-gray-600">Rating</div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2 mt-4">
                          <button
                            onClick={() =>
                              navigate(`/university/${uni.uname}`, {
                                state: { scrollToTop: true },
                              })
                            }
                            className="cursor-pointer w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center group"
                          >
                            <span>View Details</span>
                            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleFeeStructure(uni)}
                              className="cursor-pointer py-2 px-3 border-2 border-blue-200 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-all duration-200 text-sm"
                            >
                              Fee Structure
                            </button>
                            <button
                              onClick={() => handleBrochure(uni)}
                              className="cursor-pointer py-2 px-3 border-2 border-green-200 text-green-600 rounded-xl font-medium hover:bg-green-50 transition-all duration-200 text-sm"
                            >
                              Brochure
                            </button>
                          </div>

                          <button
                            onClick={handleCompare}
                            className="cursor-pointer w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 text-sm"
                          >
                            Compare Universities
                          </button>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}

        {/* Browse All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/universities/universities-in-malaysia")}
            className="cursor-pointer inline-flex items-center border-2 border-blue-800 text-blue-800 font-semibold px-8 py-3 rounded-full transition hover:bg-blue-800 hover:text-white"
          >
            EXPLORE ALL MALAYSIAN UNIVERSITIES
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {successModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70">
          <div className="relative z-10 bg-white rounded-2xl p-6 max-w-sm shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {successMessage || "Submitted"}
              </h3>
              <p className="text-gray-600">We'll get back to you soon.</p>
              <div className="mt-4">
                <button
                  onClick={() => setSuccessModalOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fee Structure Modal */}
      <FeeStructureForm
        universityName={selectedUniversityForModal?.name}
        universityLogo={
          selectedUniversityForModal?.logo_path
            ? `${API_URL}${selectedUniversityForModal.logo_path}`
            : logoFor(selectedUniversityForModal)
        }
        isOpen={feeModalOpen}
        onClose={() => setFeeModalOpen(false)}
        onSuccess={showSuccess}
      />

      {/* Brochure Modal */}
      <BrochureForm
        universityName={selectedUniversityForModal?.name}
        universityLogo={
          selectedUniversityForModal?.logo_path
            ? `${API_URL}${selectedUniversityForModal.logo_path}`
            : logoFor(selectedUniversityForModal)
        }
        isOpen={brochureModalOpen}
        onClose={() => setBrochureModalOpen(false)}
        onSuccess={showSuccess}
      />

      {/* Compare Universities Modal */}
      <CompareUniversitiesForm
        universities={universities}
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        onSuccess={showSuccess}
      />
    </div>
  );
}
