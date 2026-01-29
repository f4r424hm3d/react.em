

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../../api';
// import { BookOpen, GraduationCap, Calendar, Clock, Award, DollarSign } from 'lucide-react';

// // Placeholder components for sections that might be external
// const GetInTouchForm = () => <div className="bg-white p-6 rounded-lg shadow-md">Get in Touch Form</div>;
// const FeaturedUniversities = () => <div className="bg-white p-6 rounded-lg shadow-md">Featured Universities</div>;
// const UniversityCoursesCard = () => <div className="bg-white p-6 rounded-lg shadow-md">University Courses Card</div>;
// const PopularCourses = () => <div className="bg-white p-6 rounded-lg shadow-md">Popular Courses</div>;

// const CourseDetail = () => {
//   const { slug, course_slug } = useParams();
//   const navigate = useNavigate();
//   const [courseDetails, setCourseDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [expandedSections, setExpandedSections] = useState({
//     programme: false,
//     seminars: false,
//     similarPrograms: false,
//     course: true
//   });

//   useEffect(() => {
//     const fetchCourseDetails = async () => {
//       try {
//         setLoading(true);
//         const res = await api.get(`/university-course-details/${slug}/${course_slug}`);
//         setCourseDetails(res.data);
//         setError(null);
//       } catch (err) {
//         setError("Failed to fetch course details. Please try again later.");
//         console.error("Error fetching course details:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourseDetails();
//   }, [slug, course_slug]);

//   const toggleSection = (section) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
//   // Create a set of active intake months for quick lookup
//   const activeIntakeMonths = new Set(courseDetails?.intake?.split(',').map(m => m.trim().substring(0, 3)));

//   if (loading) {
//     return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
//   }

//   if (error) {
//     return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
//   }

//   if (!courseDetails) {
//     return <div className="flex justify-center items-center min-h-screen">No course details found.</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-10">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col lg:flex-row gap-6">
          
//           {/* LEFT SIDE - Main Content */}
//           <div className="lg:w-[70%]">
//             <div className="space-y-6">
              
//               {/* Course Details Summary - At Top */}
//               <div className="bg-white rounded-lg p-6 border border-gray-300">
//                 <h1 className="text-xl font-medium text-gray-800 mb-6">
//                   {courseDetails.course_name} Fees Structure, Admission, Intake, Deadline
//                 </h1>
                
//                 {/* GRID WRAPPER */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  
//                   {/* Left Column */}
//                   <div className="space-y-4">
//                     <div className="flex items-center space-x-3">
//                       <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
//                       <div>
//                         <p className="text-sm font-medium text-blue-600">Study Mode:</p>
//                         <p className="text-gray-700">{courseDetails.study_mode || 'N/A'}</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center space-x-3">
//                       <GraduationCap className="w-5 h-5 text-blue-600 flex-shrink-0" />
//                       <div>
//                         <p className="text-sm font-medium text-blue-600">Levell:</p>
//                         <p className="text-gray-700">{courseDetails.level || 'N/A'}</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center space-x-3">
//                       <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
//                       <div>
//                         <p className="text-sm font-medium text-blue-600">Intake:</p>
//                         <p className="text-gray-700">{courseDetails.intake || 'N/A'}</p>
//                       </div>
//                     </div>
                    
//                     {/* NEW: IELTS */}
//                     <div className="flex items-center space-x-3">
//                       <Award className="w-5 h-5 text-blue-600 flex-shrink-0" />
//                       <div>
//                         <p className="text-sm font-medium text-blue-600">IELTS:</p>
//                         <p className="text-gray-700">N/A</p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Column */}
//                   <div className="space-y-4">
//                     <div className="flex items-center space-x-3">
//                       <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
//                       <div>
//                         <p className="text-sm font-medium text-blue-600">Duration:</p>
//                         <p className="text-gray-700">{courseDetails.duration || 'N/A'}</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center space-x-3">
//                       <Award className="w-5 h-5 text-blue-600 flex-shrink-0" />
//                       <div>
//                         <p className="text-sm font-medium text-blue-600">Exam Accepted:</p>
//                         <p className="text-gray-700">{courseDetails.exam_accepted || 'N/A'}</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center space-x-3">
//                       <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0" />
//                       <div>
//                         <p className="text-sm font-medium text-blue-600">Tuition Fees:</p>
//                         <p className="text-gray-700">{courseDetails.tuition_fees || 'N/A'}</p>
//                       </div>
//                     </div>
                    
