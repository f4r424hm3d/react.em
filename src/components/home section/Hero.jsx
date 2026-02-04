import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import api from "../../api";

const Hero = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ Changed to false initially

  // ✅ Default content - immediately visible
  const defaultBanner = {
    title: "Explore Top Universities",
    description:
      "Begin your study journey in Malaysia with expert guidance for admissions, course selection, and fast-track visa processing.",
    banner_path: "/default-banner.jpg",
    alt_text: "Education Malaysia",
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      // ✅ No setLoading(true) - avoid showing spinner
      const res = await api.get("/banners/home");

      if (res.data?.status && res.data?.data?.banners) {
        setBanners(res.data.data.banners);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      // ✅ On error, keep default banner visible
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // ✅ Use banners if available, otherwise default
  const displayBanners = banners.length > 0 ? banners : [defaultBanner];
  const mainBanner = displayBanners[0];

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* ✅ Swiper Background Slider */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Navigation, Pagination, EffectFade, Autoplay]}
          effect="fade"
          navigation={isDesktop} // ✅ JS controlled navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={displayBanners.length > 1}
          className="w-full h-full hero-swiper"
        >
          {displayBanners.map((banner, i) => (
            <SwiperSlide key={banner.id || i}>
              <img
                src={
                  banner.banner_path.startsWith("/")
                    ? banner.banner_path
                    : `https://www.educationmalaysia.in/storage/${banner.banner_path}`
                }
                alt={banner.alt_text || `Banner ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // ✅ Fallback to placeholder gradient
                  e.target.style.display = "none";
                  e.target.parentElement.style.background =
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-blue-900/60 z-10 pointer-events-none" />

      {/* ✅ Content - Always visible */}
      <div className="relative z-20 flex items-center h-full px-6 md:px-20 pointer-events-none">
        <motion.div
          className="text-white max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base text-blue-400 tracking-widest font-semibold uppercase mb-3 md:mb-4"
          >
            Study in Malaysia
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6"
          >
            <span className="block">{mainBanner.title}</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-gray-100 max-w-2xl mb-8 md:mb-10 leading-relaxed"
          >
            {mainBanner.description}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 pointer-events-auto"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/who-we-are">
                <button className="cursor-pointer bg-[#003893] hover:bg-[#002966] text-white font-bold px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 flex items-center gap-2">
                  ABOUT US
                </button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/courses-in-malaysias">
                <button className="cursor-pointer bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold px-8 py-3 rounded-full transition-all duration-300 backdrop-blur-sm flex items-center gap-2">
                  EXPLORE COURCES
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Custom CSS for Swiper Controls */}
      <style>{`
        /* Desktop/Tablet - Show arrows with styling */
        @media (min-width: 768px) {
          :global(.swiper-button-prev),
          :global(.swiper-button-next) {
            background: white !important;
            width: 50px !important;
            height: 50px !important;
            border-radius: 50% !important;
            z-index: 30 !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
            transition: all 0.3s ease !important;
          }

          :global(.swiper-button-prev:hover),
          :global(.swiper-button-next:hover) {
            background: #3b82f6 !important;
            transform: scale(1.1) !important;
            box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5) !important;
          }

          :global(.swiper-button-prev::after),
          :global(.swiper-button-next::after) {
            font-size: 22px !important;
            font-weight: bold !important;
            color: #1f2937 !important;
          }

          :global(.swiper-button-prev:hover::after),
          :global(.swiper-button-next:hover::after) {
            color: white !important;
          }
        }

        /* Mobile - Hide arrows completely */
        @media (max-width: 767px) {
          :global(.swiper-button-prev),
          :global(.swiper-button-next),
          :global(.hero-swiper .swiper-button-prev),
          :global(.hero-swiper .swiper-button-next) {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
          }
        }

        :global(.swiper-pagination) {
          bottom: 30px !important;
          z-index: 30 !important;
        }

        :global(.swiper-pagination-bullet) {
          width: 12px !important;
          height: 12px !important;
          background: white !important;
          opacity: 0.6 !important;
          transition: all 0.3s ease !important;
        }

        :global(.swiper-pagination-bullet:hover) {
          opacity: 0.8 !important;
          transform: scale(1.2) !important;
        }

        :global(.swiper-pagination-bullet-active) {
          background: #60a5fa !important;
          opacity: 1 !important;
          transform: scale(1.3) !important;
        }
      `}</style>
    </section>
  );
};

export default Hero;
