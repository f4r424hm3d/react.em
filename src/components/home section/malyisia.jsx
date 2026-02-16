import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  GraduationCap,
  Globe2,
  Shield,
  Users,
  Briefcase,
  DollarSign,
  BookOpen,
  School,
  Building2,
  Award,
} from "lucide-react";

const stats = [
  {
    icon: <GraduationCap className="w-6 h-6" />,
    value: 100,
    suffix: "+",
    label: "Accredited Universities and University Colleges",
  },
  {
    icon: <Users className="w-6 h-6" />,
    value: 130,
    suffix: "K+",
    label: "International Students",
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    value: 470,
    suffix: "B+ USD",
    prefix: "$",
    label: "GDP Economy",
  },
  {
    icon: <Award className="w-6 h-6" />,
    value: 97,
    suffix: "%",
    label: "Study Visa Success Rate",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    value: 69,
    suffix: "%",
    prefix: "$",
    label: "Employment To Population Ratio",
  },
];

function Counter({ value, suffix, prefix = "" }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            const duration = 2000;
            const steps = 60;
            const increment = value / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= value) {
                setCount(value);
                clearInterval(timer);
              } else {
                setCount(current);
              }
            }, duration / steps);

            return () => clearInterval(timer);
          }
        });
      },
      { threshold: 0.3 },
    );

    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  const formatNumber = (num) => {
    if (value >= 1000 && value < 1000000)
      return Math.floor(num).toLocaleString();
    if (value < 10) return num.toFixed(1);
    return Math.floor(num).toString();
  };

  return (
    <div
      ref={counterRef}
      className="text-2xl md:text-3xl font-bold text-[#003893]"
    >
      {prefix}
      {formatNumber(count)}
      {suffix}
    </div>
  );
}

