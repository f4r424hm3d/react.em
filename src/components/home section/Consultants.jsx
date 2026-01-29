import React from "react";
import { FaSitemap, FaUserShield, FaMoneyCheckAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const consultantBenefits = [
  {
    icon: <FaUserShield />,
    title: "Official University Partner",
    description:
      "We work directly with top Malaysian universities, and provide most accurate and updated information on courses, fees, and scholarships.",
  },
  {
    icon: <FaSitemap />,
    title: "End-to-End Student Support",
    description:
      "From choosing the right university to application processing, visa assistance, and accommodation support, we provide one-on-one expert guidance.",
  },
  {
    icon: <FaMoneyCheckAlt />,
    title: "Transparent & Cost-Effective Services",
    description:
      "Our guidance ensures student gets the best value for their investment. No hidden charges — reliable, student-focused support to help you achieve your academic goals.",
  },
];

const Consultants = () => {
  return (
    <section className="bg-white px-4 py-16 md:px-10 lg:px-24">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
        Why Choose{" "}
        <span className="text-blue-600">Education Malaysia Consultants</span>?
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {consultantBenefits.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-2xl shadow-md p-6 group hover:shadow-xl hover:-translate-y-1 transition duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 text-white flex items-center justify-center text-xl">
                {item.icon}
              </div>
            </div>
            <h3 className="text-gray-800 font-semibold text-lg mb-3 group-hover:text-blue-600 transition">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Consultants;