//                     {/* NEW: TOEFL */}
//                     <div className="flex items-center space-x-3">
//                       <Award className="w-5 h-5 text-blue-600 flex-shrink-0" />
//                       <div>
//                         <p className="text-sm font-medium text-blue-600">TOEFL:</p>
//                         <p className="text-gray-700">N/A</p>
//                       </div>
//                     </div>
//                   </div>
                  
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
//                   <button 
//                     onClick={() => navigate('/signup')}
//                     className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
//                   >
//                     Apply Now
//                   </button>
//                   <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
//                     View all coursess
//                   </button>
//                 </div>
//               </div>

//               {/* Course Intake Calendar - Second */}
//               <div className="bg-white rounded-lg p-6">
//                 <h4 className="text-lg font-medium text-gray-800 mb-4">Course Intake</h4>
//                 <div className="grid grid-cols-4 gap-3">
//                   {allMonths.map((month) => (
//                     <div
//                       key={month}
//                       className={`p-3 text-center rounded-lg border text-sm ${
//                         activeIntakeMonths.has(month)
//                           ? 'bg-blue-600 text-white border-blue-600' 
//                           : 'bg-white text-blue-600 border-gray-300'
//                       }`}
//                     >
//                       {month}
//                     </div>
//                   ))}
//                 </div>
//               </div>

             
//               {/* Other Expandable Sections - At Bottom */}
//               <div className="bg-white rounded-lg p-6">
//                 <div className="space-y-3">

//                   {/* Course Details - Third */}
//                   <div className="bg-gray-50 rounded-lg ">
//                     <div className="border border-gray-300 rounded-lg">
//                       <button
//                         onClick={() => toggleSection('course')}
//                         className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50"
//                       >
//                         <h2 className="text-lg font-medium text-blue-600">Course</h2>
//                         <div className="w-5 h-5 text-blue-600 text-xl font-light">
//                           +
//                         </div>
//                       </button>
                      
//                       {expandedSections.course && (
//                         <div className="p-4 border-t border-gray-200">
//                           <div className="bg-blue-100 p-3 rounded-lg mb-4">
//                             <h3 className="text-lg font-medium text-blue-800">
//                               Course of {courseDetails.course_name} in {courseDetails.university_name}
//                             </h3>
//                           </div>
//                           <div className="space-y-4 text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: courseDetails.description || '' }} />
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Programme Section */}
//                   <div className="border border-gray-300 rounded-lg bg-gray-50">
//                     <button
//                       onClick={() => toggleSection('programme')}
//                       className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-100"
//                     >
//                       <h2 className="text-lg font-medium text-blue-600">Programme</h2>
//                       <div className="w-5 h-5 text-blue-600 text-xl font-light">
//                         +
//                       </div>
//                     </button>
                    
//                     {expandedSections.programme && courseDetails.programme_structure && (
//                       <div className="p-4 border-t border-gray-200 bg-white">
//                         <div className="space-y-4 text-gray-700" dangerouslySetInnerHTML={{ __html: courseDetails.programme_structure || ''}} />
//                       </div>
//                     )}
//                   </div>

//                   {/* Seminars Section */}
//                   <div className="border border-gray-300 rounded-lg border-l-4 border-l-green-500 bg-gray-50">
//                     <button
//                       onClick={() => toggleSection('seminars')}
//                       className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-100"
//                     >
//                       <h2 className="text-lg font-medium text-blue-600">Seminars (Career Skills)</h2>
//                       <div className="w-5 h-5 text-blue-600 text-xl font-light">
//                         +
//                       </div>
//                     </button>
                    
//                     {expandedSections.seminars && courseDetails.seminars && (
//                       <div className="p-4 border-t border-gray-200 bg-white">
//                          <div className="space-y-4 text-gray-700" dangerouslySetInnerHTML={{ __html: courseDetails.seminars || ''}} />
//                       </div>
//                     )}
//                   </div>

//                   {/* Similar Programs Section */}
//                   {courseDetails.similar_programs && courseDetails.similar_programs.length > 0 && (
//                     <div className="border border-gray-300 rounded-lg bg-gray-50">
//                       <button
//                         onClick={() => toggleSection('similarPrograms')}
//                         className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-100"
//                       >
//                         <h2 className="text-lg font-medium text-blue-600">Similar Programs</h2>
//                         <div className="w-5 h-5 text-blue-600 text-xl font-light">
//                           +
//                         </div>
//                       </button>
                      
