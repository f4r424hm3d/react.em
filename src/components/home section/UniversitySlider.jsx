import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, BookOpen, Eye, ChevronRight, Heart, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import api from "../../api";
import { FeeStructureForm, BrochureForm, CompareUniversitiesForm } from "../../pages/universitysection/universitypopform";
import { API_URL } from "../../config";

export default function UniversityCardsSlider() {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const [likedUniversities, setLikedUniversities] = useState(new Set());
  const [expandedCards, setExpandedCards] = useState(new Set());
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Modal states
  const [feeModalOpen, setFeeModalOpen] = useState(false);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedUniversityForModal, setSelectedUniversityForModal] = useState(null);

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
    type === "public" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800";

  const getUniversityTypeIcon = (type) => (type === "public" ? "🏛️" : "🏢");

  const logoFor = (uni) => {
    if (!uni) return "https://via.placeholder.com/200x200?text=University";

    if (uni.banner_path && uni.banner_path.trim() !== "") {
      if (uni.banner_path.startsWith('http')) {
        return uni.banner_path;
      }
      return `${API_URL}${uni.banner_path}`;
    }

    if (uni.banner && uni.banner.trim() !== "") {
      if (uni.banner.startsWith('http')) {
        return uni.banner;
      }
      return `${API_URL}${uni.banner}`;
    }

    return "https://via.placeholder.com/200x200?text=No+Logo";
  };

  const handleFeeStructure = (name) => {
    setSelectedUniversityForModal(name);
    setFeeModalOpen(true);
  };

  const handleBrochure = (name) => {
    setSelectedUniversityForModal(name);
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
    <div className="relative px-6 py-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-black mb-6">
          🎓 Top Trending Universities <span className="text-blue-600">in Malaysia</span>
        </h2>

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 left-3 z-30">
          <button ref={prevRef} className="p-2 rounded-full hover:bg-blue-100 transition shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-3 z-30">
          <button ref={nextRef} className="p-2 rounded-full hover:bg-blue-100 transition shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={3}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 3 },
          }}
        >
          {universities.length === 0 ? (
            <SwiperSlide>
              <div className="h-56 flex items-center justify-center">
                <p className="text-gray-600">Loading universities...</p>
              </div>
            </SwiperSlide>
          ) : (
            universities.map((uni, idx) => {
              const uniId = uni.id || uni._id || idx;
              const isExpanded = expandedCards.has(uniId);
              const shortNote = uni.shortnote || 'Explore this university.';
              const shouldTruncate = shortNote.length > 100;

              return (
                <SwiperSlide key={uniId}>
                  <div className="group mb-4 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden border border-gray-100">
                    {/* University Image */}
                    <div className="h-48 overflow-hidden relative bg-gray-100">
                      <img
                        src={logoFor(uni)}
                        alt={uni.name || "University Logo"}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/200x200?text=No+Logo";
                        }}
                        className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110"
                      />

                      {/* Overlay Icons */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleLike(uniId)}
                              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${likedUniversities.has(uniId)
                                ? 'bg-red-500 text-white'
                                : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                            >
                              <Heart className={`w-4 h-4 ${likedUniversities.has(uniId) ? 'fill-current' : ''}`} />
                            </button>
                            <button className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-200">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Type Badge */}
                      {uni.type && (
                        <div className="absolute top-4 left-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getUniversityTypeColor(uni.type)}`}>
                            <span className="mr-1">{getUniversityTypeIcon(uni.type)}</span>
                            {uni.type.charAt(0).toUpperCase() + uni.type.slice(1)}
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
                    <div className="p-6 flex flex-col h-full">
                      <h3
                        onClick={() => navigate(`/university/${uni.uname}`)}
                        className="font-bold text-gray-800 text-xl group-hover:text-blue-600 mb-3 line-clamp-2 min-h-[3.5rem] cursor-pointer transition-all"
                      >
                        {uni.name}
                      </h3>

                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="text-sm font-medium">{uni.location || 'Malaysia'}</span>
                      </div>

                      {/* Description with Show More/Less */}
                      <div className="mb-4">
                        <p className={`text-gray-600 text-sm leading-relaxed ${!isExpanded && shouldTruncate ? 'line-clamp-2' : ''}`}>
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
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-3 bg-blue-50 rounded-xl">
                          <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                          <div className="text-lg font-bold text-blue-600">{uni.active_programs_count || 0}</div>
                          <div className="text-xs text-gray-600">Programs</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-xl">
                          <Eye className="w-5 h-5 text-green-600 mx-auto mb-1" />
                          <div className="text-lg font-bold text-green-600">{uni.click || 0}</div>
                          <div className="text-xs text-gray-600">Views</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-xl">
                          <Star className="w-5 h-5 text-yellow-600 mx-auto mb-1 fill-current" />
                          <div className="text-lg font-bold text-yellow-600">
                            {uni.rating ? parseFloat(uni.rating).toFixed(1) : '0.0'}
                          </div>
                          <div className="text-xs text-gray-600">Rating</div>
                        </div>
                      </div>

                      <div className="flex-grow"></div>

                      {/* Action Buttons */}
                      <div className="space-y-3 mt-auto">
                        <button
                          onClick={() => navigate(`/university/${uni.uname}`, {
                            state: { scrollToTop: true }
                          })}
                          className="cursor-pointer w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center group"
                        >
                          <span>View Details</span>
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleFeeStructure(uni.name)}
                            className="cursor-pointer py-2 px-3 border-2 border-blue-200 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-all duration-200 text-sm"
                          >
                            Fee Structure
                          </button>
                          <button
                            onClick={() => handleBrochure(uni.name)}
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
            })
          )}
        </Swiper>

        {/* Browse All Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/universities/universities-in-malaysia")}
            className="cursor-pointer inline-flex items-center border-2 border-blue-800 text-blue-800 font-semibold px-6 py-2 rounded-full transition hover:bg-blue-800 hover:text-white"
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
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{successMessage || "Submitted"}</h3>
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
        universityName={selectedUniversityForModal}
        isOpen={feeModalOpen}
        onClose={() => setFeeModalOpen(false)}
        onSuccess={showSuccess}
      />

      {/* Brochure Modal */}
      <BrochureForm
        universityName={selectedUniversityForModal}
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