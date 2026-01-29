

import { useState } from 'react';
import { X, Upload, CheckCircle } from 'lucide-react';
// Note: The type import for 'Course' has been removed as it's not valid in JSX/JS.

// The TypeScript interface ApplicationModalProps has been removed.
// The component now relies on implicit prop types (course, onClose).

const countries = [
  'Afghanistan', 'Bangladesh', 'Brunei', 'Cambodia', 'China', 'Hong Kong', 'India', 'Indonesia',
  'Iran', 'Iraq', 'Japan', 'Jordan', 'Kazakhstan', 'Kuwait', 'Laos', 'Lebanon', 'Malaysia',
  'Maldives', 'Mongolia', 'Myanmar', 'Nepal', 'North Korea', 'Oman', 'Pakistan', 'Palestine',
  'Philippines', 'Qatar', 'Saudi Arabia', 'Singapore', 'South Korea', 'Sri Lanka', 'Syria',
  'Taiwan', 'Thailand', 'Turkey', 'United Arab Emirates', 'Vietnam', 'Yemen',
  'Australia', 'New Zealand', 'Fiji', 'Papua New Guinea',
  'United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium',
  'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina',
  'Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Morocco', 'Ghana', 'Ethiopia'
].sort();

const educationLevels = [
  'Secondary School / O-Level / SPM',
  'High School / A-Level / STPM',
  'Foundation / Pre-University',
  'Diploma',
  'Advanced Diploma',
  'Bachelor Degree',
  'Master Degree',
  'Doctorate / PhD',
  'Other'
];

// Removed type annotation for props
const ApplicationModal = ({ course, onClose }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    currentCountry: '',
    passportNumber: '',
    currentEducationLevel: '',
    institutionName: '',
    fieldOfStudy: '',
    gpa: '',
    graduationYear: '',
    englishProficiency: '',
    intendedIntake: '',
    fundingSource: '',
    // Removed type assertion 'as File[]'
    documents: [], 
    additionalInfo: ''
  });

  // Removed event type annotation
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Removed event type annotation
  const handleFileUpload = (e) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        // Array.from is used to convert FileList to a standard Array of files
        documents: Array.from(e.target.files)
      });
    }
  };

  // Removed event type annotation
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send formData to a server here.
    console.log("Submitting application:", formData);
    setSubmitted(true);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for applying to <strong>{course.title}</strong> at {course.university.name}.
            We will review your application and contact you within 3-5 business days.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            A confirmation email has been sent to <strong>{formData.email}</strong>
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-lg p-2"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl sticky top-0 z-10">
          <h2 className="text-2xl font-bold mb-1">Course Application</h2>
          <p className="text-sm text-blue-100">{course.title}</p>
          <p className="text-xs text-blue-200">{course.university.name}</p>
        </div>

        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    s <= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      s < step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="As per passport"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="+60 12-345 6789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Nationality <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Current Country of Residence <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="currentCountry"
                      value={formData.currentCountry}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Passport Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Enter your passport number"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Educational Background</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Current Education Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="currentEducationLevel"
                      value={formData.currentEducationLevel}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select Education Level</option>
                      {educationLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Institution Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="institutionName"
                      value={formData.institutionName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Name of your school/university"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      name="fieldOfStudy"
                      value={formData.fieldOfStudy}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="e.g., Science, Engineering"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      GPA / Grade <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="gpa"
                      value={formData.gpa}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="e.g., 3.5 / 4.0 or A"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Graduation Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="e.g., 2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      English Proficiency Test
                    </label>
                    <select
                      name="englishProficiency"
                      value={formData.englishProficiency}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select Test</option>
                      <option value="IELTS">IELTS</option>
                      <option value="TOEFL">TOEFL</option>
                      <option value="PTE">PTE</option>
                      <option value="Cambridge">Cambridge English</option>
                      <option value="Duolingo">Duolingo English Test</option>
                      <option value="None">Not Yet Taken</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Intended Intake <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="intendedIntake"
                      value={formData.intendedIntake}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select Intake</option>
                      <option value="January 2025">January 2025</option>
                      <option value="March 2025">March 2025</option>
                      <option value="May 2025">May 2025</option>
                      <option value="August 2025">August 2025</option>
                      <option value="October 2025">October 2025</option>
                      <option value="January 2026">January 2026</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Additional Information</h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      How will you fund your studies? <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="fundingSource"
                      value={formData.fundingSource}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select Funding Source</option>
                      <option value="Self-funded">Self-funded</option>
                      <option value="Parents/Family">Parents/Family</option>
                      <option value="Scholarship">Scholarship</option>
                      <option value="Government Sponsorship">Government Sponsorship</option>
                      <option value="Company Sponsorship">Company Sponsorship</option>
                      <option value="Education Loan">Education Loan</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Upload Documents
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Upload transcripts, certificates, passport copy, etc.
                      </p>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-block px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        Choose Files
                      </label>
                      {formData.documents.length > 0 && (
                        <p className="text-sm text-green-600 mt-2">
                          {formData.documents.length} file(s) selected
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Additional Information / Message
                    </label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
                      rows={4}
                      placeholder="Tell us anything else that might be relevant to your application..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border-2 border-red-300 text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors"
              >
                Close
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md"
                >
                  Submit Application
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