//                       {expandedSections.similarPrograms && (
//                         <div className="p-4 border-t border-gray-200 bg-white">
//                           <div className="space-y-6">
//                             {courseDetails.similar_programs.map((program, index) => (
//                               <div key={index} className="border border-gray-200 rounded-lg p-6">
//                                 <div className="flex gap-4 mb-4">
//                                   <div className="w-20 h-20 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
//                                     <img src={program.university_logo} alt={`${program.university_name} Logo`} className="w-12 h-8 object-contain"/>
//                                   </div>
//                                   <div className="flex-1">
//                                     <h3 className="text-lg font-medium text-gray-800 mb-2">{program.university_name}</h3>
//                                     <div className="space-y-1 text-sm text-gray-600">
//                                       <p>{program.location}</p>
//                                       <p>{program.city_state}</p>
//                                       <p>{program.type}</p>
//                                     </div>
//                                   </div>
//                                 </div>
//                                 <div className="mb-4">
//                                   <h4 className="text-lg font-medium text-gray-800 mb-2">{program.course_name}</h4>
//                                   <div className="space-y-1 text-sm">
//                                     <p className="text-blue-600 font-medium">{program.duration}</p>
//                                     <p className="text-gray-600">{program.study_mode}</p>
//                                     <p className="text-blue-600">{program.intakes}</p>
//                                   </div>
//                                 </div>
//                                 <div className="flex gap-3">
//                                   <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
//                                     View details
//                                   </button>
//                                   <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
//                                     View courses
//                                   </button>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                   <PopularCourses/>
//                 </div>
//               </div>

//             </div>
//           </div>

//           {/* RIGHT SIDE - Other Components */}
//           <div className="lg:col-span-1 lg:w-[30%]">
//             <div className="space-y-6">
//               <div className="">
//                 <GetInTouchForm/>
//               </div>
//               <div className="">
//                 <FeaturedUniversities/>
//               </div>
//               <div className="">
//                 <div className="">
//                   <UniversityCoursesCard/>  
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseDetail;




import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { BookOpen, GraduationCap, Calendar, Clock, Award, DollarSign } from 'lucide-react';

// Placeholder components for sections that might be external
const GetInTouchForm = () => <div className="bg-white p-6 rounded-lg shadow-md">Get in Touch Form</div>;
const FeaturedUniversities = () => <div className="bg-white p-6 rounded-lg shadow-md">Featured Universities</div>;
const UniversityCoursesCard = () => <div className="bg-white p-6 rounded-lg shadow-md">University Courses Card</div>;
const PopularCourses = () => <div className="bg-white p-6 rounded-lg shadow-md">Popular Courses</div>;

