import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

const PartnerCard = ({ partner, viewMode, onContactClick }) => {
  // Extract all partner data with safe fallbacks
  const getField = (primaryField, altFields = [], defaultVal = "") => {
    if (partner[primaryField] !== undefined && partner[primaryField] !== null) {
      return partner[primaryField];
    }
    for (const field of altFields) {
      if (partner[field] !== undefined && partner[field] !== null) {
        return partner[field];
      }
    }
    return defaultVal;
  };

  const image = getField("profile_image", ["image", "photo", "avatar"], null);
  const phone = getField(
    "phone",
    ["mobile", "contact_number", "phone_number"],
    "Not Available",
  );
  const studentsPlaced = getField(
    "students_placed",
    ["studentsPlaced", "total_students"],
    0,
  );
  const experience = getField(
    "experience_years",
    ["experience", "years_of_experience"],
    "N/A",
  );
  const rating = getField("rating", ["average_rating"], 0);
  const isVerified =
    getField("is_verified", ["verified", "verified_status"], false) === true;

  // 🔍 DEBUG: Log extracted values
  console.log("🎯 PartnerCard Debug for:", partner.name);
  console.log(
    "📞 Phone extracted:",
    phone,
    "| Raw partner.phone:",
    partner.phone,
    "| Raw partner.mobile:",
    partner.mobile,
  );
  console.log(
    "👥 Students extracted:",
    studentsPlaced,
    "| Raw partner.students_placed:",
    partner.students_placed,
  );
  console.log(
    "📅 Experience extracted:",
    experience,
    "| Raw partner.experience_years:",
    partner.experience_years,
  );
  console.log("⭐ Rating:", rating, "✅ Verified:", isVerified);
  console.log("📷 Image:", image);
  console.log("🔢 All partner keys:", Object.keys(partner));

  const defaultAvatar =
    "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";

  if (viewMode === "grid") {
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
        <div className="relative">
          <img
            src={image || defaultAvatar}
            alt={partner.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = defaultAvatar;
            }}
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            {isVerified && (
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </div>
            )}
            {rating > 0 && (
              <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {rating}
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {partner.name}
              </h3>
              <p className="text-blue-600 font-medium">
                {partner.designation || "Partner"}
              </p>
              <p className="text-gray-600 text-sm">{partner.company}</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm">{partner.city}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm">{phone}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm truncate max-w-[200px]">
                {partner.email}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">
                {studentsPlaced}
              </div>
              <div className="text-xs text-gray-600">Students Placed</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">
                {experience}
              </div>
              <div className="text-xs text-gray-600">Experience</div>
            </div>
          </div>

          {partner.specialization && partner.specialization.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Specializations:
              </div>
              <div className="flex flex-wrap gap-1">
                {partner.specialization.slice(0, 2).map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {spec}
                  </span>
                ))}
                {partner.specialization.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    +{partner.specialization.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={() => onContactClick(partner)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Contact Now
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex items-center p-6">
      <div className="flex-shrink-0 mr-6 relative">
        <img
          src={image || defaultAvatar}
          alt={partner.name}
          className="w-24 h-24 rounded-xl object-cover"
          onError={(e) => {
            e.target.src = defaultAvatar;
          }}
        />
        {isVerified && (
          <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {partner.name}
          </h3>
          <p className="text-blue-600 font-medium text-sm">
            {partner.designation || "Partner"}
          </p>
          <p className="text-gray-600 text-sm">{partner.company}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="text-sm">{partner.city}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Phone className="w-3 h-3 mr-1" />
            <span className="text-sm">{phone}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Mail className="w-3 h-3 mr-1" />
            <span className="text-sm">{partner.email}</span>
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">
            {studentsPlaced}
          </div>
          <div className="text-xs text-gray-600">Students Placed</div>
          <div className="flex items-center justify-center mt-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-medium">{rating || "N/A"}</span>
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{experience}</div>
          <div className="text-xs text-gray-600">Experience</div>
        </div>

        <div className="text-right">
          <button
            onClick={() => onContactClick(partner)}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Contact Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerCard;