const EducationSystem = () => {
  const stages = [
    {
      title: "Early Education",
      icon: BookOpen,
      color: "from-[#003893] to-[#003893]",
      items: ["Government", "Private", "Special Needs", "Assistance"],
    },
    {
      title: "Primary Education",
      icon: School,
      color: "from-[#003893] to-[#003893]",
      items: [
        "Government",
        "Religious",
        "Private",
        "Special Needs",
        "Examinations & Assessments",
        "School Transfer",
        "Assistance",
      ],
    },
    {
      title: "Secondary Education",
      icon: Building2,
      color: "from-[#003893] to-[#003893]",
      items: [
        "Government",
        "Vocational College",
        "Private",
        "Special Needs",
        "Examinations & Assessments",
        "Assistance",
      ],
    },
    {
      title: "Post Secondary",
      icon: Award,
      color: "from-[#003893] to-[#003893]",
      items: ["Form 6", "Matriculation", "Examinations", "Assistance"],
    },
    {
      title: "Higher Education",
      icon: GraduationCap,
      color: "from-[#003893] to-[#003893]",
      sections: [
        {
          title: "Citizen",
          items: [
            "Local IPTA",
            "Local IPTS",
            "Study Abroad",
            "Accreditation",
            "Assistance",
          ],
        },
        {
          title: "Non-Citizen",
          items: ["IPTA", "IPTS", "Scholarship"],
        },
      ],
    },
  ];

  return (
    <div className="py-4 md:py-8 bg-gradient-to-br from-slate-50 to-slate-100 mt-[-1rem]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Title - Responsive text sizes */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4 tracking-tight">
            Education System in Malaysia
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-6xl mx-auto leading-relaxed px-2 sm:px-4 text-justify">
            Malaysia's education system offers accessible, high-quality learning
            from early childhood to higher education, guided by strong national
            standards and global benchmarks. Both Malaysian and international
            students benefit from structured academic pathways, modern teaching
            approaches, and flexible opportunities for lifelong learning. With
            its focus on innovation and inclusivity, Malaysia continues to grow
            as one of Asia's leading education hubs.
          </p>
        </div>

        {/* Subtitle - Responsive */}
        <div className="text-center mb-5 md:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">
            Education Pathway In Malaysia
          </h2>
        </div>

        {/* Cards - Properly aligned grid with equal heights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isHigherEd = stage.title === "Higher Education";
            return (
              <div
                key={stage.title}
                className={`rounded-xl shadow-md bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col ${isHigherEd ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                {/* Card Header - White title */}
                <div
                  className={`bg-gradient-to-br ${stage.color} p-4 md:p-5 rounded-t-xl`}
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="bg-white/20 p-1.5 md:p-2 rounded-lg backdrop-blur-sm">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h2 className="text-base md:text-lg font-bold text-white">
                      {stage.title}
                    </h2>
                  </div>
                </div>

                {/* Card Body - Responsive padding and text */}
                <div className="bg-white p-4 md:p-5 flex-grow rounded-b-xl">
                  {!isHigherEd ? (
                    <ul className="space-y-1.5 md:space-y-2">
                      {stage.items?.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-slate-700 group text-sm md:text-base"
                        >
                          <span className="text-slate-400 mt-0.5 md:mt-1 group-hover:text-slate-600 transition-colors">
                            •
                          </span>
                          <span className="group-hover:text-slate-900 transition-colors">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="space-y-4 md:space-y-5">
                      {stage.sections?.map((section, idx) => (
                        <div key={idx}>
                          <h3 className="font-semibold text-slate-900 mb-1.5 md:mb-2 pb-1 border-b border-slate-200 text-sm md:text-base">
                            {section.title}
                          </h3>
                          <ul className="space-y-1.5 md:space-y-2">
                            {section.items.map((item, itemIdx) => (
                              <li
                                key={itemIdx}
                                className="flex items-start gap-2 text-slate-700 group text-sm md:text-base"
                              >
                                <span className="text-slate-400 mt-0.5 md:mt-1 group-hover:text-slate-600 transition-colors">
                                  •
                                </span>
                                <span className="group-hover:text-slate-900 transition-colors">
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const WhyMalaysia = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoId = "hbZzfWnfJqw";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Main Section */}
      <section className="container mx-auto px-6 py-8 lg:py-10">
        <div className="text-center mb-10">
          <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-800 to-blue-900 bg-clip-text text-transparent mb-3">
            Study in Malaysia
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Global Recognition, Affordable Education, International Pathways &
            Post-Study Opportunities
          </p>
        </div>

        {/* MAIN GRID - YE IMPORTANT HAI! */}
        <div className="grid lg:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">
          {/* LEFT COLUMN - Images + Video */}
          <div className="space-y-6">
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-3xl shadow-xl aspect-[4/5] group">
                <img
                  src="/Malaysian students.webp"
                  alt="International students studying together"
                  width="400"
                  height="500"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="relative overflow-hidden rounded-3xl shadow-xl aspect-[4/5] group mt-6">
                <img
                  src="/download (20).webp"
                  alt="Kuala Lumpur Petronas Towers skyline"
                  width="400"
                  height="500"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="relative overflow-hidden rounded-3xl shadow-xl aspect-video col-span-2 group">
                <img
                  src="/Malaysian.webp"
                  alt="Diverse cultural activities and campus life"
                  width="800"
                  height="450"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Video Box */}
            <div className="relative bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl shadow-2xl overflow-hidden group">
              <div className="aspect-video relative">
                {!isVideoOpen ? (
                  <div
                    onClick={() => setIsVideoOpen(true)}
                    className="w-full h-full cursor-pointer relative"
                  >
                    <img
                      src="https://i.ytimg.com/vi/hbZzfWnfJqw/sddefault.jpg"
                      alt="Study in Malaysia video"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Agar thumbnail load nahi hua, backup image dikha do
                        e.target.src = "/Malaysian.webp";
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                      <div className="bg-white rounded-full p-5 group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <Play
                          className="w-12 h-12 text-blue-600"
                          fill="currentColor"
                        />
                      </div>
                      <div className="mt-5 text-center">
                        <p className="text-white/90 text-sm font-semibold tracking-widest mb-1">
                          WATCH NOW
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/hbZzfWnfJqw?autoplay=1&rel=0&modestbranding=1"
                    title="Study in Malaysia video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Info Cards */}
          <div className="space-y-5">
            {[
              {
                icon: <GraduationCap className="w-8 h-8 text-white" />,
                color: "from-[#003893] to-[#003893]",
                title:
                  "Globally Recognised Degrees & International Partnerships",
                desc: "Many Malaysian universities have academic collaborations with the UK, Australia, USA, Europe, and New Zealand. Some degrees are fully accredited by global bodies such as ACCA, CIMA, ABET, and AACSB, giving students worldwide acceptance.",
              },
              {
                icon: <Globe2 className="w-8 h-8 text-white" />,
                // color: "from-emerald-500 to-emerald-600",
                color: "from-[#003893] to-[#003893]",
                title: "World-Class Education at an Affordable Cost",
                desc: "Malaysia offers high-quality education aligned with UK, Australian, and international standards — but at 70% lower tuition fees and living expenses. Students get premium quality without the financial burden associated with Western countries.",
              },
              {
                icon: <GraduationCap className="w-8 h-8 text-white" />,
                color: "from-[#003893] to-[#003893]",
                title: "Pathways to the UK, Australia, and Europe",
                desc: "Many universities offer credit transfer programmes, allowing students to start their studies in Malaysia and complete them in top universities abroad — reducing total cost by 50–60%.",
              },
              {
                icon: <Shield className="w-8 h-8 text-white" />,
                // color: "from-amber-500 to-amber-600",
                color: "from-[#003893] to-[#003893]",
                title:
                  "Post-Study One-Year Visa in Malaysia (Graduate Employment Pass)",
                desc: "Malaysia allows international graduates to stay back for one year after completing their studies to explore job opportunities under the Graduate Pass / Special Pass. This stay-back option helps students gain work experience and transition smoothly into employment.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/80 rounded-3xl p-7 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-200 group"
              >
                <div className="flex items-start space-x-5">
                  <div
                    className={`bg-gradient-to-br ${item.color} rounded-2xl p-4 shadow-md`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* GRID CLOSE - YE MISS HO GAYA THA! */}
      </section>

      {/* Stats Section */}
      <section className="relative py-8 sm:my-4 px-4 overflow-hidden ">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-amber-50 opacity-70"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003893] mb-2">
              Gateway to World-Class Education in Malaysia
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Study in a globally respected education hub offering recognised
              degrees, multicultural campuses, and future-ready skills.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#003893] to-[#D4AF37] mx-auto mt-3 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white/80 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-white/30 hover:scale-105"
              >
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-gradient-to-br from-[#003893] to-[#0052CC] rounded-lg text-white group-hover:scale-110 transition-transform duration-300 shadow-md">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-center mb-1">
                  <Counter
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                  />
                </div>
                <p className="text-xs text-gray-600 text-center leading-snug">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education System Section */}
      <EducationSystem />
    </div>
  );
};

export default WhyMalaysia;