const CourseDetail = () => {
  // const { slug, course_slug } = useParams();
  const { slug, courseSlug } = useParams();
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [expandedSections, setExpandedSections] = useState({
    programme: false,
    seminars: false,
    similarPrograms: false,
    course: true
  });

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
    //  const res = await api.get(`/university-course-details/${slug}/${course_slug}`);   
    const res = await api.get(`/university-course-details/${slug}/${courseSlug}`);
        setCourseDetails(res.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch course details. Please try again later.");
        console.error("Error fetching course details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
// }, [slug, course_slug]);  
}, [slug, courseSlug]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Create a set of active intake months for quick lookup
  const activeIntakeMonths = new Set(courseDetails?.intake?.split(',').map(m => m.trim().substring(0, 3)));

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  if (!courseDetails) {
    return <div className="flex justify-center items-center min-h-screen">No course details found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT SIDE - Main Content */}
          <div className="lg:w-[70%]">
            <div className="space-y-6">
              
              {/* Course Details Summary - At Top */}
              <div className="bg-white rounded-lg p-6 border border-gray-300">
                <h1 className="text-xl font-medium text-gray-800 mb-6">
                  {courseDetails.course_name} Fees Structure, Admission, Intake, Deadline
                </h1>
                
                {/* GRID WRAPPER */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-600">Study Mode:</p>
                        <p className="text-gray-700">{courseDetails.study_mode || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-600">Levell:</p>
                        <p className="text-gray-700">{courseDetails.level || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-600">Intake:</p>
                        <p className="text-gray-700">{courseDetails.intake || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {/* NEW: IELTS */}
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-600">IELTS:</p>
                        <p className="text-gray-700">N/A</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-600">Duration:</p>
                        <p className="text-gray-700">{courseDetails.duration || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-600">Exam Accepted:</p>
                        <p className="text-gray-700">{courseDetails.exam_accepted || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-600">Tuition Fees:</p>
                        <p className="text-gray-700">{courseDetails.tuition_fees || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {/* NEW: TOEFL */}
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-600">TOEFL:</p>
                        <p className="text-gray-700">N/A</p>
                      </div>
                    </div>
                  </div>
                  
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button 
                    onClick={() => navigate('/signup')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </button>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    View all coursess
                  </button>
                </div>
              </div>

              {/* Course Intake Calendar - Second */}
              <div className="bg-white rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Course Intake</h4>
                <div className="grid grid-cols-4 gap-3">
                  {allMonths.map((month) => (
                    <div
                      key={month}
                      className={`p-3 text-center rounded-lg border text-sm ${
                        activeIntakeMonths.has(month)
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-blue-600 border-gray-300'
                      }`}
                    >
                      {month}
                    </div>
                  ))}
                </div>
              </div>

             
              {/* Other Expandable Sections - At Bottom */}
              <div className="bg-white rounded-lg p-6">
                <div className="space-y-3">

                  {/* Course Details - Third */}
                  <div className="bg-gray-50 rounded-lg ">
                    <div className="border border-gray-300 rounded-lg">
                      <button
                        onClick={() => toggleSection('course')}
                        className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50"
                      >
                        <h2 className="text-lg font-medium text-blue-600">Course</h2>
                        <div className="w-5 h-5 text-blue-600 text-xl font-light">
                          +
                        </div>
                      </button>
                      
                      {expandedSections.course && (
                        <div className="p-4 border-t border-gray-200">
                          <div className="bg-blue-100 p-3 rounded-lg mb-4">
                            <h3 className="text-lg font-medium text-blue-800">
                              Course of {courseDetails.course_name} in {courseDetails.university_name}
                            </h3>
                          </div>
                          <div className="space-y-4 text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: courseDetails.description || '' }} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Programme Section */}
                  <div className="border border-gray-300 rounded-lg bg-gray-50">
                    <button
                      onClick={() => toggleSection('programme')}
                      className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-100"
                    >
                      <h2 className="text-lg font-medium text-blue-600">Programme</h2>
                      <div className="w-5 h-5 text-blue-600 text-xl font-light">
                        +
                      </div>
                    </button>
                    
                    {expandedSections.programme && courseDetails.programme_structure && (
                      <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="space-y-4 text-gray-700" dangerouslySetInnerHTML={{ __html: courseDetails.programme_structure || ''}} />
                      </div>
                    )}
                  </div>

                  {/* Seminars Section */}
                  <div className="border border-gray-300 rounded-lg border-l-4 border-l-green-500 bg-gray-50">
                    <button
                      onClick={() => toggleSection('seminars')}
                      className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-100"
                    >
                      <h2 className="text-lg font-medium text-blue-600">Seminars (Career Skills)</h2>
                      <div className="w-5 h-5 text-blue-600 text-xl font-light">
                        +
                      </div>
                    </button>
                    
                    {expandedSections.seminars && courseDetails.seminars && (
                      <div className="p-4 border-t border-gray-200 bg-white">
                         <div className="space-y-4 text-gray-700" dangerouslySetInnerHTML={{ __html: courseDetails.seminars || ''}} />
                      </div>
                    )}
                  </div>

                  {/* Similar Programs Section */}
                  {courseDetails.similar_programs && courseDetails.similar_programs.length > 0 && (
                    <div className="border border-gray-300 rounded-lg bg-gray-50">
                      <button
                        onClick={() => toggleSection('similarPrograms')}
                        className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-100"
                      >
                        <h2 className="text-lg font-medium text-blue-600">Similar Programs</h2>
                        <div className="w-5 h-5 text-blue-600 text-xl font-light">
                          +
                        </div>
                      </button>
                      
                      {expandedSections.similarPrograms && (
                        <div className="p-4 border-t border-gray-200 bg-white">
                          <div className="space-y-6">
                            {courseDetails.similar_programs.map((program, index) => (
                              <div key={index} className="border border-gray-200 rounded-lg p-6">
                                <div className="flex gap-4 mb-4">
                                  <div className="w-20 h-20 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                                    <img src={program.university_logo} alt={`${program.university_name} Logo`} className="w-12 h-8 object-contain"/>
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">{program.university_name}</h3>
                                    <div className="space-y-1 text-sm text-gray-600">
                                      <p>{program.location}</p>
                                      <p>{program.city_state}</p>
                                      <p>{program.type}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-4">
                                  <h4 className="text-lg font-medium text-gray-800 mb-2">{program.course_name}</h4>
                                  <div className="space-y-1 text-sm">
                                    <p className="text-blue-600 font-medium">{program.duration}</p>
                                    <p className="text-gray-600">{program.study_mode}</p>
                                    <p className="text-blue-600">{program.intakes}</p>
                                  </div>
                                </div>
                                <div className="flex gap-3">
                                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                    View details
                                  </button>
                                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                    View courses
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <PopularCourses/>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE - Other Components */}
          <div className="lg:col-span-1 lg:w-[30%]">
            <div className="space-y-6">
              <div className="">
                <GetInTouchForm/>
              </div>
              <div className="">
                <FeaturedUniversities/>
              </div>
              <div className="">
                <div className="">
                  <UniversityCoursesCard/>  
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
